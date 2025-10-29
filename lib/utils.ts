import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"
import type { ReviewStatus, Priority } from "./types"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatTimeAgo(date: string): string {
  const now = new Date()
  const past = new Date(date)
  const diffInSeconds = Math.floor((now.getTime() - past.getTime()) / 1000)

  if (diffInSeconds < 60) return "just now"
  if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m ago`
  if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}h ago`
  if (diffInSeconds < 604800) return `${Math.floor(diffInSeconds / 86400)}d ago`

  return past.toLocaleDateString()
}

export function formatDuration(minutes: number): string {
  if (minutes < 60) return `${minutes}m`
  const hours = Math.floor(minutes / 60)
  const mins = minutes % 60
  return mins > 0 ? `${hours}h ${mins}m` : `${hours}h`
}

export function getReviewStatusColor(status: ReviewStatus): string {
  switch (status) {
    case "pending":
      return "text-yellow-600 bg-yellow-50 border-yellow-200"
    case "in_review":
      return "text-blue-600 bg-blue-50 border-blue-200"
    case "approved":
      return "text-green-600 bg-green-50 border-green-200"
    case "changes_requested":
      return "text-red-600 bg-red-50 border-red-200"
    default:
      return "text-gray-600 bg-gray-50 border-gray-200"
  }
}

export function getPriorityLabel(priority: Priority): string {
  switch (priority) {
    case 0:
      return "Low"
    case 1:
      return "Medium"
    case 2:
      return "High"
    case 3:
      return "Critical"
    default:
      return "Unknown"
  }
}

export function getPriorityColor(priority: Priority): string {
  switch (priority) {
    case 0:
      return "text-gray-600 bg-gray-100"
    case 1:
      return "text-blue-600 bg-blue-100"
    case 2:
      return "text-orange-600 bg-orange-100"
    case 3:
      return "text-red-600 bg-red-100"
    default:
      return "text-gray-600 bg-gray-100"
  }
}
