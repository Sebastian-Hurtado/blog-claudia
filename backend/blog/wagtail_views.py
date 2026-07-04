from django.contrib import messages
from django.contrib.auth.mixins import PermissionRequiredMixin
from django.db.models import Q
from django.shortcuts import get_object_or_404, redirect
from django.utils.html import escape
from django.utils import timezone
from django.utils.text import slugify
from django.views.generic import TemplateView, View

from .models import (
    BlogIndexPage,
    BlogPage,
    Comment,
    ConsultationRequest,
    GuestPostSubmission,
)
from .serializers import (
    ConsultationRequestUpdateSerializer,
    GuestPostSubmissionUpdateSerializer,
)


class CommentModerationView(PermissionRequiredMixin, TemplateView):
    permission_required = "blog.change_comment"
    template_name = "blog/wagtail/comment_moderation.html"

    def get_context_data(self, **kwargs):
        context = super().get_context_data(**kwargs)
        context["pending_comments"] = (
            Comment.objects.select_related("post")
            .filter(is_approved=False)
            .order_by("created_at")
        )
        context["approved_comments"] = (
            Comment.objects.select_related("post")
            .filter(is_approved=True)
            .order_by("-created_at")[:10]
        )
        return context


class CommentApproveView(PermissionRequiredMixin, View):
    permission_required = "blog.change_comment"

    def post(self, request, comment_id):
        comment = get_object_or_404(Comment, pk=comment_id)
        comment.is_approved = True
        comment.save(update_fields=["is_approved"])
        messages.success(request, "Comentario aprobado correctamente.")
        return redirect("blog_comment_moderation")


class CommentRejectView(PermissionRequiredMixin, View):
    permission_required = "blog.change_comment"

    def post(self, request, comment_id):
        comment = get_object_or_404(Comment, pk=comment_id)
        comment.is_approved = False
        comment.save(update_fields=["is_approved"])
        messages.success(request, "Comentario rechazado correctamente.")
        return redirect("blog_comment_moderation")


class ConsultationRequestListView(PermissionRequiredMixin, TemplateView):
    permission_required = "blog.change_consultationrequest"
    template_name = "blog/wagtail/consultation_request_list.html"

    def get_context_data(self, **kwargs):
        context = super().get_context_data(**kwargs)
        status_filter = self.request.GET.get("status", "").strip()
        query = self.request.GET.get("q", "").strip()

        requests = ConsultationRequest.objects.prefetch_related("attachments").all()
        if status_filter:
            requests = requests.filter(status=status_filter)
        if query:
            requests = requests.filter(
                Q(full_name__icontains=query)
                | Q(email__icontains=query)
                | Q(subject__icontains=query)
            )

        context["requests"] = requests.order_by("-created_at")
        context["selected_status"] = status_filter
        context["query"] = query
        context["status_choices"] = ConsultationRequest.Status.choices
        return context


class ConsultationRequestDetailView(PermissionRequiredMixin, TemplateView):
    permission_required = "blog.change_consultationrequest"
    template_name = "blog/wagtail/consultation_request_detail.html"

    def get_context_data(self, **kwargs):
        context = super().get_context_data(**kwargs)
        consultation = get_object_or_404(
            ConsultationRequest.objects.prefetch_related("attachments"),
            pk=self.kwargs["request_id"],
        )
        context["consultation"] = consultation
        context["status_choices"] = ConsultationRequest.Status.choices
        return context


class ConsultationRequestUpdateView(PermissionRequiredMixin, View):
    permission_required = "blog.change_consultationrequest"

    def post(self, request, request_id):
        consultation = get_object_or_404(ConsultationRequest, pk=request_id)
        serializer = ConsultationRequestUpdateSerializer(
            consultation,
            data={
                "status": request.POST.get("status", consultation.status),
                "internal_notes": request.POST.get(
                    "internal_notes",
                    consultation.internal_notes,
                ),
            },
        )
        serializer.is_valid(raise_exception=True)
        serializer.save()
        messages.success(request, "Solicitud de consultoria actualizada.")
        return redirect("blog_consultation_detail", request_id=consultation.id)


def _split_suggested_tags(raw_tags):
    return [
        tag.strip()
        for tag in raw_tags.replace(";", ",").split(",")
        if tag.strip()
    ]


