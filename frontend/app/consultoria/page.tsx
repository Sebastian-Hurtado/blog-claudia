import Container from "@/components/ui/Container";
import ConsultationForm from "@/components/consultation/ConsultationForm";

export const metadata = {
  title: "Consultoria | Claudia",
  description: "Envía tu solicitud de consultoría legal y revisa su estado.",
};

export default function ConsultationPage() {
  return (
    <section className="py-12">
      <Container>
        <div className="max-w-4xl mx-auto">
          <div className="mb-10 text-center">
            <h1 className="text-4xl font-bold text-heading mb-3">
              Consultoria legal
            </h1>
            <p className="text-body max-w-2xl mx-auto">
              En este espacio puedes enviar tu solicitud de consultoría y hacer
              seguimiento al estado de tus casos desde tu cuenta.
            </p>
            <div className="mt-4 w-16 h-1 bg-primary mx-auto rounded-full" />
          </div>

          <ConsultationForm />
        </div>
      </Container>
    </section>
  );
}
