import type { Comment } from "@/lib/types";

/* ============================================
   Elemento individual de comentario
   ============================================ */

interface CommentItemProps {
  comment: Comment;
}

export default function CommentItem({ comment }: CommentItemProps) {
  const formattedDate = new Date(comment.created_at).toLocaleDateString("es-ES", {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });

  return (
    <div className="flex gap-4 py-5 border-b border-border last:border-b-0">
      {/* Avatar */}
      <div className="flex-shrink-0">
        {comment.author_image ? (
          <img
            src={comment.author_image}
            alt={comment.author_name}
            className="w-10 h-10 rounded-full"
            referrerPolicy="no-referrer"
          />
        ) : (
          <div className="w-10 h-10 rounded-full bg-primary text-white flex items-center justify-center font-semibold text-sm">
            {comment.author_name.charAt(0).toUpperCase()}
          </div>
        )}
      </div>

      {/* Contenido */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 mb-1">
          <span className="font-semibold text-heading text-sm">
            {comment.author_name}
          </span>
          <time className="text-xs text-muted">{formattedDate}</time>
        </div>
        <p className="text-body text-sm leading-relaxed whitespace-pre-line">
          {comment.content}
        </p>
      </div>
    </div>
  );
}
