import { type NextRequest, NextResponse } from "next/server"
import { reviewerAssignmentEngine } from "@/lib/reviewer-assignment"
import { mockUsers, mockAssignments, getPullRequestById } from "@/lib/mock-data"

export async function POST(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params
    const body = await request.json()
    const { numReviewers = 2 } = body

    // Get the pull request
    const pullRequest = getPullRequestById(id)
    if (!pullRequest) {
      return NextResponse.json({ error: "Pull request not found" }, { status: 404 })
    }

    // Assign reviewers using the intelligent algorithm
    const assignments = await reviewerAssignmentEngine.assignReviewers(
      pullRequest,
      mockUsers,
      mockAssignments,
      numReviewers,
    )

    // In production, save assignments to database and notify reviewers
    console.log("[v0] Assigned reviewers:", assignments)

    return NextResponse.json({
      success: true,
      data: assignments,
    })
  } catch (error) {
    console.error("[v0] Reviewer assignment error:", error)
    return NextResponse.json({ error: "Failed to assign reviewers" }, { status: 500 })
  }
}
