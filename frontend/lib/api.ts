import type {
  BlogPost,
  NewsItem,
  WagtailPaginatedResponse,
  Comment,
  CommentCreatePayload,
  CommentSubmissionResponse,
  ConsultationRequestSummary,
  ConsultationSubmissionResponse,
  GuestPostSubmissionResponse,
  GuestPostSubmissionSummary,
} from "./types";
import { API_BASE_URL, API_ENDPOINTS, SECTION_TAGS } from "./constants";

/* ============================================
   Cliente API para Wagtail
   Principio: Single Responsibility
   Solo se encarga de comunicación con el backend
   ============================================ */

/**
 * Convierte URLs de media relativas a absolutas.
 * Ej: "/media/original_images/foto.png" → "http://127.0.0.1:8000/media/original_images/foto.png"
 */
export function getMediaUrl(url: string): string {
  if (!url) return "";
  if (url.startsWith("http")) return url;
  return `${API_BASE_URL}${url}`;
}

/**
 * Fetch genérico con manejo de errores
 */
async function fetchAPI<T>(url: string): Promise<T> {
  const res = await fetch(url, {
    next: { revalidate: 60 }, // ISR: revalida cada 60 segundos
  });

  if (!res.ok) {
    throw new Error(`Error al obtener datos: ${res.status} ${res.statusText}`);
  }

  return res.json();
}

/**
 * Obtener posts del blog general (excluyendo los de secciones específicas)
 */
export async function getBlogPosts(): Promise<BlogPost[]> {
  const excludeTags = SECTION_TAGS.join(",");
  const url = `${API_ENDPOINTS.pages}?type=blog.BlogPage&fields=date,intro,body,main_image,tags,author_display_name,allow_comments&exclude_tags=${encodeURIComponent(excludeTags)}&order=-date`;
  const data = await fetchAPI<WagtailPaginatedResponse<BlogPost>>(url);
  return data.items;
}

/**
 * Obtener posts filtrados por tag (ej: "madres-comunitarias")
 */
export async function getBlogPostsByTag(tag: string): Promise<BlogPost[]> {
  const url = `${API_ENDPOINTS.pages}?type=blog.BlogPage&fields=date,intro,body,main_image,tags,author_display_name,allow_comments&tags=${encodeURIComponent(tag)}&order=-date`;
  const data = await fetchAPI<WagtailPaginatedResponse<BlogPost>>(url);
  return data.items;
}

/**
 * Obtener un post por su slug
 */
export async function getBlogPostBySlug(
  slug: string
): Promise<BlogPost | null> {
  const url = `${API_ENDPOINTS.pages}?type=blog.BlogPage&slug=${slug}&fields=date,intro,body,main_image,author_display_name,allow_comments`;
  const data = await fetchAPI<WagtailPaginatedResponse<BlogPost>>(url);
  return data.items[0] ?? null;
}

/**
 * Obtener un post por su ID
 */
export async function getBlogPostById(id: number): Promise<BlogPost> {
  const url = `${API_ENDPOINTS.pages}${id}/?fields=date,intro,body,main_image,author_display_name,allow_comments`;
  return fetchAPI<BlogPost>(url);
}

/**
 * Obtener las noticias mas recientes para la portada.
 */
export async function getLatestNews(limit = 3): Promise<NewsItem[]> {
  const url = `${API_ENDPOINTS.pages}?type=blog.NewsPage&fields=date,summary,body,main_image&order=-date&limit=${limit}`;
  const data = await fetchAPI<WagtailPaginatedResponse<NewsItem>>(url);
  return data.items;
}

/**
 * Obtener una noticia por su slug.
 */
export async function getNewsBySlug(slug: string): Promise<NewsItem | null> {
  const url = `${API_ENDPOINTS.pages}?type=blog.NewsPage&slug=${slug}&fields=date,summary,body,main_image`;
  const data = await fetchAPI<WagtailPaginatedResponse<NewsItem>>(url);
  return data.items[0] ?? null;
}

/**
 * Verificar la salud del backend
 */
export async function checkHealth(): Promise<{ status: string }> {
  return fetchAPI<{ status: string }>(API_ENDPOINTS.health);
}

// ============================================
// Comentarios
// ============================================

/**
 * Obtener comentarios aprobados de un post por su slug
 */
export async function getCommentsBySlug(slug: string): Promise<Comment[]> {
  const url = `${API_BASE_URL}/api/comments/${slug}/`;
  const res = await fetch(url, { cache: "no-store" });
  if (!res.ok) return [];
  return res.json();
}

/**
 * Crear un comentario (requiere sesión de Google)
 */
export async function createComment(
  payload: CommentCreatePayload
): Promise<CommentSubmissionResponse> {
  const url = `${API_BASE_URL}/api/comments/`;
  const res = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });

  if (!res.ok) {
    const error = await res.json().catch(() => ({}));
    throw new Error(error.error ?? "Error al crear comentario");
  }

  return res.json();
}

/**
 * Crear una solicitud de consultoria.
 */
export async function createConsultationRequest(
  formData: FormData
): Promise<ConsultationSubmissionResponse> {
  const res = await fetch("/api/consultoria", {
    method: "POST",
    body: formData,
  });

  const payload = await res.json().catch(() => ({}));
  if (!res.ok) {
    throw new Error(payload.error ?? "Error al crear la solicitud de consultoria");
  }

  return payload;
}

export async function getMyConsultationRequests(): Promise<
  ConsultationRequestSummary[]
> {
  const res = await fetch("/api/consultoria", {
    method: "GET",
    cache: "no-store",
  });

  const payload = await res.json().catch(() => ([]));
  if (!res.ok) {
    throw new Error(payload.error ?? "Error al cargar tus solicitudes");
  }

  return payload;
}

export async function createGuestPostSubmission(
  formData: FormData
): Promise<GuestPostSubmissionResponse> {
  const res = await fetch("/api/publicar", {
    method: "POST",
    body: formData,
  });

  const payload = await res.json().catch(() => ({}));
  if (!res.ok) {
    throw new Error(payload.error ?? "Error al enviar el articulo");
  }

  return payload;
}

export async function getMyGuestPostSubmissions(): Promise<
  GuestPostSubmissionSummary[]
> {
  const res = await fetch("/api/publicar", {
    method: "GET",
    cache: "no-store",
  });

  const payload = await res.json().catch(() => ([]));
  if (!res.ok) {
    throw new Error(payload.error ?? "Error al cargar tus articulos enviados");
  }

  return payload;
}
