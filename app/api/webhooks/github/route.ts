import { type NextRequest, NextResponse } from "next/server"
import type { WebhookPayload } from "@/lib/github"

export async function POST(request: NextRequest) {
  try {
    const signature = request.headers.get("x-hub-signature-256")
    const event = request.headers.get("x-github-event")

    if (!signature || !event) {
      return NextResponse.json({ error: "Missing headers" }, { status: 400 })
    }

    const payload: WebhookPayload = await request.json()

    console.log("[v0] GitHub webhook received:", event, payload.action)

    // Handle different webhook events
    switch (event) {
      case "pull_request":
        await handlePullRequestEvent(payload)
        break
      case "pull_request_review":
        await handleReviewEvent(payload)
        break
      case "pull_request_review_comment":
        await handleReviewCommentEvent(payload)
        break
      default:
        console.log("[v0] Unhandled webhook event:", event)
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("[v0] Webhook processing error:", error)
    return NextResponse.json({ error: "Webhook processing failed" }, { status: 500 })
  }
}

async function handlePullRequestEvent(payload: WebhookPayload) {
  const { action, pull_request } = payload

  switch (action) {
    case "opened":
      console.log("[v0] New PR opened:", pull_request?.number)
      // Trigger reviewer assignment logic
      break
    case "synchronize":
      console.log("[v0] PR updated:", pull_request?.number)
      // Update PR data and notify reviewers
      break
    case "closed":
      console.log("[v0] PR closed:", pull_request?.number)
      // Update PR status
      break
  }
}

async function handleReviewEvent(payload: WebhookPayload) {
  const { action, review, pull_request } = payload

  if (action === "submitted") {
    console.log("[v0] Review submitted for PR:", pull_request?.number)
    // Update review status and notify PR author
  }
}

async function handleReviewCommentEvent(payload: WebhookPayload) {
  console.log("[v0] Review comment added")
  // Store comment and notify relevant users
}
