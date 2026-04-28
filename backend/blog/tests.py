from datetime import date, timedelta

from django.contrib.auth import get_user_model
from django.core.files.uploadedfile import SimpleUploadedFile
from django.test import TestCase, override_settings
from django.urls import reverse
from rest_framework.test import APIClient
from wagtail.models import Page, Site

from .models import (
    BlogIndexPage,
    BlogPage,
    Comment,
    ConsultationRequest,
    HomePage,
    NewsIndexPage,
    NewsPage,
)


class BaseBlogTestCase(TestCase):
    def setUp(self):
        root = Page.get_first_root_node()

        self.home_page = HomePage(title="Inicio", slug="inicio")
        root.add_child(instance=self.home_page)
        self.home_page.save_revision().publish()

        self.site = Site.objects.first()
        self.site.root_page = self.home_page
        self.site.site_name = "Blog Claudia"
        self.site.save()

        User = get_user_model()
        self.admin_user = User.objects.create_superuser(
            username="moderador",
            email="moderador@example.com",
            password="password123",
        )


class CommentModerationTests(BaseBlogTestCase):
    def setUp(self):
        super().setUp()

        self.blog_index = BlogIndexPage(title="Blog", slug="blog")
        self.home_page.add_child(instance=self.blog_index)
        self.blog_index.save_revision().publish()

        self.post = BlogPage(
            title="Post abierto",
            slug="post-abierto",
            date=date.today(),
            intro="Intro",
            body="<p>Contenido</p>",
            allow_comments=True,
        )
        self.blog_index.add_child(instance=self.post)
        self.post.save_revision().publish()

        self.closed_post = BlogPage(
            title="Post cerrado",
            slug="post-cerrado",
            date=date.today(),
            intro="Intro",
            body="<p>Contenido</p>",
            allow_comments=False,
        )
        self.blog_index.add_child(instance=self.closed_post)
        self.closed_post.save_revision().publish()

    def test_create_comment_starts_pending(self):
        response = self.client.post(
            "/api/comments/",
            data={
                "post_slug": self.post.slug,
                "author_name": "Persona Test",
                "author_email": "persona@example.com",
                "content": "Comentario pendiente",
            },
            content_type="application/json",
        )

        self.assertEqual(response.status_code, 201)
        self.assertEqual(response.json()["status"], "pending")

        comment = Comment.objects.get(post=self.post)
        self.assertFalse(comment.is_approved)

    def test_create_comment_rejects_closed_post(self):
        response = self.client.post(
            "/api/comments/",
            data={
                "post_slug": self.closed_post.slug,
                "author_name": "Persona Test",
                "author_email": "persona@example.com",
                "content": "Comentario bloqueado",
            },
            content_type="application/json",
        )

        self.assertEqual(response.status_code, 403)
        self.assertEqual(
            response.json()["error"],
            "Los comentarios estan cerrados en esta publicacion.",
        )
        self.assertFalse(Comment.objects.filter(post=self.closed_post).exists())

    def test_list_comments_returns_only_approved(self):
        Comment.objects.create(
            post=self.post,
            author_name="Aprobado",
            author_email="aprobado@example.com",
            content="Visible",
            is_approved=True,
        )
        Comment.objects.create(
            post=self.post,
            author_name="Pendiente",
            author_email="pendiente@example.com",
            content="Oculto",
            is_approved=False,
        )

        response = self.client.get(f"/api/comments/{self.post.slug}/")

        self.assertEqual(response.status_code, 200)
        payload = response.json()
        self.assertEqual(len(payload), 1)
        self.assertEqual(payload[0]["author_name"], "Aprobado")

    def test_wagtail_moderation_can_approve_comment(self):
        comment = Comment.objects.create(
            post=self.post,
            author_name="Pendiente",
            author_email="pendiente@example.com",
            content="Por aprobar",
            is_approved=False,
        )
        self.client.force_login(self.admin_user)

        response = self.client.post(reverse("blog_comment_approve", args=[comment.id]))

        comment.refresh_from_db()
        self.assertEqual(response.status_code, 302)
        self.assertTrue(comment.is_approved)

    def test_wagtail_moderation_can_reject_comment(self):
        comment = Comment.objects.create(
            post=self.post,
            author_name="Pendiente",
            author_email="pendiente@example.com",
            content="Por rechazar",
            is_approved=False,
        )
        self.client.force_login(self.admin_user)

        response = self.client.post(reverse("blog_comment_reject", args=[comment.id]))

        comment.refresh_from_db()
        self.assertEqual(response.status_code, 302)
        self.assertFalse(comment.is_approved)


