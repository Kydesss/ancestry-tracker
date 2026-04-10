import { Link } from 'react-router-dom'
import { SignedIn, SignedOut } from '@clerk/clerk-react'

const features = [
  {
    icon: '🌳',
    title: 'Interactive Family Tree Builder',
    description: 'Drag and drop nodes to visualize your family across generations with an intuitive canvas.',
  },
  {
    icon: '👥',
    title: 'Real-Time Collaboration',
    description: 'Invite family members to view or edit your tree simultaneously, from anywhere.',
  },
  {
    icon: '🖼️',
    title: 'Media & Profiles',
    description: 'Attach photos, birth dates, and life events to each person in your tree.',
  },
  {
    icon: '📅',
    title: 'Timeline View',
    description: 'See your family history laid out chronologically to spot patterns and connections.',
  },
]

const pricingTiers = [
  {
    name: 'Free Trial',
    price: '$0',
    period: 'forever',
    description: 'Start building your family tree today.',
    features: [
      'Build your own family tree',
      'Up to 20 family members',
      'Profile photos & dates',
      'Export as image',
    ],
    cta: 'Start Free',
    href: '/auth',
    highlighted: false,
  },
  {
    name: 'Premium',
    price: '$4.99',
    period: 'per month',
    description: 'Everything you need to collaborate with your whole family.',
    features: [
      'Everything in Free',
      'Unlimited family members',
      'Invite family collaborators',
      'Real-time edits',
      'Shared trees',
      'Priority support',
    ],
    cta: 'Start Premium',
    href: '/auth',
    highlighted: true,
  },
]

