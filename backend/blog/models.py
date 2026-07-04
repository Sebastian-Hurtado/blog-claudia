import os

from django.db import models

from modelcluster.contrib.taggit import ClusterTaggableManager
from modelcluster.fields import ParentalKey
from taggit.models import TaggedItemBase
from wagtail.admin.panels import FieldPanel, MultiFieldPanel
from wagtail.api import APIField
from wagtail.fields import RichTextField
from wagtail.models import Page
from wagtail.search import index


def consultation_attachment_upload_to(instance, filename):
    return os.path.join("consultations", str(instance.request_id), filename)


def guest_post_attachment_upload_to(instance, filename):
    return os.path.join("guest-posts", str(instance.submission_id), filename)


class BlogPageTag(TaggedItemBase):
    """Relacion intermedia para tags de BlogPage."""

    content_object = ParentalKey(
        "blog.BlogPage",
        related_name="tagged_items",
        on_delete=models.CASCADE,
    )


class HomePage(Page):
    body = RichTextField(blank=True)

    content_panels = Page.content_panels + [
        FieldPanel("body"),
    ]

    subpage_types = ["blog.BlogIndexPage", "blog.NewsIndexPage"]


class BlogIndexPage(Page):
    intro = RichTextField(blank=True)

    content_panels = Page.content_panels + [
        FieldPanel("intro"),
    ]

    subpage_types = ["blog.BlogPage"]
    parent_page_types = ["blog.HomePage"]


class NewsIndexPage(Page):
    subpage_types = ["blog.NewsPage"]
    parent_page_types = ["blog.HomePage"]


class BlogPage(Page):
    date = models.DateField("Post date")
    intro = models.CharField(max_length=250, blank=True)
    body = RichTextField(blank=True)
    author_display_name = models.CharField(
        max_length=150,
        blank=True,
        help_text="Nombre publico del autor. Usar 'Autor anonimo' si la publicacion invitada debe ocultar identidad.",
    )
    allow_comments = models.BooleanField(
        default=True,
        help_text="Permite que los visitantes envien comentarios a esta publicacion.",
    )

    main_image = models.ForeignKey(
        "wagtailimages.Image",
        null=True,
        blank=True,
        on_delete=models.SET_NULL,
        related_name="+",
    )

    tags = ClusterTaggableManager(
        through=BlogPageTag,
        blank=True,
        help_text="Etiquetas del post (ej: madres-comunitarias, derecho, educacion)",
    )

    content_panels = Page.content_panels + [
        MultiFieldPanel(
            [
                FieldPanel("date"),
                FieldPanel("tags"),
                FieldPanel("author_display_name"),
                FieldPanel("allow_comments"),
            ],
            heading="Informacion del post",
        ),
        FieldPanel("intro"),
        FieldPanel("body"),
        FieldPanel("main_image"),
    ]

    api_fields = [
        APIField("date"),
        APIField("intro"),
        APIField("body"),
        APIField("main_image"),
        APIField("tags"),
        APIField("author_display_name"),
        APIField("allow_comments"),
    ]

    parent_page_types = ["blog.BlogIndexPage"]

    search_fields = Page.search_fields + [
        index.SearchField("title"),
        index.SearchField("intro"),
        index.SearchField("body"),
    ]


class NewsPage(Page):
    date = models.DateField("Fecha de la noticia")
    summary = models.CharField(max_length=250)
    body = RichTextField(blank=True)

    main_image = models.ForeignKey(
        "wagtailimages.Image",
        null=True,
        blank=True,
        on_delete=models.SET_NULL,
        related_name="+",
    )

    content_panels = Page.content_panels + [
        MultiFieldPanel(
            [
                FieldPanel("date"),
            ],
            heading="Informacion de la noticia",
        ),
        FieldPanel("summary"),
        FieldPanel("body"),
        FieldPanel("main_image"),
    ]

    api_fields = [
        APIField("date"),
        APIField("summary"),
        APIField("body"),
        APIField("main_image"),
    ]

    parent_page_types = ["blog.NewsIndexPage"]

    search_fields = Page.search_fields + [
        index.SearchField("title"),
        index.SearchField("summary"),
        index.SearchField("body"),
    ]


