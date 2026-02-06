"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export default function ProjectsAdminPage() {
  const supabase = createClient();
  const router = useRouter();
  const [generations, setGenerations] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    supabase
      .from("generations")
      .select("*")
      .order("id", { ascending: false })
      .then(({ data }) => {
        setGenerations(data ?? []);
        setLoading(false);
      });
  }, [supabase]);

  const handleDeleteGeneration = async (generation: any) => {
    const ok = confirm(
      `${generation.name} (${generation.year}) 기수를 삭제할까요?\n하위 프로젝트도 모두 삭제됩니다.`
    );
    if (!ok) return;

    const { error } = await supabase
      .from("generations")
      .delete()
      .eq("id", generation.id);

    if (error) {
      console.error("❌ 기수 삭제 실패", error);
      alert(error.message);
      return;
    }

    // 기수 다시 조회
    const { data } = await supabase
      .from("generations")
      .select("*")
      .order("id", { ascending: false });

    setGenerations(data ?? []);
  };

  if (loading) {
    return <p className="text-muted-foreground">로딩 중...</p>;
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">기수 관리</h1>
          <p className="text-muted-foreground mt-1">
            기수를 선택하여 해당 기수의 프로젝트를 관리하세요
          </p>
        </div>
        <Button
          variant="outline"
          onClick={() => router.push("/posts/projects/generations/new")}
        >
          + 기수 추가
        </Button>
      </div>

      {generations.length === 0 && (
        <Card>
          <CardContent className="py-12 text-center">
            <p className="text-muted-foreground">등록된 기수가 없습니다</p>
            <Button
              className="mt-4"
              onClick={() => router.push("/posts/projects/generations/new")}
            >
              첫 기수 추가하기
            </Button>
          </CardContent>
        </Card>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {generations.map((generation) => (
          <Card
            key={generation.id}
            className="cursor-pointer hover:shadow-md transition-shadow"
            onClick={() => router.push(`/posts/projects/generations/${generation.id}`)}
          >
            <CardHeader>
              <div className="flex items-start justify-between">
                <div>
                  <CardTitle className="text-xl">{generation.name}</CardTitle>
                  <CardDescription className="mt-1">
                    {generation.year}
                  </CardDescription>
                </div>
                <div className="flex gap-1" onClick={(e) => e.stopPropagation()}>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() =>
                      router.push(`/posts/projects/generations/${generation.id}/edit`)
                    }
                  >
                    수정
                  </Button>
                  <Button
                    size="sm"
                    variant="destructive"
                    onClick={() => handleDeleteGeneration(generation)}
                  >
                    삭제
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <Button
                variant="outline"
                className="w-full"
                onClick={(e) => {
                  e.stopPropagation();
                  router.push(`/posts/projects/generations/${generation.id}`);
                }}
              >
                프로젝트 보기
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}