from django_filters import rest_framework as filters


class DisabledHTMLFilterBackend(filters.DjangoFilterBackend):
    def to_html(self, request, queryset, view):
        return ""
