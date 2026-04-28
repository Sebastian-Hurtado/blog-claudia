import Container from "@/components/ui/Container";
import BlogList from "@/components/blog/BlogList";
import { getBlogPostsByTag } from "@/lib/api";

/* ============================================
   Página Madres Comunitarias
   Muestra artículos del blog con tag
   "madres-comunitarias"
   ============================================ */

export const metadata = {
  title: "Madres Comunitarias | Claudia",
  description:
    "Artículos, recursos y reflexiones sobre madres comunitarias.",
};

export default async function MadresComunitariasPage() {
  let posts: import("@/lib/types").BlogPost[] = [];

  try {
    posts = await getBlogPostsByTag("madres-comunitarias");
  } catch {
    console.error("No se pudo conectar con el backend");
  }

  return (
    <section className="py-12">
      <Container>
        {/* Encabezado */}
        <div className="mb-12 text-center">
          <h1 className="text-4xl font-bold text-heading mb-3">
            Madres Comunitarias
          </h1>
          <p className="text-body max-w-2xl mx-auto">
            Artículos dedicados a las madres comunitarias: sus derechos,
            su labor y los recursos legales disponibles para ellas.
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
