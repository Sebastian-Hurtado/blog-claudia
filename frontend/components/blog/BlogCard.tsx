import Link from "next/link";
import type { BlogPost } from "@/lib/types";
import { getMediaUrl } from "@/lib/api";

interface BlogCardProps {
  post: BlogPost;
}

export default function BlogCard({ post }: BlogCardProps) {
  const formattedDate = new Date(post.date).toLocaleDateString("es-ES", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  return (
    <article className="bg-white rounded-lg overflow-hidden border border-border shadow-sm hover:shadow-lg transition-shadow duration-300 group">
      {/* Imagen destacada */}
      {post.main_image && (
        <div className="aspect-video overflow-hidden bg-surface">
          <img
            src={getMediaUrl(post.main_image.meta.download_url)}
            alt={post.main_image.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          />
        </div>
      )}

      {/* Contenido */}
      <div className="p-6">
        <time dateTime={post.date} className="text-xs uppercase tracking-wider text-muted font-medium">
          {formattedDate}
        </time>

        <h2 className="mt-2 text-xl font-bold text-heading group-hover:text-primary transition-colors">
          <Link href={`/blog/${post.meta.slug}`}>{post.title}</Link>
        </h2>

        {post.intro && (
          <p className="mt-2 text-sm text-body line-clamp-3">{post.intro}</p>
        )}

        <Link
          href={`/blog/${post.meta.slug}`}
          className="inline-block mt-4 text-sm font-semibold text-primary hover:text-primary-light transition-colors"
        >
          Leer más →
        </Link>
      </div>
    </article>
  );
}
