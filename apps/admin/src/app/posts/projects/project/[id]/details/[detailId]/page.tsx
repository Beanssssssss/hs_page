"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { createClient } from "@/lib/supabase";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export default function ProjectDetailEditPage() {
  const supabase = createClient();
  const router = useRouter();
  const params = useParams();

  const projectId = Number(params.id);
  const detailId = Number(params.detailId);

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [githubUrl, setGithubUrl] = useState("");
  const [demoUrl, setDemoUrl] = useState("");
  const [youtubeUrl, setYoutubeUrl] = useState("");
  const [engineer, setEngineer] = useState("");
  const [producer, setProducer] = useState("");

  useEffect(() => {
    const loadDetail = async () => {
      const { data, error } = await supabase
        .from("project_details")
        .select("*")
        .eq("id", detailId)
        .eq("project_id", projectId)
        .single();

      if (error || !data) {
        alert("상세 정보를 불러오지 못했습니다.");
        router.back();
        return;
      }

      setGithubUrl(data.github_url ?? "");
      setDemoUrl(data.demo_url ?? "");
      setYoutubeUrl(data.youtube_url ?? "");
      setEngineer(data.engineer ?? "");
      setProducer(data.producer ?? "");
      setLoading(false);
    };

    loadDetail();
  }, [detailId, projectId, router, supabase]);

  const handleUpdate = async () => {
    setSaving(true);

    const { error } = await supabase
      .from("project_details")
      .update({
        github_url: githubUrl || null,
        demo_url: demoUrl || null,
        youtube_url: youtubeUrl || null,
        engineer: engineer || null,
        producer: producer || null,
      })
      .eq("id", detailId);

    setSaving(false);

    if (error) {
      alert(error.message);
      return;
    }

    alert("상세 정보가 수정되었습니다.");
    router.back();
  };

  if (loading) {
    return <p>로딩 중...</p>;
  }

  return (
    <div className="max-w-xl space-y-6">
      <h1 className="text-2xl font-bold">상세 정보 수정</h1>

      <div className="space-y-2">
        <label className="text-sm font-medium">GitHub URL</label>
        <Input
          value={githubUrl}
          onChange={(e) => setGithubUrl(e.target.value)}
        />
      </div>

      <div className="space-y-2">
        <label className="text-sm font-medium">Demo URL</label>
        <Input
          value={demoUrl}
          onChange={(e) => setDemoUrl(e.target.value)}
        />
      </div>

      <div className="space-y-2">
        <label className="text-sm font-medium">YouTube URL</label>
        <Input
          value={youtubeUrl}
          onChange={(e) => setYoutubeUrl(e.target.value)}
          placeholder="https://www.youtube.com/..."
        />
      </div>

      <div className="space-y-2">
        <label className="text-sm font-medium">엔지니어</label>
        <Input
          value={engineer}
          onChange={(e) => setEngineer(e.target.value)}
          placeholder="엔지니어 이름 (예: 홍길동, 김철수)"
        />
      </div>

      <div className="space-y-2">
        <label className="text-sm font-medium">프로듀서</label>
        <Input
          value={producer}
          onChange={(e) => setProducer(e.target.value)}
          placeholder="프로듀서 이름 (예: 이영희, 박민수)"
        />
      </div>

      <div className="flex justify-end gap-2">
        <Button variant="outline" onClick={() => router.back()}>
          취소
        </Button>
        <Button onClick={handleUpdate} disabled={saving}>
          {saving ? "저장 중..." : "저장"}
        </Button>
      </div>
    </div>
  );
}