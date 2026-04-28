/* ============================================
   Tipos TypeScript para el Blog
   Principio: Interface Segregation
   Cada tipo es pequeño y específico
   ============================================ */

/** Imagen de Wagtail */
export interface WagtailImage {
  id: number;
  title: string;
  meta: {
    type: string;
    detail_url: string;
    download_url: string;
  };
}

/** Página base de Wagtail */
export interface WagtailPage {
  id: number;
  title: string;
  meta: {
    type: string;
    slug: string;
    detail_url: string;
    html_url: string;
    first_published_at: string;
  };
}

/** Post del blog */
export interface BlogPost extends WagtailPage {
  date: string;
  intro: string;
  body: string;
  main_image: WagtailImage | null;
  tags: string[];
  allow_comments: boolean;
}

/** Noticia publicada en portada */
export interface NewsItem extends WagtailPage {
  date: string;
  summary: string;
  body: string;
  main_image: WagtailImage | null;
}

/** Respuesta paginada de la API de Wagtail */
export interface WagtailPaginatedResponse<T> {
  meta: {
    total_count: number;
  };
  items: T[];
}

/** Enlace de navegación */
export interface NavLink {
  label: string;
  href: string;
}

/** Red social */
export interface SocialLink {
  name: string;
  href: string;
  icon: "facebook" | "twitter" | "instagram" | "linkedin" | "youtube";
}

/** Info de contacto */
export interface ContactInfo {
  email?: string;
  phone?: string;
  address?: string;
}

/** Comentario de blog */
export interface Comment {
  id: number;
  post: number;
  author_name: string;
  author_email: string;
  author_image: string;
  content: string;
  created_at: string;
}

export interface CommentSubmissionResponse {
  id: number;
  status: "pending";
  message: string;
}

export interface ConsultationSubmissionResponse {
  id: number;
  status: "pending" | "in_review" | "resolved" | "rejected";
  message: string;
}

export interface ConsultationRequestSummary {
  id: number;
  subject: string;
  status: "pending" | "in_review" | "resolved" | "rejected";
  status_label: string;
  created_at: string;
}

/** Payload para crear un comentario */
export interface CommentCreatePayload {
  post_slug: string;
  author_name: string;
  author_email: string;
  author_image?: string;
  content: string;
}
