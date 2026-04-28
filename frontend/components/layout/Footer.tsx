import Container from "@/components/ui/Container";
import { SITE_CONFIG, NAV_LINKS, SOCIAL_LINKS } from "@/lib/constants";
import Link from "next/link";

/* ============================================
   Footer Component
   ============================================ */

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="w-full bg-primary-dark text-white mt-16">
      <Container>
        <div className="py-12 grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Columna 1: Info */}
          <div>
            <h3 className="text-lg font-bold text-white mb-3">
              {SITE_CONFIG.owner}
            </h3>
            <p className="text-sm text-white/70 leading-relaxed">
              {SITE_CONFIG.description}
            </p>
          </div>

          {/* Columna 2: Enlaces */}
          <div>
            <h3 className="text-lg font-bold text-white mb-3">
              Navegación
            </h3>
            <ul className="space-y-2">
              {NAV_LINKS.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-white/70 hover:text-gold transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Columna 3: Redes sociales */}
          <div>
            <h3 className="text-lg font-bold text-white mb-3">
              Sígueme
            </h3>
            <div className="flex gap-4">
              {SOCIAL_LINKS.map((link) => (
                <a
                  key={link.name}
                  href={link.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm text-white/70 hover:text-gold transition-colors"
                >
                  {link.name}
                </a>
              ))}
            </div>
          </div>
        </div>

        {/* Copyright */}
        <div className="border-t border-white/20 py-4">
          <p className="text-center text-xs text-white/50">
            &copy; {currentYear} {SITE_CONFIG.owner}. Todos los derechos reservados.
          </p>
        </div>
      </Container>
    </footer>
  );
}
