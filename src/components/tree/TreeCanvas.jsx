import { useEffect, useMemo, useRef, useState } from "react";
import ReactFlow, {
    Background,
    Controls,
    Handle,
    Position,
    useNodesState,
    useEdgesState,
    MarkerType,
} from "reactflow";
import "reactflow/dist/style.css";
import PersonCard from "./PersonCard";
import ConnectModal from "./ConnectModal";
import useStore from "../../store/useStore";
import { getAuthenticatedClient } from "../../lib/supabaseClient";
import { useAuth } from "@clerk/clerk-react";
import { debounce } from "./debounce";

// Approximate card dimensions (w-52 = 208px, ~200-240px tall depending on death date)
const CARD_W = 208;
const CARD_H_BASE = 200; // Height without death date
const CARD_H_WITH_DOD = 240; // Height with death date
const ALIGN_SNAP_PX = 60;

// Calculate actual card height based on whether member has death date
function getCardHeight(member) {
    return member.dod ? CARD_H_WITH_DOD : CARD_H_BASE;
}

// ─── Family node ─────────────────────────────────────────────────────────────
// A small dot that sits between two partners and acts as the shared origin
// for their children. Prevents duplicate arrows from each parent to each child.
function FamilyNode() {
    return (
        <div
            style={{
                width: 14,
                height: 14,
                borderRadius: "50%",
                background: "#a98e6e", // tertiary-accent (heritage bronze)
                border: "2.5px solid #3a2810", // tertiary-container
                boxShadow: "0 0 0 3px rgba(251,249,248,1)",
            }}
        >
            <Handle
                id="left"
                type="target"
                position={Position.Left}
                style={{
                    opacity: 0,
                    width: 1,
                    height: 1,
                    minWidth: 0,
                    minHeight: 0,
                }}
            />
            <Handle
                id="right"
                type="target"
                position={Position.Right}
                style={{
                    opacity: 0,
                    width: 1,
                    height: 1,
                    minWidth: 0,
                    minHeight: 0,
                }}
            />
            <Handle
                id="top"
                type="target"
                position={Position.Top}
                style={{
                    opacity: 0,
                    width: 1,
                    height: 1,
                    minWidth: 0,
                    minHeight: 0,
                }}
            />
            <Handle
                id="bottom"
                type="source"
                position={Position.Bottom}
                style={{
                    opacity: 0,
                    width: 1,
                    height: 1,
                    minWidth: 0,
                    minHeight: 0,
                }}
            />
        </div>
    );
}

const nodeTypes = { personCard: PersonCard, familyNode: FamilyNode };

// ─── Graph builders ───────────────────────────────────────────────────────────

function membersToNodes(members, callbacks) {
    return members.map((m) => ({
        id: m.id,
        type: "personCard",
        position: { x: m.position_x ?? 0, y: m.position_y ?? 0 },
        data: { member: m, ...callbacks },
    }));
}

/**
 * Find partner pairs that have ≥1 shared child.
 * Returns:
 *   familyGroups: { coupleKey → { p1Id, p2Id, childIds: Set } }
 *   handledRelIds: Set of relationship IDs replaced by family-node edges
 */
function computeFamilyGroups(relationships) {
    const partnerSet = new Set(
        relationships
            .filter((r) => r.type === "partner")
            .map((r) => [r.from_member_id, r.to_member_id].sort().join("|")),
    );

    // childId → [parentIds]
    const childParents = {};
    relationships
        .filter((r) => r.type === "child")
        .forEach((r) => {
            childParents[r.to_member_id] = childParents[r.to_member_id] || [];
            childParents[r.to_member_id].push(r.from_member_id);
        });

    const familyGroups = {};
    const handledRelIds = new Set();

    Object.entries(childParents).forEach(([childId, parentIds]) => {
        for (let i = 0; i < parentIds.length; i++) {
            for (let j = i + 1; j < parentIds.length; j++) {
                const [a, b] = [parentIds[i], parentIds[j]].sort();
                const coupleKey = `${a}|${b}`;
                if (partnerSet.has(coupleKey)) {
                    if (!familyGroups[coupleKey]) {
                        familyGroups[coupleKey] = {
                            p1Id: a,
                            p2Id: b,
                            childIds: new Set(),
                        };
                    }
                    familyGroups[coupleKey].childIds.add(childId);
                    // Mark the individual parent→child edges as superseded
                    relationships
                        .filter(
                            (r) =>
                                r.type === "child" &&
                                r.to_member_id === childId &&
                                (r.from_member_id === a ||
                                    r.from_member_id === b),
                        )
                        .forEach((r) => handledRelIds.add(r.id));
                }
            }
        }
    });

    return { familyGroups, handledRelIds };
}

