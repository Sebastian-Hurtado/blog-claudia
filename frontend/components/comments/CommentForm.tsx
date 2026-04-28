"use client";

import { useSession, signIn } from "next-auth/react";
import { useState } from "react";
import { createComment } from "@/lib/api";

/* ============================================
   Formulario de Comentario
   Requiere autenticación con Google.
   ============================================ */

interface CommentFormProps {
  postSlug: string;
  onCommentAdded: () => void;
}

export default function CommentForm({ postSlug, onCommentAdded }: CommentFormProps) {
  const { data: session, status } = useSession();
  const [content, setContent] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  // Si no está autenticado, mostrar botón de login
  if (status === "loading") {
    return (
      <div className="animate-pulse bg-surface rounded-lg p-6">
        <div className="h-4 bg-border rounded w-1/3 mb-4" />
        <div className="h-20 bg-border rounded" />
      </div>
    );
  }

  if (!session) {
    return (
      <div className="bg-surface rounded-lg p-6 text-center border border-border">
        <p className="text-body mb-4">
          Inicia sesión con Google para dejar un comentario.
        </p>
        <button
          onClick={() => signIn("google")}
          className="inline-flex items-center gap-3 px-6 py-3 rounded-md bg-white border border-border shadow-sm hover:shadow-md transition-all text-heading font-medium"
        >
          <svg className="w-5 h-5" viewBox="0 0 24 24">
            <path
              d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z"
              fill="#4285F4"
            />
            <path
              d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
              fill="#34A853"
            />
            <path
              d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
              fill="#FBBC05"
            />
            <path
              d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
              fill="#EA4335"
            />
          </svg>
          Iniciar sesión con Google
        </button>
      </div>
    );
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!content.trim()) return;

    setIsSubmitting(true);
    setError("");
    setSuccessMessage("");

    try {
      const result = await createComment({
        post_slug: postSlug,
        author_name: session.user?.name ?? "Anónimo",
        author_email: session.user?.email ?? "",
        author_image: session.user?.image ?? "",
        content: content.trim(),
      });
      setContent("");
      setSuccessMessage(result.message);
      onCommentAdded();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error al enviar comentario");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="bg-surface rounded-lg p-6 border border-border">
      <div className="flex items-center gap-3 mb-4">
        {session.user?.image && (
          <img
            src={session.user.image}
            alt={session.user.name ?? ""}
            className="w-8 h-8 rounded-full"
            referrerPolicy="no-referrer"
          />
        )}
        <span className="text-sm font-medium text-heading">
          {session.user?.name}
        </span>
      </div>

      <textarea
        value={content}
        onChange={(e) => setContent(e.target.value)}
        rows={3}
        required
        maxLength={2000}
        placeholder="Escribe tu comentario..."
        className="w-full px-4 py-3 rounded-md border border-border bg-white text-heading focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all resize-y"
      />

      {error && (
        <p className="mt-2 text-sm text-red-600">{error}</p>
      )}

      {successMessage && (
        <p className="mt-2 text-sm text-green-700">{successMessage}</p>
      )}

      <div className="mt-3 flex justify-end">
        <button
          type="submit"
          disabled={isSubmitting || !content.trim()}
          className="px-5 py-2 rounded-md bg-primary text-white font-semibold text-sm hover:bg-primary-light focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isSubmitting ? "Enviando..." : "Comentar"}
        </button>
      </div>
    </form>
  );
}
