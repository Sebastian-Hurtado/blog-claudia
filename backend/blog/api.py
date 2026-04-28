from wagtail.api.v2.views import PagesAPIViewSet
from wagtail.api.v2.filters import FieldsFilter, OrderingFilter, SearchFilter
from django_filters.rest_framework import DjangoFilterBackend


class BlogPagesAPIViewSet(PagesAPIViewSet):
    """
    ViewSet personalizado que permite filtrar y excluir posts por tags.
    
    Ejemplos:
      ?tags=madres-comunitarias          → solo posts con ese tag
      ?exclude_tags=madres-comunitarias  → posts SIN ese tag
      Se pueden combinar con comas: ?exclude_tags=tag1,tag2,tag3
    """

    filter_backends = PagesAPIViewSet.filter_backends + [
        DjangoFilterBackend,
    ]

    known_query_parameters = PagesAPIViewSet.known_query_parameters.union(
        {"tags", "exclude_tags"}
    )

    def get_queryset(self):
        qs = super().get_queryset()
        from blog.models import BlogPage

        # Incluir solo posts CON estos tags
        tags = self.request.query_params.get("tags")
        if tags:
            tag_list = [t.strip() for t in tags.split(",")]
            tagged_ids = (
                BlogPage.objects.filter(tags__name__in=tag_list)
                .values_list("pk", flat=True)
            )
            qs = qs.filter(pk__in=tagged_ids)

        # Excluir posts CON estos tags
        exclude_tags = self.request.query_params.get("exclude_tags")
        if exclude_tags:
            exclude_list = [t.strip() for t in exclude_tags.split(",")]
            excluded_ids = (
                BlogPage.objects.filter(tags__name__in=exclude_list)
                .values_list("pk", flat=True)
            )
            qs = qs.exclude(pk__in=excluded_ids)
        return qs
