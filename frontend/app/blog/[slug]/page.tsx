import Container from "@/components/ui/Container";
import { getBlogPostBySlug, getMediaUrl } from "@/lib/api";
import { notFound } from "next/navigation";
import Link from "next/link";
import CommentSection from "@/components/comments/CommentSection";

/* ============================================
   Página de Post Individual
   Renderiza un post completo del blog.
   ============================================ */

interface Props {
  params: Promise<{ slug: string }>;
}

export default async function BlogPostPage({ params }: Props) {
  const { slug } = await params;

  let post;
  try {
    post = await getBlogPostBySlug(slug);
  } catch {
    notFound();
  }

  if (!post) {
    notFound();
  }

  const formattedDate = new Date(post.date).toLocaleDateString("es-ES", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  return (
    <article className="py-12">
      <Container>
        {/* Breadcrumb */}
        <nav className="mb-8 text-sm text-muted">
          <Link href="/" className="hover:text-primary">Inicio</Link>
          <span className="mx-2">/</span>
          <Link href="/blog" className="hover:text-primary">Blog</Link>
          <span className="mx-2">/</span>
          <span className="text-body">{post.title}</span>
        </nav>

        <div className="max-w-3xl mx-auto">
          {post.main_image && (
            <div className="rounded-lg overflow-hidden mb-8 shadow-md">
              <img
                src={getMediaUrl(post.main_image.meta.download_url)}
                alt={post.main_image.title}
                className="w-full h-auto"
              />
            </div>
          )}

          <time dateTime={post.date} className="text-sm uppercase tracking-wider text-muted font-medium">
            {formattedDate}
          </time>

          <h1 className="text-3xl md:text-4xl font-bold mt-2 mb-4 text-heading">
            {post.title}
          </h1>

          {post.author_display_name && (
            <p className="mb-6 text-sm font-medium text-muted">
              Por {post.author_display_name}
            </p>
          )}

          {post.intro && (
            <p className="text-lg text-body mb-8 italic border-l-4 border-primary pl-4">
              {post.intro}
            </p>
          )}

          <div className="prose" dangerouslySetInnerHTML={{ __html: post.body }} />

          {/* Sección de comentarios */}
          <CommentSection
            postSlug={slug}
            allowComments={post.allow_comments}
          />

          <div className="mt-12 pt-8 border-t border-border">
            <Link
              href="/blog"
              className="inline-flex items-center gap-2 text-primary font-semibold hover:text-primary-light transition-colors"
            >
              ← Volver al blog
            </Link>
          </div>
        </div>
      </Container>
    </article>
  );
}
