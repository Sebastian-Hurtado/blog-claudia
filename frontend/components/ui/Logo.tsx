import Link from "next/link";
import Image from "next/image";
import { SITE_CONFIG } from "@/lib/constants";

/* ============================================
   Logo Component
   ============================================ */

export default function Logo() {
  return (
    <Link href="/inicio" className="flex items-center gap-3 group shrink-0">
      <Image
        src="/logo-blog.png"
        alt={`Logo de ${SITE_CONFIG.owner}`}
        width={50}
        height={50}
        className="rounded-full transition-transform group-hover:scale-105"
        priority
      />

      {/* Nombre del blog */}
      <span className="text-white text-2xl font-bold tracking-wide">
        {SITE_CONFIG.name}
      </span>
    </Link>
  );
}
