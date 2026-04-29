import Container from "@/components/ui/Container";

export const metadata = {
  title: "Sobre mi | Claudia Milena Castellanos Avendaño",
  description:
    "Perfil profesional y trayectoria academica de Claudia Milena Castellanos Avendaño.",
};

type Cargo = {
  titulo: string;
  periodo: string;
  nota?: string;
};

type ExperienciaProfesional = {
  institucion: string;
  subtitulo?: string;
  cargos: Cargo[];
};

type ExperienciaDocente = {
  programa: string;
  institucion: string;
  detalle: string;
  periodo: string;
};

type Estudio = {
  titulo: string;
  institucion: string;
  detalle: string;
};

type FormacionComplementaria = {
  rol: string;
  actividad: string;
  detalle: string;
  fecha: string;
};

const experienciaProfesional: ExperienciaProfesional[] = [
  {
    institucion: "Universidad Nacional de Colombia",
    cargos: [
      {
        titulo: "Directora de Personal Docente y Administrativo de la Sede Bogota",
        periodo: "2 de julio de 2025 - 20 de febrero de 2026",
      },
    ],
  },
  {
    institucion: "Corte Suprema de Justicia de Colombia",
    subtitulo: "Sala de Casacion Laboral",
    cargos: [
      {
        titulo: "Magistrada Auxiliar de la Sala de Casacion Laboral",
        periodo: "8 de junio de 2017 - 5 de junio de 2025",
      },
      {
        titulo: "Profesional Especializado",
        periodo: "Enero de 2011 - 13 de septiembre de 2013",
      },
    ],
  },
  {
    institucion: "Caja Nacional de Prevision Social (CAJANAL) en Liquidacion",
    cargos: [
      {
        titulo: "Asesora Juridica - Lider del Registro Nacional de Afiliados",
        periodo: "26 de agosto de 2011 - 15 de enero de 2012",
      },
    ],
  },
  {
    institucion: "Rama Judicial de Colombia",
    cargos: [
      {
        titulo: "Auxiliar de Magistrado, Tribunal Superior del Distrito Judicial de Bogota",
        periodo: "18 de julio de 2011 - 26 de agosto de 2011",
        nota: "Nombramiento en provisionalidad.",
      },
      {
        titulo: "Jueza Promiscuo Municipal de Villeta, Cundinamarca",
        periodo: "20 de junio de 2011 - 11 de julio de 2011",
      },
      {
        titulo: "Jueza Promiscuo Municipal de La Palma, Cundinamarca",
        periodo: "14 de enero de 2011 - 30 de abril de 2011",
      },
    ],
  },
  {
    institucion: "Fiscalia General de la Nacion",
    cargos: [
      {
        titulo: "Abogada Contratista - Oficina Juridica",
        periodo: "Noviembre de 2009 - diciembre de 2010",
      },
      {
        titulo: "Auxiliar Juridica en convenio con la Universidad Nacional de Colombia",
        periodo: "Diciembre de 2007 - 19 de febrero de 2008",
      },
    ],
  },
  {
    institucion: "Universidad de los Andes",
    subtitulo: "Facultad de Derecho",
    cargos: [
      {
        titulo: "Abogada - Consultorio Juridico",
        periodo: "3 de febrero de 2009 - 19 de agosto de 2009",
        nota: "Area de Derecho Publico, Derecho Laboral y Seguridad Social.",
      },
    ],
  },
  {
    institucion: "Ejercicio profesional independiente",
    cargos: [
      {
        titulo:
          "Prestacion de servicios profesionales con la Oficina de la Dra. Martha Amelia Gonzalez Perez y la Oficina del Dr. Marcel Silva Romero",
        periodo: "2 de enero de 2007 - 30 de enero de 2009",
      },
    ],
  },
];

const experienciaDocente: ExperienciaDocente[] = [
  {
    programa:
      "Especializacion en Derecho Laboral y de la Seguridad Social",
    institucion: "Universidad del Rosario",
    detalle:
      "Modulo: Jurisprudencia en Derecho Laboral y en Seguridad Social.",
    periodo: "Desde junio de 2014",
  },
  {
    programa: "Maestria en Derecho Laboral",
    institucion: "Universidad del Rosario",
    detalle:
      "Modulo: Aspectos contemporaneos del Derecho del Trabajo.",
    periodo: "Desde febrero de 2026",
  },
  {
    programa: "Especializacion en Derecho del Trabajo",
    institucion: "Universidad Nacional de Colombia",
    detalle:
      "Modulo: Tendencias contemporaneas del Derecho del Trabajo.",
    periodo: "Desde 2013 a la fecha",
  },
  {
    programa:
      "Especializacion en Derecho Laboral y de la Seguridad Social",
    institucion: "Universidad Libre",
    detalle: "Modulo: Jurisprudencia constitucional y laboral.",
    periodo: "Desde 2014 a la fecha",
  },
];

