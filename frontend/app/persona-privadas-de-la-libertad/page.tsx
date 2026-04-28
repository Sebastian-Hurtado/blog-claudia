import Container from "@/components/ui/Container";
import BlogList from "@/components/blog/BlogList";
import { getBlogPostsByTag } from "@/lib/api";

/* ============================================
   Página Personas Privadas de la Libertad
   Muestra artículos del blog con tag
   "personas-privadas-de-la-libertad"
   ============================================ */

export const metadata = {
  title: "Personas Privadas de la Libertad | Claudia",
  description:
    "Artículos sobre los derechos de las personas privadas de la libertad.",
};

export default async function PersonasPrivadasPage() {
  let posts: import("@/lib/types").BlogPost[] = [];

  try {
    posts = await getBlogPostsByTag("personas-privadas-de-la-libertad");
  } catch {
    console.error("No se pudo conectar con el backend");
  }

  return (
    <section className="py-12">
      <Container>
        {/* Encabezado */}
        <div className="mb-12 text-center">
          <h1 className="text-4xl font-bold text-heading mb-3">
            Personas Privadas de la Libertad
          </h1>
          <p className="text-body max-w-2xl mx-auto">
            Artículos dedicados a los derechos humanos y la situación
            legal de las personas privadas de la libertad.
          </p>
          <div className="mt-4 w-16 h-1 bg-primary mx-auto rounded-full" />
        </div>

        {/* Listado de artículos */}
        {posts.length > 0 ? (
          <BlogList posts={posts} />
        ) : (
          <div className="text-center py-16">
            <p className="text-muted text-lg">
              Aún no hay artículos publicados en esta categoría.
            </p>
            <p className="text-muted mt-2">
              Pronto habrá contenido disponible. ¡Vuelve pronto!
            </p>
          </div>
        )}
      </Container>
    </section>
  );
}
