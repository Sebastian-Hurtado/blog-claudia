/* ============================================
   Container Component
   Contenedor reutilizable con ancho máximo
   Principio: Single Responsibility
   ============================================ */

interface ContainerProps {
  children: React.ReactNode;
  className?: string;
  as?: "div" | "section" | "article" | "main";
}

export default function Container({
  children,
  className = "",
  as: Tag = "div",
}: ContainerProps) {
  return (
    <Tag className={`w-full max-w-[1200px] mx-auto px-6 md:px-8 ${className}`}>
      {children}
    </Tag>
  );
}