class NewsPageTests(BaseBlogTestCase):
    def setUp(self):
        super().setUp()

        self.news_index = NewsIndexPage(title="Noticias", slug="noticias")
        self.home_page.add_child(instance=self.news_index)
        self.news_index.save_revision().publish()

    def test_can_create_news_index_under_home_and_news_page_under_index(self):
        news_page = NewsPage(
            title="Nueva noticia",
            slug="nueva-noticia",
            date=date.today(),
            summary="Resumen corto de prueba",
            body="<p>Contenido de la noticia.</p>",
        )

        self.news_index.add_child(instance=news_page)
        news_page.save_revision().publish()

        self.assertEqual(news_page.get_parent().specific, self.news_index)
        self.assertTrue(
            NewsPage.objects.child_of(self.news_index).filter(pk=news_page.pk).exists()
        )

    def test_news_api_returns_recent_news_sorted_by_date(self):
        first_news = NewsPage(
            title="Noticia antigua",
            slug="noticia-antigua",
            date=date.today() - timedelta(days=2),
            summary="Resumen 1",
            body="<p>Contenido 1</p>",
        )
        self.news_index.add_child(instance=first_news)
        first_news.save_revision().publish()

        latest_news = NewsPage(
            title="Noticia reciente",
            slug="noticia-reciente",
            date=date.today(),
            summary="Resumen 2",
            body="<p>Contenido 2</p>",
        )
        self.news_index.add_child(instance=latest_news)
        latest_news.save_revision().publish()

        response = self.client.get(
            "/wagtail-api/v2/pages/",
            data={
                "type": "blog.NewsPage",
                "fields": "date,summary,body,main_image",
                "order": "-date",
            },
        )

        self.assertEqual(response.status_code, 200)
        payload = response.json()
        self.assertEqual(payload["items"][0]["title"], "Noticia reciente")
        self.assertEqual(payload["items"][0]["summary"], "Resumen 2")
        self.assertEqual(payload["items"][1]["title"], "Noticia antigua")


