// Authentication utilities

import { cookies } from "next/headers"
import { GitHubClient } from "./github"

export async function getGitHubToken(): Promise<string | null> {
  const cookieStore = await cookies()
  return cookieStore.get("github_token")?.value || null
}

export async function getGitHubClient(): Promise<GitHubClient | null> {
  const token = await getGitHubToken()
  if (!token) return null
  return new GitHubClient(token)
}

export async function getCurrentUser() {
  const client = await getGitHubClient()
  if (!client) return null

  try {
    return await client.getUser()
  } catch (error) {
    console.error("[v0] Failed to get current user:", error)
    return null
  }
}

export async function requireAuth() {
  const user = await getCurrentUser()
  if (!user) {
    throw new Error("Authentication required")
  }
  return user
}
