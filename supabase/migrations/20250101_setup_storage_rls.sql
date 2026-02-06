-- Storage 버킷 'hateslop_data'에 대한 RLS 정책 설정
-- 인증된 사용자가 파일을 업로드, 읽기, 삭제할 수 있도록 설정

-- 1. 버킷이 존재하는지 확인하고, 없으면 생성 (수동으로 Supabase 대시보드에서 생성해야 함)
-- Storage > Buckets > New bucket > 이름: hateslop_data, Public: true

-- 2. 인증된 사용자가 파일 업로드 가능
CREATE POLICY "인증된 사용자 업로드 허용"
ON storage.objects
FOR INSERT
TO authenticated
WITH CHECK (
  bucket_id = 'hateslop_data'
);

-- 3. 인증된 사용자가 파일 읽기 가능
CREATE POLICY "인증된 사용자 읽기 허용"
ON storage.objects
FOR SELECT
TO authenticated
USING (
  bucket_id = 'hateslop_data'
);

-- 4. 인증된 사용자가 파일 업데이트 가능
CREATE POLICY "인증된 사용자 업데이트 허용"
ON storage.objects
FOR UPDATE
TO authenticated
USING (
  bucket_id = 'hateslop_data'
)
WITH CHECK (
  bucket_id = 'hateslop_data'
);

-- 5. 인증된 사용자가 파일 삭제 가능
CREATE POLICY "인증된 사용자 삭제 허용"
ON storage.objects
FOR DELETE
TO authenticated
USING (
  bucket_id = 'hateslop_data'
);

-- 6. 공개 읽기 허용 (선택사항 - 공개 버킷인 경우)
CREATE POLICY "공개 읽기 허용"
ON storage.objects
FOR SELECT
TO public
USING (
  bucket_id = 'hateslop_data'
);
