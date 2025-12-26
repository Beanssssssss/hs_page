import { createBrowserClient } from "@supabase/ssr";

export const createClient = () =>
  //TODO : any > 실제 데이터 타입으로 변경 필요
  createBrowserClient<any>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );
