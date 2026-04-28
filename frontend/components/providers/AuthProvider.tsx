"use client";

import { SessionProvider } from "next-auth/react";

/* ============================================
   Proveedor de sesión (NextAuth)
   Envuelve la app para acceso al hook useSession
   ============================================ */

export default function AuthProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  return <SessionProvider>{children}</SessionProvider>;
}
