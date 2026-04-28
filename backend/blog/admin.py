from django.contrib import admin

from .models import Comment, ConsultationAttachment, ConsultationRequest


@admin.register(Comment)
class CommentAdmin(admin.ModelAdmin):
    list_display = ("author_name", "post", "created_at", "is_approved")
    list_filter = ("is_approved", "created_at")
    search_fields = ("author_name", "author_email", "content")
    actions = ["approve_comments", "reject_comments"]

    @admin.action(description="Aprobar comentarios seleccionados")
    def approve_comments(self, request, queryset):
        queryset.update(is_approved=True)

    @admin.action(description="Rechazar comentarios seleccionados")
    def reject_comments(self, request, queryset):
        queryset.update(is_approved=False)


class ConsultationAttachmentInline(admin.TabularInline):
    model = ConsultationAttachment
    extra = 0
    readonly_fields = ("uploaded_at",)


@admin.register(ConsultationRequest)
class ConsultationRequestAdmin(admin.ModelAdmin):
    list_display = ("full_name", "email", "subject", "status", "created_at")
    list_filter = ("status", "created_at")
    search_fields = ("full_name", "email", "subject", "message")
    readonly_fields = ("created_at", "updated_at")
    inlines = [ConsultationAttachmentInline]


@admin.register(ConsultationAttachment)
class ConsultationAttachmentAdmin(admin.ModelAdmin):
    list_display = ("request", "file", "uploaded_at")
    search_fields = ("request__full_name", "request__email", "file")
    readonly_fields = ("uploaded_at",)
