import { Redis } from "@upstash/redis"

export const redis = new Redis({
  url: process.env.KV_REST_API_URL!,
  token: process.env.KV_REST_API_TOKEN!,
})

export interface VehicleLocation {
  id: string
  name: string
  lat: number
  lng: number
  speed: number
  heading: number
  timestamp: number
  status: "active" | "idle" | "offline"
  phone?: string
  // Personalization
  avatar?: string // URL or emoji
  avatarType?: "emoji" | "photo" | "initials"
  carBrand?: string
  carColor?: string
  // Delivery & Work
  deliveryStatus?: "none" | "pickup" | "in-transit" | "delivered"
  clockedIn?: boolean
  clockInTime?: number
  totalMiles?: number
  dailyMilesGoal?: number
  // Messaging
  message?: string
  floatingEmoji?: string
  // Gamification
  streak?: number
  totalDeliveries?: number
  achievements?: string[]
  // Trail history (last 20 positions)
  trail?: Array<{ lat: number; lng: number; timestamp: number }>
}
