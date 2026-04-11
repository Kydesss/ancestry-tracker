import { useCallback, useEffect, useRef, useState } from 'react'
import ReactFlow, {
  Background,
  Controls,
  Handle,
  Position,
  useNodesState,
  useEdgesState,
  MarkerType,
} from 'reactflow'
import 'reactflow/dist/style.css'
import PersonCard from './PersonCard'
import ConnectModal from './ConnectModal'
import useStore from '../../store/useStore'
import { getAuthenticatedClient } from '../../lib/supabaseClient'
import { useAuth } from '@clerk/clerk-react'
import { debounce } from './debounce'

// Approximate card dimensions (w-52 = 208px, ~240px tall)
const CARD_W = 208
const CARD_H = 240

// ─── Family node ─────────────────────────────────────────────────────────────
// A small dot that sits between two partners and acts as the shared origin
// for their children. Prevents duplicate arrows from each parent to each child.
function FamilyNode() {
  return (
    <div
      style={{
        width: 14,
        height: 14,
        borderRadius: '50%',
        background: '#6b7280',
        border: '2.5px solid #9ca3af',
        boxShadow: '0 0 0 3px #f3f4f6',
      }}
    >
      <Handle id="left"   type="target" position={Position.Left}   style={{ opacity: 0, width: 1, height: 1, minWidth: 0, minHeight: 0 }} />
      <Handle id="right"  type="target" position={Position.Right}  style={{ opacity: 0, width: 1, height: 1, minWidth: 0, minHeight: 0 }} />
      <Handle id="top"    type="target" position={Position.Top}    style={{ opacity: 0, width: 1, height: 1, minWidth: 0, minHeight: 0 }} />
      <Handle id="bottom" type="source" position={Position.Bottom} style={{ opacity: 0, width: 1, height: 1, minWidth: 0, minHeight: 0 }} />
    </div>
  )
}

const nodeTypes = { personCard: PersonCard, familyNode: FamilyNode }

// ─── Graph builders ───────────────────────────────────────────────────────────

function membersToNodes(members, callbacks) {
  return members.map((m) => ({
    id: m.id,
    type: 'personCard',
    position: { x: m.position_x ?? 0, y: m.position_y ?? 0 },
    data: { member: m, ...callbacks },
  }))
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
      .filter((r) => r.type === 'partner')
      .map((r) => [r.from_member_id, r.to_member_id].sort().join('|'))
  )

  // childId → [parentIds]
  const childParents = {}
  relationships
    .filter((r) => r.type === 'child')
    .forEach((r) => {
      ;(childParents[r.to_member_id] = childParents[r.to_member_id] || []).push(r.from_member_id)
    })

  const familyGroups = {}
  const handledRelIds = new Set()

  Object.entries(childParents).forEach(([childId, parentIds]) => {
    for (let i = 0; i < parentIds.length; i++) {
      for (let j = i + 1; j < parentIds.length; j++) {
        const [a, b] = [parentIds[i], parentIds[j]].sort()
        const coupleKey = `${a}|${b}`
        if (partnerSet.has(coupleKey)) {
          if (!familyGroups[coupleKey]) {
            familyGroups[coupleKey] = { p1Id: a, p2Id: b, childIds: new Set() }
          }
          familyGroups[coupleKey].childIds.add(childId)
          // Mark the individual parent→child edges as superseded
          relationships
            .filter(
              (r) =>
                r.type === 'child' &&
                r.to_member_id === childId &&
                (r.from_member_id === a || r.from_member_id === b)
            )
            .forEach((r) => handledRelIds.add(r.id))
        }
      }
    }
  })

  return { familyGroups, handledRelIds }
}

/** X/Y of the family dot, computed from the current node positions. */
function familyNodePos(p1Id, p2Id, posMap) {
  const p1 = posMap[p1Id] ?? { x: 0, y: 0 }
  const p2 = posMap[p2Id] ?? { x: 0, y: 0 }
  return {
    x: (p1.x + p2.x) / 2 + CARD_W / 2 - 7,   // center between card midpoints
    y: Math.max(p1.y, p2.y) + CARD_H + 16,     // just below the lower parent card
  }
}