const estudios: Estudio[] = [
  {
    titulo: "Doctorado en Derecho Privado y Ciencias Criminales (en curso)",
    institucion: "Universidad de Burdeos, Francia",
    detalle:
      "Proyeccion de sustentacion de tesis: junio de 2026. Tesis sobre la justiciabilidad de los derechos economicos, sociales y culturales en el sistema interamericano.",
  },
  {
    titulo: "Maestria en Derecho",
    institucion: "Universidad Nacional de Colombia",
    detalle:
      "Enfasis en Derecho Laboral y de la Seguridad Social. 2013.",
  },
  {
    titulo: "Especializacion en Derecho Privado Economico",
    institucion: "Universidad Nacional de Colombia",
    detalle: "2008.",
  },
  {
    titulo: "Abogada",
    institucion: "Universidad Nacional de Colombia",
    detalle: "2007.",
  },
  {
    titulo: "Curso en Derecho del Trabajo para Postgraduados",
    institucion: "Universidad de Sevilla, Espana",
    detalle: "Beca otorgada por Fundacion Cajasol. 2010.",
  },
];

const formacionComplementaria: FormacionComplementaria[] = [
  {
    rol: "Formadora",
    actividad: "Curso Regional de Justicia Restaurativa",
    detalle: "Modalidad presencial - 16 horas.",
    fecha: "25 al 26 de agosto de 2022, Cartagena, Colombia",
  },
  {
    rol: "Discente",
    actividad:
      "Segundo Curso Especializado en Justicia Restaurativa y Justicia Terapeutica",
    detalle: "Modalidad presencial - 16 horas.",
    fecha: "28 al 29 de abril de 2022, Cali, Colombia",
  },
];

function SectionTitle({
  title,
  badge,
}: {
  title: string;
  badge: string;
}) {
  return (
    <div className="flex items-center gap-4 mb-8">
      <div className="w-11 h-11 rounded-full bg-primary text-white flex items-center justify-center font-bold shadow-md">
        {badge}
      </div>
      <h2 className="text-2xl md:text-3xl font-bold text-heading">{title}</h2>
    </div>
  );
}

