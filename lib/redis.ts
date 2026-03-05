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
}
