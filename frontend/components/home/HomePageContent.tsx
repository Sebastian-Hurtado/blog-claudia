import NewsCard from "@/components/news/NewsCard";
import Container from "@/components/ui/Container";
import { getLatestNews } from "@/lib/api";
import type { NewsItem } from "@/lib/types";

export default async function HomePageContent() {
  let latestNews: NewsItem[] = [];

  try {
    latestNews = await getLatestNews();
  } catch {
    console.error("No se pudieron cargar las noticias de la portada");
  }

  return (
    <section className="w-full py-16">
        <Container>
          <div className="max-w-[760px] mb-10">
            <h1 className="text-3xl font-bold text-heading">Noticias</h1>
            <div className="mt-3 w-16 h-1 bg-primary rounded-full" />
            <p className="mt-4 text-body">
              Novedades, reflexiones y temas de interés general.
            </p>
          </div>

          {latestNews.length > 0 ? (
            <div className="grid gap-8 md:grid-cols-2 xl:grid-cols-3">
              {latestNews.map((news) => (
                <NewsCard key={news.id} news={news} />
              ))}
            </div>
          ) : (
            <div className="rounded-xl border border-dashed border-border bg-surface px-8 py-12 text-center">
              <p className="text-body">
                Aun no hay noticias publicadas para mostrar en la portada.
              </p>
              <p className="mt-2 text-sm text-muted">
                Puedes crearlas desde Wagtail en Inicio &gt; Noticias.
              </p>
            </div>
          )}
        </Container>
    </section>
  );
}