class Comment(models.Model):
    """Comentario asociado a un BlogPage, creado por un usuario autenticado con Google."""

    post = models.ForeignKey(
        BlogPage,
        on_delete=models.CASCADE,
        related_name="comments",
    )
    author_name = models.CharField(max_length=150)
    author_email = models.EmailField()
    author_image = models.URLField(blank=True, default="")
    content = models.TextField()
    created_at = models.DateTimeField(auto_now_add=True)
    is_approved = models.BooleanField(
        default=False,
        help_text="Desmarcar para ocultar el comentario (moderacion).",
    )

    class Meta:
        ordering = ["-created_at"]
        verbose_name = "Comentario"
        verbose_name_plural = "Comentarios"

    def __str__(self):
        return f"{self.author_name} en '{self.post.title}'"


class ConsultationRequest(models.Model):
    class Status(models.TextChoices):
        PENDING = "pending", "Pendiente"
        IN_REVIEW = "in_review", "En revision"
        RESOLVED = "resolved", "Resuelta"
        REJECTED = "rejected", "Rechazada"

    full_name = models.CharField(max_length=150)
    email = models.EmailField()
    phone = models.CharField(max_length=50)
    subject = models.CharField(max_length=200)
    message = models.TextField()
    status = models.CharField(
        max_length=20,
        choices=Status.choices,
        default=Status.PENDING,
    )
    internal_notes = models.TextField(blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ["-created_at"]
        verbose_name = "Solicitud de consultoria"
        verbose_name_plural = "Solicitudes de consultoria"

    def __str__(self):
        return f"{self.full_name} - {self.subject}"


class ConsultationAttachment(models.Model):
    request = models.ForeignKey(
        ConsultationRequest,
        on_delete=models.CASCADE,
        related_name="attachments",
    )
    file = models.FileField(upload_to=consultation_attachment_upload_to)
    uploaded_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ["uploaded_at"]
        verbose_name = "Adjunto de consultoria"
        verbose_name_plural = "Adjuntos de consultoria"

    @property
    def filename(self):
        return os.path.basename(self.file.name)

    def __str__(self):
        return self.filename


class GuestPostSubmission(models.Model):
    class Status(models.TextChoices):
        PENDING = "pending", "Pendiente"
        IN_REVIEW = "in_review", "En revision"
        DRAFT_CREATED = "draft_created", "Borrador creado"
        REJECTED = "rejected", "Rechazada"

    full_name = models.CharField(max_length=150)
    email = models.EmailField()
    author_image = models.URLField(blank=True, default="")
    title = models.CharField(max_length=200)
    summary = models.CharField(max_length=250)
    content = models.TextField()
    suggested_tags = models.CharField(max_length=250, blank=True)
    publish_anonymously = models.BooleanField(default=False)
    status = models.CharField(
        max_length=20,
        choices=Status.choices,
        default=Status.PENDING,
    )
    editorial_notes = models.TextField(blank=True)
    created_blog_page = models.ForeignKey(
        BlogPage,
        null=True,
        blank=True,
        on_delete=models.SET_NULL,
        related_name="guest_submissions",
    )
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ["-created_at"]
        verbose_name = "Publicacion invitada"
        verbose_name_plural = "Publicaciones invitadas"

    @property
    def public_author_name(self):
        return "Autor anonimo" if self.publish_anonymously else self.full_name

    def __str__(self):
        return f"{self.title} - {self.full_name}"


class GuestPostAttachment(models.Model):
    submission = models.ForeignKey(
        GuestPostSubmission,
        on_delete=models.CASCADE,
        related_name="attachments",
    )
    file = models.FileField(upload_to=guest_post_attachment_upload_to)
    uploaded_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ["uploaded_at"]
        verbose_name = "Adjunto de publicacion invitada"
        verbose_name_plural = "Adjuntos de publicaciones invitadas"

    @property
    def filename(self):
        return os.path.basename(self.file.name)

    def __str__(self):
        return self.filename
