import { useState, useEffect, useRef } from "react";
import { useUser, useAuth } from "@clerk/clerk-react";
import { useSearchParams } from "react-router-dom";
import { useReactFlow, ReactFlowProvider } from "reactflow";
import Sidebar from "../components/layout/Sidebar";
import Toolbar from "../components/layout/Toolbar";
import TreeCanvas from "../components/tree/TreeCanvas";
import PersonModal from "../components/tree/PersonModal";
import UpgradeModal from "../components/ui/UpgradeModal";
import useStore from "../store/useStore";
import { getAuthenticatedClient } from "../lib/supabaseClient";
import { useSubscription } from "../hooks/useSubscription";

function DashboardInner() {
    const { user } = useUser();
    const { getToken } = useAuth();
    const [searchParams] = useSearchParams();
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [treeLoading, setTreeLoading] = useState(true);
    const [bootstrapError, setBootstrapError] = useState(null);

    const [modalState, setModalState] = useState({
        isOpen: false,
        editMember: null,
        relationshipType: null,
        parentMember: null,
        spawnPosition: null,
    });

    const reactFlowRef = useRef(null);
    const { screenToFlowPosition } = useReactFlow();

    const setUser = useStore((s) => s.setUser);
    const setSubscriptionTier = useStore((s) => s.setSubscriptionTier);
    const setActiveTree = useStore((s) => s.setActiveTree);
    const setMembers = useStore((s) => s.setMembers);
    const setRelationships = useStore((s) => s.setRelationships);
    const showToast = useStore((s) => s.showToast);
    const activeTree = useStore((s) => s.activeTree);
    const { requirePremium } = useSubscription();

    useEffect(() => {
        if (!user) return;
        setUser(user);
        bootstrap();
    }, [user]); // eslint-disable-line

    useEffect(() => {
        if (searchParams.get("upgraded") === "true") {
            refetchSubscription();
            showToast(
                "Welcome to Heirloom. Your archive is now unlimited.",
                "success",
            );
        }
    }, [searchParams]); // eslint-disable-line

    async function bootstrap() {
        setTreeLoading(true);
        setBootstrapError(null);
        try {
            const token = await getToken({ template: "supabase" });
            if (!token)
                throw new Error(
                    'Could not get Supabase token from Clerk. Make sure the "supabase" JWT template exists in your Clerk dashboard.',
                );

            const client = getAuthenticatedClient(token);

            const { error: upsertErr } = await client
                .from("users")
                .upsert(
                    {
                        id: user.id,
                        email: user.primaryEmailAddress?.emailAddress || "",
                    },
                    { onConflict: "id", ignoreDuplicates: false },
                );
            if (upsertErr)
                throw new Error(`User sync failed: ${upsertErr.message}`);

            const { data: userData } = await client
                .from("users")
                .select("subscription_tier")
                .eq("id", user.id)
                .single();
            if (userData) setSubscriptionTier(userData.subscription_tier);

            const { data: trees, error: treesErr } = await client
                .from("trees")
                .select("*")
                .eq("owner_id", user.id)
                .order("created_at")
                .limit(1);
            if (treesErr)
                throw new Error(`Failed to fetch trees: ${treesErr.message}`);

            let tree = trees?.[0];
            if (!tree) {
                const { data: newTree, error: insertErr } = await client
                    .from("trees")
                    .insert({
                        owner_id: user.id,
                        name: `${user.firstName || "My"}'s Family Tree`,
                    })
                    .select()
                    .single();
                if (insertErr)
                    throw new Error(
                        `Failed to create tree: ${insertErr.message}`,
                    );
                tree = newTree;
            }

            setActiveTree(tree);

            const [{ data: members }, { data: rels }] = await Promise.all([
                client.from("members").select("*").eq("tree_id", tree.id),
                client.from("relationships").select("*").eq("tree_id", tree.id),
            ]);
            setMembers(members || []);
            setRelationships(rels || []);
        } catch (err) {
            console.error("[bootstrap]", err);
            setBootstrapError(err.message);
        } finally {
            setTreeLoading(false);
        }
    }

    async function refetchSubscription() {
        try {
            const token = await getToken({ template: "supabase" });
            const client = getAuthenticatedClient(token);
            const { data } = await client
                .from("users")
                .select("subscription_tier")
                .eq("id", user.id)
                .single();
            if (data) setSubscriptionTier(data.subscription_tier);
        } catch {
            /* ignore */
        }
    }

    function openAddModal({
        relationshipType = null,
        parentMember = null,
    } = {}) {
        const spawnPosition = screenToFlowPosition({
            x: window.innerWidth / 2,
            y: window.innerHeight / 2,
        });
        if (relationshipType === null) {
            if (
                !requirePremium("add_member", () => {
                    setModalState({
                        isOpen: true,
                        editMember: null,
                        relationshipType: null,
                        parentMember: null,
                        spawnPosition,
                    });
                })
            )
                return;
        }
        setModalState({
            isOpen: true,
            editMember: null,
            relationshipType,
            parentMember,
            spawnPosition,
        });
    }

    function openEditModal(member) {
        setModalState({
            isOpen: true,
            editMember: member,
            relationshipType: null,
            parentMember: null,
        });
    }

    function closeModal() {
        setModalState((s) => ({ ...s, isOpen: false }));
    }

    return (
        <div className="flex h-screen overflow-hidden bg-surface text-ink">
            <Sidebar
                isOpen={sidebarOpen}
                onClose={() => setSidebarOpen(false)}
            />

            <div className="flex flex-col flex-1 min-w-0 overflow-hidden">
                {/* Mobile top bar */}
                <div className="flex items-center h-14 px-4 border-b border-outline-variant/60 bg-container-lowest lg:hidden flex-shrink-0">
                    <button
                        onClick={() => setSidebarOpen(true)}
                        className="p-2 rounded hover:bg-container-low text-ink-variant mr-3 transition-colors"
                    >
                        <svg
                            className="w-5 h-5"
                            viewBox="0 0 20 20"
                            fill="currentColor"
                        >
                            <path
                                fillRule="evenodd"
                                d="M3 5a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 10a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 15a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z"
                                clipRule="evenodd"
                            />
                        </svg>
                    </button>
                    <span className="font-serif text-base font-semibold text-ink">
                        {activeTree?.name || "My Family Tree"}
                    </span>
                </div>

                {/* Tree title bar (desktop) */}
                <div className="hidden lg:flex items-center h-14 px-6 border-b border-outline-variant/60 bg-container-lowest flex-shrink-0">
                    <h1 className="font-serif text-lg font-semibold text-ink">
                        {activeTree?.name || "My Family Tree"}
                    </h1>
                    <span className="ml-3 label-meta">
                        An archive in progress
                    </span>
                </div>

                <Toolbar
                    onAddRoot={() => openAddModal()}
                    disabled={treeLoading || !activeTree}
                />

                {/* Canvas */}
                <div className="flex-1 overflow-hidden relative">
                    {treeLoading && (
                        <div className="absolute inset-0 flex items-center justify-center bg-surface z-10">
                            <div className="flex flex-col items-center gap-3 text-ink-variant">
                                <svg
                                    className="w-8 h-8 animate-spin text-primary"
                                    viewBox="0 0 24 24"
                                    fill="none"
                                >
                                    <circle
                                        className="opacity-25"
                                        cx="12"
                                        cy="12"
                                        r="10"
                                        stroke="currentColor"
                                        strokeWidth="4"
                                    />
                                    <path
                                        className="opacity-75"
                                        fill="currentColor"
                                        d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
                                    />
                                </svg>
                                <span className="font-serif italic text-sm">
                                    Composing your archive…
                                </span>
                            </div>
                        </div>
                    )}
                    {bootstrapError && (
                        <div className="absolute inset-0 flex items-center justify-center bg-surface z-10 p-6">
                            <div className="bg-container-lowest rounded-md shadow-modal border border-danger-container p-7 max-w-md w-full text-center">
                                <div className="w-10 h-10 mx-auto mb-3 rounded-full bg-danger-container text-danger flex items-center justify-center">
                                    <svg
                                        className="w-5 h-5"
                                        viewBox="0 0 20 20"
                                        fill="currentColor"
                                    >
                                        <path
                                            fillRule="evenodd"
                                            d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.214 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z"
                                            clipRule="evenodd"
                                        />
                                    </svg>
                                </div>
                                <h3 className="font-serif text-lg font-semibold text-ink mb-2">
                                    Could not open your archive
                                </h3>
                                <p className="text-sm text-danger-on-container bg-danger-container/60 rounded px-3 py-2 mb-5 text-left font-mono break-all">
                                    {bootstrapError}
                                </p>
                                <button
                                    onClick={bootstrap}
                                    className="btn-primary"
                                >
                                    Try Again
                                </button>
                            </div>
                        </div>
                    )}
                    <TreeCanvas
                        onEdit={openEditModal}
                        onAddPartner={(member) =>
                            openAddModal({
                                relationshipType: "partner",
                                parentMember: member,
                            })
                        }
                        onAddChild={(member) =>
                            openAddModal({
                                relationshipType: "child",
                                parentMember: member,
                            })
                        }
                        reactFlowRef={reactFlowRef}
                    />
                </div>
            </div>

            <PersonModal
                isOpen={modalState.isOpen}
                onClose={closeModal}
                editMember={modalState.editMember}
                relationshipType={modalState.relationshipType}
                parentMember={modalState.parentMember}
                spawnPosition={modalState.spawnPosition}
            />
            <UpgradeModal />
        </div>
    );
}

export default function Dashboard() {
    return (
        <ReactFlowProvider>
            <DashboardInner />
        </ReactFlowProvider>
    );
}
