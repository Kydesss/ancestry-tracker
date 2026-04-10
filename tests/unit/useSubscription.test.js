import { describe, it, expect, beforeEach } from 'vitest'
import { renderHook, act } from '@testing-library/react'
import { useSubscription } from '../../src/hooks/useSubscription'
import useStore from '../../src/store/useStore'

beforeEach(() => {
  useStore.setState({ subscriptionTier: 'free', members: [], showUpgradeModal: false, upgradeFeature: null })
})

describe('useSubscription', () => {
  it('returns isFree=true and isPremium=false on free tier', () => {
    const { result } = renderHook(() => useSubscription())
    expect(result.current.isFree).toBe(true)
    expect(result.current.isPremium).toBe(false)
  })

  it('returns isPremium=true on premium tier', () => {
    useStore.setState({ subscriptionTier: 'premium' })
    const { result } = renderHook(() => useSubscription())
    expect(result.current.isPremium).toBe(true)
    expect(result.current.isFree).toBe(false)
  })

  it('blocks share_tree feature for free users', () => {
    const { result } = renderHook(() => useSubscription())
    expect(result.current.checkAccess('share_tree')).toBe(false)
  })

  it('allows share_tree for premium users', () => {
    useStore.setState({ subscriptionTier: 'premium' })
    const { result } = renderHook(() => useSubscription())
    expect(result.current.checkAccess('share_tree')).toBe(true)
  })

  it('blocks add_member when free limit is reached', () => {
    useStore.setState({
      subscriptionTier: 'free',
      members: Array.from({ length: 20 }, (_, i) => ({ id: `m${i}` })),
    })
    const { result } = renderHook(() => useSubscription())
    expect(result.current.checkAccess('add_member')).toBe(false)
  })

  it('allows add_member under free limit', () => {
    useStore.setState({
      subscriptionTier: 'free',
      members: Array.from({ length: 5 }, (_, i) => ({ id: `m${i}` })),
    })
    const { result } = renderHook(() => useSubscription())
    expect(result.current.checkAccess('add_member')).toBe(true)
  })

  it('requirePremium opens upgrade modal for free user', () => {
    const { result } = renderHook(() => useSubscription())
    act(() => {
      result.current.requirePremium('share_tree')
    })
    expect(useStore.getState().showUpgradeModal).toBe(true)
    expect(useStore.getState().upgradeFeature).toBe('share_tree')
  })

  it('requirePremium calls onSuccess for premium user', () => {
    useStore.setState({ subscriptionTier: 'premium' })
    const { result } = renderHook(() => useSubscription())
    const onSuccess = vi.fn()
    act(() => {
      result.current.requirePremium('share_tree', onSuccess)
    })
    expect(onSuccess).toHaveBeenCalledOnce()
    expect(useStore.getState().showUpgradeModal).toBe(false)
  })
})
