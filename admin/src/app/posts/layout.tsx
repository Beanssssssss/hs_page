import { PostsNav } from "@/components/layout/posts-nav";

export default function PostsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="space-y-6">
      <PostsNav />
      {children}
    </div>
  );
}