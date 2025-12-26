import { supabase } from "@/lib/supabase";

export default function IntroPage() {
  return (
    <div>
      <h1 className="text-2xl font-bold">동아리 소개</h1>

      <p className="mt-4">
        헤이트슬롭은 프로젝트 중심으로 운영되는 동아리입니다.
      </p>
    </div>
  );
}