function buildGraph(members, relationships, callbacks, posMap) {
  const { familyGroups, handledRelIds } = computeFamilyGroups(relationships)

  // Keys for couples that have a family node → suppress the direct dashed partner edge
  const familyPartnerKeys = new Set(Object.keys(familyGroups))

  // ── Nodes ──────────────────────────────────────────
  const memberNodes = membersToNodes(members, callbacks).map((n) => ({
    ...n,
    position: posMap[n.id] ?? n.position,
  }))

  const familyNodeList = Object.entries(familyGroups).map(([coupleKey, { p1Id, p2Id }]) => ({
    id: `family-${coupleKey}`,
    type: 'familyNode',
    position: familyNodePos(p1Id, p2Id, posMap),
    data: {},
    draggable: false,
    selectable: false,
    focusable: false,
  }))

  // ── Edges ──────────────────────────────────────────
  // Regular edges: keep partner edges without a family node, keep unhandled child edges
  const regularEdges = relationships
    .filter((r) => !handledRelIds.has(r.id))
    .filter((r) => {
      if (r.type !== 'partner') return true
      const key = [r.from_member_id, r.to_member_id].sort().join('|')
      return !familyPartnerKeys.has(key) // drop partner edge when family node exists
    })
    .map((r) => ({
      id: r.id,
      source: r.from_member_id,
      target: r.to_member_id,
      type: 'smoothstep',
      style:
        r.type === 'partner'
          ? { stroke: '#9ca3af', strokeDasharray: '6 3', strokeWidth: 2 }
          : { stroke: '#2563eb', strokeWidth: 2 },
      markerEnd:
        r.type === 'child'
          ? { type: MarkerType.ArrowClosed, color: '#2563eb', width: 16, height: 16 }
          : undefined,
    }))

  const familyEdgeList = []
  Object.entries(familyGroups).forEach(([coupleKey, { p1Id, p2Id, childIds }]) => {
    const fnId = `family-${coupleKey}`
    // Parent → family dot (subtle gray, no arrow)
    familyEdgeList.push({
      id: `${fnId}-from-${p1Id}`,
      source: p1Id,
      target: fnId,
      targetHandle: 'left',
      type: 'smoothstep',
      style: { stroke: '#9ca3af', strokeWidth: 2 },
    })
    familyEdgeList.push({
      id: `${fnId}-from-${p2Id}`,
      source: p2Id,
      target: fnId,
      targetHandle: 'right',
      type: 'smoothstep',
      style: { stroke: '#9ca3af', strokeWidth: 2 },
    })
    // Family dot → each child (blue arrow)
    childIds.forEach((childId) => {
      familyEdgeList.push({
        id: `${fnId}-to-${childId}`,
        source: fnId,
        sourceHandle: 'bottom',
        target: childId,
        type: 'smoothstep',
        style: { stroke: '#2563eb', strokeWidth: 2 },
        markerEnd: { type: MarkerType.ArrowClosed, color: '#2563eb', width: 16, height: 16 },
      })
    })
  })

  return {
    nodes: [...memberNodes, ...familyNodeList],
    edges: [...regularEdges, ...familyEdgeList],
  }
}

// ─── Component ────────────────────────────────────────────────────────────────

