from django_filters import rest_framework as filters

from articles.models import Article


class ArticleFilter(filters.FilterSet):
    tag = filters.CharFilter(field_name="tag_list__name")
    author = filters.CharFilter(field_name="author__username")
    favorited = filters.CharFilter(field_name="favored_by__username")
    title = filters.CharFilter(field_name="title", lookup_expr="icontains")
    created_after = filters.DateFilter(field_name="created_at", lookup_expr="gte")
    created_before = filters.DateFilter(field_name="created_at", lookup_expr="lte")
    ordering = filters.OrderingFilter(
        fields=(
            ('created_at', 'created'),
            ('updated_at', 'updated'),
            ('title', 'title'),
        ),
    )

    class Meta:
        model = Article
        fields = ["author", "tag", "favorited", "title", "created_after", "created_before"]