def _unique_child_slug(parent, title):
    base_slug = slugify(title)[:80] or "publicacion-invitada"
    slug = base_slug
    counter = 2

    while parent.get_children().filter(slug=slug).exists():
        suffix = f"-{counter}"
        slug = f"{base_slug[:80 - len(suffix)]}{suffix}"
        counter += 1

    return slug


def _content_to_rich_text(content):
    paragraphs = [
        paragraph.strip()
        for paragraph in content.replace("\r\n", "\n").split("\n\n")
        if paragraph.strip()
    ]
    return "".join(
        f"<p>{escape(paragraph).replace(chr(10), '<br>')}</p>"
        for paragraph in paragraphs
    )


class GuestPostSubmissionListView(PermissionRequiredMixin, TemplateView):
    permission_required = "blog.change_guestpostsubmission"
    template_name = "blog/wagtail/guest_post_submission_list.html"

    def get_context_data(self, **kwargs):
        context = super().get_context_data(**kwargs)
        status_filter = self.request.GET.get("status", "").strip()
        query = self.request.GET.get("q", "").strip()

        submissions = GuestPostSubmission.objects.prefetch_related("attachments").all()
        if status_filter:
            submissions = submissions.filter(status=status_filter)
        if query:
            submissions = submissions.filter(
                Q(full_name__icontains=query)
                | Q(email__icontains=query)
                | Q(title__icontains=query)
            )

        context["submissions"] = submissions.order_by("-created_at")
        context["selected_status"] = status_filter
        context["query"] = query
        context["status_choices"] = GuestPostSubmission.Status.choices
        return context


class GuestPostSubmissionDetailView(PermissionRequiredMixin, TemplateView):
    permission_required = "blog.change_guestpostsubmission"
    template_name = "blog/wagtail/guest_post_submission_detail.html"

    def get_context_data(self, **kwargs):
        context = super().get_context_data(**kwargs)
        submission = get_object_or_404(
            GuestPostSubmission.objects.prefetch_related("attachments").select_related(
                "created_blog_page"
            ),
            pk=self.kwargs["submission_id"],
        )
        context["submission"] = submission
        context["status_choices"] = GuestPostSubmission.Status.choices
        return context


class GuestPostSubmissionUpdateView(PermissionRequiredMixin, View):
    permission_required = "blog.change_guestpostsubmission"

    def post(self, request, submission_id):
        submission = get_object_or_404(GuestPostSubmission, pk=submission_id)
        serializer = GuestPostSubmissionUpdateSerializer(
            submission,
            data={
                "status": request.POST.get("status", submission.status),
                "editorial_notes": request.POST.get(
                    "editorial_notes",
                    submission.editorial_notes,
                ),
            },
        )
        serializer.is_valid(raise_exception=True)
        serializer.save()
        messages.success(request, "Publicacion invitada actualizada.")
        return redirect("blog_guest_post_detail", submission_id=submission.id)


class GuestPostCreateDraftView(PermissionRequiredMixin, View):
    permission_required = "blog.add_blogpage"

    def post(self, request, submission_id):
        submission = get_object_or_404(GuestPostSubmission, pk=submission_id)

        if submission.created_blog_page_id:
            messages.info(request, "Esta publicacion ya tiene un borrador creado.")
            return redirect("blog_guest_post_detail", submission_id=submission.id)

        blog_index = BlogIndexPage.objects.live().first()
        if not blog_index:
            messages.error(
                request,
                "No existe una pagina indice de blog para crear el borrador.",
            )
            return redirect("blog_guest_post_detail", submission_id=submission.id)

        blog_page = BlogPage(
            title=submission.title,
            slug=_unique_child_slug(blog_index, submission.title),
            date=timezone.localdate(),
            intro=submission.summary,
            body=_content_to_rich_text(submission.content),
            author_display_name=submission.public_author_name,
            live=False,
            has_unpublished_changes=True,
        )
        blog_index.add_child(instance=blog_page)

        tags = _split_suggested_tags(submission.suggested_tags)
        if tags:
            blog_page.tags.set(tags)
            blog_page.save()

        blog_page.save_revision()

        submission.created_blog_page = blog_page
        submission.status = GuestPostSubmission.Status.DRAFT_CREATED
        submission.editorial_notes = request.POST.get(
            "editorial_notes",
            submission.editorial_notes,
        )
        submission.save(
            update_fields=[
                "created_blog_page",
                "status",
                "editorial_notes",
                "updated_at",
            ]
        )

        messages.success(request, "Borrador de blog creado correctamente.")
        return redirect("blog_guest_post_detail", submission_id=submission.id)
