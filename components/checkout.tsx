"use client"

import { useCallback } from "react"
import {
  EmbeddedCheckout,
  EmbeddedCheckoutProvider,
} from "@stripe/react-stripe-js"
import { loadStripe } from "@stripe/stripe-js"
import { X } from "lucide-react"

import { startCheckoutSession } from "@/app/actions/stripe"

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!)

interface CheckoutProps {
  productId: string
  onClose: () => void
}

export function Checkout({ productId, onClose }: CheckoutProps) {
  const startCheckoutSessionForProduct = useCallback(
    () => startCheckoutSession(productId),
    [productId]
  )

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-sm p-4">
      <div className="relative w-full max-w-lg rounded-2xl border border-border bg-card shadow-2xl">
        <button
          onClick={onClose}
          className="absolute right-4 top-4 z-10 rounded-full p-2 text-muted-foreground hover:bg-secondary hover:text-foreground transition-colors"
        >
          <X className="h-5 w-5" />
        </button>
        <div className="p-6">
          <EmbeddedCheckoutProvider
            stripe={stripePromise}
            options={{ clientSecret: startCheckoutSessionForProduct }}
          >
            <EmbeddedCheckout />
          </EmbeddedCheckoutProvider>
        </div>
      </div>
    </div>
  )
}
