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
      <div className="relative w-full max-w-md max-h-[90vh] rounded-2xl border border-border bg-card shadow-2xl overflow-hidden flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between px-4 py-3 border-b border-border bg-secondary/30 shrink-0">
          <h3 className="text-sm font-semibold text-foreground">Secure Checkout</h3>
          <button
            onClick={onClose}
            className="rounded-full p-1.5 text-muted-foreground hover:bg-secondary hover:text-foreground transition-colors"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
        
        {/* Content */}
        {error ? (
          <div className="p-8 text-center">
            <p className="text-destructive font-medium text-sm">{error}</p>
            <button
              onClick={onClose}
              className="mt-4 text-sm text-muted-foreground hover:text-foreground"
            >
              Close
            </button>
          </div>
        ) : !clientSecret ? (
          <div className="p-8 flex flex-col items-center justify-center gap-3">
            <Loader2 className="h-6 w-6 animate-spin text-primary" />
            <p className="text-sm text-muted-foreground">Loading checkout...</p>
          </div>
        ) : (
          <div className="flex-1 overflow-y-auto min-h-0">
            <div className="p-1">
              <EmbeddedCheckoutProvider
                stripe={stripePromise}
                options={{ clientSecret }}
              >
                <EmbeddedCheckout />
              </EmbeddedCheckoutProvider>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
