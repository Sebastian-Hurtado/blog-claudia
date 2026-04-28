import Container from "@/components/ui/Container";

/* ============================================
   Página de Contacto
   ============================================ */

export const metadata = {
  title: "Contacto | Claudia",
  description: "Ponte en contacto con Claudia.",
};

export default function ContactoPage() {
  return (
    <section className="py-12">
      <Container>
        <div className="max-w-2xl mx-auto">
          <div className="mb-12 text-center">
            <h1 className="text-4xl font-bold text-heading mb-3">Contacto</h1>
            <p className="text-body">
              ¿Tienes alguna pregunta o propuesta? No dudes en escribirme.
            </p>
            <div className="mt-4 w-16 h-1 bg-primary mx-auto rounded-full" />
          </div>

          <form className="space-y-6">
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-heading mb-1">
                Nombre
              </label>
              <input
                type="text"
                id="name"
                name="name"
                required
                className="w-full px-4 py-3 rounded-md border border-border bg-white text-heading focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
                placeholder="Tu nombre"
              />
            </div>

            <div>
              <label htmlFor="email" className="block text-sm font-medium text-heading mb-1">
                Email
              </label>
              <input
                type="email"
                id="email"
                name="email"
                required
                className="w-full px-4 py-3 rounded-md border border-border bg-white text-heading focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
                placeholder="tu@email.com"
              />
            </div>

            <div>
              <label htmlFor="subject" className="block text-sm font-medium text-heading mb-1">
                Asunto
              </label>
              <input
                type="text"
                id="subject"
                name="subject"
                required
                className="w-full px-4 py-3 rounded-md border border-border bg-white text-heading focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
                placeholder="Asunto del mensaje"
              />
            </div>

            <div>
              <label htmlFor="message" className="block text-sm font-medium text-heading mb-1">
                Mensaje
              </label>
              <textarea
                id="message"
                name="message"
                rows={5}
                required
                className="w-full px-4 py-3 rounded-md border border-border bg-white text-heading focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all resize-y"
                placeholder="Escribe tu mensaje aquí..."
              />
            </div>

            <button
              type="submit"
              className="w-full px-6 py-3 rounded-md bg-primary text-white font-semibold text-sm uppercase tracking-wider hover:bg-primary-light focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 transition-colors shadow-md"
            >
              Enviar mensaje
            </button>
          </form>
        </div>
      </Container>
    </section>
  );
}
