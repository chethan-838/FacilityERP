from rest_framework import serializers

from .models import (
    SparePartCategory,
    SparePart,
    Inventory,
    StockTransaction
)


class SparePartCategorySerializer(serializers.ModelSerializer):

    class Meta:
        model = SparePartCategory
        fields = "__all__"


class SparePartSerializer(serializers.ModelSerializer):

    category_name = serializers.CharField(
        source="category.category_name",
        read_only=True
    )

    class Meta:
        model = SparePart
        fields = [
            "id",
            "part_code",
            "part_name",
            "category",
            "category_name",
            "unit",
            "description",
            "status",
            "created_at",
        ]


class InventorySerializer(serializers.ModelSerializer):

    part_code = serializers.CharField(
        source="spare_part.part_code",
        read_only=True
    )

    part_name = serializers.CharField(
        source="spare_part.part_name",
        read_only=True
    )

    category_name = serializers.CharField(
        source="spare_part.category.category_name",
        read_only=True
    )

    class Meta:
        model = Inventory
        fields = [
            "id",
            "spare_part",
            "part_code",
            "part_name",
            "category_name",
            "current_quantity",
            "minimum_stock_level",
            "maximum_stock_level",
            "storage_location",
            "last_updated",
        ]


class StockTransactionSerializer(serializers.ModelSerializer):

    part_code = serializers.CharField(
        source="spare_part.part_code",
        read_only=True
    )

    part_name = serializers.CharField(
        source="spare_part.part_name",
        read_only=True
    )

    class Meta:
        model = StockTransaction
        fields = [
            "id",
            "spare_part",
            "part_code",
            "part_name",
            "transaction_type",
            "quantity",
            "reference",
            "remarks",
            "transaction_date",
        ]