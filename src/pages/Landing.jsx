import { useState } from 'react'
import { Link } from 'react-router-dom'
import { SignedIn, SignedOut } from '@clerk/clerk-react'

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
      <Nav />
      <Hero />
      <Story />
      <Pricing />
      <Footer />
    </div>
  )
}

/* ── Nav ─────────────────────────────────────────────────── */
function Nav() {
  return (
    <nav className="sticky top-0 z-50 bg-surface/85 backdrop-blur border-b border-outline-variant/60">
      <div className="max-w-content mx-auto px-margin flex items-center justify-between h-16">
        <span className="font-serif text-xl font-semibold text-primary tracking-tight">
          Rooted Heritage
        </span>
        <div className="flex items-center gap-2">
          <SignedIn>
            <Link to="/dashboard" className="btn-primary">Open Archive</Link>
          </SignedIn>
          <SignedOut>
            <a href="#story" className="btn-ghost hidden sm:inline-flex">How it works</a>
            <Link to="/auth" className="btn-ghost hidden sm:inline-flex">Sign in</Link>
            <Link to="/auth" className="btn-primary">Begin Your Tree</Link>
          </SignedOut>
        </div>
      </div>
    </nav>
  )
}

/* ── Hero (asymmetric editorial spread) ──────────────────── */
function Hero() {
  return (
    <section className="relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-primary-fixed/30 via-surface to-surface pointer-events-none" />
      <div className="relative max-w-content mx-auto px-margin pt-16 pb-20 sm:pt-24 sm:pb-28
                      grid grid-cols-1 lg:grid-cols-12 gap-x-12 gap-y-16 items-center">
        {/* Left: editorial text column */}
        <div className="lg:col-span-5 lg:pr-4">
          <span className="label-meta block mb-5">Est. for the family record</span>
          <h1 className="font-serif text-5xl sm:text-6xl lg:text-[68px] font-semibold leading-[1.02] text-ink mb-6">
            A place for your{' '}
            <em className="italic font-medium text-primary">family story</em>{' '}
            to live.
          </h1>
          <p className="font-sans text-body-lg text-ink-variant max-w-md mb-9 leading-relaxed">
            Build a living family tree alongside the people in it. Add a portrait, a wedding,
            a grandparent's favorite recipe, then invite the relatives who remember the rest.
          </p>
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 mb-10">
            <Link to="/auth" className="btn-primary text-base px-7 py-3">
              Begin your tree
            </Link>
            <a
              href="#story"
              className="font-sans text-sm font-semibold text-tertiary-accent hover:text-primary
                         underline-offset-4 hover:underline transition-colors inline-flex items-center gap-1.5"
            >
              See an example tree
              <span aria-hidden="true">↓</span>
            </a>
          </div>
          <p className="font-sans text-xs text-ink-variant/80 max-w-sm leading-relaxed">
            Free to start. No credit card. Twenty family members on the house — enough for most
            living branches.
          </p>
        </div>

        {/* Right: living tree mockup, larger and interactive */}
        <div className="lg:col-span-7 lg:pl-4 relative">
          <FamilyTreeMockup />
        </div>
      </div>
    </section>
  )
}

