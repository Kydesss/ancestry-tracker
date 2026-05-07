import { useUser } from '@clerk/clerk-react'
import { startCheckout } from '../../lib/stripeClient'
import useStore from '../../store/useStore'

const premiumFeatures = [
  'Unlimited family members',
  'Invite family collaborators',
  'Real-time collaborative editing',
  'View & manage shared trees',
  'Priority support',
]

export default function UpgradeModal() {
  const showUpgradeModal = useStore((s) => s.showUpgradeModal)
  const setShowUpgradeModal = useStore((s) => s.setShowUpgradeModal)
  const { user } = useUser()

  if (!showUpgradeModal) return null

  async function handleUpgrade() {
    if (!user) return
    await startCheckout(user.id)
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div
        className="absolute inset-0 bg-ink/40 backdrop-blur-sm"
        onClick={() => setShowUpgradeModal(false)}
      />
      <div className="relative bg-container-lowest rounded-md shadow-modal max-w-md w-full p-8 z-10 border border-outline-variant/60">
        {/* Badge */}
        <div className="flex justify-center mb-5">
          <span className="chip-tertiary">
            <span className="text-tertiary-accent">✦</span>
            Heirloom Tier
          </span>
        </div>

        <h2 className="font-serif text-headline-md font-semibold text-ink text-center mb-2">
          Preserve Without Limits
        </h2>
        <p className="text-ink-variant text-sm text-center mb-7 max-w-xs mx-auto">
          Upgrade to Heirloom for unlimited family members and full collaboration with your relatives.
        </p>

        <ul className="space-y-3 mb-8">
          {premiumFeatures.map((f) => (
            <li key={f} className="flex items-start gap-3 text-sm text-ink-variant">
              <span className="mt-0.5 w-5 h-5 rounded-full bg-primary-fixed flex items-center justify-center flex-shrink-0">
                <svg className="w-3 h-3 text-primary" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
              </span>
              {f}
            </li>
          ))}
        </ul>

        <div className="text-center mb-6 pb-6 border-b border-outline-variant/60">
          <span className="font-serif text-display-lg font-semibold text-ink">$4.99</span>
          <span className="text-ink-variant text-sm ml-1">/ month</span>
        </div>

        <button onClick={handleUpgrade} className="btn-primary w-full justify-center text-base py-3 mb-3">
          Begin Heirloom, $4.99/mo
        </button>
        <button
          onClick={() => setShowUpgradeModal(false)}
          className="w-full text-center text-sm text-ink-variant hover:text-ink transition-colors py-1"
        >
          Maybe Later
        </button>
      </div>
    </div>
  )
}
