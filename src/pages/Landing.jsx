import { Link } from 'react-router-dom'
import { SignedIn, SignedOut } from '@clerk/clerk-react'

const features = [
  {
    icon: TreeGlyph,
    title: 'Interactive Family Tree',
    description: 'Compose your lineage on a tactile canvas. Drag, link, and arrange generations like an heirloom in progress.',
  },
  {
    icon: PeopleGlyph,
    title: 'Real-Time Collaboration',
    description: 'Invite relatives to view or curate the tree together — every memory captured, no detail lost.',
  },
  {
    icon: FrameGlyph,
    title: 'Profiles & Portraits',
    description: 'Affix portraits, life dates, and stories to each ancestor — a portrait gallery for your family.',
  },
  {
    icon: TimelineGlyph,
    title: 'Chronological Timeline',
    description: 'See generations laid out chronologically — discover patterns and the threads that bind them.',
  },
]

const pricingTiers = [
  {
    name: 'Free Trial',
    price: '$0',
    period: 'forever',
    description: 'Begin assembling your family record.',
    features: [
      'Build your own family tree',
      'Up to 20 family members',
      'Profile portraits & dates',
      'Export as image',
    ],
    cta: 'Start Free',
    href: '/auth',
    highlighted: false,
  },
  {
    name: 'Heirloom',
    price: '$4.99',
    period: 'per month',
    description: 'For families gathering generations of stories.',
    features: [
      'Everything in Free',
      'Unlimited family members',
      'Invite family collaborators',
      'Real-time edits',
      'Shared trees',
      'Priority support',
    ],
    cta: 'Begin Heirloom',
    href: '/auth',
    highlighted: true,
  },
]