/* ── Story (replaces 4-up grid with 3 uneven editorial blocks) ── */
function Story() {
  return (
    <section id="story" className="border-t border-outline-variant/60">
      <div className="max-w-content mx-auto px-margin py-24 sm:py-32 space-y-28 sm:space-y-36">
        {/* Block 1: wide left, narrow right — generations on one canvas */}
        <article className="grid grid-cols-1 lg:grid-cols-12 gap-x-12 gap-y-10 items-center">
          <div className="lg:col-span-7 order-2 lg:order-1">
            <BranchIllustration />
          </div>
          <div className="lg:col-span-5 lg:pl-6 order-1 lg:order-2">
            <span className="label-meta block mb-3">One canvas</span>
            <h2 className="font-serif text-headline-lg sm:text-display-lg font-semibold text-ink mb-5 leading-[1.1]">
              Five generations,<br />on a single page.
            </h2>
            <p className="text-ink-variant text-body-lg leading-relaxed">
              Drag, link, and arrange every branch like an heirloom in progress. The whole
              family is visible at once — no hidden pages, no buried records.
            </p>
          </div>
        </article>

        {/* Block 2: narrow left, wide right — stories alongside dates */}
        <article className="grid grid-cols-1 lg:grid-cols-12 gap-x-12 gap-y-10 items-center">
          <div className="lg:col-span-5 lg:pr-6">
            <span className="label-meta block mb-3">More than dates</span>
            <h2 className="font-serif text-headline-lg sm:text-display-lg font-semibold text-ink mb-5 leading-[1.1]">
              Stories <em className="italic font-medium text-primary">alongside</em>{' '}
              the dates.
            </h2>
            <p className="text-ink-variant text-body-lg leading-relaxed mb-5">
              Affix portraits, life events, and the small things that get forgotten — the
              recipe she always made, the song he hummed, the year they finally moved north.
            </p>
            <ul className="space-y-2 text-sm text-ink-variant">
              <li>— Portraits and life dates</li>
              <li>— Birth, marriage, migration, passing</li>
              <li>— Anecdotes, recipes, voice notes</li>
            </ul>
          </div>
          <div className="lg:col-span-7">
            <ProfileVignette />
          </div>
        </article>

        {/* Block 3: full width, asymmetric inside — built together */}
        <article className="grid grid-cols-1 lg:grid-cols-12 gap-x-12 gap-y-10 items-center">
          <div className="lg:col-span-5 lg:pl-2">
            <span className="label-meta block mb-3">Shared, not solo</span>
            <h2 className="font-serif text-headline-lg sm:text-display-lg font-semibold text-ink mb-5 leading-[1.1]">
              Built by the<br />whole family.
            </h2>
            <p className="text-ink-variant text-body-lg leading-relaxed">
              The curator builds the bones. Aunts, uncles, and cousins fill in what only they
              remember. Every contribution is attributed quietly, the way a kitchen-table
              conversation is.
            </p>
          </div>
          <div className="lg:col-span-7">
            <CollaboratorRail />
          </div>
        </article>
      </div>
    </section>
  )
}

/* ── Pricing (moved below value, calmer) ─────────────────── */
function Pricing() {
  return (
    <section className="bg-container-low border-t border-outline-variant/60">
      <div className="max-w-4xl mx-auto px-margin py-24 sm:py-28">
        <div className="max-w-xl mb-12">
          <span className="label-meta block mb-3">Pricing</span>
          <h2 className="font-serif text-headline-lg sm:text-display-lg font-semibold text-ink mb-4 leading-[1.1]">
            Honest, considered pricing.
          </h2>
          <p className="text-ink-variant text-body-lg leading-relaxed">
            Begin freely. Upgrade only when your family outgrows the free tier — most never
            need to.
          </p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-gutter">
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
                    <svg className={`w-4 h-4 mt-0.5 flex-shrink-0 ${tier.highlighted ? 'text-tertiary-fixed-dim' : 'text-primary'}`} viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
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
  )
}

/* ── Footer ──────────────────────────────────────────────── */
function Footer() {
  const year = new Date().getFullYear()
  return (
    <footer className="py-10 border-t border-outline-variant/60 bg-surface">
      <div className="max-w-content mx-auto px-margin flex flex-col sm:flex-row items-center justify-between gap-4">
        <span className="font-serif text-lg font-semibold text-primary">Rooted Heritage</span>
        <p className="text-sm text-ink-variant">&copy; {year} Rooted Heritage. All rights reserved.</p>
        <div className="flex gap-6 text-sm text-ink-variant">
          <a href="#" className="hover:text-primary transition-colors">Privacy</a>
          <a href="#" className="hover:text-primary transition-colors">Terms</a>
          <a href="#" className="hover:text-primary transition-colors">Contact</a>
        </div>
      </div>
    </footer>
  )
}

