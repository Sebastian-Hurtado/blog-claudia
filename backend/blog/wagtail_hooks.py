from django.urls import path, reverse

from wagtail import hooks
from wagtail.admin.menu import MenuItem

from .wagtail_views import (
    CommentApproveView,
    CommentModerationView,
    CommentRejectView,
    ConsultationRequestDetailView,
    ConsultationRequestListView,
    ConsultationRequestUpdateView,
    GuestPostCreateDraftView,
    GuestPostSubmissionDetailView,
    GuestPostSubmissionListView,
    GuestPostSubmissionUpdateView,
)


@hooks.register("register_admin_urls")
def register_blog_admin_urls():
    return [
        path(
            "comments/moderation/",
            CommentModerationView.as_view(),
            name="blog_comment_moderation",
        ),
        path(
            "comments/<int:comment_id>/approve/",
            CommentApproveView.as_view(),
            name="blog_comment_approve",
        ),
        path(
            "comments/<int:comment_id>/reject/",
            CommentRejectView.as_view(),
            name="blog_comment_reject",
        ),
        path(
            "consultations/",
            ConsultationRequestListView.as_view(),
            name="blog_consultation_list",
        ),
        path(
            "consultations/<int:request_id>/",
            ConsultationRequestDetailView.as_view(),
            name="blog_consultation_detail",
        ),
        path(
            "consultations/<int:request_id>/update/",
            ConsultationRequestUpdateView.as_view(),
            name="blog_consultation_update",
        ),
        path(
            "guest-posts/",
            GuestPostSubmissionListView.as_view(),
            name="blog_guest_post_list",
        ),
        path(
            "guest-posts/<int:submission_id>/",
            GuestPostSubmissionDetailView.as_view(),
            name="blog_guest_post_detail",
        ),
        path(
            "guest-posts/<int:submission_id>/update/",
            GuestPostSubmissionUpdateView.as_view(),
            name="blog_guest_post_update",
        ),
        path(
            "guest-posts/<int:submission_id>/create-draft/",
            GuestPostCreateDraftView.as_view(),
            name="blog_guest_post_create_draft",
        ),
    ]


@hooks.register("register_admin_menu_item")
def register_comment_moderation_menu_item():
    return MenuItem(
        "Moderacion",
        reverse("blog_comment_moderation"),
        icon_name="comment",
        order=850,
    )


@hooks.register("register_admin_menu_item")
def register_consultation_menu_item():
    return MenuItem(
        "Consultorias",
        reverse("blog_consultation_list"),
        icon_name="mail",
        order=860,
    )


@hooks.register("register_admin_menu_item")
def register_guest_post_menu_item():
    return MenuItem(
        "Publicaciones invitadas",
        reverse("blog_guest_post_list"),
        icon_name="doc-full",
        order=870,
    )
