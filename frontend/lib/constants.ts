import type { NavLink, SocialLink } from "./types";

/* ============================================
   Constantes del sitio
   Centraliza toda la configuracion para
   facilitar cambios futuros
   ============================================ */

/** Informacion del sitio */
export const SITE_CONFIG = {
  name: "Claudia Castellanos",
  owner: "Claudia Castellanos",
  title: "Dra. en Derecho",
  description:
    "Blog profesional de Claudia - Abogada y Profesora especializada en Derecho.",
} as const;

/** Enlaces de navegacion */
export const NAV_LINKS: NavLink[] = [
  { label: "Inicio", href: "/inicio" },
  { label: "Blog", href: "/blog" },
  { label: "Madres Comunitarias", href: "/madres-comunitarias" },
  { label: "Reforma Laboral", href: "/reforma-de-trabajo" },
  {
    label: "Personas privadas de la libertad",
    href: "/persona-privadas-de-la-libertad",
  },
  { label: "Consultoria", href: "/consultoria" },
  { label: "Publicar", href: "/publicar" },
  { label: "Sobre mi", href: "/sobre-mi" },
  { label: "Contacto", href: "/contacto" },
];

/** Redes sociales - edita los hrefs con tus URLs reales */
export const SOCIAL_LINKS: SocialLink[] = [
  { name: "Facebook", href: "https://facebook.com", icon: "facebook" },
  { name: "Twitter", href: "https://twitter.com", icon: "twitter" },
  { name: "Instagram", href: "https://instagram.com", icon: "instagram" },
];

/**
 * Tags de secciones especificas.
 * Los posts con estos tags NO aparecen en Blog general,
 * solo en su seccion correspondiente.
 */
export const SECTION_TAGS = [
  "madres-comunitarias",
  "reforma-de-trabajo",
  "personas-privadas-de-la-libertad",
] as const;

/** URL base del backend */
export const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL ?? "http://127.0.0.1:8000";

/** Endpoints de la API de Wagtail */
export const API_ENDPOINTS = {
  pages: `${API_BASE_URL}/wagtail-api/v2/pages/`,
  images: `${API_BASE_URL}/wagtail-api/v2/images/`,
  health: `${API_BASE_URL}/api/health/`,
} as const;
