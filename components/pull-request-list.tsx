"use client"

import { GitPullRequest, Clock, MessageSquare, Users } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import type { PullRequest } from "@/lib/types"
import { formatTimeAgo, getReviewStatusColor, getPriorityLabel, getPriorityColor } from "@/lib/utils"

interface PullRequestListProps {
  pullRequests: PullRequest[]
}

export function PullRequestList({ pullRequests }: PullRequestListProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <GitPullRequest className="h-5 w-5" />
          Active Pull Requests
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {pullRequests.map((pr) => (
          <div
            key={pr.id}
            className="flex items-start gap-4 rounded-lg border border-border p-4 transition-colors hover:bg-accent"
          >
            <Avatar className="h-10 w-10">
              <AvatarImage src={pr.author?.avatar_url || "/placeholder.svg"} />
              <AvatarFallback>{pr.author?.username[0].toUpperCase()}</AvatarFallback>
            </Avatar>

            <div className="flex-1 space-y-2">
              <div className="flex items-start justify-between gap-2">
                <div className="flex-1">
                  <h3 className="font-semibold text-foreground leading-tight">{pr.title}</h3>
                  <p className="mt-1 text-sm text-muted-foreground">
                    {pr.repository?.full_name} #{pr.number} opened by {pr.author?.username}
                  </p>
                </div>
                <Badge className={getPriorityColor(pr.priority)}>{getPriorityLabel(pr.priority)}</Badge>
              </div>

              <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
                <span className="flex items-center gap-1">
                  <Clock className="h-4 w-4" />
                  {formatTimeAgo(pr.created_at)}
                </span>
                <span className="flex items-center gap-1">
                  <MessageSquare className="h-4 w-4" />
                  {pr.reviews?.length || 0} reviews
                </span>
                <span className="flex items-center gap-1">
                  <Users className="h-4 w-4" />
                  {pr.assignments?.length || 0} reviewers
                </span>
                <span className="text-green-600">+{pr.additions}</span>
                <span className="text-red-600">-{pr.deletions}</span>
              </div>

              <div className="flex items-center gap-2">
                <Badge className={getReviewStatusColor(pr.review_status)}>{pr.review_status.replace("_", " ")}</Badge>
                {pr.labels.map((label) => (
                  <Badge key={label} variant="outline" className="text-xs">
                    {label}
                  </Badge>
                ))}
              </div>

              {pr.assignments && pr.assignments.length > 0 && (
                <div className="flex items-center gap-2">
                  <span className="text-xs text-muted-foreground">Reviewers:</span>
                  <div className="flex -space-x-2">
                    {pr.assignments.map((assignment) => (
                      <Avatar key={assignment.id} className="h-6 w-6 border-2 border-background">
                        <AvatarImage src={assignment.reviewer?.avatar_url || "/placeholder.svg"} />
                        <AvatarFallback className="text-xs">
                          {assignment.reviewer?.username[0].toUpperCase()}
                        </AvatarFallback>
                      </Avatar>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  )
}
