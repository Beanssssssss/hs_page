"use client";

import { useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { createClient } from "@/lib/supabase";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

export default function ProjectDetailNewPage() {
  const supabase = createClient();
  const router = useRouter();
  const params = useParams();

  const projectId = Number(params.id);

  const [saving, setSaving] = useState(false);
  const [description, setDescription] = useState("");
  const [githubUrl, setGithubUrl] = useState("");
  const [demoUrl, setDemoUrl] = useState("");

  const handleSubmit = async () => {
    if (!description) {
      alert("설명을 입력하세요.");
      return;
    }

    setSaving(true);

    const { error } = await supabase
      .from("project_details")
      .insert({
        project_id: projectId,
        description,
        github_url: githubUrl || null,
        demo_url: demoUrl || null,
      });

    setSaving(false);

    if (error) {
      alert(error.message);
      return;
    }

    alert("상세 정보가 추가되었습니다.");
    router.back();
  };

  return (
    <div className="max-w-xl space-y-6">
      <h1 className="text-2xl font-bold">상세 정보 추가</h1>

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
          placeholder="https://github.com/..."
        />
      </div>

      <div className="space-y-2">
        <label className="text-sm font-medium">Demo URL</label>
        <Input
          value={demoUrl}
          onChange={(e) => setDemoUrl(e.target.value)}
          placeholder="https://..."
        />
      </div>

      <div className="flex justify-end gap-2">
        <Button variant="outline" onClick={() => router.back()}>
          취소
        </Button>
        <Button onClick={handleSubmit} disabled={saving}>
          {saving ? "저장 중..." : "저장"}
        </Button>
      </div>
    </div>
  );
}