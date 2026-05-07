import { useClerk, useUser } from '@clerk/clerk-react'
import Avatar from '../ui/Avatar'
import useStore from '../../store/useStore'
import { useSubscription } from '../../hooks/useSubscription'

/**
 * Tree-centric sidebar. The journal's spine, not a CMS menu.
 * Sections (top → bottom): brand + tree title, curator, family,
 * recent activity, footer (upgrade nudge for free, settings + sign out).
 */
export default function Sidebar({ isOpen, onClose }) {
  const { signOut } = useClerk()
  const { user } = useUser()
  const subscriptionTier = useStore((s) => s.subscriptionTier)
  const setShowUpgradeModal = useStore((s) => s.setShowUpgradeModal)
  const setUpgradeFeature = useStore((s) => s.setUpgradeFeature)
  const activeTree = useStore((s) => s.activeTree)
  const members = useStore((s) => s.members)
  const { isPremium, requirePremium } = useSubscription()

  const isHeirloom = subscriptionTier === 'premium'
  const memberCount = members.length

  function openUpgrade(feature = 'general') {
    setUpgradeFeature(feature)
    setShowUpgradeModal(true)
    onClose?.()
  }

  function handleInvite() {
    requirePremium('invite_collaborator', () => {
      // Real invite flow lands here when collaborators feature ships.
    })
  }

  return (
    <>
      {/* Mobile backdrop — solid dim, no blur (avoid glassmorphism) */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-ink/30 z-20 lg:hidden"
          onClick={onClose}
          aria-hidden="true"
        />
      )}

      <aside
        className={`
          fixed top-0 left-0 h-full w-72 bg-container-lowest border-r border-outline-variant/60
          z-30 flex flex-col
          transition-transform duration-200 ease-out
          ${isOpen ? 'translate-x-0' : '-translate-x-full'}
          lg:translate-x-0 lg:static lg:z-auto
        `}
        aria-label="Tree sidebar"
      >
        {/* ── Header: brand + tree title + meta ─────────── */}
        <div className="flex items-start justify-between px-5 pt-5 pb-4 border-b border-outline-variant/50 flex-shrink-0">
          <div className="min-w-0">
            <span className="block label-meta mb-1.5">Rooted Heritage</span>
            <h1 className="font-serif text-lg font-semibold text-ink leading-tight truncate">
              {activeTree?.name || 'My Family Tree'}
            </h1>
            <p className="text-xs text-ink-variant mt-1">
              {memberCount === 0
                ? 'An archive in progress'
                : memberCount === 1
                  ? '1 person recorded'
                  : `${memberCount} people recorded`}
            </p>
          </div>
          <button
            onClick={onClose}
            className="lg:hidden p-1.5 -mr-1 rounded hover:bg-container-low text-ink-variant transition-colors flex-shrink-0"
            aria-label="Close sidebar"
          >
            <svg className="w-5 h-5" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
              <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
            </svg>
          </button>
        </div>

        {/* ── Body (scrolls if content overflows) ───────── */}
        <div className="flex-1 overflow-y-auto">
          {/* Curator */}
          <section className="px-5 pt-5 pb-4">
            <h2 className="label-meta mb-3">Curator</h2>
            <div className="flex items-center gap-3">
              <Avatar
                src={user?.imageUrl}
                name={user?.fullName || user?.emailAddresses?.[0]?.emailAddress}
                size="md"
              />
              <div className="min-w-0 flex-1">
                <p className="font-serif text-sm font-semibold text-ink truncate">
                  {user?.fullName || 'Archivist'}
                </p>
                <p className="text-xs text-ink-variant truncate">
                  {isHeirloom ? 'Heirloom subscriber' : 'Free trial'}
                </p>
              </div>
            </div>
          </section>

          {/* Family / Collaborators */}
          <section className="px-5 py-4 border-t border-outline-variant/40">
            <div className="flex items-baseline justify-between mb-3">
              <h2 className="label-meta">Family</h2>
              <span className="text-[10px] uppercase tracking-wider font-semibold text-ink-variant/70">
                Just you
              </span>
            </div>
            <p className="text-xs text-ink-variant leading-relaxed mb-3">
              Invite relatives so the tree grows with the people in it.
            </p>
            <button
              onClick={handleInvite}
              className="inline-flex items-center gap-1.5 text-xs font-semibold text-tertiary-accent
                         hover:text-primary underline-offset-4 hover:underline transition-colors
                         focus:outline-none focus:ring-2 focus:ring-primary-300 rounded px-1 -mx-1"
            >
              Invite family
              {!isPremium && (
                <svg className="w-3 h-3" viewBox="0 0 20 20" fill="currentColor" aria-label="Premium">
                  <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
                </svg>
              )}
            </button>
          </section>

          {/* Recent activity */}
          <section className="px-5 py-4 border-t border-outline-variant/40">
            <h2 className="label-meta mb-3">Recent</h2>
            {memberCount === 0 ? (
              <p className="text-xs text-ink-variant/80 leading-relaxed font-serif italic">
                Edits and additions will appear here as your tree grows.
              </p>
            ) : (
              <ul className="space-y-2 text-xs text-ink-variant">
                <li className="flex items-baseline gap-2">
                  <span className="w-1 h-1 rounded-full bg-tertiary-accent flex-shrink-0 translate-y-1.5" aria-hidden="true" />
                  <span>
                    <span className="font-semibold text-ink">{memberCount}</span>
                    {' '}{memberCount === 1 ? 'person' : 'people'} on the tree.
                  </span>
                </li>
              </ul>
            )}
          </section>
        </div>

        {/* ── Footer: upgrade + sign out + settings ─────── */}
        <div className="border-t border-outline-variant/50 flex-shrink-0">
          {!isHeirloom && (
            <button
              onClick={() => openUpgrade('general')}
              className="w-full flex items-center gap-3 px-5 py-3
                         text-sm font-semibold text-tertiary-on-container
                         hover:bg-tertiary-fixed/50 transition-colors
                         border-b border-outline-variant/40
                         focus:outline-none focus:bg-tertiary-fixed/50"
            >
              <svg className="w-4 h-4 text-tertiary-accent flex-shrink-0" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
              </svg>
              <span className="flex-1 text-left">Upgrade to Heirloom</span>
              <span aria-hidden="true">→</span>
            </button>
          )}
          <div className="flex items-stretch divide-x divide-outline-variant/40">
            <button
              onClick={() => signOut()}
              className="flex-1 flex items-center gap-2.5 px-5 py-3
                         text-xs font-semibold text-ink-variant
                         hover:bg-container-low hover:text-ink transition-colors
                         focus:outline-none focus:bg-container-low"
            >
              <svg className="w-4 h-4" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                <path fillRule="evenodd" d="M3 3a1 1 0 00-1 1v12a1 1 0 102 0V4a1 1 0 00-1-1zm10.293 9.293a1 1 0 001.414 1.414l3-3a1 1 0 000-1.414l-3-3a1 1 0 10-1.414 1.414L14.586 9H7a1 1 0 100 2h7.586l-1.293 1.293z" clipRule="evenodd" />
              </svg>
              Sign out
            </button>
            <button
              onClick={() => {/* settings drawer lands here */}}
              className="flex items-center justify-center px-5 py-3
                         text-ink-variant hover:bg-container-low hover:text-ink transition-colors
                         focus:outline-none focus:bg-container-low"
              aria-label="Settings"
              title="Settings"
            >
              <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <circle cx="12" cy="12" r="3" />
                <path d="M19.4 15a1.65 1.65 0 00.33 1.82l.06.06a2 2 0 01-2.83 2.83l-.06-.06a1.65 1.65 0 00-1.82-.33 1.65 1.65 0 00-1 1.51V21a2 2 0 01-4 0v-.09A1.65 1.65 0 009 19.4a1.65 1.65 0 00-1.82.33l-.06.06a2 2 0 11-2.83-2.83l.06-.06a1.65 1.65 0 00.33-1.82 1.65 1.65 0 00-1.51-1H3a2 2 0 010-4h.09A1.65 1.65 0 004.6 9a1.65 1.65 0 00-.33-1.82l-.06-.06a2 2 0 112.83-2.83l.06.06a1.65 1.65 0 001.82.33H9a1.65 1.65 0 001-1.51V3a2 2 0 014 0v.09a1.65 1.65 0 001 1.51 1.65 1.65 0 001.82-.33l.06-.06a2 2 0 112.83 2.83l-.06.06a1.65 1.65 0 00-.33 1.82V9a1.65 1.65 0 001.51 1H21a2 2 0 010 4h-.09a1.65 1.65 0 00-1.51 1z" />
              </svg>
            </button>
          </div>
        </div>
      </aside>
    </>
  )
}
