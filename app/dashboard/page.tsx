import { DashboardHeader } from "@/components/dashboard-header"
import { StatsCards } from "@/components/stats-cards"
import { PullRequestList } from "@/components/pull-request-list"
import { ReviewerWorkload } from "@/components/reviewer-workload"
import { mockDashboardStats, getAllPullRequests, mockUsers, mockAssignments } from "@/lib/mock-data"

export default function DashboardPage() {
  const pullRequests = getAllPullRequests()
  const stats = mockDashboardStats

  return (
    <div className="min-h-screen bg-background">
      <DashboardHeader />

      <main className="container mx-auto p-6 space-y-6">
        <div>
          <h2 className="text-3xl font-bold text-foreground">Dashboard</h2>
          <p className="mt-1 text-muted-foreground">Monitor and manage code reviews across your organization</p>
        </div>

        <StatsCards stats={stats} />

        <div className="grid gap-6 lg:grid-cols-3">
          <div className="lg:col-span-2">
            <PullRequestList pullRequests={pullRequests} />
          </div>

          <div>
            <ReviewerWorkload reviewers={mockUsers} assignments={mockAssignments} />
          </div>
        </div>
      </main>
    </div>
  )
}