export default function Landing() {
  return (
    <div className="min-h-screen bg-surface text-ink">
      {/* Nav */}
      <nav className="sticky top-0 z-50 bg-surface/85 backdrop-blur border-b border-outline-variant/60">
        <div className="max-w-content mx-auto px-margin sm:px-margin flex items-center justify-between h-16">
          <span className="font-serif text-xl font-semibold text-primary tracking-tight">
            Rooted Heritage
          </span>
          <div className="flex items-center gap-3">
            <SignedIn>
              <Link to="/dashboard" className="btn-primary">Open Archive</Link>
            </SignedIn>
            <SignedOut>
              <Link to="/auth" className="btn-ghost hidden sm:inline-flex">Sign In</Link>
              <Link to="/auth" className="btn-primary">Begin Your Tree</Link>
            </SignedOut>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="relative overflow-hidden pt-20 pb-28 sm:pt-28 sm:pb-36">
        <div className="absolute inset-0 bg-gradient-to-b from-primary-fixed/40 via-surface to-surface pointer-events-none" />
        <div className="relative max-w-4xl mx-auto px-margin text-center">
          <span className="chip-tertiary mb-5">
            <span className="w-1 h-1 rounded-full bg-tertiary-accent" />
            Family History, Preserved
          </span>
          <h1 className="font-serif text-5xl sm:text-6xl lg:text-7xl font-semibold leading-[1.05] mb-6 text-ink">
            Discover &amp; Share Your{' '}
            <em className="font-medium text-primary not-italic">
              <span className="italic">Family Story</span>
            </em>
          </h1>
          <p className="font-sans text-body-lg text-ink-variant max-w-2xl mx-auto mb-10">
            Build enduring, interactive family trees. Collaborate with relatives in real time and preserve your heritage as a digital heirloom for generations to come.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link to="/auth" className="btn-primary text-base px-7 py-3 w-full sm:w-auto">
              Begin Your Tree
            </Link>
            <Link to="/auth" className="btn-secondary text-base px-7 py-3 w-full sm:w-auto">
              Sign In
            </Link>
          </div>
        </div>

        {/* Decorative tree illustration */}
        <div className="relative mt-16 max-w-3xl mx-auto px-margin">
          <div className="rounded-xl bg-container-lowest shadow-modal border border-outline-variant/60 overflow-hidden p-8">
            <div className="flex items-start justify-center">
              <FamilyTreeMockup />
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-20 sm:py-28 max-w-content mx-auto px-margin">
        <div className="text-center mb-14 max-w-2xl mx-auto">
          <span className="label-meta block mb-3">The Tools</span>
          <h2 className="font-serif text-headline-lg sm:text-display-lg font-semibold text-ink mb-4">
            Everything an archivist needs
          </h2>
          <p className="text-ink-variant text-body-lg">
            Considered tools to document your family history with the care it deserves.
          </p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-gutter">
          {features.map(({ icon: Icon, title, description }) => (
            <div key={title} className="card card-hover">
              <div className="w-10 h-10 rounded-md bg-primary-fixed text-primary flex items-center justify-center mb-4">
                <Icon />
              </div>
              <h3 className="font-serif text-lg font-semibold text-ink mb-1.5">{title}</h3>
              <p className="text-sm text-ink-variant leading-relaxed">{description}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Pricing */}
      <section className="py-20 sm:py-28 bg-container-low border-y border-outline-variant/60">
        <div className="max-w-4xl mx-auto px-margin">
          <div className="text-center mb-14 max-w-xl mx-auto">
            <span className="label-meta block mb-3">Pricing</span>
            <h2 className="font-serif text-headline-lg sm:text-display-lg font-semibold text-ink mb-4">
              Honest, considered pricing
            </h2>
            <p className="text-ink-variant text-body-lg">Begin freely. Upgrade when your family grows.</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-gutter max-w-2xl mx-auto">
            {pricingTiers.map((tier) => (
              <div
                key={tier.name}
                className={`rounded-md border p-8 flex flex-col transition-all duration-300 ${
                  tier.highlighted
                    ? 'bg-primary text-primary-on border-primary shadow-modal'
                    : 'bg-container-lowest border-outline-variant/60 shadow-card'
                }`}
              >
                <div className="mb-6">
                  <h3 className={`font-serif text-xl font-semibold mb-1 ${tier.highlighted ? 'text-primary-on' : 'text-ink'}`}>
                    {tier.name}
                  </h3>
                  <p className={`text-sm mb-5 ${tier.highlighted ? 'text-primary-on-container' : 'text-ink-variant'}`}>
                    {tier.description}
                  </p>
                  <div className="flex items-end gap-1">
                    <span className={`font-serif text-5xl font-semibold ${tier.highlighted ? 'text-primary-on' : 'text-ink'}`}>
                      {tier.price}
                    </span>
                    <span className={`text-sm pb-2 ${tier.highlighted ? 'text-primary-on-container' : 'text-ink-variant'}`}>
                      /{tier.period}
                    </span>
                  </div>
                </div>
                <ul className="space-y-2.5 mb-8 flex-1">
                  {tier.features.map((feat) => (
                    <li key={feat} className="flex items-start gap-2 text-sm">
                      <svg className={`w-4 h-4 mt-0.5 flex-shrink-0 ${tier.highlighted ? 'text-tertiary-fixed-dim' : 'text-primary'}`} viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                      <span className={tier.highlighted ? 'text-primary-on-container' : 'text-ink-variant'}>{feat}</span>
                    </li>
                  ))}
                </ul>
                <Link
                  to={tier.href}
                  className={`text-center py-2.5 px-5 rounded font-semibold text-sm transition-all ${
                    tier.highlighted
                      ? 'bg-tertiary-fixed text-tertiary-on-container hover:bg-tertiary-fixed-dim'
                      : 'bg-primary text-primary-on hover:bg-primary-700 shadow-embossed'
                  }`}
                >
                  {tier.cta}
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-10 border-t border-outline-variant/60 bg-surface">
        <div className="max-w-content mx-auto px-margin flex flex-col sm:flex-row items-center justify-between gap-4">
          <span className="font-serif text-lg font-semibold text-primary">Rooted Heritage</span>
          <p className="text-sm text-ink-variant">&copy; {new Date().getFullYear()} Rooted Heritage. All rights reserved.</p>
          <div className="flex gap-6 text-sm text-ink-variant">
            <a href="#" className="hover:text-primary transition-colors">Privacy</a>
            <a href="#" className="hover:text-primary transition-colors">Terms</a>
            <a href="#" className="hover:text-primary transition-colors">Contact</a>
          </div>
        </div>
      </footer>
    </div>
  )
}

/* ── Heritage glyph icons ────────────────────────────────── */
function TreeGlyph() {
  return (
    <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 22V14" />
      <path d="M12 14a4 4 0 100-8 4 4 0 000 8z" />
      <path d="M6 10a3 3 0 100-6 3 3 0 000 6zM18 10a3 3 0 100-6 3 3 0 000 6z" />
      <path d="M6 10v3a2 2 0 002 2h2M18 10v3a2 2 0 01-2 2h-2" />
    </svg>
  )
}
function PeopleGlyph() {
  return (
    <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M9 11a4 4 0 100-8 4 4 0 000 8z" />
      <path d="M2 21v-2a4 4 0 014-4h6a4 4 0 014 4v2" />
      <path d="M16 3.13a4 4 0 010 7.75M22 21v-2a4 4 0 00-3-3.87" />
    </svg>
  )
}
function FrameGlyph() {
  return (
    <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="3" width="18" height="18" rx="2" />
      <circle cx="9" cy="10" r="2" />
      <path d="M3 17l5-5 4 4 4-4 5 5" />
    </svg>
  )
}
function TimelineGlyph() {
  return (
    <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 2v20" />
      <circle cx="12" cy="6" r="2" />
      <circle cx="12" cy="12" r="2" />
      <circle cx="12" cy="18" r="2" />
      <path d="M14 6h6M4 12h6M14 18h6" />
    </svg>
  )
}

function FamilyTreeMockup() {
  const nodes = [
    { id: 1, name: 'George Miller', role: 'Grandfather', tone: 'primary' },
    { id: 2, name: 'Helen Miller', role: 'Grandmother', tone: 'tertiary' },
    { id: 3, name: 'James Miller', role: 'Father', tone: 'primary' },
    { id: 4, name: 'Sarah Miller', role: 'Mother', tone: 'tertiary' },
    { id: 5, name: 'Emily Miller', role: 'You', tone: 'accent' },
  ]

  return (
    <div className="w-full flex flex-col items-center gap-3 select-none pointer-events-none">
      <div className="flex gap-6 justify-center">
        {nodes.slice(0, 2).map((n) => <MockCard key={n.id} node={n} />)}
      </div>
      <div className="w-px h-5 bg-outline-variant" />
      <div className="flex gap-6 justify-center">
        {nodes.slice(2, 4).map((n) => <MockCard key={n.id} node={n} />)}
      </div>
      <div className="w-px h-5 bg-outline-variant" />
      <MockCard node={nodes[4]} />
    </div>
  )
}

function MockCard({ node }) {
  const tones = {
    primary:   'bg-container-lowest border-outline-variant',
    tertiary:  'bg-container-lowest border-outline-variant',
    accent:    'bg-primary-fixed border-primary-300',
  }
  const initial = node.name.charAt(0)
  return (
    <div className={`rounded-md border px-4 py-2.5 text-center shadow-card min-w-[120px] ${tones[node.tone]}`}>
      <div className="w-8 h-8 rounded-full bg-tertiary-fixed mx-auto mb-1.5 flex items-center justify-center font-serif text-sm font-semibold text-tertiary-on-container">
        {initial}
      </div>
      <p className="font-serif text-sm font-semibold text-ink whitespace-nowrap">{node.name}</p>
      <p className="text-[11px] uppercase tracking-wider font-semibold text-ink-variant mt-0.5">{node.role}</p>
    </div>
  )
}
