import GuestPostForm from "@/components/guest-posts/GuestPostForm";
import Container from "@/components/ui/Container";

export const metadata = {
  title: "Publicar | Blog Claudia",
  description:
    "Envia un articulo invitado para revision editorial en el blog.",
};

export default function PublicarPage() {
  return (
    <section className="py-16">
      <Container>
        <div className="max-w-4xl mx-auto">
          <div className="mb-10 text-center">
            <p className="text-sm uppercase tracking-[0.25em] text-primary font-semibold">
              Participa en el blog
            </p>
            <h1 className="mt-3 text-3xl md:text-5xl font-bold text-heading">
              Envia tu articulo invitado
            </h1>
            <p className="mt-4 text-body text-lg leading-8">
              Comparte una reflexion o aporte para el blog. Todas las
              propuestas pasan por revision editorial antes de publicarse.
            </p>
          </div>

          <GuestPostForm />
        </div>
      </Container>
    </section>
  );
}
