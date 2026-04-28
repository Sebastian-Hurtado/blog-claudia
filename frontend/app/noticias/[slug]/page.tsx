import Link from "next/link";
import { notFound } from "next/navigation";

import Container from "@/components/ui/Container";
import { getMediaUrl, getNewsBySlug } from "@/lib/api";

interface Props {
  params: Promise<{ slug: string }>;
}

export default async function NewsDetailPage({ params }: Props) {
  const { slug } = await params;

  let news;
  try {
    news = await getNewsBySlug(slug);
  } catch {
    notFound();
  }

  if (!news) {
    notFound();
  }

  const formattedDate = new Date(news.date).toLocaleDateString("es-ES", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  return (
    <article className="py-12">
      <Container>
        <nav className="mb-8 text-sm text-muted">
          <Link href="/" className="hover:text-primary">
            Inicio
          </Link>
          <span className="mx-2">/</span>
          <span>Noticias</span>
          <span className="mx-2">/</span>
          <span className="text-body">{news.title}</span>
        </nav>

        <div className="max-w-3xl mx-auto">
          {news.main_image && (
            <div className="rounded-lg overflow-hidden mb-8 shadow-md">
              <img
                src={getMediaUrl(news.main_image.meta.download_url)}
                alt={news.main_image.title}
                className="w-full h-auto"
              />
            </div>
          )}

          <time
            dateTime={news.date}
            className="text-sm uppercase tracking-wider text-muted font-medium"
          >
            {formattedDate}
          </time>

          <h1 className="text-3xl md:text-4xl font-bold mt-2 mb-4 text-heading">
            {news.title}
          </h1>

          <p className="text-lg text-body mb-8 italic border-l-4 border-primary pl-4">
            {news.summary}
          </p>

          {news.body ? (
            <div
              className="prose"
              dangerouslySetInnerHTML={{ __html: news.body }}
            />
          ) : (
            <p className="text-body">
              Esta noticia no tiene contenido adicional publicado.
            </p>
          )}
        </div>
      </Container>
    </article>
  );
}