export default function TreeCanvas({ onEdit, onAddPartner, onAddChild, reactFlowRef }) {
  const members = useStore((s) => s.members)
  const relationships = useStore((s) => s.relationships)
  const removeMember = useStore((s) => s.removeMember)
  const addRelationship = useStore((s) => s.addRelationship)
  const showToast = useStore((s) => s.showToast)
  const activeTree = useStore((s) => s.activeTree)
  const { getToken } = useAuth()

  const [connectModal, setConnectModal] = useState({ isOpen: false, sourceId: null, targetId: null })
  // Track dragged positions so rebuilds don't reset cards back to DB values
  const dragPosRef = useRef({})

  const callbacks = { onEdit, onAddPartner, onAddChild, onDelete: handleDelete }

  const [nodes, setNodes, onNodesChange] = useNodesState([])
  const [edges, setEdges, onEdgesChange] = useEdgesState([])

  // Rebuild both nodes AND edges atomically whenever store data changes
  useEffect(() => {
    const posMap = {}
    members.forEach((m) => { posMap[m.id] = { x: m.position_x ?? 0, y: m.position_y ?? 0 } })
    Object.assign(posMap, dragPosRef.current)

    const { nodes: newNodes, edges: newEdges } = buildGraph(members, relationships, callbacks, posMap)
    setNodes(newNodes)
    setEdges(newEdges)
  }, [members, relationships]) // eslint-disable-line

  // Keep family node positions live while dragging a parent card
  function handleNodesChange(changes) {
    onNodesChange(changes)
    const movingNodes = changes.filter((c) => c.type === 'position' && c.dragging && c.position)
    if (!movingNodes.length) return
    // Update dragPosRef with latest positions
    movingNodes.forEach((c) => { dragPosRef.current[c.id] = c.position })
    const { familyGroups } = computeFamilyGroups(relationships)
    if (!Object.keys(familyGroups).length) return
    setNodes((current) => {
      const posMap = {}
      members.forEach((m) => { posMap[m.id] = { x: m.position_x ?? 0, y: m.position_y ?? 0 } })
      current.filter((n) => !n.id.startsWith('family-')).forEach((n) => { posMap[n.id] = n.position })
      return current.map((n) => {
        if (!n.id.startsWith('family-')) return n
        const coupleKey = n.id.replace('family-', '')
        const group = familyGroups[coupleKey]
        if (!group) return n
        return { ...n, position: familyNodePos(group.p1Id, group.p2Id, posMap) }
      })
    })
  }

  // Debounced position save
  const savePosition = useCallback(
    debounce(async (id, x, y) => {
      try {
        const token = await getToken({ template: 'supabase' })
        const client = getAuthenticatedClient(token)
        await client.from('members').update({ position_x: x, position_y: y }).eq('id', id)
      } catch { /* non-critical */ }
    }, 800),
    [getToken]
  )

  function onNodeDragStop(_, node) {
    if (node.id.startsWith('family-')) return
    dragPosRef.current[node.id] = node.position
    savePosition(node.id, node.position.x, node.position.y)
  }

  // Drag-to-connect between person cards
  function onConnect({ source, target }) {
    if (!source || !target || source === target) return
    if (source.startsWith('family-') || target.startsWith('family-')) return
    const exists = relationships.some(
      (r) =>
        (r.from_member_id === source && r.to_member_id === target) ||
        (r.from_member_id === target && r.to_member_id === source)
    )
    if (exists) {
      showToast('These people are already connected.', 'error')
      return
    }
    setConnectModal({ isOpen: true, sourceId: source, targetId: target })
  }

  async function handleConnectConfirm(relType) {
    const { sourceId, targetId } = connectModal
    setConnectModal({ isOpen: false, sourceId: null, targetId: null })
    try {
      const token = await getToken({ template: 'supabase' })
      const client = getAuthenticatedClient(token)

      // Create the primary relationship
      const { data, error } = await client
        .from('relationships')
        .insert({ tree_id: activeTree.id, from_member_id: sourceId, to_member_id: targetId, type: relType })
        .select()
        .single()
      if (error) throw error
      addRelationship(data)

      // When two existing people become partners, cross-link their children so
      // the family node shows correctly and neither side loses their parent link.
      if (relType === 'partner') {
        await syncPartnerChildren(client, sourceId, targetId)
      }

      showToast('Connection added.', 'success')
    } catch {
      showToast('Failed to connect people. Please try again.', 'error')
    }
  }

  // After a partner relationship is created between A and B:
  // • give B parent-of status for each child A already has
  // • give A parent-of status for each child B already has
  async function syncPartnerChildren(client, aId, bId) {
    const aChildren = relationships.filter((r) => r.type === 'child' && r.from_member_id === aId)
    const bChildren = relationships.filter((r) => r.type === 'child' && r.from_member_id === bId)

    const toInsert = []

    for (const r of aChildren) {
      const missing = !relationships.some((x) => x.type === 'child' && x.from_member_id === bId && x.to_member_id === r.to_member_id)
      if (missing) toInsert.push({ tree_id: activeTree.id, from_member_id: bId, to_member_id: r.to_member_id, type: 'child' })
    }
    for (const r of bChildren) {
      const missing = !relationships.some((x) => x.type === 'child' && x.from_member_id === aId && x.to_member_id === r.to_member_id)
      if (missing) toInsert.push({ tree_id: activeTree.id, from_member_id: aId, to_member_id: r.to_member_id, type: 'child' })
    }

    if (!toInsert.length) return

    const { data: newRels, error } = await client
      .from('relationships')
      .insert(toInsert)
      .select()
    if (!error && newRels) newRels.forEach((r) => addRelationship(r))
  }

  async function handleDelete(member) {
    try {
      const token = await getToken({ template: 'supabase' })
      const client = getAuthenticatedClient(token)
      await client
        .from('relationships')
        .delete()
        .or(`from_member_id.eq.${member.id},to_member_id.eq.${member.id}`)
      const { error } = await client.from('members').delete().eq('id', member.id)
      if (error) throw error
      removeMember(member.id)
      showToast(`${member.name} removed from tree.`, 'success')
    } catch {
      showToast('Failed to delete person. Please try again.', 'error')
    }
  }

  const sourceMember = members.find((m) => m.id === connectModal.sourceId)
  const targetMember = members.find((m) => m.id === connectModal.targetId)

  return (
    <div className="flex-1 h-full" ref={reactFlowRef}>
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
        connectionLineStyle={{ stroke: '#6366f1', strokeWidth: 2, strokeDasharray: '6 3' }}
        connectionLineType="smoothstep"
      >
        <Background color="#e5e7eb" gap={24} size={1} />
        <Controls showInteractive={false} className="bg-white shadow-card border border-gray-100 rounded-xl overflow-hidden" />
      </ReactFlow>

      <ConnectModal
        isOpen={connectModal.isOpen}
        sourceMember={sourceMember}
        targetMember={targetMember}
        onConfirm={handleConnectConfirm}
        onClose={() => setConnectModal({ isOpen: false, sourceId: null, targetId: null })}
      />
    </div>
  )
}
