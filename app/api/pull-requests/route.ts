import { NextResponse } from "next/server"
import { getAllPullRequests } from "@/lib/mock-data"

export async function GET() {
  try {
    const pullRequests = getAllPullRequests()

    return NextResponse.json({
      success: true,
      data: pullRequests,
    })
  } catch (error) {
    console.error("[v0] Failed to fetch pull requests:", error)
    return NextResponse.json({ error: "Failed to fetch pull requests" }, { status: 500 })
  }
}
