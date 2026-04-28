import Logo from "@/components/ui/Logo";
import Navbar from "@/components/layout/Navbar";
import MobileMenu from "@/components/layout/MobileMenu";
import Container from "@/components/ui/Container";

/* ============================================
   Header / Banner Component
   Banner principal burgundy del blog.
   ============================================ */

export default function Header() {
  return (
    <header className="w-full bg-primary shadow-lg sticky top-0 z-40">
      <Container className="max-w-[1440px]">
        <div className="flex items-center justify-between min-h-20 py-4 gap-8">
          <Logo />

          <div className="hidden md:flex flex-1 justify-end pl-4 lg:pl-8">
            <Navbar />
          </div>

          <MobileMenu />
        </div>
      </Container>
    </header>
  );
}
