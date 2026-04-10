import { create } from 'zustand'

const useStore = create((set) => ({
  // Current Clerk user object
  user: null,
  setUser: (user) => set({ user }),

  // 'free' | 'premium'
  subscriptionTier: 'free',
  setSubscriptionTier: (tier) => set({ subscriptionTier: tier }),

  // The currently selected tree object
  activeTree: null,
  setActiveTree: (tree) => set({ activeTree: tree }),

  // Array of member nodes for the active tree
  members: [],
  setMembers: (members) => set({ members }),
  addMember: (member) => set((state) => ({ members: [...state.members, member] })),
  updateMember: (id, updates) =>
    set((state) => ({
      members: state.members.map((m) => (m.id === id ? { ...m, ...updates } : m)),
    })),
  removeMember: (id) =>
    set((state) => ({
      members: state.members.filter((m) => m.id !== id),
      relationships: state.relationships.filter(
        (r) => r.from_member_id !== id && r.to_member_id !== id
      ),
    })),

  // Array of relationship edges for the active tree
  relationships: [],
  setRelationships: (relationships) => set({ relationships }),
  addRelationship: (rel) =>
    set((state) => ({ relationships: [...state.relationships, rel] })),
  removeRelationship: (id) =>
    set((state) => ({
      relationships: state.relationships.filter((r) => r.id !== id),
    })),

  // UI state
  showUpgradeModal: false,
  setShowUpgradeModal: (show) => set({ showUpgradeModal: show }),

  upgradeFeature: null,
  setUpgradeFeature: (feature) => set({ upgradeFeature: feature }),

  // Toast notifications
  toast: null,
  showToast: (message, type = 'success') => {
    set({ toast: { message, type, id: Date.now() } })
    setTimeout(() => set({ toast: null }), 4000)
  },
  clearToast: () => set({ toast: null }),
}))

export default useStore
