// Intelligent reviewer assignment algorithm

import type { User, PullRequest, ReviewerAssignment } from "./types"

export interface AssignmentScore {
  reviewer: User
  score: number
  reasons: string[]
}

export interface AssignmentResult {
  reviewer: User
  reason: string
  score: number
}

export class ReviewerAssignmentEngine {
  /**
   * Assigns optimal reviewers to a pull request based on multiple factors:
   * - Expertise match with PR language/labels
   * - Current workload (number of active reviews)
   * - Historical review patterns
   * - Availability (max concurrent reviews)
   */
  async assignReviewers(
    pullRequest: PullRequest,
    availableReviewers: User[],
    currentAssignments: ReviewerAssignment[],
    numReviewers = 2,
  ): Promise<AssignmentResult[]> {
    // Filter out PR author
    const eligibleReviewers = availableReviewers.filter((r) => r.id !== pullRequest.author_id)

    // Calculate scores for each reviewer
    const scores = eligibleReviewers.map((reviewer) =>
      this.calculateReviewerScore(reviewer, pullRequest, currentAssignments),
    )

    // Sort by score (highest first) and take top N
    scores.sort((a, b) => b.score - a.score)

    return scores.slice(0, numReviewers).map((s) => ({
      reviewer: s.reviewer,
      reason: s.reasons.join(", "),
      score: s.score,
    }))
  }

  private calculateReviewerScore(
    reviewer: User,
    pullRequest: PullRequest,
    allAssignments: ReviewerAssignment[],
  ): AssignmentScore {
    let score = 0
    const reasons: string[] = []

    // 1. Expertise match (0-40 points)
    const expertiseScore = this.calculateExpertiseScore(reviewer, pullRequest)
    score += expertiseScore
    if (expertiseScore > 20) {
      reasons.push("expertise_match")
    }

    // 2. Workload balance (0-30 points)
    const workloadScore = this.calculateWorkloadScore(reviewer, allAssignments)
    score += workloadScore
    if (workloadScore > 15) {
      reasons.push("load_balancing")
    }

    // 3. Seniority bonus (0-20 points)
    const seniorityScore = this.calculateSeniorityScore(reviewer)
    score += seniorityScore
    if (seniorityScore > 10) {
      reasons.push("senior_reviewer")
    }

    // 4. Availability (0-10 points)
    const availabilityScore = this.calculateAvailabilityScore(reviewer, allAssignments)
    score += availabilityScore
    if (availabilityScore < 5) {
      reasons.push("high_workload")
    }

    return { reviewer, score, reasons }
  }

  private calculateExpertiseScore(reviewer: User, pullRequest: PullRequest): number {
    let score = 0

    // Check if reviewer has expertise in PR language
    if (pullRequest.repository?.language) {
      const hasLanguageExpertise = reviewer.expertise_areas.some((area) =>
        area.toLowerCase().includes(pullRequest.repository!.language!.toLowerCase()),
      )
      if (hasLanguageExpertise) score += 20
    }

    // Check if reviewer has expertise matching PR labels
    const labelMatches = pullRequest.labels.filter((label) =>
      reviewer.expertise_areas.some((area) => area.toLowerCase().includes(label.toLowerCase())),
    )
    score += Math.min(labelMatches.length * 10, 20)

    return score
  }

  private calculateWorkloadScore(reviewer: User, allAssignments: ReviewerAssignment[]): number {
    // Count active assignments for this reviewer
    const activeAssignments = allAssignments.filter(
      (a) => a.reviewer_id === reviewer.id && (a.status === "assigned" || a.status === "accepted"),
    ).length

    // More available capacity = higher score
    const capacityRatio = 1 - activeAssignments / reviewer.max_concurrent_reviews
    return Math.max(0, Math.floor(capacityRatio * 30))
  }

  private calculateSeniorityScore(reviewer: User): number {
    switch (reviewer.role) {
      case "tech_lead":
        return 20
      case "senior_developer":
        return 15
      case "developer":
        return 10
      default:
        return 5
    }
  }

  private calculateAvailabilityScore(reviewer: User, allAssignments: ReviewerAssignment[]): number {
    const activeAssignments = allAssignments.filter(
      (a) => a.reviewer_id === reviewer.id && (a.status === "assigned" || a.status === "accepted"),
    ).length

    // Penalize if at or near capacity
    if (activeAssignments >= reviewer.max_concurrent_reviews) return 0
    if (activeAssignments >= reviewer.max_concurrent_reviews * 0.8) return 5

    return 10
  }

  /**
   * Determines PR priority based on labels, size, and age
   */
  calculatePriority(pullRequest: PullRequest): number {
    let priority = 1 // default medium

    // Check labels for priority indicators
    const labels = pullRequest.labels.map((l) => l.toLowerCase())
    if (labels.includes("critical") || labels.includes("hotfix")) return 3
    if (labels.includes("high") || labels.includes("urgent")) return 2
    if (labels.includes("low")) return 0

    // Large PRs get higher priority (need more attention)
    const totalChanges = pullRequest.additions + pullRequest.deletions
    if (totalChanges > 500) priority = Math.max(priority, 2)

    // Old PRs get higher priority
    const ageInDays = (Date.now() - new Date(pullRequest.created_at).getTime()) / (1000 * 60 * 60 * 24)
    if (ageInDays > 3) priority = Math.max(priority, 2)

    return priority
  }
}

// Singleton instance
export const reviewerAssignmentEngine = new ReviewerAssignmentEngine()
