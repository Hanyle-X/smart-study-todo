"use client";

import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { useAppStore } from "@/lib/app-store";
import { formatPercent } from "@/lib/utils";

export default function HistoryPage() {
  const { data } = useAppStore();

  return (
    <div className="flex flex-col gap-5">
      {data.reviews.map((review) => (
        <Card key={review.id}>
          <CardHeader>
            <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
              <div>
                <CardTitle>{review.date}</CardTitle>
                <CardDescription>{review.reflection ?? "今天不是重新做人，是重新调参。"}</CardDescription>
              </div>
              <Badge tone={review.completionRate >= 0.8 ? "green" : review.completionRate < 0.5 ? "orange" : "blue"}>{formatPercent(review.completionRate)}</Badge>
            </div>
          </CardHeader>
          <CardContent>
            <Progress value={review.completionRate * 100} />
            <p className="mt-3 text-sm text-muted">{review.completedTaskCount}/{review.totalTaskCount} 个任务完成 · 状态：{review.userFeeling}</p>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