/* ── Interactive family tree mockup (hero asset) ─────────── */
function FamilyTreeMockup() {
  const nodes = [
    { id: 'g1', name: 'George Miller',  role: 'Grandfather', life: '1932 – 2018', tone: 'primary' },
    { id: 'g2', name: 'Helen Miller',   role: 'Grandmother', life: '1935 – 2021', tone: 'tertiary' },
    { id: 'p1', name: 'James Miller',   role: 'Father',      life: 'b. 1962',     tone: 'primary' },
    { id: 'p2', name: 'Sarah Miller',   role: 'Mother',      life: 'b. 1965',     tone: 'tertiary' },
    { id: 'me', name: 'Emily Miller',   role: 'You',         life: 'b. 1992',     tone: 'accent' },
  ]
  const [hovered, setHovered] = useState(null)

  return (
    <div className="relative">
      {/* Paper-card frame for the tree */}
      <div className="rounded-xl bg-container-lowest border border-outline-variant/60 shadow-modal p-6 sm:p-10">
        <div className="flex flex-col items-center gap-3 select-none">
          {/* Generation 1 */}
          <div className="flex gap-6 sm:gap-10 justify-center">
            {nodes.slice(0, 2).map((n) => (
              <MockCard key={n.id} node={n} hovered={hovered} setHovered={setHovered} />
            ))}
          </div>
          <Connector />
          {/* Generation 2 */}
          <div className="flex gap-6 sm:gap-10 justify-center">
            {nodes.slice(2, 4).map((n) => (
              <MockCard key={n.id} node={n} hovered={hovered} setHovered={setHovered} />
            ))}
          </div>
          <Connector />
          {/* Generation 3 */}
          <MockCard node={nodes[4]} hovered={hovered} setHovered={setHovered} />
        </div>
      </div>
      <p className="mt-3 text-xs text-ink-variant text-center font-sans">
        Hover any name to see the dates kept beneath it.
      </p>
    </div>
  )
}

function Connector() {
  return <div className="w-px h-6 bg-outline-variant/80" aria-hidden="true" />
}

function MockCard({ node, hovered, setHovered }) {
  const isHovered = hovered === node.id
  const tones = {
    primary:  'bg-container-lowest border-outline-variant',
    tertiary: 'bg-container-lowest border-outline-variant',
    accent:   'bg-primary-fixed border-primary-300',
  }
  const initial = node.name.charAt(0)
  return (
    <button
      type="button"
      onMouseEnter={() => setHovered(node.id)}
      onMouseLeave={() => setHovered(null)}
      onFocus={() => setHovered(node.id)}
      onBlur={() => setHovered(null)}
      className={`group relative rounded-md border px-4 py-2.5 text-center min-w-[132px]
                  transition-all duration-300 ease-out cursor-default
                  ${tones[node.tone]}
                  ${isHovered ? 'shadow-card-hover -translate-y-0.5' : 'shadow-card'}`}
      aria-label={`${node.name}, ${node.role}, ${node.life}`}
    >
      <div className="w-9 h-9 rounded-full bg-tertiary-fixed mx-auto mb-1.5 flex items-center
                      justify-center font-serif text-sm font-semibold text-tertiary-on-container">
        {initial}
      </div>
      <p className="font-serif text-sm font-semibold text-ink whitespace-nowrap">{node.name}</p>
      <p className="text-[10px] uppercase tracking-wider font-semibold text-ink-variant mt-0.5">
        {node.role}
      </p>
      <p
        className={`text-[11px] font-sans text-ink-variant whitespace-nowrap mt-1
                    transition-opacity duration-200
                    ${isHovered ? 'opacity-100' : 'opacity-0'}`}
        aria-hidden={!isHovered}
      >
        {node.life}
      </p>
    </button>
  )
}

