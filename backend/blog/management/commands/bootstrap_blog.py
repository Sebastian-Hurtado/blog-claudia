from django.core.management.base import BaseCommand
from django.utils import timezone

from wagtail.models import Page, Site

from blog.models import BlogIndexPage, BlogPage, HomePage, NewsIndexPage


class Command(BaseCommand):
    help = "Crea la estructura inicial del sitio en Wagtail."

    def add_arguments(self, parser):
        parser.add_argument(
            "--no-sample-post",
            action="store_true",
            help="Crea la estructura sin generar un post de ejemplo.",
        )

    def handle(self, *args, **options):
        root = Page.get_first_root_node()
        site = Site.objects.filter(is_default_site=True).first() or Site.objects.first()

        home_page = HomePage.objects.child_of(root).first()
        if home_page is None:
            home_page = HomePage(
                title="Inicio",
                slug="inicio",
                body=(
                    "<p>Bienvenida al sitio de Claudia.</p>"
                    "<p>Desde aqui puedes gestionar el blog y las noticias destacadas.</p>"
                ),
            )
            root.add_child(instance=home_page)
            home_page.save_revision().publish()
            self.stdout.write(self.style.SUCCESS("HomePage creada."))
        else:
            self.stdout.write("HomePage ya existia, se reutilizo.")

        blog_index = BlogIndexPage.objects.child_of(home_page).filter(slug="blog").first()
        if blog_index is None:
            blog_index = BlogIndexPage(
                title="Blog",
                slug="blog",
                intro="<p>Publicaciones del blog.</p>",
            )
            home_page.add_child(instance=blog_index)
            blog_index.save_revision().publish()
            self.stdout.write(self.style.SUCCESS("BlogIndexPage creada."))
        else:
            self.stdout.write("BlogIndexPage ya existia, se reutilizo.")

        news_index = NewsIndexPage.objects.child_of(home_page).filter(slug="noticias").first()
        if news_index is None:
            news_index = NewsIndexPage(
                title="Noticias",
                slug="noticias",
            )
            home_page.add_child(instance=news_index)
            news_index.save_revision().publish()
            self.stdout.write(self.style.SUCCESS("NewsIndexPage creada."))
        else:
            self.stdout.write("NewsIndexPage ya existia, se reutilizo.")

        if site is None:
            Site.objects.create(
                hostname="localhost",
                site_name="Blog Claudia",
                root_page=home_page,
                is_default_site=True,
            )
            self.stdout.write(self.style.SUCCESS("Sitio por defecto creado."))
        else:
            changed = False
            if site.root_page_id != home_page.id:
                site.root_page = home_page
                changed = True
            if site.site_name != "Blog Claudia":
                site.site_name = "Blog Claudia"
                changed = True
            if changed:
                site.save()
                self.stdout.write(self.style.SUCCESS("Configuracion del sitio actualizada."))
            else:
                self.stdout.write("La configuracion del sitio ya estaba correcta.")

        if not options["no_sample_post"]:
            sample_post = BlogPage.objects.child_of(blog_index).filter(slug="bienvenida").first()
            if sample_post is None:
                sample_post = BlogPage(
                    title="Bienvenida al blog",
                    slug="bienvenida",
                    date=timezone.now().date(),
                    intro="Este es un post inicial para verificar que el blog carga correctamente.",
                    body=(
                        "<p>El blog ya esta listo en este nuevo entorno.</p>"
                        "<p>Desde Wagtail puedes editar este contenido o crear nuevas publicaciones.</p>"
                    ),
                )
                blog_index.add_child(instance=sample_post)
                sample_post.save_revision().publish()
                self.stdout.write(self.style.SUCCESS("Post de ejemplo creado."))
            else:
                self.stdout.write("El post de ejemplo ya existia, se reutilizo.")

        self.stdout.write(self.style.SUCCESS("Bootstrap del sitio completado."))