export default function Landing() {
  return (
    <div className="min-h-screen bg-white">
      {/* Nav */}
      <nav className="sticky top-0 z-50 bg-white/80 backdrop-blur border-b border-gray-100">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 flex items-center justify-between h-16">
          <span className="text-xl font-bold text-primary-700 tracking-tight">AncestryTracker</span>
          <div className="flex items-center gap-3">
            <SignedIn>
              <Link to="/dashboard" className="btn-primary">Go to Dashboard</Link>
            </SignedIn>
            <SignedOut>
              <Link to="/auth" className="btn-secondary hidden sm:inline-flex">Sign In</Link>
              <Link to="/auth" className="btn-primary">Start Free Trial</Link>
            </SignedOut>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="relative overflow-hidden pt-20 pb-28 sm:pt-28 sm:pb-36 bg-gradient-to-b from-primary-50 to-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 text-center">
          <span className="inline-block mb-4 px-3 py-1 rounded-full bg-primary-100 text-primary-700 text-xs font-semibold tracking-wide uppercase">
            Family History, Simplified
          </span>
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-gray-900 leading-tight mb-6">
            Discover &amp; Share Your{' '}
            <span className="text-primary-600">Family Story</span>
          </h1>
          <p className="text-lg sm:text-xl text-gray-500 max-w-2xl mx-auto mb-10">
            Build beautiful, interactive family trees. Collaborate with relatives in real time and preserve your heritage for generations to come.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link to="/auth" className="btn-primary text-base px-7 py-3 w-full sm:w-auto">
              Start Free Trial
            </Link>
            <Link to="/auth" className="btn-secondary text-base px-7 py-3 w-full sm:w-auto">
              Sign In
            </Link>
          </div>
        </div>

        {/* Decorative tree illustration */}
        <div className="mt-16 max-w-3xl mx-auto px-4 sm:px-6">
          <div className="rounded-2xl bg-white shadow-modal border border-gray-100 overflow-hidden p-6">
            <div className="flex items-start justify-center gap-8 flex-wrap">
              {/* Mini tree mockup */}
              <FamilyTreeMockup />
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-20 sm:py-28 max-w-6xl mx-auto px-4 sm:px-6">
        <div className="text-center mb-14">
          <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">Everything you need</h2>
          <p className="text-gray-500 text-lg max-w-xl mx-auto">
            Powerful tools to document your family history and keep everyone connected.
          </p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((f) => (
            <div key={f.title} className="card hover:shadow-card-hover transition-shadow">
              <div className="text-3xl mb-3">{f.icon}</div>
              <h3 className="font-semibold text-gray-900 mb-1.5">{f.title}</h3>
              <p className="text-sm text-gray-500 leading-relaxed">{f.description}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Pricing */}
      <section className="py-20 sm:py-28 bg-gray-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-14">
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">Simple, honest pricing</h2>
            <p className="text-gray-500 text-lg">Start free, upgrade when you need more.</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 max-w-2xl mx-auto">
            {pricingTiers.map((tier) => (
              <div
                key={tier.name}
                className={`rounded-2xl border p-8 flex flex-col ${
                  tier.highlighted
                    ? 'bg-primary-600 border-primary-600 text-white shadow-modal'
                    : 'bg-white border-gray-200 shadow-card'
                }`}
              >
                <div className="mb-6">
                  <h3 className={`text-lg font-semibold mb-1 ${tier.highlighted ? 'text-white' : 'text-gray-900'}`}>
                    {tier.name}
                  </h3>
                  <p className={`text-sm mb-4 ${tier.highlighted ? 'text-primary-200' : 'text-gray-500'}`}>
                    {tier.description}
                  </p>
                  <div className="flex items-end gap-1">
                    <span className={`text-4xl font-bold ${tier.highlighted ? 'text-white' : 'text-gray-900'}`}>
                      {tier.price}
                    </span>
                    <span className={`text-sm pb-1 ${tier.highlighted ? 'text-primary-200' : 'text-gray-400'}`}>
                      /{tier.period}
                    </span>
                  </div>
                </div>
                <ul className="space-y-2.5 mb-8 flex-1">
                  {tier.features.map((feat) => (
                    <li key={feat} className="flex items-center gap-2 text-sm">
                      <svg className={`w-4 h-4 flex-shrink-0 ${tier.highlighted ? 'text-primary-200' : 'text-primary-500'}`} viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                      <span className={tier.highlighted ? 'text-primary-100' : 'text-gray-600'}>{feat}</span>
                    </li>
                  ))}
                </ul>
                <Link
                  to={tier.href}
                  className={`text-center py-2.5 px-5 rounded-lg font-medium text-sm transition-colors ${
                    tier.highlighted
                      ? 'bg-white text-primary-700 hover:bg-primary-50'
                      : 'bg-primary-600 text-white hover:bg-primary-700'
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
      <footer className="py-10 border-t border-gray-100">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <span className="font-bold text-primary-700">AncestryTracker</span>
          <p className="text-sm text-gray-400">&copy; {new Date().getFullYear()} AncestryTracker. All rights reserved.</p>
          <div className="flex gap-6 text-sm text-gray-400">
            <a href="#" className="hover:text-gray-600">Privacy</a>
            <a href="#" className="hover:text-gray-600">Terms</a>
            <a href="#" className="hover:text-gray-600">Contact</a>
          </div>
        </div>
      </footer>
    </div>
  )
}

function FamilyTreeMockup() {
  const nodes = [
    { id: 1, name: 'George Miller', role: 'Grandfather', x: 'left', color: 'bg-blue-100 border-blue-300' },
    { id: 2, name: 'Helen Miller', role: 'Grandmother', x: 'right', color: 'bg-pink-100 border-pink-300' },
    { id: 3, name: 'James Miller', role: 'Father', x: 'left', color: 'bg-blue-100 border-blue-300' },
    { id: 4, name: 'Sarah Miller', role: 'Mother', x: 'right', color: 'bg-pink-100 border-pink-300' },
    { id: 5, name: 'Emily Miller', role: 'You', x: 'center', color: 'bg-primary-100 border-primary-400' },
  ]

  return (
    <div className="w-full flex flex-col items-center gap-2 select-none pointer-events-none">
      {/* Row 1 */}
      <div className="flex gap-4 justify-center">
        {nodes.slice(0, 2).map((n) => <MockCard key={n.id} node={n} />)}
      </div>
      {/* Connector */}
      <div className="w-px h-4 bg-gray-300" />
      {/* Row 2 */}
      <div className="flex gap-4 justify-center">
        {nodes.slice(2, 4).map((n) => <MockCard key={n.id} node={n} />)}
      </div>
      {/* Connector */}
      <div className="w-px h-4 bg-gray-300" />
      {/* Row 3 */}
      <MockCard node={nodes[4]} />
    </div>
  )
}

function MockCard({ node }) {
  return (
    <div className={`rounded-xl border-2 px-4 py-2.5 text-center shadow-card ${node.color}`}>
      <div className="w-8 h-8 rounded-full bg-gray-200 mx-auto mb-1.5 flex items-center justify-center text-xs font-bold text-gray-500">
        {node.name.charAt(0)}
      </div>
      <p className="text-xs font-semibold text-gray-800 whitespace-nowrap">{node.name}</p>
      <p className="text-xs text-gray-500">{node.role}</p>
    </div>
  )
}
