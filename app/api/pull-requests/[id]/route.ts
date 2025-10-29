import { type NextRequest, NextResponse } from "next/server"
import { getPullRequestById } from "@/lib/mock-data"

export async function GET(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params
    const pullRequest = getPullRequestById(id)

    if (!pullRequest) {
      return NextResponse.json({ error: "Pull request not found" }, { status: 404 })
    }

    return NextResponse.json({
      success: true,
      data: pullRequest,
    })
  } catch (error) {
    console.error("[v0] Failed to fetch pull request:", error)
    return NextResponse.json({ error: "Failed to fetch pull request" }, { status: 500 })
  }
}
