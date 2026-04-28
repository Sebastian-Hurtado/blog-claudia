import Container from "@/components/ui/Container";
import BlogList from "@/components/blog/BlogList";
import { getBlogPosts } from "@/lib/api";

/* ============================================
   Página del Blog — Listado de posts
   Server Component: hace fetch en el servidor
   ============================================ */

export const metadata = {
  title: "Blog | Claudia",
  description: "Artículos y publicaciones del blog de Claudia.",
};

export default async function BlogPage() {
  let posts: import("@/lib/types").BlogPost[] = [];

  try {
    posts = await getBlogPosts();
  } catch {
    // Si el backend no está disponible, mostramos lista vacía
    console.error("No se pudo conectar con el backend");
  }

  return (
    <section className="py-12">
      <Container>
        <div className="mb-12 text-center">
          <h1 className="text-4xl font-bold text-heading mb-3">Blog</h1>
          <p className="text-body">
            Artículos, reflexiones y análisis sobre derecho y educación.
          </p>
          <div className="mt-4 w-16 h-1 bg-primary mx-auto rounded-full" />
        </div>
        <BlogList posts={posts} />
      </Container>
    </section>
  );
}
