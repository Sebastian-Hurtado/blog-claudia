from django.urls import path
from . import views

urlpatterns = [
    path("health/", views.health),
    path("comments/<slug:slug>/", views.list_comments),
    path("comments/", views.create_comment),
    path("consultation-requests/", views.create_consultation_request),
    path("guest-post-submissions/", views.guest_post_submissions),
]

