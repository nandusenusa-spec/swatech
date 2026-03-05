import { NextResponse } from "next/server"
import { redis } from "@/lib/redis"

// GET: Clean up old vehicle data from Redis
export async function GET() {
  try {
    // Get all keys matching vehicle pattern
    const keys = await redis.keys("vehicle:*")
    
    if (keys.length > 0) {
      // Delete all vehicle keys
      for (const key of keys) {
        await redis.del(key)
      }
    }
    
    return NextResponse.json({ 
      success: true, 
      message: `Cleaned ${keys.length} vehicle records`,
      keysDeleted: keys 
    })
  } catch (error) {
    console.error("Cleanup error:", error)
    return NextResponse.json(
      { error: "Failed to cleanup" },
      { status: 500 }
    )
  }
}
