from notifications.notification_utils import create_low_stock_notification
from decimal import Decimal
from django.db import models
from rest_framework import viewsets
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework import status

from .models import (
    SparePartCategory,
    SparePart,
    Inventory,
    StockTransaction
)

from .serializers import (
    SparePartCategorySerializer,
    SparePartSerializer,
    InventorySerializer,
    StockTransactionSerializer
)


class SparePartCategoryViewSet(viewsets.ModelViewSet):

    queryset = SparePartCategory.objects.all()

    serializer_class = SparePartCategorySerializer


class SparePartViewSet(viewsets.ModelViewSet):

    queryset = SparePart.objects.select_related(
        "category"
    ).all()

    serializer_class = SparePartSerializer


class InventoryViewSet(viewsets.ModelViewSet):

    queryset = Inventory.objects.select_related(
        "spare_part",
        "spare_part__category"
    ).all()

    serializer_class = InventorySerializer

    def get_queryset(self):

        queryset = Inventory.objects.select_related(
            "spare_part",
            "spare_part__category"
        ).all()

        category = self.request.query_params.get(
            "category"
        )

        if category:
            queryset = queryset.filter(
                spare_part__category__category_name=category
            )

        return queryset

    @action(
        detail=False,
        methods=["get"],
        url_path="low-stock"
    )
    def low_stock(self, request):

        queryset = Inventory.objects.select_related(
            "spare_part",
            "spare_part__category"
        ).filter(
            current_quantity__lte=models.F("minimum_stock_level")
        )

        serializer = self.get_serializer(
            queryset,
            many=True
        )

        return Response({
            "count": queryset.count(),
            "low_stock_items": serializer.data
        })


class StockTransactionViewSet(viewsets.ModelViewSet):

    queryset = StockTransaction.objects.select_related(
        "spare_part"
    ).all()

    serializer_class = StockTransactionSerializer

    def create(self, request, *args, **kwargs):

        spare_part_id = request.data.get("spare_part")
        transaction_type = request.data.get("transaction_type")
        quantity = request.data.get("quantity")

        if not spare_part_id:
            return Response(
                {"error": "Spare part is required."},
                status=status.HTTP_400_BAD_REQUEST
            )

        if not transaction_type:
            return Response(
                {"error": "Transaction type is required."},
                status=status.HTTP_400_BAD_REQUEST
            )

        if not quantity:
            return Response(
                {"error": "Quantity is required."},
                status=status.HTTP_400_BAD_REQUEST
            )

        try:
            quantity = Decimal(str(quantity))
        except Exception:
            return Response(
                {"error": "Quantity must be a valid number."},
                status=status.HTTP_400_BAD_REQUEST
            )

        if quantity <= 0:
            return Response(
                {"error": "Quantity must be greater than zero."},
                status=status.HTTP_400_BAD_REQUEST
            )

        try:
            inventory = Inventory.objects.get(
                spare_part_id=spare_part_id
            )
        except Inventory.DoesNotExist:
            return Response(
                {
                    "error": "Inventory record does not exist for this spare part."
                },
                status=status.HTTP_400_BAD_REQUEST
            )

        if transaction_type == "RECEIVED":

            inventory.current_quantity += quantity

            inventory.save(
                update_fields=[
                    "current_quantity",
                    "last_updated"
                ]
            )

        elif transaction_type == "ISSUED":

            if quantity > inventory.current_quantity:

                return Response(
                    {
                        "error": "Insufficient stock.",
                        "available_stock": inventory.current_quantity,
                        "requested_quantity": quantity
                    },
                    status=status.HTTP_400_BAD_REQUEST
                )

            inventory.current_quantity -= quantity

            inventory.save(
                update_fields=[
                    "current_quantity",
                    "last_updated"
                ]
            )

        elif transaction_type == "ADJUSTMENT":

            inventory.current_quantity += quantity

            inventory.save(
                update_fields=[
                    "current_quantity",
                    "last_updated"
                ]
            )

        else:

            return Response(
                {"error": "Invalid transaction type."},
                status=status.HTTP_400_BAD_REQUEST
            )

        serializer = self.get_serializer(
            data=request.data
        )

        serializer.is_valid(
            raise_exception=True
        )

        serializer.save()

        if inventory.current_quantity <= inventory.minimum_stock_level:
         create_low_stock_notification(
        employee_id=1
    )

        return Response(
           serializer.data,
        status=status.HTTP_201_CREATED
    )