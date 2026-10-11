from django.contrib import admin

from .models import (
    SparePartCategory,
    SparePart,
    Inventory,
    StockTransaction
)


@admin.register(SparePartCategory)
class SparePartCategoryAdmin(admin.ModelAdmin):

    list_display = (
        "id",
        "category_name",
        "description",
        "created_at",
    )

    search_fields = (
        "category_name",
    )

    ordering = ("id",)


@admin.register(SparePart)
class SparePartAdmin(admin.ModelAdmin):

    list_display = (
        "id",
        "part_code",
        "part_name",
        "category",
        "unit",
        "status",
        "created_at",
    )

    search_fields = (
        "part_code",
        "part_name",
    )

    list_filter = (
        "category",
        "status",
    )

    ordering = ("id",)


@admin.register(Inventory)
class InventoryAdmin(admin.ModelAdmin):

    list_display = (
        "id",
        "spare_part",
        "current_quantity",
        "minimum_stock_level",
        "maximum_stock_level",
        "storage_location",
        "last_updated",
    )

    search_fields = (
        "spare_part__part_code",
        "spare_part__part_name",
        "storage_location",
    )

    ordering = ("id",)


@admin.register(StockTransaction)
class StockTransactionAdmin(admin.ModelAdmin):

    list_display = (
        "id",
        "spare_part",
        "transaction_type",
        "quantity",
        "reference",
        "transaction_date",
    )

    search_fields = (
        "spare_part__part_code",
        "reference",
        "remarks",
    )

    list_filter = (
        "transaction_type",
        "transaction_date",
    )

    ordering = ("id",)