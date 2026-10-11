from rest_framework import serializers

from .models import (
    VendorCategory,
    Vendor,
    PurchaseRequest,
    PurchaseRequestItem,
    PurchaseOrder,
    PurchaseOrderItem,
)


class VendorCategorySerializer(serializers.ModelSerializer):

    class Meta:
        model = VendorCategory
        fields = "__all__"


class VendorSerializer(serializers.ModelSerializer):

    category_name = serializers.CharField(
        source="category.category_name",
        read_only=True
    )

    class Meta:
        model = Vendor
        fields = [
            "id",
            "vendor_code",
            "vendor_name",
            "category",
            "category_name",
            "contact_person",
            "email",
            "phone",
            "address",
            "city",
            "state",
            "status",
            "created_at",
        ]


class PurchaseRequestSerializer(serializers.ModelSerializer):

    requested_by_name = serializers.SerializerMethodField()

    class Meta:
        model = PurchaseRequest
        fields = [
            "id",
            "request_code",
            "requested_by",
            "requested_by_name",
            "request_date",
            "required_date",
            "purpose",
            "status",
            "created_at",
            "updated_at",
        ]

    def get_requested_by_name(self, obj):
        return str(obj.requested_by)


class PurchaseRequestItemSerializer(serializers.ModelSerializer):

    part_code = serializers.CharField(
        source="spare_part.part_code",
        read_only=True
    )

    part_name = serializers.CharField(
        source="spare_part.part_name",
        read_only=True
    )

    class Meta:
        model = PurchaseRequestItem
        fields = [
            "id",
            "purchase_request",
            "spare_part",
            "part_code",
            "part_name",
            "requested_quantity",
            "remarks",
        ]


class PurchaseOrderSerializer(serializers.ModelSerializer):

    vendor_name = serializers.CharField(
        source="vendor.vendor_name",
        read_only=True
    )

    class Meta:
        model = PurchaseOrder
        fields = [
            "id",
            "purchase_order_code",
            "vendor",
            "vendor_name",
            "purchase_request",
            "ordered_by",
            "order_date",
            "expected_delivery_date",
            "status",
            "notes",
            "total_amount",
            "created_at",
            "updated_at",
        ]


class PurchaseOrderItemSerializer(serializers.ModelSerializer):

    part_code = serializers.CharField(
        source="spare_part.part_code",
        read_only=True
    )

    part_name = serializers.CharField(
        source="spare_part.part_name",
        read_only=True
    )

    line_total = serializers.DecimalField(
        max_digits=14,
        decimal_places=2,
        read_only=True
    )

    pending_quantity = serializers.DecimalField(
        max_digits=12,
        decimal_places=2,
        read_only=True
    )

    class Meta:
        model = PurchaseOrderItem
        fields = [
            "id",
            "purchase_order",
            "spare_part",
            "part_code",
            "part_name",
            "ordered_quantity",
            "received_quantity",
            "pending_quantity",
            "unit_price",
            "line_total",
            "remarks",
        ]