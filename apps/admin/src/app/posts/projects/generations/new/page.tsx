"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export default function GenerationCreatePage() {
  const supabase = createClient();
  const router = useRouter();

  const [name, setName] = useState("");
  const [year, setYear] = useState<number | "">("");
  const [saving, setSaving] = useState(false);

  // -----------------------------
  // 1️⃣ 생성
  // -----------------------------
  const handleCreate = async () => {
    if (!name || !year) {
      alert("기수 이름과 연도를 입력하세요.");
      return;
    }

    setSaving(true);

    // 시퀀스 동기화 시도 (에러 발생 시)
    const { data, error } = await supabase
      .from("generations")
      .insert({
        name,
        year,
      })
      .select();

    if (error) {
      setSaving(false);
      console.error("기수 생성 에러:", error);
      
      // 중복 키 에러인 경우 시퀀스 동기화 안내
      if (error.code === "23505") {
        alert(
          `기수 추가 실패: 중복 키 에러\n\n` +
          `데이터베이스 시퀀스가 테이블의 최대 id와 동기화되지 않았습니다.\n\n` +
          `해결 방법:\n` +
          `1. Supabase 대시보드 → SQL Editor로 이동\n` +
          `2. 다음 SQL을 실행:\n\n` +
          `SELECT setval('generations_id_seq', COALESCE((SELECT MAX(id) FROM generations), 1), true);\n\n` +
          `3. 다시 기수 추가를 시도하세요.\n\n` +
          `또는 supabase/fix_generations_sequence.sql 파일을 참고하세요.`
        );
      } else {
        alert(`기수 추가 실패: ${error.message}\n\n에러 코드: ${error.code || "N/A"}`);
      }
      return;
    }

    setSaving(false);
    alert("기수가 추가되었습니다.");
    router.push("/posts/projects");
  };

  // -----------------------------
  // UI
  // -----------------------------
  return (
    <div className="max-w-xl space-y-6 p-6">
      <h1 className="text-2xl font-bold">기수 추가</h1>

      <div className="space-y-4">
        <div>
          <label className="text-sm font-medium">기수 이름</label>
          <Input
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="예: 3기"
          />
        </div>

        <div>
          <label className="text-sm font-medium">연도</label>
          <Input
            type="number"
            value={year}
            onChange={(e) => setYear(Number(e.target.value))}
            placeholder="예: 2025"
          />
        </div>
      </div>

      <div className="flex justify-between pt-4">
        <Button
          variant="outline"
          onClick={() => router.back()}
        >
          취소
        </Button>

        <Button
          onClick={handleCreate}
          disabled={saving}
        >
          {saving ? "저장 중..." : "추가"}
        </Button>
      </div>
    </div>
  );
}