/* ── Editorial illustrations (story blocks) ──────────────── */
function BranchIllustration() {
  return (
    <div className="relative rounded-xl border border-outline-variant/60 bg-container-lowest shadow-card p-8 sm:p-10">
      <svg viewBox="0 0 600 300" className="w-full h-auto" aria-hidden="true">
        {/* connector lines */}
        <g stroke="#737973" strokeWidth="1" fill="none" opacity="0.55">
          <path d="M150 50 V100 H450 V50" />
          <path d="M300 100 V150" />
          <path d="M150 200 V230 H450 V200" />
          <path d="M300 230 V260" />
        </g>
        {/* generation labels */}
        <g fontFamily="Manrope, sans-serif" fontSize="11" fill="#434843" letterSpacing="0.08em">
          <text x="20" y="35" textTransform="uppercase">Gen I</text>
          <text x="20" y="185" textTransform="uppercase">Gen II</text>
          <text x="20" y="285" textTransform="uppercase">Gen III</text>
        </g>
        {/* nodes */}
        {[
          [150, 30, '#fbf9f8', '#737973', 'G'],
          [450, 30, '#fbf9f8', '#737973', 'H'],
          [150, 180, '#fbf9f8', '#737973', 'J'],
          [450, 180, '#fbf9f8', '#737973', 'S'],
          [300, 270, '#d0e9d4', '#819986', 'E'],
        ].map(([cx, cy, fill, stroke, ch], i) => (
          <g key={i}>
            <circle cx={cx} cy={cy} r="22" fill={fill} stroke={stroke} strokeWidth="1.25" />
            <text
              x={cx} y={cy + 5} textAnchor="middle"
              fontFamily="Newsreader, serif" fontWeight="600" fontSize="16" fill="#1b1c1c"
            >
              {ch}
            </text>
          </g>
        ))}
      </svg>
    </div>
  )
}

function ProfileVignette() {
  return (
    <div className="rounded-xl border border-outline-variant/60 bg-container-lowest shadow-card overflow-hidden">
      <div className="grid grid-cols-5">
        {/* Portrait area */}
        <div className="col-span-2 bg-tertiary-fixed flex items-center justify-center aspect-square sm:aspect-auto">
          <div className="w-24 h-24 rounded-full bg-tertiary-fixed-dim border-2 border-tertiary-on-container/20
                          flex items-center justify-center font-serif text-3xl font-semibold text-tertiary-on-container">
            H
          </div>
        </div>
        {/* Profile content */}
        <div className="col-span-3 p-6 sm:p-7">
          <p className="label-meta mb-2">Profile</p>
          <h3 className="font-serif text-2xl font-semibold text-ink mb-1">Helen Miller</h3>
          <p className="text-xs uppercase tracking-wider font-semibold text-ink-variant mb-4">
            1935 – 2021 · Grandmother
          </p>
          <ul className="space-y-2 text-sm text-ink-variant border-l border-tertiary-accent/40 pl-3">
            <li><span className="font-semibold text-ink">1957</span> — Married George in Bergen.</li>
            <li><span className="font-semibold text-ink">1962</span> — Welcomed James, eldest of four.</li>
            <li><span className="font-semibold text-ink">1971</span> — Family migrated to Boston.</li>
            <li className="italic text-ink-variant/80">"Her cardamom buns. Always.&rdquo;</li>
          </ul>
        </div>
      </div>
    </div>
  )
}

function CollaboratorRail() {
  const people = [
    { initial: 'E', name: 'Emily',   note: 'curator',         tone: 'bg-primary-fixed text-primary-700' },
    { initial: 'A', name: 'Aunt Marie', note: 'added 14 photos', tone: 'bg-tertiary-fixed text-tertiary-on-container' },
    { initial: 'D', name: 'Dad',     note: 'added 3 stories',  tone: 'bg-container-high text-ink-variant' },
    { initial: 'C', name: 'Cousin Jo', note: 'invited 2 days ago', tone: 'bg-primary-fixed text-primary-700' },
    { initial: 'G', name: 'Grandma', note: 'voice note · 1m',  tone: 'bg-tertiary-fixed text-tertiary-on-container' },
  ]
  return (
    <div className="rounded-xl border border-outline-variant/60 bg-container-lowest shadow-card p-6 sm:p-8">
      <ul className="divide-y divide-outline-variant/40">
        {people.map((p, i) => (
          <li key={i} className="flex items-center gap-4 py-3.5 first:pt-1 last:pb-1">
            <span className={`w-10 h-10 rounded-full flex items-center justify-center
                              font-serif text-base font-semibold ${p.tone}`}>
              {p.initial}
            </span>
            <div className="flex-1 min-w-0">
              <p className="font-serif text-base font-semibold text-ink leading-tight">{p.name}</p>
              <p className="text-xs text-ink-variant">{p.note}</p>
            </div>
            <span className="text-[10px] uppercase tracking-wider font-semibold text-ink-variant/70">
              contributor
            </span>
          </li>
        ))}
      </ul>
    </div>
  )
}
