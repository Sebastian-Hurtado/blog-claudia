import Container from "@/components/ui/Container";
import { SITE_CONFIG, SOCIAL_LINKS } from "@/lib/constants";

/* ============================================
   Footer Component
   ============================================ */

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="w-full bg-primary-dark text-white mt-10">
      <Container>
        <div className="py-8 grid grid-cols-1 gap-7 md:grid-cols-2 md:items-start">
          {/* Columna 1: Info */}
          <div>
            <h3 className="text-base font-bold text-white mb-2">
              {SITE_CONFIG.owner}
            </h3>
            <p className="text-sm text-white/70 leading-relaxed max-w-sm">
              {SITE_CONFIG.description}
            </p>
          </div>

          {/* Columna 2: Redes sociales */}
          <div className="md:text-right">
            <h3 className="text-base font-bold text-white mb-3">
              Sígueme
            </h3>
            <div className="flex flex-wrap gap-x-4 gap-y-2 md:justify-end">
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
        <div className="border-t border-white/20 py-3">
          <p className="text-center text-xs text-white/50">
            &copy; {currentYear} {SITE_CONFIG.owner}. Todos los derechos reservados.
          </p>
        </div>
      </Container>
    </footer>
  );
}
