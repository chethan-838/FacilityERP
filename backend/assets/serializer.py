from rest_framework import serializers
from .models import AssetCategory, Asset


class AssetCategorySerializer(serializers.ModelSerializer):
    class Meta:
        model = AssetCategory
        fields = "__all__"


class AssetSerializer(serializers.ModelSerializer):
    category_name = serializers.CharField(
        source="category.category_name",
        read_only=True
    )

    location_name = serializers.CharField(
        source="location.location_name",
        read_only=True
    )

    class Meta:
        model = Asset
        fields = [
            "id",
            "asset_code",
            "asset_name",
            "category",
            "category_name",
            "location",
            "location_name",
            "purchase_date",
            "purchase_cost",
            "warranty_expiry",
            "status",
            "description",
            "created_at",
        ]