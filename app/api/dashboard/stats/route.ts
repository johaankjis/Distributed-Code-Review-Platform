import { NextResponse } from "next/server"
import { mockDashboardStats } from "@/lib/mock-data"

export async function GET() {
  try {
    return NextResponse.json({
      success: true,
      data: mockDashboardStats,
    })
  } catch (error) {
    console.error("[v0] Failed to fetch dashboard stats:", error)
    return NextResponse.json({ error: "Failed to fetch stats" }, { status: 500 })
  }
}
