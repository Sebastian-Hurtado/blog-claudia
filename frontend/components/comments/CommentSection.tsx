"use client";

import { useCallback, useEffect, useState } from "react";
import { getCommentsBySlug } from "@/lib/api";
import type { Comment } from "@/lib/types";
import CommentForm from "./CommentForm";
import CommentItem from "./CommentItem";

/* ============================================
   Sección completa de Comentarios
   Incluye lista + formulario de nuevo comentario.
   ============================================ */

interface CommentSectionProps {
  postSlug: string;
  allowComments: boolean;
}

export default function CommentSection({
  postSlug,
  allowComments,
}: CommentSectionProps) {
  const [comments, setComments] = useState<Comment[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const loadComments = useCallback(async () => {
    setIsLoading(true);
    try {
      const data = await getCommentsBySlug(postSlug);
      setComments(data);
    } catch {
      console.error("Error al cargar comentarios");
    } finally {
      setIsLoading(false);
    }
  }, [postSlug]);

  useEffect(() => {
    loadComments();
  }, [loadComments]);

  return (
    <section className="mt-12 pt-8 border-t border-border">
      <h2 className="text-2xl font-bold text-heading mb-6">
        Comentarios {comments.length > 0 && `(${comments.length})`}
      </h2>

      {/* Formulario */}
      {allowComments ? (
        <CommentForm postSlug={postSlug} onCommentAdded={loadComments} />
      ) : (
        <div className="bg-surface rounded-lg p-6 text-center border border-border">
          <p className="text-body font-medium">
            Los comentarios estan cerrados en esta publicacion.
          </p>
        </div>
      )}

      {/* Lista de comentarios */}
      <div className="mt-8">
        {isLoading ? (
          <div className="space-y-4">
            {[1, 2].map((i) => (
              <div key={i} className="animate-pulse flex gap-4 py-5">
                <div className="w-10 h-10 bg-border rounded-full" />
                <div className="flex-1 space-y-2">
                  <div className="h-4 bg-border rounded w-1/4" />
                  <div className="h-4 bg-border rounded w-3/4" />
                </div>
              </div>
            ))}
          </div>
        ) : comments.length === 0 ? (
          <p className="text-muted text-center py-8">
            No hay comentarios aún. ¡Sé el primero en comentar!
          </p>
        ) : (
          <div>
            {comments.map((comment) => (
              <CommentItem key={comment.id} comment={comment} />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
