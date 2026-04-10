import { loadStripe } from '@stripe/stripe-js'

let stripePromise

function getStripe() {
  if (!stripePromise) {
    stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY)
  }
  return stripePromise
}

export async function startCheckout(userId) {
  const stripe = await getStripe()
  await stripe.redirectToCheckout({
    lineItems: [{ price: import.meta.env.VITE_STRIPE_PRICE_ID, quantity: 1 }],
    mode: 'subscription',
    successUrl: `${window.location.origin}/dashboard?upgraded=true`,
    cancelUrl: `${window.location.origin}/dashboard`,
    clientReferenceId: userId,
  })
}