/** X/Y of the family dot, computed from the current node positions. */
function familyNodePos(p1Id, p2Id, posMap, members) {
    const p1 = posMap[p1Id] ?? { x: 0, y: 0 };
    const p2 = posMap[p2Id] ?? { x: 0, y: 0 };

    // Find the actual height of each parent card
    const p1Member = members.find((m) => m.id === p1Id);
    const p2Member = members.find((m) => m.id === p2Id);
    const p1Height = p1Member ? getCardHeight(p1Member) : CARD_H_WITH_DOD;
    const p2Height = p2Member ? getCardHeight(p2Member) : CARD_H_WITH_DOD;
    const maxHeight = Math.max(p1Height, p2Height);

    const VERTICAL_FAMILY_GAP = 64;

    return {
        x: (p1.x + p2.x) / 2 + CARD_W / 2 - 7, // center between card midpoints
        y: Math.max(p1.y, p2.y) + maxHeight + VERTICAL_FAMILY_GAP, // further below the lower parent card
    };
}

function sideHandlesFor(sourceId, targetId, posMap) {
    const source = posMap[sourceId] ?? { x: 0, y: 0 };
    const target = posMap[targetId] ?? { x: 0, y: 0 };
    if (source.x <= target.x) {
        return { sourceHandle: "right", targetHandle: "left" };
    }
    return { sourceHandle: "left", targetHandle: "right" };
}

/**
 * Snap a dragged position to the SINGLE nearest neighbouring card.
 * Picks the closest card by Euclidean distance, then snaps each axis to
 * that one card if the per-axis delta is within ALIGN_SNAP_PX. Aligning
 * to a single card avoids the prior bug where x and y could snap to
 * different cards, producing positions that didn't visually line up
 * with anything.
 */
function snapToNearbyCard(position, nodeId, nodes, members) {
    const currentMember = members.find((m) => m.id === nodeId);
    if (!currentMember) return position;
    const currentHeight = getCardHeight(currentMember);
    const currentCenterY = position.y + currentHeight / 2;

    let nearest = null;
    let nearestCenterY = 0;
    let bestDistSq = Infinity;
    for (const n of nodes) {
        if (n.id === nodeId || n.id.startsWith("family-")) continue;
        const otherMember = members.find((m) => m.id === n.id);
        if (!otherMember) continue;
        const otherHeight = getCardHeight(otherMember);
        const otherCenterY = n.position.y + otherHeight / 2;
        const dx = n.position.x - position.x;
        const dy = otherCenterY - currentCenterY;
        const distSq = dx * dx + dy * dy;
        if (distSq < bestDistSq) {
            bestDistSq = distSq;
            nearest = n;
            nearestCenterY = otherCenterY;
        }
    }
    if (!nearest) return position;
    const adx = Math.abs(nearest.position.x - position.x);
    const ady = Math.abs(nearestCenterY - currentCenterY);
    return {
        x: adx <= ALIGN_SNAP_PX ? nearest.position.x : position.x,
        y: ady <= ALIGN_SNAP_PX ? nearestCenterY - currentHeight / 2 : position.y,
    };
}

