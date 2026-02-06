# Vercel 배포 설정

이 저장소는 **pnpm 모노레포**이며, 배포할 웹 앱은 `apps/www`에 있습니다.

## 필수 설정 (Vercel 대시보드)

1. **Project Settings** → **General**
2. **Root Directory**를 **`apps/www`**로 설정하고 **Edit** 후 **Save**

이렇게 하면 Vercel이 `apps/www`를 프로젝트 루트로 인식하고, 상위 디렉터리의 `pnpm-workspace.yaml`을 사용해 의존성을 설치한 뒤 `next build`를 실행합니다.

## 환경 변수

- Supabase 등을 쓰는 경우 **Settings** → **Environment Variables**에 필요한 변수를 추가하세요.
  - `NEXT_PUBLIC_SUPABASE_URL`
  - `NEXT_PUBLIC_SUPABASE_ANON_KEY`

## 로컬 빌드 확인

배포 전 로컬에서 빌드가 되는지 확인:

```bash
pnpm install
pnpm --filter www build
```
