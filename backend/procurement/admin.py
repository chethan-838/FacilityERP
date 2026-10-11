from django.contrib import admin

from .models import (
    VendorCategory,
    Vendor,
    PurchaseRequest,
    PurchaseRequestItem,
    PurchaseOrder,
    PurchaseOrderItem,
)


@admin.register(VendorCategory)
class VendorCategoryAdmin(admin.ModelAdmin):

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


@admin.register(Vendor)
class VendorAdmin(admin.ModelAdmin):

    list_display = (
        "id",
        "vendor_code",
        "vendor_name",
        "category",
        "contact_person",
        "email",
        "phone",
        "status",
        "created_at",
    )

    search_fields = (
        "vendor_code",
        "vendor_name",
        "contact_person",
        "email",
        "phone",
    )

    list_filter = (
        "category",
        "status",
    )

    ordering = ("id",)


@admin.register(PurchaseRequest)
class PurchaseRequestAdmin(admin.ModelAdmin):

    list_display = (
        "id",
        "request_code",
        "requested_by",
        "request_date",
        "required_date",
        "status",
        "created_at",
    )

    search_fields = (
        "request_code",
    )

    list_filter = (
        "status",
        "request_date",
    )

    ordering = ("id",)


@admin.register(PurchaseRequestItem)
class PurchaseRequestItemAdmin(admin.ModelAdmin):

    list_display = (
        "id",
        "purchase_request",
        "spare_part",
        "requested_quantity",
        "remarks",
    )

    search_fields = (
        "purchase_request__request_code",
        "spare_part__part_code",
        "spare_part__part_name",
    )

    ordering = ("id",)


@admin.register(PurchaseOrder)
class PurchaseOrderAdmin(admin.ModelAdmin):

    list_display = (
        "id",
        "purchase_order_code",
        "vendor",
        "purchase_request",
        "ordered_by",
        "order_date",
        "expected_delivery_date",
        "status",
        "total_amount",
        "created_at",
    )

    search_fields = (
        "purchase_order_code",
        "vendor__vendor_code",
        "vendor__vendor_name",
    )

    list_filter = (
        "status",
        "order_date",
    )

    ordering = ("id",)


@admin.register(PurchaseOrderItem)
class PurchaseOrderItemAdmin(admin.ModelAdmin):

    list_display = (
        "id",
        "purchase_order",
        "spare_part",
        "ordered_quantity",
        "received_quantity",
        "unit_price",
        "remarks",
    )

    search_fields = (
        "purchase_order__purchase_order_code",
        "spare_part__part_code",
        "spare_part__part_name",
    )

    ordering = ("id",)
