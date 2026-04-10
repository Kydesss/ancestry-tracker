import { describe, it, expect, beforeEach } from 'vitest'
import useStore from '../../src/store/useStore'

beforeEach(() => {
  useStore.setState({
    members: [],
    relationships: [],
    subscriptionTier: 'free',
    activeTree: null,
    user: null,
    showUpgradeModal: false,
    upgradeFeature: null,
    toast: null,
  })
})

describe('useStore — members', () => {
  it('addMember appends a member', () => {
    useStore.getState().addMember({ id: '1', name: 'Alice' })
    expect(useStore.getState().members).toHaveLength(1)
    expect(useStore.getState().members[0].name).toBe('Alice')
  })

  it('updateMember patches a member by id', () => {
    useStore.getState().addMember({ id: '1', name: 'Alice' })
    useStore.getState().updateMember('1', { name: 'Alice Updated' })
    expect(useStore.getState().members[0].name).toBe('Alice Updated')
  })

  it('removeMember removes the member and their relationships', () => {
    useStore.setState({
      members: [{ id: 'm1' }, { id: 'm2' }],
      relationships: [
        { id: 'r1', from_member_id: 'm1', to_member_id: 'm2' },
        { id: 'r2', from_member_id: 'm2', to_member_id: 'm1' },
      ],
    })
    useStore.getState().removeMember('m1')
    expect(useStore.getState().members).toHaveLength(1)
    expect(useStore.getState().relationships).toHaveLength(0)
  })
})

describe('useStore — subscriptionTier', () => {
  it('defaults to free', () => {
    expect(useStore.getState().subscriptionTier).toBe('free')
  })

  it('setSubscriptionTier updates tier', () => {
    useStore.getState().setSubscriptionTier('premium')
    expect(useStore.getState().subscriptionTier).toBe('premium')
  })
})

describe('useStore — toast', () => {
  it('showToast sets a toast object', () => {
    useStore.getState().showToast('Hello!', 'success')
    const { toast } = useStore.getState()
    expect(toast).not.toBeNull()
    expect(toast.message).toBe('Hello!')
    expect(toast.type).toBe('success')
  })

  it('clearToast sets toast to null', () => {
    useStore.getState().showToast('Hello!', 'success')
    useStore.getState().clearToast()
    expect(useStore.getState().toast).toBeNull()
  })
})
