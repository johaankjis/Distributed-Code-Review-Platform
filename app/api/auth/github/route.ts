import { type NextRequest, NextResponse } from "next/server"

// GitHub OAuth configuration
const GITHUB_CLIENT_ID = process.env.GITHUB_CLIENT_ID || "mock_client_id"
const GITHUB_CLIENT_SECRET = process.env.GITHUB_CLIENT_SECRET || "mock_client_secret"
const GITHUB_REDIRECT_URI = process.env.GITHUB_REDIRECT_URI || "http://localhost:3000/api/auth/github/callback"

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams
  const code = searchParams.get("code")

  if (!code) {
    // Redirect to GitHub OAuth
    const githubAuthUrl = new URL("https://github.com/login/oauth/authorize")
    githubAuthUrl.searchParams.set("client_id", GITHUB_CLIENT_ID)
    githubAuthUrl.searchParams.set("redirect_uri", GITHUB_REDIRECT_URI)
    githubAuthUrl.searchParams.set("scope", "repo read:user user:email")

    return NextResponse.redirect(githubAuthUrl.toString())
  }

  // Exchange code for access token
  try {
    const tokenResponse = await fetch("https://github.com/login/oauth/access_token", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify({
        client_id: GITHUB_CLIENT_ID,
        client_secret: GITHUB_CLIENT_SECRET,
        code,
        redirect_uri: GITHUB_REDIRECT_URI,
      }),
    })

    const tokenData = await tokenResponse.json()

    if (tokenData.error) {
      return NextResponse.json({ error: tokenData.error }, { status: 400 })
    }

    // In production, store the access token securely and create a session
    // For now, redirect to dashboard with token in query (not secure, demo only)
    const response = NextResponse.redirect(new URL("/dashboard", request.url))
    response.cookies.set("github_token", tokenData.access_token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 60 * 60 * 24 * 30, // 30 days
    })

    return response
  } catch (error) {
    console.error("[v0] GitHub OAuth error:", error)
    return NextResponse.json({ error: "Authentication failed" }, { status: 500 })
  }
}
