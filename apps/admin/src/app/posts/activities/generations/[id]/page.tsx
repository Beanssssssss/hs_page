"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { createClient } from "@/lib/supabase";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export default function GenerationActivitiesPage() {
  const supabase = createClient();
  const router = useRouter();
  const params = useParams();

  const generationId = Number(params.id);

  const [loading, setLoading] = useState(true);
  const [generation, setGeneration] = useState<any>(null);
  const [activities, setActivities] = useState<any[]>([]);

  useEffect(() => {
    const loadData = async () => {
      // 기수 정보 조회
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

      // 액티비티 조회
      const { data: activitiesData, error: activitiesError } = await supabase
        .from("activity")
        .select("*")
        .eq("generation_id", generationId)
        .order("date", { ascending: false });

      if (activitiesError) {
        console.error("❌ activity 조회 에러", activitiesError);
        alert(activitiesError.message);
        setLoading(false);
        return;
      }

      setActivities(activitiesData ?? []);
      setLoading(false);
    };

    loadData();
  }, [generationId, router, supabase]);

  const handleDeleteActivity = async (activity: any) => {
    const ok = confirm(`"${activity.title}" 액티비티를 삭제할까요?`);
    if (!ok) return;

    const { error } = await supabase
      .from("activity")
      .delete()
      .eq("id", activity.id);

    if (error) {
      console.error("❌ 액티비티 삭제 실패", error);
      alert(error.message);
      return;
    }

    // 액티비티 목록 새로고침
    const { data: activitiesData } = await supabase
      .from("activity")
      .select("*")
      .eq("generation_id", generationId)
      .order("date", { ascending: false });

    setActivities(activitiesData ?? []);
  };

  if (loading) {
    return <p className="text-muted-foreground">로딩 중...</p>;
  }

  if (!generation) {
    return null;
  }

  return (
    <div className="space-y-6">
      {/* 헤더 */}
      <div className="flex items-center justify-between">
        <div>
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
                {generation.year}년 · 총 {activities.length}개 액티비티
              </p>
            </div>
          </div>
        </div>
        <div className="flex gap-2">
          <Button
            variant="outline"
            onClick={() => router.push(`/posts/activities/generations/${generationId}/edit`)}
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
            + 액티비티 추가
          </Button>
        </div>
      </div>

      {/* 액티비티 목록 */}
      {activities.length === 0 ? (
        <Card>
          <CardContent className="py-12 text-center">
            <p className="text-muted-foreground mb-4">
              등록된 액티비티가 없습니다
            </p>
            <Button
              onClick={() =>
                router.push(
                  `/posts/activities/activity/new?generation_id=${generationId}`
                )
              }
            >
              첫 액티비티 추가하기
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {activities.map((activity) => (
            <Card
              key={activity.id}
              className="cursor-pointer hover:shadow-md transition-shadow"
              onClick={() =>
                router.push(`/posts/activities/activity/${activity.id}`)
              }
            >
              <CardHeader>
                <div className="flex items-start justify-between">
                  <CardTitle className="text-lg line-clamp-2">
                    {activity.title}
                  </CardTitle>
                  <div
                    className="flex gap-1 shrink-0"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() =>
                        router.push(`/posts/activities/activity/${activity.id}`)
                      }
                    >
                      수정
                    </Button>
                    <Button
                      size="sm"
                      variant="destructive"
                      onClick={() => handleDeleteActivity(activity)}
                    >
                      삭제
                    </Button>
                  </div>
                </div>
                {activity.category && (
                  <CardDescription className="line-clamp-2">
                    {activity.category}
                  </CardDescription>
                )}
              </CardHeader>
              {activity.image_url && (
                <CardContent>
                  <img
                    src={activity.image_url}
                    alt={activity.title}
                    className="w-full h-32 object-cover rounded"
                  />
                </CardContent>
              )}
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
