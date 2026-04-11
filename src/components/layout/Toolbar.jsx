import { useSubscription } from '../../hooks/useSubscription'
import useStore from '../../store/useStore'

export default function Toolbar({ onAddRoot, onZoomIn, onZoomOut, disabled = false }) {
  const { requirePremium } = useSubscription()
  const setShowUpgradeModal = useStore((s) => s.setShowUpgradeModal)
  const setUpgradeFeature = useStore((s) => s.setUpgradeFeature)
  const showToast = useStore((s) => s.showToast)

  function handleShare() {
    requirePremium('share_tree', () => {
      showToast('Share link copied to clipboard!', 'success')
    })
  }

  return (
    <div className="flex items-center justify-between px-4 py-3 border-b border-gray-100 bg-white flex-wrap gap-2 flex-shrink-0">
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
        <div className="flex items-center border border-gray-200 rounded-lg overflow-hidden">
          <button
            onClick={onZoomOut}
            className="px-3 py-2 text-gray-600 hover:bg-gray-50 transition-colors border-r border-gray-200"
            title="Zoom out"
          >
            <svg className="w-4 h-4" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M5 10a1 1 0 011-1h8a1 1 0 110 2H6a1 1 0 01-1-1z" clipRule="evenodd" />
            </svg>
          </button>
          <button
            onClick={onZoomIn}
            className="px-3 py-2 text-gray-600 hover:bg-gray-50 transition-colors"
            title="Zoom in"
          >
            <svg className="w-4 h-4" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z" clipRule="evenodd" />
            </svg>
          </button>
        </div>

        {/* Share button */}
        <button
          onClick={handleShare}
          className="btn-secondary text-sm"
        >
          <svg className="w-4 h-4" viewBox="0 0 20 20" fill="currentColor">
            <path d="M15 8a3 3 0 10-2.977-2.63l-4.94 2.47a3 3 0 100 4.319l4.94 2.47a3 3 0 10.895-1.789l-4.94-2.47a3.027 3.027 0 000-.74l4.94-2.47C13.456 7.68 14.19 8 15 8z" />
          </svg>
          Share Tree
          {/* Lock icon for free users — shown inline */}
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
    <svg className="w-3.5 h-3.5 text-gray-400 -ml-0.5" viewBox="0 0 20 20" fill="currentColor">
      <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
    </svg>
  )
}
