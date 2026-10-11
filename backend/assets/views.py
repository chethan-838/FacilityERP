from rest_framework import viewsets

from .models import AssetCategory, Asset
from .serializer import AssetCategorySerializer, AssetSerializer


class AssetCategoryViewSet(viewsets.ModelViewSet):
    queryset = AssetCategory.objects.all()
    serializer_class = AssetCategorySerializer


class AssetViewSet(viewsets.ModelViewSet):
    queryset = Asset.objects.select_related(
        "category",
        "location"
    ).all()

    serializer_class = AssetSerializer
