from django.contrib import messages
from django.contrib.auth.mixins import PermissionRequiredMixin
from django.db.models import Q
from django.shortcuts import get_object_or_404, redirect
from django.views.generic import TemplateView, View

from .models import Comment, ConsultationRequest
from .serializers import ConsultationRequestUpdateSerializer


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
