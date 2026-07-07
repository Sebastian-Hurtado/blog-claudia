"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { NAV_LINKS } from "@/lib/constants";

/* ============================================
   Navbar Component
   ============================================ */

export default function Navbar() {
  const pathname = usePathname();

  return (
    <nav className="flex items-center gap-3 lg:gap-4 xl:gap-5">
      {NAV_LINKS.map((link) => {
        const isActive =
          pathname === link.href ||
          (link.href !== "/" && pathname.startsWith(link.href));

        return (
          <Link
            key={link.href}
            href={link.href}
            className={`text-[11px] lg:text-xs xl:text-sm font-medium tracking-normal transition-all duration-200 border-b-2 pb-1 leading-tight text-center max-w-[150px] ${
              isActive
                ? "text-gold border-gold"
                : "text-white border-transparent hover:text-gold hover:border-gold-light"
            }`}
          >
            {link.label}
          </Link>
        );
      })}
    </nav>
  );
}
