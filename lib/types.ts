// Core type definitions for the distributed code review platform

export type UserRole = "developer" | "senior_developer" | "tech_lead" | "admin"

export type PRState = "open" | "closed" | "merged"

export type ReviewStatus = "pending" | "in_review" | "approved" | "changes_requested"

export type ReviewState = "pending" | "approved" | "changes_requested" | "commented"

export type AssignmentStatus = "assigned" | "accepted" | "declined" | "completed"

export type NotificationType = "review_assigned" | "review_completed" | "comment_added" | "pr_updated" | "pr_merged"

export type Priority = 0 | 1 | 2 | 3 // low, medium, high, critical

export interface User {
  id: string
  github_id: number
  username: string
  email?: string
  avatar_url?: string
  name?: string
  role: UserRole
  expertise_areas: string[]
  max_concurrent_reviews: number
  created_at: string
  updated_at: string
}

export interface Repository {
  id: string
  github_id: number
  name: string
  full_name: string
  owner: string
  description?: string
  language?: string
  is_active: boolean
  webhook_secret?: string
  created_at: string
  updated_at: string
}

export interface PullRequest {
  id: string
  repository_id: string
  github_id: number
  number: number
  title: string
  description?: string
  author_id: string
  state: PRState
  review_status: ReviewStatus
  base_branch: string
  head_branch: string
  additions: number
  deletions: number
  changed_files: number
  labels: string[]
  priority: Priority
  created_at: string
  updated_at: string
  // Populated fields
  author?: User
  repository?: Repository
  reviews?: Review[]
  assignments?: ReviewerAssignment[]
  metrics?: ReviewMetrics
}

export interface Review {
  id: string
  pull_request_id: string
  reviewer_id: string
  github_review_id?: number
  state: ReviewState
  body?: string
  submitted_at?: string
  created_at: string
  updated_at: string
  // Populated fields
  reviewer?: User
  comments?: ReviewComment[]
}

export interface ReviewComment {
  id: string
  review_id: string
  pull_request_id: string
  author_id: string
  github_comment_id?: number
  body: string
  path?: string
  line?: number
  created_at: string
  updated_at: string
  // Populated fields
  author?: User
}

export interface ReviewerAssignment {
  id: string
  pull_request_id: string
  reviewer_id: string
  assigned_by_id: string
  assignment_reason: string
  status: AssignmentStatus
  assigned_at: string
  responded_at?: string
  created_at: string
  updated_at: string
  // Populated fields
  reviewer?: User
  assigned_by?: User
}

export interface Notification {
  id: string
  user_id: string
  type: NotificationType
  title: string
  message?: string
  link?: string
  is_read: boolean
  created_at: string
}

export interface ReviewMetrics {
  id: string
  pull_request_id: string
  time_to_first_review?: number // minutes
  time_to_approval?: number // minutes
  total_review_time?: number // minutes
  number_of_reviewers: number
  number_of_comments: number
  number_of_iterations: number
  created_at: string
  updated_at: string
}

// Dashboard statistics
export interface DashboardStats {
  total_prs: number
  pending_reviews: number
  in_review: number
  approved: number
  avg_review_time: number // minutes
  active_reviewers: number
}

// API response types
export interface ApiResponse<T> {
  success: boolean
  data?: T
  error?: string
  message?: string
}

export interface PaginatedResponse<T> {
  data: T[]
  total: number
  page: number
  per_page: number
  total_pages: number
}
