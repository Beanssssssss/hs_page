import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";

export async function updateSession(request: NextRequest) {
  let response = NextResponse.next({
    request: {
      headers: request.headers,
    },
  });

  // Supabase 서버 클라이언트 생성
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value, options }) => {
            request.cookies.set(name, value);
          });

          response = NextResponse.next({ request });

          cookiesToSet.forEach(({ name, value, options }) => {
            response.cookies.set(name, value, options);
          });
        },
      },
    }
  );

  // 🔑 현재 로그인 유저 확인 (쿠키 기반)
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const pathname = request.nextUrl.pathname;

  // --------------------------------------------------
  // 1️⃣ 로그인 페이지는 항상 통과
  // --------------------------------------------------
  if (pathname === "/login") {
    return response;
  }

  // --------------------------------------------------
  // 2️⃣ admin 영역 접근인데 로그인 안 했으면 → /login
  // --------------------------------------------------
  if (!user) {
    const url = request.nextUrl.clone();
    url.pathname = "/login";
    return NextResponse.redirect(url);
  }

  // --------------------------------------------------
  // 3️⃣ 로그인 돼 있으면 그대로 통과
  // --------------------------------------------------
  return response;
}