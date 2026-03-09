import { NextResponse } from "next/server"
import { notifyNewLead } from "@/lib/telegram"

export async function GET() {
  try {
    await notifyNewLead({
      email: "test@example.com",
      name: "Prueba",
      company: "Test Company",
      source: "test-endpoint"
    })
    
    return NextResponse.json({ success: true, message: "Notificacion enviada!" })
  } catch (error) {
    console.error("Error sending Telegram notification:", error)
    return NextResponse.json({ 
      success: false, 
      error: error instanceof Error ? error.message : "Error desconocido" 
    }, { status: 500 })
  }
}
