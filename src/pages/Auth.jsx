import { SignIn, SignUp, SignedIn } from '@clerk/clerk-react'
import { Navigate, useSearchParams, Link } from 'react-router-dom'
import { useState } from 'react'

export default function Auth() {
  const [searchParams] = useSearchParams()
  const [mode, setMode] = useState(searchParams.get('mode') === 'signup' ? 'signup' : 'signin')

  return (
    <SignedIn>
      {/* Already signed in — redirect away */}
      <Navigate to="/dashboard" replace />
      <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-4">
        <AuthCard mode={mode} setMode={setMode} />
      </div>
    </SignedIn>
  )
}

// Wrap content so it only renders when NOT signed in
function AuthCard({ mode, setMode }) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 to-white flex flex-col items-center justify-center p-4">
      <Link to="/" className="mb-8 text-2xl font-bold text-primary-700 tracking-tight">
        AncestryTracker
      </Link>

      <div className="w-full max-w-md bg-white rounded-2xl shadow-modal border border-gray-100 p-8">
        <div className="flex rounded-lg bg-gray-100 p-1 mb-6">
          <button
            onClick={() => setMode('signin')}
            className={`flex-1 py-2 text-sm font-medium rounded-md transition-all ${
              mode === 'signin' ? 'bg-white shadow text-gray-900' : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            Sign In
          </button>
          <button
            onClick={() => setMode('signup')}
            className={`flex-1 py-2 text-sm font-medium rounded-md transition-all ${
              mode === 'signup' ? 'bg-white shadow text-gray-900' : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            Sign Up
          </button>
        </div>

        {mode === 'signin' ? (
          <SignIn
            routing="hash"
            redirectUrl="/dashboard"
            appearance={{
              elements: {
                rootBox: 'w-full',
                card: 'shadow-none p-0 border-0',
                headerTitle: 'text-xl font-bold text-gray-900',
                headerSubtitle: 'text-gray-500 text-sm',
                formButtonPrimary: 'btn-primary w-full justify-center',
                formFieldInput: 'input',
                formFieldLabel: 'label',
                footerActionLink: 'text-primary-600 font-medium hover:underline',
              },
            }}
          />
        ) : (
          <SignUp
            routing="hash"
            redirectUrl="/dashboard"
            appearance={{
              elements: {
                rootBox: 'w-full',
                card: 'shadow-none p-0 border-0',
                headerTitle: 'text-xl font-bold text-gray-900',
                headerSubtitle: 'text-gray-500 text-sm',
                formButtonPrimary: 'btn-primary w-full justify-center',
                formFieldInput: 'input',
                formFieldLabel: 'label',
                footerActionLink: 'text-primary-600 font-medium hover:underline',
              },
            }}
          />
        )}
      </div>
    </div>
  )
}
