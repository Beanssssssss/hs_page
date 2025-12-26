import { supabase } from "@/lib/supabase";

export default function Home() {
  return (
    <div className="min-h-screen bg-background">
      <h1 className="text-3xl font-bold">
        여기가 랜딩페이지
      </h1>

      <p className="mt-4 text-gray-500">
        헤이트슬롭 동아리 소개 사이트입니다.
      </p>
    </div>
  );
}