export default function SobreMiPage() {
  return (
    <section className="py-16">
      <Container>
        <div className="max-w-5xl mx-auto">
          <div className="bg-primary rounded-2xl p-10 md:p-14 mb-10 text-center shadow-lg">
            <h1 className="text-3xl md:text-4xl font-bold text-white mb-3">
              Claudia Milena Castellanos Avendaño
            </h1>
            <p className="text-white/80 text-lg font-medium tracking-wide">
              Abogada | Magister en Derecho | Docente universitaria
            </p>
          </div>

          <div className="bg-white rounded-2xl shadow-md p-8 md:p-10 mb-10 border border-border">
            <p className="text-body leading-8 text-base md:text-lg">
              Soy abogada con trayectoria en la rama judicial, el sector publico
              y la academia, con experiencia en derecho laboral, seguridad
              social, funcion publica y formacion juridica de posgrado. He
              ocupado cargos de alta responsabilidad en la Corte Suprema de
              Justicia y en la Universidad Nacional de Colombia, y desarrollo mi
              trabajo con un enfoque riguroso, humano y orientado al servicio.
            </p>
            <p className="text-body leading-8 text-base md:text-lg mt-5">
              Mi formacion incluye maestria en Derecho, especializacion en
              Derecho Privado Economico y estudios doctorales en la Universidad
              de Burdeos, Francia. En paralelo, mantengo una labor docente
              sostenida en programas de especializacion y maestria en derecho
              laboral y de la seguridad social.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-5 mb-14">
            <div className="bg-white rounded-xl p-6 shadow-md border-t-4 border-primary">
              <div className="flex items-center gap-3 mb-4">
                <span className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold">
                  C
                </span>
                <h3 className="font-bold text-heading text-sm uppercase tracking-wider">
                  Contacto
                </h3>
              </div>
              <p className="text-body text-sm leading-relaxed">
                +57 321 481 3362
              </p>
              <p className="text-body text-sm leading-relaxed">
                iuscolombia71@gmail.com
              </p>
            </div>

            <div className="bg-white rounded-xl p-6 shadow-md border-t-4 border-gold">
              <div className="flex items-center gap-3 mb-4">
                <span className="w-10 h-10 rounded-full bg-gold/10 flex items-center justify-center text-gold font-bold">
                  I
                </span>
                <h3 className="font-bold text-heading text-sm uppercase tracking-wider">
                  Idiomas
                </h3>
              </div>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-body">Espanol</span>
                  <span className="text-muted font-medium">Nativo</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-body">Frances</span>
                  <span className="text-muted font-medium">Avanzado</span>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl p-6 shadow-md border-t-4 border-primary-light">
              <div className="flex items-center gap-3 mb-4">
                <span className="w-10 h-10 rounded-full bg-primary-light/10 flex items-center justify-center text-primary-light font-bold">
                  T
                </span>
                <h3 className="font-bold text-heading text-sm uppercase tracking-wider">
                  Herramientas
                </h3>
              </div>
              <p className="text-body text-sm leading-relaxed">
                Dominio del paquete Office
              </p>
              <p className="text-body text-sm leading-relaxed">
                Manejo de programas de recursos humanos
              </p>
            </div>
          </div>

          <div className="mb-14">
            <SectionTitle title="Experiencia Profesional" badge="EP" />
            <div className="relative space-y-7 before:absolute before:left-4 before:top-2 before:bottom-2 before:w-px before:bg-primary/20 md:before:left-6">
              {experienciaProfesional.map((exp) => (
                <div
                  key={exp.institucion}
                  className="relative pl-12 md:pl-16"
                >
                  <span className="absolute left-0 top-6 flex h-8 w-8 items-center justify-center rounded-full border-4 border-white bg-primary shadow-md md:left-2" />
                  <article className="overflow-hidden rounded-2xl border border-border bg-white shadow-md transition-shadow hover:shadow-lg">
                    <div className="border-b border-border/70 bg-gradient-to-r from-surface to-white px-6 py-5">
                      <h3 className="text-lg font-bold text-heading md:text-xl">
                        {exp.institucion}
                      </h3>
                      {exp.subtitulo && (
                        <p className="mt-1 text-sm text-muted">
                          {exp.subtitulo}
                        </p>
                      )}
                    </div>
                    <div className="space-y-4 p-6">
                      {exp.cargos.map((cargo) => (
                        <div
                          key={`${cargo.titulo}-${cargo.periodo}`}
                          className="rounded-xl border border-border/60 bg-surface/40 p-4"
                        >
                          <div className="flex flex-col gap-3 lg:flex-row lg:items-start lg:justify-between">
                            <p className="font-semibold text-primary leading-snug">
                              {cargo.titulo}
                            </p>
                            <span className="inline-flex w-fit rounded-full bg-white px-3 py-1 text-xs font-medium text-muted shadow-sm ring-1 ring-border/70">
                              {cargo.periodo}
                            </span>
                          </div>
                          {cargo.nota && (
                            <p className="mt-3 border-l-2 border-primary/30 pl-3 text-sm italic leading-6 text-muted">
                              {cargo.nota}
                            </p>
                          )}
                        </div>
                      ))}
                    </div>
                  </article>
                </div>
              ))}
            </div>
          </div>

          <div className="mb-14">
            <SectionTitle title="Experiencia Docente" badge="ED" />
            <div className="grid md:grid-cols-2 gap-6">
              {experienciaDocente.map((item) => (
                <div
                  key={`${item.programa}-${item.institucion}`}
                  className="bg-white rounded-xl shadow-md p-6 border border-border"
                >
                  <p className="text-primary font-semibold text-sm mb-2">
                    {item.programa}
                  </p>
                  <h3 className="text-lg font-bold text-heading mb-2">
                    {item.institucion}
                  </h3>
                  <p className="text-body text-sm leading-7">{item.detalle}</p>
                  <p className="mt-4 text-xs text-muted uppercase tracking-wider">
                    {item.periodo}
                  </p>
                </div>
              ))}
            </div>
          </div>

          <div className="mb-14">
            <SectionTitle title="Formacion Academica" badge="FA" />
            <div className="grid gap-4">
              {estudios.map((estudio) => (
                <div
                  key={`${estudio.titulo}-${estudio.institucion}`}
                  className="bg-white rounded-xl shadow-md p-6 border border-border"
                >
                  <h3 className="text-lg font-bold text-heading">
                    {estudio.titulo}
                  </h3>
                  <p className="text-primary text-sm font-medium mt-1">
                    {estudio.institucion}
                  </p>
                  <p className="text-body text-sm leading-7 mt-3">
                    {estudio.detalle}
                  </p>
                </div>
              ))}
            </div>
          </div>

          <div>
            <SectionTitle title="Formacion Complementaria" badge="FC" />
            <div className="grid md:grid-cols-2 gap-6">
              {formacionComplementaria.map((item) => (
                <div
                  key={`${item.rol}-${item.actividad}`}
                  className="bg-white rounded-xl shadow-md p-6 border border-border"
                >
                  <p className="text-xs uppercase tracking-wider text-muted mb-2">
                    {item.rol}
                  </p>
                  <h3 className="text-lg font-bold text-heading mb-2">
                    {item.actividad}
                  </h3>
                  <p className="text-body text-sm leading-7">{item.detalle}</p>
                  <p className="text-primary text-sm mt-4">{item.fecha}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
}
