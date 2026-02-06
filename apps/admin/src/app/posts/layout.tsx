import { PostsNav } from "@/components/layout/posts-nav";

export default function PostsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <PostsNav />
      {children}
    </>
  );
}