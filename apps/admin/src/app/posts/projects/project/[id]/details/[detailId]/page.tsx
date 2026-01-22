"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { createClient } from "@/lib/supabase";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

export default function ProjectDetailEditPage() {
  const supabase = createClient();
  const router = useRouter();
  const params = useParams();

  const projectId = Number(params.id);
  const detailId = Number(params.detailId);

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [description, setDescription] = useState("");
  const [githubUrl, setGithubUrl] = useState("");
  const [demoUrl, setDemoUrl] = useState("");

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

      setDescription(data.description ?? "");
      setGithubUrl(data.github_url ?? "");
      setDemoUrl(data.demo_url ?? "");
      setLoading(false);
    };

    loadDetail();
  }, [detailId, projectId, router, supabase]);

  const handleUpdate = async () => {
    if (!description) {
      alert("설명을 입력하세요.");
      return;
    }

    setSaving(true);

    const { error } = await supabase
      .from("project_details")
      .update({
        description,
        github_url: githubUrl || null,
        demo_url: demoUrl || null,
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
        <label className="text-sm font-medium">설명</label>
        <Textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          rows={6}
        />
      </div>

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