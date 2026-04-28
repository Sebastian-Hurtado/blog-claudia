import Link from "next/link";

import { getMediaUrl } from "@/lib/api";
import type { NewsItem } from "@/lib/types";

interface NewsCardProps {
  news: NewsItem;
}

export default function NewsCard({ news }: NewsCardProps) {
  const formattedDate = new Date(news.date).toLocaleDateString("es-ES", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  return (
    <article className="bg-white rounded-lg overflow-hidden border border-border shadow-sm hover:shadow-lg transition-shadow duration-300 group">
      {news.main_image && (
        <div className="aspect-video overflow-hidden bg-surface">
          <img
            src={getMediaUrl(news.main_image.meta.download_url)}
            alt={news.main_image.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          />
        </div>
      )}

      <div className="p-6">
        <time
          dateTime={news.date}
          className="text-xs uppercase tracking-wider text-muted font-medium"
        >
          {formattedDate}
        </time>

        <h2 className="mt-2 text-xl font-bold text-heading group-hover:text-primary transition-colors">
          <Link href={`/noticias/${news.meta.slug}`}>{news.title}</Link>
        </h2>

        <p className="mt-3 text-sm text-body line-clamp-3">{news.summary}</p>

        <Link
          href={`/noticias/${news.meta.slug}`}
          className="inline-block mt-4 text-sm font-semibold text-primary hover:text-primary-light transition-colors"
        >
          Leer mas →
        </Link>
      </div>
    </article>
  );
}
