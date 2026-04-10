import useStore from '../store/useStore'

export function useSubscription() {
  const subscriptionTier = useStore((s) => s.subscriptionTier)
  const setShowUpgradeModal = useStore((s) => s.setShowUpgradeModal)
  const setUpgradeFeature = useStore((s) => s.setUpgradeFeature)
  const members = useStore((s) => s.members)

  const isPremium = subscriptionTier === 'premium'
  const isFree = subscriptionTier === 'free'

  const FREE_MEMBER_LIMIT = 20

  function checkAccess(feature) {
    if (isPremium) return true

    switch (feature) {
      case 'share_tree':
      case 'shared_trees':
      case 'invite_collaborator':
        return false
      case 'add_member':
        return members.length < FREE_MEMBER_LIMIT
      default:
        return true
    }
  }

  function requirePremium(feature, onSuccess) {
    if (checkAccess(feature)) {
      onSuccess?.()
    } else {
      setUpgradeFeature(feature)
      setShowUpgradeModal(true)
    }
  }

  return { isPremium, isFree, checkAccess, requirePremium, FREE_MEMBER_LIMIT }
}
