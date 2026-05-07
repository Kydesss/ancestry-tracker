import { useSubscription } from '../../hooks/useSubscription'
import useStore from '../../store/useStore'

export default function Toolbar({ onAddRoot, onZoomIn, onZoomOut, disabled = false }) {
  const { requirePremium } = useSubscription()
  const setShowUpgradeModal = useStore((s) => s.setShowUpgradeModal)
  const setUpgradeFeature = useStore((s) => s.setUpgradeFeature)
  const showToast = useStore((s) => s.showToast)

  function handleShare() {
    requirePremium('share_tree', () => {
      showToast('Share link copied to clipboard.', 'success')
    })
  }

  return (
    <div className="flex items-center justify-between px-4 py-3 border-b border-outline-variant/60 bg-container-lowest flex-wrap gap-2 flex-shrink-0">
      <div className="flex items-center gap-2">
        <button onClick={onAddRoot} disabled={disabled} className="btn-primary text-sm">
          <svg className="w-4 h-4" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z" clipRule="evenodd" />
          </svg>
          Add Root Person
        </button>
      </div>

      <div className="flex items-center gap-2">
        {/* Zoom controls */}
        <div className="flex items-center border border-outline-variant rounded overflow-hidden bg-container-lowest">
          <button
            onClick={onZoomOut}
            className="px-3 py-2 text-ink-variant hover:bg-container-low hover:text-primary transition-colors border-r border-outline-variant"
            title="Zoom out"
          >
            <svg className="w-4 h-4" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M5 10a1 1 0 011-1h8a1 1 0 110 2H6a1 1 0 01-1-1z" clipRule="evenodd" />
            </svg>
          </button>
          <button
            onClick={onZoomIn}
            className="px-3 py-2 text-ink-variant hover:bg-container-low hover:text-primary transition-colors"
            title="Zoom in"
          >
            <svg className="w-4 h-4" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z" clipRule="evenodd" />
            </svg>
          </button>
        </div>

        {/* Share button */}
        <button onClick={handleShare} className="btn-secondary text-sm">
          <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="18" cy="5" r="3" />
            <circle cx="6" cy="12" r="3" />
            <circle cx="18" cy="19" r="3" />
            <path d="M8.59 13.51l6.83 3.98M15.41 6.51L8.59 10.49" />
          </svg>
          Share Tree
          <LockIfFree />
        </button>
      </div>
    </div>
  )
}

function LockIfFree() {
  const { isFree } = useSubscription()
  if (!isFree) return null
  return (
    <svg className="w-3.5 h-3.5 text-tertiary-accent -ml-0.5" viewBox="0 0 20 20" fill="currentColor">
      <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
    </svg>
  )
}
