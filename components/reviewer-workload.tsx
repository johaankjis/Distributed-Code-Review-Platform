"use client"

import { Users } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Progress } from "@/components/ui/progress"
import type { User, ReviewerAssignment } from "@/lib/types"

interface ReviewerWorkloadProps {
  reviewers: User[]
  assignments: ReviewerAssignment[]
}

export function ReviewerWorkload({ reviewers, assignments }: ReviewerWorkloadProps) {
  const workloadData = reviewers.map((reviewer) => {
    const activeAssignments = assignments.filter(
      (a) => a.reviewer_id === reviewer.id && (a.status === "assigned" || a.status === "accepted"),
    ).length

    const workloadPercentage = (activeAssignments / reviewer.max_concurrent_reviews) * 100

    return {
      reviewer,
      activeAssignments,
      workloadPercentage,
    }
  })

  // Sort by workload percentage
  workloadData.sort((a, b) => b.workloadPercentage - a.workloadPercentage)

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Users className="h-5 w-5" />
          Reviewer Workload
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {workloadData.map(({ reviewer, activeAssignments, workloadPercentage }) => (
          <div key={reviewer.id} className="space-y-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Avatar className="h-8 w-8">
                  <AvatarImage src={reviewer.avatar_url || "/placeholder.svg"} />
                  <AvatarFallback>{reviewer.username[0].toUpperCase()}</AvatarFallback>
                </Avatar>
                <div>
                  <p className="text-sm font-medium text-foreground">{reviewer.name}</p>
                  <p className="text-xs text-muted-foreground">{reviewer.role.replace("_", " ")}</p>
                </div>
              </div>
              <span className="text-sm font-medium text-muted-foreground">
                {activeAssignments}/{reviewer.max_concurrent_reviews}
              </span>
            </div>
            <Progress value={workloadPercentage} className="h-2" />
          </div>
        ))}
      </CardContent>
    </Card>
  )
}
