import Link from "next/link";
import Image from "next/image";
import { SITE_CONFIG } from "@/lib/constants";

/* ============================================
   Logo Component
   ============================================ */

export default function Logo() {
  return (
    <Link href="/inicio" className="flex items-center gap-2 group shrink-0">
      <Image
        src="/logo-blog.png"
        alt={`Logo de ${SITE_CONFIG.owner}`}
        width={42}
        height={42}
        className="rounded-full transition-transform group-hover:scale-105"
        priority
      />

      {/* Nombre del blog */}
      <span className="text-white text-base font-bold tracking-normal sm:text-lg lg:text-xl">
        {SITE_CONFIG.name}
      </span>
    </Link>
  );
}
