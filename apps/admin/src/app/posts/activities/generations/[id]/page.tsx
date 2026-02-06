"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { createClient } from "@/lib/supabase";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

type ActivityRow = {
  id: number;
  title: string | null;
  description: string | null;
  category: string | null;
  date: string | null;
  image_url: string | null;
  generation_id: number | null;
};

export default function GenerationActivitiesPage() {
  const supabase = createClient();
  const router = useRouter();
  const params = useParams();
  const generationId = Number(params.id);

  const [loading, setLoading] = useState(true);
  const [generation, setGeneration] = useState<any>(null);
  const [activities, setActivities] = useState<ActivityRow[]>([]);

  const loadData = async () => {
    const { data: genData, error: genError } = await supabase
      .from("generations")
      .select("*")
      .eq("id", generationId)
      .single();

    if (genError || !genData) {
      alert("기수 정보를 불러오지 못했습니다.");
      router.push("/posts/activities");
      return;
    }

    setGeneration(genData);

    const { data: activitiesData, error: activitiesError } = await supabase
      .from("activity")
      .select("id, title, description, category, date, image_url, generation_id")
      .eq("generation_id", generationId)
      .order("date", { ascending: false });

    if (activitiesError) {
      alert(activitiesError.message);
    } else {
      setActivities((activitiesData ?? []) as ActivityRow[]);
    }
    setLoading(false);
  };

  useEffect(() => {
    loadData();
  }, [generationId]);

  const handleDeleteActivity = async (activity: ActivityRow) => {
    const ok = confirm(
      `"${activity.title ?? "제목 없음"}" 활동을 삭제할까요?\n연결된 미디어도 함께 삭제됩니다.`
    );
    if (!ok) return;

    const { error } = await supabase
      .from("activity")
      .delete()
      .eq("id", activity.id);

    if (error) {
      alert(error.message);
      return;
    }
    await loadData();
  };

  if (loading) {
    return <p className="text-muted-foreground">로딩 중...</p>;
  }

  if (!generation) {
    return null;
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => router.push("/posts/activities")}
          >
            ← 뒤로
          </Button>
          <div>
            <h1 className="text-3xl font-bold">{generation.name}</h1>
            <p className="text-muted-foreground mt-1">
              {generation.year ?? "-"}년 · 총 {activities.length}개 활동
            </p>
          </div>
        </div>
        <div className="flex gap-2">
          <Button
            variant="outline"
            onClick={() =>
              router.push(
                `/posts/projects/generations/${generationId}/edit`
              )
            }
          >
            기수 수정
          </Button>
          <Button
            variant="outline"
            onClick={() =>
              router.push(
                `/posts/activities/activity/new?generation_id=${generationId}`
              )
            }
          >
            + 활동 추가
          </Button>
        </div>
      </div>

      {activities.length === 0 ? (
        <Card>
          <CardContent className="py-12 text-center">
            <p className="text-muted-foreground mb-4">
              등록된 활동이 없습니다
            </p>
            <Button
              onClick={() =>
                router.push(
                  `/posts/activities/activity/new?generation_id=${generationId}`
                )
              }
            >
              첫 활동 추가하기
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {activities.map((activity) => (
            <Card
              key={activity.id}
              className="overflow-hidden hover:shadow-md transition-shadow"
            >
              {activity.image_url && (
                <div className="aspect-video w-full bg-muted">
                  <img
                    src={activity.image_url}
                    alt=""
                    className="w-full h-full object-cover"
                  />
                </div>
              )}
              <CardHeader className="pb-2">
                <CardTitle className="text-lg line-clamp-2">
                  {activity.title || "제목 없음"}
                </CardTitle>
                <div className="flex flex-wrap gap-1 text-sm text-muted-foreground">
                  {activity.category && <span>{activity.category}</span>}
                  {activity.date && <span>· {activity.date}</span>}
                </div>
              </CardHeader>
              <CardContent className="flex flex-wrap gap-2 pt-0">
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() =>
                    router.push(
                      `/posts/activities/activity/${activity.id}`
                    )
                  }
                >
                  수정
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() =>
                    router.push(
                      `/posts/activities/activity/${activity.id}/media`
                    )
                  }
                >
                  미디어 추가·삭제·수정
                </Button>
                <Button
                  size="sm"
                  variant="destructive"
                  onClick={() => handleDeleteActivity(activity)}
                >
                  삭제
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
