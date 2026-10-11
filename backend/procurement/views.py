from notifications.notification_utils import create_procurement_notification
from decimal import Decimal

from django.db import transaction

from rest_framework import status, viewsets
from rest_framework.decorators import action
from rest_framework.response import Response

from inventory.models import Inventory, StockTransaction

from .models import (
    VendorCategory,
    Vendor,
    PurchaseRequest,
    PurchaseRequestItem,
    PurchaseOrder,
    PurchaseOrderItem,
)

from .serializers import (
    VendorCategorySerializer,
    VendorSerializer,
    PurchaseRequestSerializer,
    PurchaseRequestItemSerializer,
    PurchaseOrderSerializer,
    PurchaseOrderItemSerializer,
)


class VendorCategoryViewSet(viewsets.ModelViewSet):

    queryset = VendorCategory.objects.all()

    serializer_class = VendorCategorySerializer


class VendorViewSet(viewsets.ModelViewSet):

    queryset = Vendor.objects.select_related(
        "category"
    ).all()

    serializer_class = VendorSerializer

    def get_queryset(self):

        queryset = Vendor.objects.select_related(
            "category"
        ).all()

        status_filter = self.request.query_params.get("status")

        if status_filter:
            queryset = queryset.filter(
                status=status_filter
            )

        return queryset


class PurchaseRequestViewSet(viewsets.ModelViewSet):

    queryset = PurchaseRequest.objects.select_related(
        "requested_by"
    ).all()

    serializer_class = PurchaseRequestSerializer

    def get_queryset(self):

        queryset = PurchaseRequest.objects.select_related(
            "requested_by"
        ).all()

        request_status = self.request.query_params.get("status")

        if request_status:
            queryset = queryset.filter(
                status=request_status
            )

        return queryset


class PurchaseRequestItemViewSet(viewsets.ModelViewSet):

    queryset = PurchaseRequestItem.objects.select_related(
        "purchase_request",
        "spare_part"
    ).all()

    serializer_class = PurchaseRequestItemSerializer

class PurchaseOrderViewSet(viewsets.ModelViewSet):

    queryset = PurchaseOrder.objects.select_related(
        "vendor",
        "purchase_request",
        "ordered_by"
    ).all()

    serializer_class = PurchaseOrderSerializer

    def get_queryset(self):

        queryset = PurchaseOrder.objects.select_related(
            "vendor",
            "purchase_request",
            "ordered_by"
        ).all()

        order_status = self.request.query_params.get("status")

        vendor_id = self.request.query_params.get("vendor")

        if order_status:
            queryset = queryset.filter(
                status=order_status
            )

        if vendor_id:
            queryset = queryset.filter(
                vendor_id=vendor_id
            )

        return queryset

    def perform_create(self, serializer):

        purchase_order = serializer.save()

        create_procurement_notification(
            purchase_order.id
        )

    @action(
        detail=True,
        methods=["post"],
        url_path="receive"
    )
    def receive(self, request, pk=None):

        purchase_order = self.get_object()

        if purchase_order.status == "Received":
            return Response(
                {
                    "error": "This purchase order has already been received."
                },
                status=status.HTTP_400_BAD_REQUEST
            )

        items = purchase_order.items.select_related(
            "spare_part"
        ).all()

        if not items.exists():
            return Response(
                {
                    "error": "This purchase order has no items."
                },
                status=status.HTTP_400_BAD_REQUEST
            )

        with transaction.atomic():

            for item in items:

                pending_quantity = (
                    item.ordered_quantity -
                    item.received_quantity
                )

                if pending_quantity <= 0:
                    continue

                try:
                    inventory = Inventory.objects.get(
                        spare_part=item.spare_part
                    )

                except Inventory.DoesNotExist:

                    return Response(
                        {
                            "error":
                            f"Inventory record does not exist for "
                            f"{item.spare_part.part_code}."
                        },
                        status=status.HTTP_400_BAD_REQUEST
                    )

                inventory.current_quantity += pending_quantity

                inventory.save(
                    update_fields=[
                        "current_quantity",
                        "last_updated"
                    ]
                )

                StockTransaction.objects.create(
                    spare_part=item.spare_part,
                    transaction_type="RECEIVED",
                    quantity=pending_quantity,
                    reference=purchase_order.purchase_order_code,
                    remarks="Stock received against purchase order."
                )

                item.received_quantity = item.ordered_quantity

                item.save(
                    update_fields=[
                        "received_quantity"
                    ]
                )

            purchase_order.status = "Received"

            purchase_order.save(
                update_fields=[
                    "status",
                    "updated_at"
                ]
            )

        create_procurement_notification(
            purchase_order.id
        )

        return Response(
            {
                "message":
                "Purchase order received successfully.",
                "purchase_order":
                purchase_order.purchase_order_code,
                "status":
                purchase_order.status
            },
            status=status.HTTP_200_OK
        )


class PurchaseOrderItemViewSet(viewsets.ModelViewSet):

    queryset = PurchaseOrderItem.objects.select_related(
        "purchase_order",
        "spare_part"
    ).all()

    serializer_class = PurchaseOrderItemSerializer