# Claudia Castellanos - Blog profesional y CMS

Sitio web profesional desarrollado para Claudia Castellanos, abogada y docente, con un frontend publico en Next.js y un CMS administrativo en Django/Wagtail. El proyecto permite publicar noticias, articulos de blog, contenidos por secciones tematicas, comentarios moderados, solicitudes de consultoria y publicaciones invitadas enviadas por usuarios autenticados con Google.

Sitio en produccion: https://claudia-castellanos.com

## Objetivo del proyecto

El objetivo fue construir una plataforma editorial completa para una profesional del area juridica, combinando una experiencia publica clara y responsive con un panel administrativo no tecnico. La solucion permite que el contenido pueda ser gestionado desde un CMS sin intervenir codigo, manteniendo flujos de revision para comentarios, consultorias y articulos enviados por terceros.

## Funcionalidades principales

- Sitio publico responsive con secciones de inicio, blog, noticias, consultoria, publicar, contacto y sobre mi.
- CMS con Wagtail para crear y administrar noticias y posts.
- Clasificacion de posts por etiquetas para secciones como Madres Comunitarias, Reforma Laboral y Personas privadas de la libertad.
- Autenticacion con Google mediante NextAuth.
- Comentarios en posts con moderacion manual desde el CMS.
- Formulario de consultoria legal con adjuntos y seguimiento por estado.
- Flujo de publicaciones invitadas con revision editorial y creacion de borradores en Wagtail.
- API interna protegida entre frontend y backend mediante secreto compartido.
- Despliegue en EC2 con Docker Compose, PostgreSQL y Caddy como reverse proxy.
- HTTPS automatico y redireccion de `www` al dominio principal.

## Stack tecnico

### Frontend

- Next.js 16
- React 19
- TypeScript
- Tailwind CSS
- NextAuth

### Backend

- Django
- Wagtail CMS
- Django REST Framework
- PostgreSQL
- Gunicorn
- WhiteNoise

### Infraestructura

- Docker y Docker Compose
- Caddy
- AWS EC2
- Cloudflare DNS
- Let's Encrypt para certificados SSL

## Arquitectura general

```text
Usuario
  |
  v
Cloudflare DNS
  |
  v
Caddy reverse proxy
  |
  +--> Frontend Next.js
  |
  +--> Backend Django/Wagtail
          |
          +--> PostgreSQL
          +--> Media y archivos adjuntos
```

El frontend consume la API publica de Wagtail para listar contenidos y usa rutas internas de Next.js para proteger operaciones sensibles, como consultorias y publicaciones invitadas. El backend valida esas operaciones con un secreto interno y conserva la logica de negocio, archivos adjuntos y estados editoriales.

## Estructura del repositorio

```text
.
├── backend/                  # Proyecto Django/Wagtail
│   ├── blog/                 # Modelos, API, vistas CMS y moderacion
│   ├── config/               # Configuracion principal de Django
│   └── requirements.txt
├── frontend/                 # Aplicacion Next.js
│   ├── app/                  # Rutas publicas y API routes
│   ├── components/           # Componentes reutilizables
│   ├── lib/                  # Constantes, tipos y funciones de API
│   └── public/               # Assets publicos
├── Caddyfile                 # Reverse proxy y HTTPS en produccion
├── docker-compose.yml        # Base local para PostgreSQL
├── docker-compose.prod.yml   # Stack de produccion
└── .env.prod.example         # Variables de entorno de referencia
```

## Modelos y flujos destacados

### Contenido editorial

El CMS maneja dos tipos principales de contenido:

- Noticias: novedades, comunicados y contenido breve de actualidad.
- Blog posts: articulos extensos con fecha, autor publico, imagen principal, cuerpo enriquecido, comentarios y etiquetas.

Las etiquetas permiten que un post se muestre en secciones especificas sin duplicar modelos ni pantallas administrativas.

### Consultorias

Los usuarios autenticados con Google pueden enviar solicitudes de consultoria con asunto, mensaje, telefono y hasta 5 archivos adjuntos. Desde el CMS se puede revisar cada solicitud, cambiar su estado y agregar notas internas.

Estados disponibles:

- Pendiente
- En revision
- Resuelta
- Rechazada

### Publicaciones invitadas

Los visitantes pueden proponer articulos desde el sitio. El CMS permite revisar cada envio, ver adjuntos, guardar notas editoriales y convertir una propuesta aprobada en borrador de blog.

Estados disponibles:

- Pendiente
- En revision
- Borrador creado
- Rechazada

### Comentarios

Los comentarios requieren autenticacion con Google y no se publican automaticamente. Quedan pendientes hasta que una persona administradora los apruebe desde el panel de moderacion.

## Ejecucion local

### Requisitos

- Python 3.12+
- Node.js
- npm
- Docker Desktop

### Base de datos local

Desde la raiz del proyecto:

```bash
docker compose up -d
```

Esto levanta PostgreSQL en el puerto `5433`.

### Backend

```powershell
cd backend
.\.venv\Scripts\Activate.ps1
python manage.py migrate
python manage.py runserver
```

Backend local:

```text
http://127.0.0.1:8000
```

CMS local:

```text
http://127.0.0.1:8000/cms/
```

### Frontend

En otra terminal:

```powershell
cd frontend
npm install
npm run dev
```

Frontend local:

```text
http://localhost:3000/inicio
```

## Variables de entorno

El proyecto usa variables para credenciales, dominios, OAuth y secretos internos. El archivo `.env.prod.example` documenta las variables esperadas para produccion.

Variables relevantes:

- `PUBLIC_URL`
- `PUBLIC_HOST`
- `POSTGRES_DB`
- `POSTGRES_USER`
- `POSTGRES_PASSWORD`
- `DJANGO_SECRET_KEY`
- `AUTH_SECRET`
- `GOOGLE_CLIENT_ID`
- `GOOGLE_CLIENT_SECRET`
- `INTERNAL_API_SECRET`
- `CONSULTATION_PROXY_SECRET`

No se deben commitear archivos `.env` reales ni secretos de produccion.

## Despliegue

El proyecto esta preparado para desplegarse con Docker Compose en una instancia EC2:

```bash
docker compose --env-file .env.prod -f docker-compose.prod.yml up -d --build
```

Despues de cambios en modelos:

```bash
docker compose --env-file .env.prod -f docker-compose.prod.yml exec backend python manage.py migrate
```

Caddy atiende los puertos `80` y `443`, sirve archivos estaticos/media y enruta el trafico al frontend o backend segun la ruta.

## Calidad y verificacion

Frontend:

```bash
cd frontend
npm run lint
npm run build
```

Backend:

```bash
cd backend
python manage.py test
```

## Lo que demuestra este proyecto

- Integracion full-stack entre Next.js y Django/Wagtail.
- Diseno de modelos editoriales y flujos de moderacion.
- Manejo de autenticacion OAuth con Google.
- Subida y validacion de archivos adjuntos.
- Separacion entre API publica, API interna y CMS administrativo.
- Despliegue real en cloud con dominio propio, HTTPS y reverse proxy.
- Implementacion orientada a una necesidad de cliente real, no solo a una demo.

## Autor

Desarrollado por Sebastian Hurtado como proyecto full-stack para cliente real.
