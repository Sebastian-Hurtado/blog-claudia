from django.contrib import admin
from django.urls import path, include
from django.conf import settings
from django.conf.urls.static import static

from wagtail.admin import urls as wagtailadmin_urls
from wagtail.documents import urls as wagtaildocs_urls
from wagtail import urls as wagtail_urls

from wagtail.api.v2.views import PagesAPIViewSet
from wagtail.images.api.v2.views import ImagesAPIViewSet
from wagtail.api.v2.router import WagtailAPIRouter
from blog.api import BlogPagesAPIViewSet

# --- Wagtail API router ---
api_router = WagtailAPIRouter("wagtailapi")
api_router.register_endpoint("pages", BlogPagesAPIViewSet)
api_router.register_endpoint("images", ImagesAPIViewSet)

urlpatterns = [
    # Admin Django (opcional)
    path("admin/", admin.site.urls),

    # Panel Wagtail
    path("cms/", include(wagtailadmin_urls)),
    path("documents/", include(wagtaildocs_urls)),

    # API Wagtail
    path("wagtail-api/v2/", api_router.urls),

    # Tu API propia (si la tienes)
    path("api/", include("blog.urls")),

    # ✅ SIEMPRE DE ÚLTIMO: páginas públicas Wagtail
    path("", include(wagtail_urls)),
]

# Servir archivos media en desarrollo
if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)

