// GitHub API integration utilities

export interface GitHubUser {
  id: number
  login: string
  avatar_url: string
  name: string | null
  email: string | null
}

export interface GitHubRepository {
  id: number
  name: string
  full_name: string
  owner: {
    login: string
  }
  description: string | null
  language: string | null
  private: boolean
}

export interface GitHubPullRequest {
  id: number
  number: number
  title: string
  body: string | null
  state: "open" | "closed"
  user: GitHubUser
  base: {
    ref: string
  }
  head: {
    ref: string
  }
  additions: number
  deletions: number
  changed_files: number
  labels: Array<{ name: string }>
  created_at: string
  updated_at: string
}

export interface GitHubReview {
  id: number
  user: GitHubUser
  body: string | null
  state: "APPROVED" | "CHANGES_REQUESTED" | "COMMENTED" | "PENDING"
  submitted_at: string | null
}

export class GitHubClient {
  private token: string
  private baseUrl = "https://api.github.com"

  constructor(token: string) {
    this.token = token
  }

  private async fetch<T>(endpoint: string, options?: RequestInit): Promise<T> {
    const response = await fetch(`${this.baseUrl}${endpoint}`, {
      ...options,
      headers: {
        Authorization: `Bearer ${this.token}`,
        Accept: "application/vnd.github.v3+json",
        ...options?.headers,
      },
    })

    if (!response.ok) {
      throw new Error(`GitHub API error: ${response.statusText}`)
    }

    return response.json()
  }

  async getUser(): Promise<GitHubUser> {
    return this.fetch<GitHubUser>("/user")
  }

  async getRepository(owner: string, repo: string): Promise<GitHubRepository> {
    return this.fetch<GitHubRepository>(`/repos/${owner}/${repo}`)
  }

  async listRepositories(): Promise<GitHubRepository[]> {
    return this.fetch<GitHubRepository[]>("/user/repos?per_page=100")
  }

  async getPullRequest(owner: string, repo: string, number: number): Promise<GitHubPullRequest> {
    return this.fetch<GitHubPullRequest>(`/repos/${owner}/${repo}/pulls/${number}`)
  }

  async listPullRequests(
    owner: string,
    repo: string,
    state: "open" | "closed" | "all" = "open",
  ): Promise<GitHubPullRequest[]> {
    return this.fetch<GitHubPullRequest[]>(`/repos/${owner}/${repo}/pulls?state=${state}&per_page=100`)
  }

  async listReviews(owner: string, repo: string, number: number): Promise<GitHubReview[]> {
    return this.fetch<GitHubReview[]>(`/repos/${owner}/${repo}/pulls/${number}/reviews`)
  }

  async createReview(
    owner: string,
    repo: string,
    number: number,
    body: string,
    event: "APPROVE" | "REQUEST_CHANGES" | "COMMENT",
  ): Promise<GitHubReview> {
    return this.fetch<GitHubReview>(`/repos/${owner}/${repo}/pulls/${number}/reviews`, {
      method: "POST",
      body: JSON.stringify({ body, event }),
    })
  }

  async requestReviewers(owner: string, repo: string, number: number, reviewers: string[]): Promise<void> {
    await this.fetch(`/repos/${owner}/${repo}/pulls/${number}/requested_reviewers`, {
      method: "POST",
      body: JSON.stringify({ reviewers }),
    })
  }

  async createWebhook(owner: string, repo: string, webhookUrl: string, secret: string): Promise<void> {
    await this.fetch(`/repos/${owner}/${repo}/hooks`, {
      method: "POST",
      body: JSON.stringify({
        name: "web",
        active: true,
        events: ["pull_request", "pull_request_review", "pull_request_review_comment"],
        config: {
          url: webhookUrl,
          content_type: "json",
          secret,
        },
      }),
    })
  }
}

// Webhook payload types
export interface WebhookPayload {
  action: string
  pull_request?: GitHubPullRequest
  review?: GitHubReview
  repository: GitHubRepository
  sender: GitHubUser
}

export function verifyWebhookSignature(payload: string, signature: string, secret: string): boolean {
  // In production, use crypto.createHmac to verify the signature
  // For now, this is a placeholder
  return true
}
