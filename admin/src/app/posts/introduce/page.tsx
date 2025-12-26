"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase";
import IntroduceEditor from "./introduce-editor";
import IntroduceMedia from "./introduce-media";
import { Button } from "@/components/ui/button";

export default function IntroducePage() {
  const supabase = createClient();

  const [introduce, setIntroduce] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      const { data } = await supabase
        .from("introduce")
        .select("*")
        .limit(1)
        .maybeSingle();

      setIntroduce(data);
      setLoading(false);
    };

    fetchData();
  }, []);

  if (loading) return <p>로딩 중...</p>;

  // ❌ introduce 없음
  if (!introduce) {
    return (
      <div className="space-y-6">
        <h1 className="text-3xl font-bold">Introduce 관리</h1>
        <p>아직 소개글이 없습니다.</p>
        <Button onClick={() => setEditing(true)}>새로 작성</Button>

        {editing && (
          <IntroduceEditor
            mode="create"
            onSaved={() => location.reload()}
          />
        )}
      </div>
    );
  }

  // ✅ introduce 있음
  return (
    <div className="space-y-8 max-w-4xl">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Introduce 관리</h1>
        <Button variant="outline" onClick={() => setEditing(!editing)}>
          {editing ? "편집 취소" : "수정"}
        </Button>
      </div>

      {editing ? (
        <IntroduceEditor
          mode="edit"
          introduce={introduce}
          onSaved={() => location.reload()}
        />
      ) : (
        <>
          <div>
            <h2 className="text-xl font-semibold">{introduce.title}</h2>
            <p className="mt-4 whitespace-pre-wrap">{introduce.content}</p>
          </div>

          <IntroduceMedia introduceId={introduce.id} />
        </>
      )}
    </div>
  );
}