@override_settings(CONSULTATION_PROXY_SECRET="test-consultation-secret")
class ConsultationRequestTests(BaseBlogTestCase):
    def setUp(self):
        super().setUp()
        self.api_client = APIClient()

    def make_file(self, name, content=b"file", content_type="application/octet-stream"):
        return SimpleUploadedFile(name, content, content_type=content_type)

    def test_create_consultation_request_with_multiple_attachments(self):
        response = self.api_client.post(
            "/api/consultation-requests/",
            data={
                "full_name": "Ana Perez",
                "email": "ana@example.com",
                "phone": "3001234567",
                "subject": "Consulta laboral",
                "message": "Necesito orientacion inicial.",
                "attachments": [
                    self.make_file("caso.pdf", b"pdf", "application/pdf"),
                    self.make_file("soporte.jpg", b"jpg", "image/jpeg"),
                ],
            },
            format="multipart",
            HTTP_X_CONSULTATION_PROXY_SECRET="test-consultation-secret",
        )

        self.assertEqual(response.status_code, 201)
        self.assertEqual(response.json()["status"], ConsultationRequest.Status.PENDING)

        consultation = ConsultationRequest.objects.get(email="ana@example.com")
        self.assertEqual(consultation.attachments.count(), 2)

    def test_create_consultation_request_rejects_missing_secret(self):
        response = self.api_client.post(
            "/api/consultation-requests/",
            data={
                "full_name": "Ana Perez",
                "email": "ana@example.com",
                "phone": "3001234567",
                "subject": "Consulta laboral",
                "message": "Necesito orientacion inicial.",
            },
            format="multipart",
        )

        self.assertEqual(response.status_code, 403)

    def test_create_consultation_request_rejects_more_than_five_files(self):
        attachments = [
            self.make_file(f"archivo-{index}.pdf", b"pdf", "application/pdf")
            for index in range(6)
        ]

        response = self.api_client.post(
            "/api/consultation-requests/",
            data={
                "full_name": "Ana Perez",
                "email": "ana@example.com",
                "phone": "3001234567",
                "subject": "Consulta laboral",
                "message": "Necesito orientacion inicial.",
                "attachments": attachments,
            },
            format="multipart",
            HTTP_X_CONSULTATION_PROXY_SECRET="test-consultation-secret",
        )

        self.assertEqual(response.status_code, 400)

    def test_create_consultation_request_rejects_invalid_extension(self):
        response = self.api_client.post(
            "/api/consultation-requests/",
            data={
                "full_name": "Ana Perez",
                "email": "ana@example.com",
                "phone": "3001234567",
                "subject": "Consulta laboral",
                "message": "Necesito orientacion inicial.",
                "attachments": [
                    self.make_file("nota.txt", b"hola", "text/plain"),
                ],
            },
            format="multipart",
            HTTP_X_CONSULTATION_PROXY_SECRET="test-consultation-secret",
        )

        self.assertEqual(response.status_code, 400)

    def test_create_consultation_request_rejects_large_file(self):
        oversized_file = self.make_file(
            "caso.pdf",
            b"x" * (10 * 1024 * 1024 + 1),
            "application/pdf",
        )

        response = self.api_client.post(
            "/api/consultation-requests/",
            data={
                "full_name": "Ana Perez",
                "email": "ana@example.com",
                "phone": "3001234567",
                "subject": "Consulta laboral",
                "message": "Necesito orientacion inicial.",
                "attachments": [oversized_file],
            },
            format="multipart",
            HTTP_X_CONSULTATION_PROXY_SECRET="test-consultation-secret",
        )

        self.assertEqual(response.status_code, 400)

    def test_wagtail_consultation_update_persists_status_and_notes(self):
        consultation = ConsultationRequest.objects.create(
            full_name="Ana Perez",
            email="ana@example.com",
            phone="3001234567",
            subject="Consulta laboral",
            message="Necesito orientacion inicial.",
        )
        self.client.force_login(self.admin_user)

        response = self.client.post(
            reverse("blog_consultation_update", args=[consultation.id]),
            data={
                "status": ConsultationRequest.Status.RESOLVED,
                "internal_notes": "Se respondio por telefono.",
            },
        )

        consultation.refresh_from_db()
        self.assertEqual(response.status_code, 302)
        self.assertEqual(consultation.status, ConsultationRequest.Status.RESOLVED)
        self.assertEqual(consultation.internal_notes, "Se respondio por telefono.")

    def test_list_my_consultation_requests_returns_only_matching_email(self):
        ConsultationRequest.objects.create(
            full_name="Ana Perez",
            email="ana@example.com",
            phone="3001234567",
            subject="Consulta laboral",
            message="Necesito orientacion inicial.",
            status=ConsultationRequest.Status.IN_REVIEW,
        )
        ConsultationRequest.objects.create(
            full_name="Luis Gomez",
            email="luis@example.com",
            phone="3007654321",
            subject="Otra consulta",
            message="Otro caso.",
        )

        response = self.api_client.get(
            "/api/consultation-requests/",
            data={"email": "ana@example.com"},
            HTTP_X_CONSULTATION_PROXY_SECRET="test-consultation-secret",
        )

        self.assertEqual(response.status_code, 200)
        payload = response.json()
        self.assertEqual(len(payload), 1)
        self.assertEqual(payload[0]["subject"], "Consulta laboral")
        self.assertEqual(payload[0]["status"], ConsultationRequest.Status.IN_REVIEW)
