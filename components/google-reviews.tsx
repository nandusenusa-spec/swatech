"use client"

import { Star } from "lucide-react"
import { useState, useEffect } from "react"

// Placeholder reviews - Replace with actual Google Reviews API data
// To get real reviews, you'll need Google Places API with your Place ID
const placeholderReviews = [
  {
    id: 1,
    author: "Michael R.",
    rating: 5,
    text: "SWATech built our fleet tracking system and it's been a game-changer for our delivery business. Real-time updates, easy to use, and great support.",
    date: "2 weeks ago",
    avatar: "M",
  },
  {
    id: 2,
    author: "Sarah L.",
    rating: 5,
    text: "Professional team that delivered exactly what we needed. Our new landing page looks amazing and we've seen a 40% increase in leads.",
    date: "1 month ago",
    avatar: "S",
  },
  {
    id: 3,
    author: "David K.",
    rating: 5,
    text: "As a small business owner in Tampa, finding a reliable tech partner was crucial. SWATech exceeded expectations with our inventory management system.",
    date: "1 month ago",
    avatar: "D",
  },
  {
    id: 4,
    author: "Jennifer M.",
    rating: 4,
    text: "Great communication throughout the project. They took the time to understand our needs and delivered a custom solution that fits perfectly.",
    date: "2 months ago",
    avatar: "J",
  },
]

interface GoogleReviewsProps {
  showTitle?: boolean
  maxReviews?: number
  className?: string
}

export function GoogleReviews({ showTitle = true, maxReviews = 4, className = "" }: GoogleReviewsProps) {
  const [currentIndex, setCurrentIndex] = useState(0)
  const reviews = placeholderReviews.slice(0, maxReviews)
  
  // Auto-rotate reviews
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % reviews.length)
    }, 5000)
    return () => clearInterval(interval)
  }, [reviews.length])

  const averageRating = reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length
  const totalReviews = 47 // Update with your actual review count

  return (
    <section id="reviews" className={`py-20 bg-background ${className}`}>
      <div className="mx-auto max-w-7xl px-6">
        {showTitle && (
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/5 px-4 py-1.5 mb-6">
              <Star className="h-4 w-4 text-primary fill-primary" />
              <span className="text-xs font-medium text-primary">Google Reviews</span>
            </div>
            <h2 className="text-2xl font-bold text-foreground sm:text-3xl lg:text-4xl font-mono text-balance">
              What Our Clients Say
            </h2>
            <p className="mt-4 text-muted-foreground max-w-2xl mx-auto">
              Join {totalReviews}+ satisfied businesses in Tampa and beyond
            </p>
            
            {/* Overall Rating */}
            <div className="mt-6 flex items-center justify-center gap-3">
              <div className="flex items-center gap-1">
                {[1, 2, 3, 4, 5].map((star) => (
                  <Star
                    key={star}
                    className={`h-6 w-6 ${
                      star <= Math.round(averageRating)
                        ? "text-yellow-400 fill-yellow-400"
                        : "text-gray-300"
                    }`}
                  />
                ))}
              </div>
              <span className="text-2xl font-bold text-foreground">{averageRating.toFixed(1)}</span>
              <span className="text-muted-foreground">({totalReviews} reviews)</span>
            </div>
          </div>
        )}

        {/* Reviews Grid */}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          {reviews.map((review, index) => (
            <div
              key={review.id}
              className={`rounded-2xl border border-border bg-card p-6 transition-all duration-500 ${
                index === currentIndex ? "ring-2 ring-primary/30 scale-[1.02]" : ""
              }`}
            >
              {/* Header */}
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold">
                  {review.avatar}
                </div>
                <div>
                  <p className="font-medium text-foreground text-sm">{review.author}</p>
                  <p className="text-xs text-muted-foreground">{review.date}</p>
                </div>
              </div>

              {/* Stars */}
              <div className="flex items-center gap-0.5 mb-3">
                {[1, 2, 3, 4, 5].map((star) => (
                  <Star
                    key={star}
                    className={`h-4 w-4 ${
                      star <= review.rating
                        ? "text-yellow-400 fill-yellow-400"
                        : "text-gray-300"
                    }`}
                  />
                ))}
              </div>

              {/* Text */}
              <p className="text-sm text-muted-foreground leading-relaxed line-clamp-4">
                "{review.text}"
              </p>

              {/* Google badge */}
              <div className="mt-4 pt-4 border-t border-border flex items-center gap-2">
                <svg className="w-4 h-4" viewBox="0 0 24 24">
                  <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                  <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                  <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                  <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                </svg>
                <span className="text-xs text-muted-foreground">Google Review</span>
              </div>
            </div>
          ))}
        </div>

        {/* CTA */}
        <div className="mt-10 text-center">
          <a
            href="https://g.page/r/YOUR_GOOGLE_PLACE_ID/review" // Replace with your actual Google review link
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 rounded-lg border border-border bg-secondary px-6 py-3 text-sm font-medium text-foreground transition-all hover:bg-border"
          >
            <Star className="h-4 w-4 text-yellow-400 fill-yellow-400" />
            Leave Us a Review on Google
          </a>
        </div>
      </div>
    </section>
  )
}
