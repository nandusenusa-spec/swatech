"use client"

import { useCallback, useState, useEffect } from "react"
import {
  EmbeddedCheckout,
  EmbeddedCheckoutProvider,
} from "@stripe/react-stripe-js"
import { loadStripe } from "@stripe/stripe-js"
import { X, Loader2 } from "lucide-react"

import { startCheckoutSession } from "@/app/actions/stripe"

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!)

interface CheckoutProps {
  productId: string
  onClose: () => void
}

export function Checkout({ productId, onClose }: CheckoutProps) {
  const [clientSecret, setClientSecret] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    startCheckoutSession(productId)
      .then((secret) => {
        if (secret) {
          setClientSecret(secret)
        } else {
          setError("Failed to initialize checkout")
        }
      })
      .catch(() => {
        setError("Failed to connect to payment system")
      })
  }, [productId])

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-sm p-4">
      <div className="relative w-full max-w-lg rounded-2xl border border-border bg-card shadow-2xl overflow-hidden">
        <button
          onClick={onClose}
          className="absolute right-4 top-4 z-10 rounded-full p-2 text-muted-foreground hover:bg-secondary hover:text-foreground transition-colors"
        >
          <X className="h-5 w-5" />
        </button>
        
        {error ? (
          <div className="p-12 text-center">
            <p className="text-destructive font-medium">{error}</p>
            <button
              onClick={onClose}
              className="mt-4 text-sm text-muted-foreground hover:text-foreground"
            >
              Close
            </button>
          </div>
        ) : !clientSecret ? (
          <div className="p-12 flex flex-col items-center justify-center gap-3">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
            <p className="text-sm text-muted-foreground">Loading checkout...</p>
          </div>
        ) : (
          <div className="p-1">
            <EmbeddedCheckoutProvider
              stripe={stripePromise}
              options={{ clientSecret }}
            >
              <EmbeddedCheckout />
            </EmbeddedCheckoutProvider>
          </div>
        )}
      </div>
    </div>
  )
}
