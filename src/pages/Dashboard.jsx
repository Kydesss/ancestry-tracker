import { useState, useEffect, useRef, useCallback } from 'react'
import { useUser, useAuth } from '@clerk/clerk-react'
import { useSearchParams } from 'react-router-dom'
import { useReactFlow, ReactFlowProvider } from 'reactflow'
import Sidebar from '../components/layout/Sidebar'
import Toolbar from '../components/layout/Toolbar'
import TreeCanvas from '../components/tree/TreeCanvas'
import PersonModal from '../components/tree/PersonModal'
import UpgradeModal from '../components/ui/UpgradeModal'
import useStore from '../store/useStore'
import { getAuthenticatedClient } from '../lib/supabaseClient'
import { useSubscription } from '../hooks/useSubscription'

function DashboardInner() {
  const { user } = useUser()
  const { getToken } = useAuth()
  const [searchParams] = useSearchParams()
  const [sidebarOpen, setSidebarOpen] = useState(false)

  const [modalState, setModalState] = useState({
    isOpen: false,
    editMember: null,
    relationshipType: null,
    parentMember: null,
  })

  const reactFlowRef = useRef(null)

  const setUser = useStore((s) => s.setUser)
  const setSubscriptionTier = useStore((s) => s.setSubscriptionTier)
  const setActiveTree = useStore((s) => s.setActiveTree)
  const setMembers = useStore((s) => s.setMembers)
  const setRelationships = useStore((s) => s.setRelationships)
  const showToast = useStore((s) => s.showToast)
  const activeTree = useStore((s) => s.activeTree)
  const { requirePremium } = useSubscription()

  // Bootstrap: sync Clerk user to Supabase, load tree data
  useEffect(() => {
    if (!user) return
    setUser(user)
    bootstrap()
  }, [user]) // eslint-disable-line

  // Handle ?upgraded=true after Stripe redirect
  useEffect(() => {
    if (searchParams.get('upgraded') === 'true') {
      refetchSubscription()
      showToast('Welcome to Premium! Your plan has been upgraded.', 'success')
    }
  }, [searchParams]) // eslint-disable-line

  async function bootstrap() {
    try {
      const token = await getToken({ template: 'supabase' })
      const client = getAuthenticatedClient(token)

      // Upsert user row
      const { error: upsertErr } = await client.from('users').upsert(
        { id: user.id, email: user.primaryEmailAddress?.emailAddress || '' },
        { onConflict: 'id', ignoreDuplicates: false }
      )
      if (upsertErr) console.error('upsert user', upsertErr)

      // Fetch subscription tier
      const { data: userData } = await client.from('users').select('subscription_tier').eq('id', user.id).single()
      if (userData) setSubscriptionTier(userData.subscription_tier)

      // Fetch or create the user's first tree
      let { data: trees } = await client.from('trees').select('*').eq('owner_id', user.id).order('created_at').limit(1)
      let tree = trees?.[0]
      if (!tree) {
        const { data: newTree } = await client
          .from('trees')
          .insert({ owner_id: user.id, name: `${user.firstName || 'My'}'s Family Tree` })
          .select()
          .single()
        tree = newTree
      }

      if (!tree) return
      setActiveTree(tree)

      // Fetch members + relationships
      const [{ data: members }, { data: rels }] = await Promise.all([
        client.from('members').select('*').eq('tree_id', tree.id),
        client.from('relationships').select('*').eq('tree_id', tree.id),
      ])
      setMembers(members || [])
      setRelationships(rels || [])
    } catch (err) {
      console.error('bootstrap error', err)
      showToast('Failed to load your tree. Please refresh.', 'error')
    }
  }

  async function refetchSubscription() {
    try {
      const token = await getToken({ template: 'supabase' })
      const client = getAuthenticatedClient(token)
      const { data } = await client.from('users').select('subscription_tier').eq('id', user.id).single()
      if (data) setSubscriptionTier(data.subscription_tier)
    } catch {/* ignore */}
  }

  function openAddModal({ relationshipType = null, parentMember = null } = {}) {
    if (relationshipType === null) {
      // Adding root person — check member limit
      if (!requirePremium('add_member', () => {
        setModalState({ isOpen: true, editMember: null, relationshipType: null, parentMember: null })
      })) return
    }
    setModalState({ isOpen: true, editMember: null, relationshipType, parentMember })
  }

  function openEditModal(member) {
    setModalState({ isOpen: true, editMember: member, relationshipType: null, parentMember: null })
  }

  function closeModal() {
    setModalState((s) => ({ ...s, isOpen: false }))
  }

  return (
    <div className="flex h-screen overflow-hidden bg-gray-50">
      {/* Sidebar */}
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      {/* Main */}
      <div className="flex flex-col flex-1 min-w-0 overflow-hidden">
        {/* Mobile top bar */}
        <div className="flex items-center h-14 px-4 border-b border-gray-200 bg-white lg:hidden flex-shrink-0">
          <button
            onClick={() => setSidebarOpen(true)}
            className="p-2 rounded-lg hover:bg-gray-100 text-gray-600 mr-3"
          >
            <svg className="w-5 h-5" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M3 5a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 10a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 15a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z" clipRule="evenodd" />
            </svg>
          </button>
          <span className="text-base font-semibold text-gray-900">
            {activeTree?.name || 'My Family Tree'}
          </span>
        </div>

        {/* Tree title bar (desktop) */}
        <div className="hidden lg:flex items-center h-14 px-6 border-b border-gray-200 bg-white flex-shrink-0">
          <h1 className="text-base font-semibold text-gray-900">
            {activeTree?.name || 'My Family Tree'}
          </h1>
        </div>

        {/* Toolbar */}
        <Toolbar
          onAddRoot={() => openAddModal()}
          onZoomIn={() => {/* handled inside ReactFlow via Controls */}}
          onZoomOut={() => {}}
        />

        {/* Canvas */}
        <div className="flex-1 overflow-hidden">
          <TreeCanvas
            onEdit={openEditModal}
            onAddPartner={(member) => openAddModal({ relationshipType: 'partner', parentMember: member })}
            onAddChild={(member) => openAddModal({ relationshipType: 'child', parentMember: member })}
            reactFlowRef={reactFlowRef}
          />
        </div>
      </div>

      {/* Modals */}
      <PersonModal
        isOpen={modalState.isOpen}
        onClose={closeModal}
        editMember={modalState.editMember}
        relationshipType={modalState.relationshipType}
        parentMember={modalState.parentMember}
      />
      <UpgradeModal />
    </div>
  )
}

// Wrap in ReactFlowProvider so useReactFlow() works inside child components
export default function Dashboard() {
  return (
    <ReactFlowProvider>
      <DashboardInner />
    </ReactFlowProvider>
  )
}