function buildGraph(members, relationships, callbacks, posMap) {
    const { familyGroups, handledRelIds } = computeFamilyGroups(relationships);

    // Keys for couples that have a family node → suppress the direct dashed partner edge
    const familyPartnerKeys = new Set(Object.keys(familyGroups));

    // ── Nodes ──────────────────────────────────────────
    const memberNodes = membersToNodes(members, callbacks).map((n) => ({
        ...n,
        position: posMap[n.id] ?? n.position,
    }));

    const familyNodeList = Object.entries(familyGroups).map(
        ([coupleKey, { p1Id, p2Id }]) => ({
            id: `family-${coupleKey}`,
            type: "familyNode",
            position: familyNodePos(p1Id, p2Id, posMap, members),
            data: {},
            draggable: false,
            selectable: false,
            focusable: false,
        }),
    );

    // ── Edges ──────────────────────────────────────────
    // Regular edges: keep partner edges without a family node, keep unhandled child edges
    const regularEdges = relationships
        .filter((r) => !handledRelIds.has(r.id))
        .filter((r) => {
            if (r.type !== "partner") return true;
            const key = [r.from_member_id, r.to_member_id].sort().join("|");
            return !familyPartnerKeys.has(key); // drop partner edge when family node exists
        })
        .map((r) => {
            const partnerHandles =
                r.type === "partner"
                    ? sideHandlesFor(r.from_member_id, r.to_member_id, posMap)
                    : {};

            return {
                id: r.id,
                source: r.from_member_id,
                target: r.to_member_id,
                ...partnerHandles,
                type: r.type === "partner" ? "straight" : "smoothstep",
                style:
                    r.type === "partner"
                        ? {
                              stroke: "#a98e6e",
                              strokeDasharray: "6 4",
                              strokeWidth: 1.5,
                          }
                        : { stroke: "#434843", strokeWidth: 1.5 },
                markerEnd:
                    r.type === "child"
                        ? {
                              type: MarkerType.ArrowClosed,
                              color: "#434843",
                              width: 14,
                              height: 14,
                          }
                        : undefined,
            };
        });

    const familyEdgeList = [];
    Object.entries(familyGroups).forEach(
        ([coupleKey, { p1Id, p2Id, childIds }]) => {
            const fnId = `family-${coupleKey}`;
            // Parent → family dot (subtle gray, no arrow)
            familyEdgeList.push({
                id: `${fnId}-from-${p1Id}`,
                source: p1Id,
                sourceHandle: "bottom",
                target: fnId,
                targetHandle: "top",
                type: "straight",
                style: { stroke: "#a98e6e", strokeWidth: 1.5 },
            });
            familyEdgeList.push({
                id: `${fnId}-from-${p2Id}`,
                source: p2Id,
                sourceHandle: "bottom",
                target: fnId,
                targetHandle: "top",
                type: "straight",
                style: { stroke: "#a98e6e", strokeWidth: 1.5 },
            });
            // Family dot → each child (blue arrow)
            childIds.forEach((childId) => {
                familyEdgeList.push({
                    id: `${fnId}-to-${childId}`,
                    source: fnId,
                    sourceHandle: "bottom",
                    target: childId,
                    targetHandle: "top",
                    type: "smoothstep",
                    style: { stroke: "#434843", strokeWidth: 1.5 },
                    markerEnd: {
                        type: MarkerType.ArrowClosed,
                        color: "#434843",
                        width: 14,
                        height: 14,
                    },
                });
            });
        },
    );

    return {
        nodes: [...memberNodes, ...familyNodeList],
        edges: [...regularEdges, ...familyEdgeList],
    };
}

// ─── Component ────────────────────────────────────────────────────────────────

