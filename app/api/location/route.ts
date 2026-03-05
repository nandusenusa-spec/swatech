import { NextRequest, NextResponse } from "next/server"
import { redis, VehicleLocation } from "@/lib/redis"

const LOCATION_KEY = "fleet:locations"
const LOCATION_EXPIRY = 60 // seconds - location expires if no update in 60s

// POST - Update vehicle location
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { id, name, lat, lng, speed = 0, heading = 0 } = body

    if (!id || !name || lat === undefined || lng === undefined) {
      return NextResponse.json(
        { error: "Missing required fields: id, name, lat, lng" },
        { status: 400 }
      )
    }

    const location: VehicleLocation = {
      id,
      name,
      lat: parseFloat(lat),
      lng: parseFloat(lng),
      speed: parseFloat(speed) || 0,
      heading: parseFloat(heading) || 0,
      timestamp: Date.now(),
      status: "active",
    }

    // Store in Redis hash with expiry handling via sorted set
    await redis.hset(LOCATION_KEY, { [id]: JSON.stringify(location) })
    await redis.zadd("fleet:timestamps", { score: Date.now(), member: id })

    return NextResponse.json({ success: true, location })
  } catch (error) {
    console.error("Error updating location:", error)
    return NextResponse.json(
      { error: "Failed to update location" },
      { status: 500 }
    )
  }
}

// GET - Get all vehicle locations
export async function GET() {
  try {
    // Get all locations from hash
    const locations = await redis.hgetall(LOCATION_KEY)
    
    if (!locations || Object.keys(locations).length === 0) {
      return NextResponse.json({ vehicles: [] })
    }

    const now = Date.now()
    const vehicles: VehicleLocation[] = []

    for (const [id, data] of Object.entries(locations)) {
      try {
        const location = typeof data === "string" ? JSON.parse(data) : data as VehicleLocation
        
        // Check if location is stale (no update in 60 seconds)
        const age = now - location.timestamp
        if (age > LOCATION_EXPIRY * 1000) {
          location.status = "offline"
        } else if (location.speed < 1) {
          location.status = "idle"
        } else {
          location.status = "active"
        }
        
        vehicles.push(location)
      } catch {
        // Skip invalid entries
      }
    }

    return NextResponse.json({ vehicles })
  } catch (error) {
    console.error("Error fetching locations:", error)
    return NextResponse.json(
      { error: "Failed to fetch locations" },
      { status: 500 }
    )
  }
}
