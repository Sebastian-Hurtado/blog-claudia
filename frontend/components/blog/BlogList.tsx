import type { BlogPost } from "@/lib/types";
import BlogCard from "./BlogCard";

/* ============================================
   BlogList Component
   Renderiza una grilla de BlogCards.
   Principio: Single Responsibility
   ============================================ */

interface BlogListProps {
  posts: BlogPost[];
}

export default function BlogList({ posts }: BlogListProps) {
  if (posts.length === 0) {
    return (
      <div className="text-center py-16">
        <p className="text-muted text-lg">
          Aún no hay publicaciones. ¡Vuelve pronto!
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
      {posts.map((post) => (
        <BlogCard key={post.id} post={post} />
      ))}
    </div>
  );
}