export default function TreeCanvas({
    onEdit,
    onAddRoot,
    onAddPartner,
    onAddChild,
    reactFlowRef,
}) {
    const members = useStore((s) => s.members);
    const relationships = useStore((s) => s.relationships);
    const removeMember = useStore((s) => s.removeMember);
    const addRelationship = useStore((s) => s.addRelationship);
    const showToast = useStore((s) => s.showToast);
    const activeTree = useStore((s) => s.activeTree);
    const { getToken } = useAuth();

    const [connectModal, setConnectModal] = useState({
        isOpen: false,
        sourceId: null,
        targetId: null,
    });
    // Track dragged positions so rebuilds don't reset cards back to DB values
    const dragPosRef = useRef({});
    const shiftPressedRef = useRef(false);

    const callbacks = {
        onEdit,
        onAddPartner,
        onAddChild,
        onDelete: handleDelete,
    };

    const [nodes, setNodes, onNodesChange] = useNodesState([]);
    const [edges, setEdges, onEdgesChange] = useEdgesState([]);

    // Rebuild both nodes AND edges atomically whenever store data changes
    useEffect(() => {
        const posMap = {};
        members.forEach((m) => {
            posMap[m.id] = { x: m.position_x ?? 0, y: m.position_y ?? 0 };
        });
        Object.assign(posMap, dragPosRef.current);

        const { nodes: newNodes, edges: newEdges } = buildGraph(
            members,
            relationships,
            callbacks,
            posMap,
        );
        setNodes(newNodes);
        setEdges(newEdges);
    }, [members, relationships]); // eslint-disable-line

    useEffect(() => {
        function handleKeyDown(event) {
            if (event.key === "Shift") shiftPressedRef.current = true;
        }
        function handleKeyUp(event) {
            if (event.key === "Shift") shiftPressedRef.current = false;
        }
        function handleBlur() {
            shiftPressedRef.current = false;
        }

        window.addEventListener("keydown", handleKeyDown);
        window.addEventListener("keyup", handleKeyUp);
        window.addEventListener("blur", handleBlur);

        return () => {
            window.removeEventListener("keydown", handleKeyDown);
            window.removeEventListener("keyup", handleKeyUp);
            window.removeEventListener("blur", handleBlur);
        };
    }, []);

    // Keep family node positions live while dragging a parent card
    function handleNodesChange(changes) {
        const nextChanges = shiftPressedRef.current
            ? changes.map((change) => {
                  if (
                      change.type !== "position" ||
                      !change.dragging ||
                      !change.position
                  )
                      return change;
                  return {
                      ...change,
                      position: snapToNearbyCard(
                          change.position,
                          change.id,
                          nodes,
                          members,
                      ),
                  };
              })
            : changes;

        onNodesChange(nextChanges);
        const movingNodes = nextChanges.filter(
            (c) => c.type === "position" && c.dragging && c.position,
        );
        if (!movingNodes.length) return;
        // Update dragPosRef with latest positions
        movingNodes.forEach((c) => {
            dragPosRef.current[c.id] = c.position;
        });
        const { familyGroups } = computeFamilyGroups(relationships);
        if (!Object.keys(familyGroups).length) return;
        setNodes((current) => {
            const posMap = {};
            members.forEach((m) => {
                posMap[m.id] = { x: m.position_x ?? 0, y: m.position_y ?? 0 };
            });
            current
                .filter((n) => !n.id.startsWith("family-"))
                .forEach((n) => {
                    posMap[n.id] = n.position;
                });
            return current.map((n) => {
                if (!n.id.startsWith("family-")) return n;
                const coupleKey = n.id.replace("family-", "");
                const group = familyGroups[coupleKey];
                if (!group) return n;
                return {
                    ...n,
                    position: familyNodePos(
                        group.p1Id,
                        group.p2Id,
                        posMap,
                        members,
                    ),
                };
            });
        });
    }

    // Debounced position save
    const savePosition = useMemo(
        () =>
            debounce(async (id, x, y) => {
                try {
                    const token = await getToken({ template: "supabase" });
                    const client = getAuthenticatedClient(token);
                    await client
                        .from("members")
                        .update({
                            position_x: Math.round(x),
                            position_y: Math.round(y),
                        })
                        .eq("id", id);
                } catch {
                    /* non-critical */
                }
            }, 800),
        [getToken],
    );

    function onNodeDragStop(_, node) {
        if (node.id.startsWith("family-")) return;
        const savedPosition = dragPosRef.current[node.id] ?? node.position;
        dragPosRef.current[node.id] = savedPosition;
        savePosition(node.id, savedPosition.x, savedPosition.y);

        // Rebuild edges so partner-edge handles flip side based on the new
        // x-positions (sideHandlesFor uses posMap to choose left/right).
        const posMap = {};
        members.forEach((m) => {
            posMap[m.id] = { x: m.position_x ?? 0, y: m.position_y ?? 0 };
        });
        Object.assign(posMap, dragPosRef.current);
        const { edges: rebuiltEdges } = buildGraph(
            members,
            relationships,
            callbacks,
            posMap,
        );
        setEdges(rebuiltEdges);
    }

    // Drag-to-connect between person cards
    function onConnect({ source, target }) {
        if (!source || !target || source === target) return;
        if (source.startsWith("family-") || target.startsWith("family-"))
            return;
        const exists = relationships.some(
            (r) =>
                (r.from_member_id === source && r.to_member_id === target) ||
                (r.from_member_id === target && r.to_member_id === source),
        );
        if (exists) {
            showToast("These people are already connected.", "error");
            return;
        }
        setConnectModal({ isOpen: true, sourceId: source, targetId: target });
    }

    async function handleConnectConfirm(relType) {
        const { sourceId, targetId } = connectModal;
        setConnectModal({ isOpen: false, sourceId: null, targetId: null });
        try {
            const token = await getToken({ template: "supabase" });
            const client = getAuthenticatedClient(token);

            // Create the primary relationship
            const { data, error } = await client
                .from("relationships")
                .insert({
                    tree_id: activeTree.id,
                    from_member_id: sourceId,
                    to_member_id: targetId,
                    type: relType,
                })
                .select()
                .single();
            if (error) throw error;
            addRelationship(data);

            // When two existing people become partners, cross-link their children so
            // the family node shows correctly and neither side loses their parent link.
            if (relType === "partner") {
                await syncPartnerChildren(client, sourceId, targetId);
            }

            showToast("Connection added.", "success");
        } catch {
            showToast("Failed to connect people. Please try again.", "error");
        }
    }

    // After a partner relationship is created between A and B:
    // • give B parent-of status for each child A already has
    // • give A parent-of status for each child B already has
    async function syncPartnerChildren(client, aId, bId) {
        const aChildren = relationships.filter(
            (r) => r.type === "child" && r.from_member_id === aId,
        );
        const bChildren = relationships.filter(
            (r) => r.type === "child" && r.from_member_id === bId,
        );

        const toInsert = [];

        for (const r of aChildren) {
            const missing = !relationships.some(
                (x) =>
                    x.type === "child" &&
                    x.from_member_id === bId &&
                    x.to_member_id === r.to_member_id,
            );
            if (missing)
                toInsert.push({
                    tree_id: activeTree.id,
                    from_member_id: bId,
                    to_member_id: r.to_member_id,
                    type: "child",
                });
        }
        for (const r of bChildren) {
            const missing = !relationships.some(
                (x) =>
                    x.type === "child" &&
                    x.from_member_id === aId &&
                    x.to_member_id === r.to_member_id,
            );
            if (missing)
                toInsert.push({
                    tree_id: activeTree.id,
                    from_member_id: aId,
                    to_member_id: r.to_member_id,
                    type: "child",
                });
        }

        if (!toInsert.length) return;

        const { data: newRels, error } = await client
            .from("relationships")
            .insert(toInsert)
            .select();
        if (!error && newRels) newRels.forEach((r) => addRelationship(r));
    }

    async function handleDelete(member) {
        try {
            const token = await getToken({ template: "supabase" });
            const client = getAuthenticatedClient(token);
            await client
                .from("relationships")
                .delete()
                .or(
                    `from_member_id.eq.${member.id},to_member_id.eq.${member.id}`,
                );
            const { error } = await client
                .from("members")
                .delete()
                .eq("id", member.id);
            if (error) throw error;
            removeMember(member.id);
            showToast(`${member.name} removed from tree.`, "success");
        } catch {
            showToast("Failed to delete person. Please try again.", "error");
        }
    }

    const sourceMember = members.find((m) => m.id === connectModal.sourceId);
    const targetMember = members.find((m) => m.id === connectModal.targetId);

    return (
        <div className="flex-1 h-full relative" ref={reactFlowRef}>
            <ReactFlow
                nodes={nodes}
                edges={edges}
                onNodesChange={handleNodesChange}
                onEdgesChange={onEdgesChange}
                nodeTypes={nodeTypes}
                onNodeDragStop={onNodeDragStop}
                onConnect={onConnect}
                fitView
                fitViewOptions={{ padding: 0.3 }}
                minZoom={0.2}
                maxZoom={2}
                deleteKeyCode={null}
                connectionLineStyle={{
                    stroke: "#4d6453",
                    strokeWidth: 2,
                    strokeDasharray: "6 3",
                }}
                connectionLineType="smoothstep"
            >
                <Background color="#c3c8c1" gap={28} size={1} />
                <Controls showInteractive={false} />
            </ReactFlow>

            {members.length === 0 && (
                <div className="absolute inset-0 z-10 flex items-center justify-center px-5 pointer-events-none">
                    <div className="max-w-lg rounded-md border border-outline-variant/70 bg-container-lowest/95 p-6 text-center shadow-modal pointer-events-auto">
                        <span className="label-meta text-tertiary-accent">
                            Begin the family record
                        </span>
                        <h2 className="mt-2 font-serif text-headline-md font-semibold text-ink">
                            Start with one person you know well.
                        </h2>
                        <p className="mx-auto mt-3 max-w-sm text-sm leading-6 text-ink-variant">
                            Add yourself, a parent, or a grandparent. Once the
                            first person is here, you can add partners and
                            children from their card.
                        </p>
                        <div className="mt-5 flex flex-col items-center justify-center gap-3 sm:flex-row">
                            <button
                                type="button"
                                onClick={onAddRoot}
                                className="btn-primary"
                            >
                                Add first person
                            </button>
                            <p className="text-xs text-ink-variant">
                                You can move each card later.
                            </p>
                        </div>
                    </div>
                </div>
            )}

            <ConnectModal
                isOpen={connectModal.isOpen}
                sourceMember={sourceMember}
                targetMember={targetMember}
                onConfirm={handleConnectConfirm}
                onClose={() =>
                    setConnectModal({
                        isOpen: false,
                        sourceId: null,
                        targetId: null,
                    })
                }
            />
        </div>
    );
}
