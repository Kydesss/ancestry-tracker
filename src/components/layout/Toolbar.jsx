import { useSubscription } from '../../hooks/useSubscription'
import useStore from '../../store/useStore'

/**
 * Floating action cluster anchored to the canvas viewport, top-right.
 * Replaces the previous full-width bar so the canvas keeps its full
 * vertical space — see DESIGN.md / Dashboard chrome notes.
 */
export default function Toolbar({ onAddRoot, disabled = false }) {
  const { requirePremium } = useSubscription()
  const showToast = useStore((s) => s.showToast)

  function handleShare() {
    requirePremium('share_tree', () => {
      showToast('Share link copied to clipboard.', 'success')
    })
  }

  return (
    <div className="absolute top-4 right-4 z-10 flex items-center gap-2">
      <button
        onClick={handleShare}
        className="inline-flex items-center gap-2 px-3.5 py-2 rounded
                   bg-container-lowest border border-outline-variant/80
                   text-ink-variant font-semibold text-xs leading-5
                   shadow-card hover:bg-container-low hover:text-primary
                   focus:outline-none focus:ring-2 focus:ring-primary-300
                   focus:ring-offset-2 focus:ring-offset-surface
                   transition-colors"
      >
        <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
          <circle cx="18" cy="5" r="3" />
          <circle cx="6" cy="12" r="3" />
          <circle cx="18" cy="19" r="3" />
          <path d="M8.59 13.51l6.83 3.98M15.41 6.51L8.59 10.49" />
        </svg>
        Share
        <LockIfFree />
      </button>
      <button
        onClick={onAddRoot}
        disabled={disabled}
        className="btn-primary text-xs px-3.5 py-2"
      >
        <svg className="w-3.5 h-3.5" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
          <path fillRule="evenodd" d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z" clipRule="evenodd" />
        </svg>
        Add person
      </button>
    </div>
  )
}

function LockIfFree() {
  const { isFree } = useSubscription()
  if (!isFree) return null
  return (
    <svg className="w-3 h-3 text-tertiary-accent -ml-0.5" viewBox="0 0 20 20" fill="currentColor" aria-label="Premium feature">
      <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
    </svg>
  )
}
