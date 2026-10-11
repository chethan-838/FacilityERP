from django.db.models import Count, Sum, F
from django.db.models.functions import TruncMonth

from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status

from employees.models import Employee
from locations.models import Location
from assets.models import Asset

from maintenance.models import (
    MaintenanceRequest,
    WorkOrder,
)

from inventory.models import (
    SparePart,
    Inventory,
    StockTransaction,
)

from procurement.models import (
    Vendor,
    PurchaseRequest,
    PurchaseOrder,
)


class DashboardSummaryAPIView(APIView):

    def get(self, request):

        total_employees = Employee.objects.count()

        total_locations = Location.objects.count()

        total_assets = Asset.objects.count()

        total_maintenance_requests = (
            MaintenanceRequest.objects.count()
        )

        total_work_orders = WorkOrder.objects.count()

        total_spare_parts = SparePart.objects.count()

        total_vendors = Vendor.objects.count()

        total_purchase_requests = (
            PurchaseRequest.objects.count()
        )

        total_purchase_orders = (
            PurchaseOrder.objects.count()
        )

        low_stock_count = Inventory.objects.filter(
            current_quantity__lt=F("minimum_stock_level")
        ).count()

        purchase_order_value = (
            PurchaseOrder.objects.aggregate(
                total=Sum("total_amount")
            )["total"]
        )

        if purchase_order_value is None:
            purchase_order_value = 0

        return Response(
            {
                "employees": total_employees,
                "locations": total_locations,
                "assets": total_assets,
                "maintenance_requests":
                    total_maintenance_requests,
                "work_orders": total_work_orders,
                "spare_parts": total_spare_parts,
                "low_stock_items": low_stock_count,
                "vendors": total_vendors,
                "purchase_requests":
                    total_purchase_requests,
                "purchase_orders":
                    total_purchase_orders,
                "purchase_order_value":
                    purchase_order_value,
            },
            status=status.HTTP_200_OK
        )


class MaintenanceReportAPIView(APIView):

    def get(self, request):

        total_requests = MaintenanceRequest.objects.count()

        total_work_orders = WorkOrder.objects.count()

        return Response(
            {
                "total_maintenance_requests":
                    total_requests,

                "total_work_orders":
                    total_work_orders,
            },
            status=status.HTTP_200_OK
        )


class WorkOrderReportAPIView(APIView):

    def get(self, request):

        work_orders_by_status = (
            WorkOrder.objects
            .values("status")
            .annotate(total=Count("id"))
            .order_by("status")
        )

        return Response(
            {
                "work_orders_by_status":
                    list(work_orders_by_status)
            },
            status=status.HTTP_200_OK
        )


class InventoryReportAPIView(APIView):

    def get(self, request):

        total_spare_parts = SparePart.objects.count()

        total_inventory_items = Inventory.objects.count()

        low_stock_items = Inventory.objects.filter(
            current_quantity__lt=F("minimum_stock_level")
        ).count()

        total_stock_quantity = (
            Inventory.objects.aggregate(
                total=Sum("current_quantity")
            )["total"]
        )

        if total_stock_quantity is None:
            total_stock_quantity = 0

        return Response(
            {
                "total_spare_parts":
                    total_spare_parts,

                "total_inventory_items":
                    total_inventory_items,

                "low_stock_items":
                    low_stock_items,

                "total_stock_quantity":
                    total_stock_quantity,
            },
            status=status.HTTP_200_OK
        )


class LowStockReportAPIView(APIView):

    def get(self, request):

        low_stock_items = (
            Inventory.objects
            .filter(
                current_quantity__lt=
                F("minimum_stock_level")
            )
            .select_related("spare_part")
            .order_by("id")
        )

        data = []

        for item in low_stock_items:

            data.append(
                {
                    "id": item.id,
                    "spare_part":
                        item.spare_part.part_code,
                    "part_name":
                        item.spare_part.part_name,
                    "current_quantity":
                        item.current_quantity,
                    "minimum_stock_level":
                        item.minimum_stock_level,
                    "storage_location":
                        item.storage_location,
                }
            )

        return Response(
            data,
            status=status.HTTP_200_OK
        )


class ProcurementReportAPIView(APIView):

    def get(self, request):

        total_vendors = Vendor.objects.count()

        total_purchase_requests = (
            PurchaseRequest.objects.count()
        )

        total_purchase_orders = (
            PurchaseOrder.objects.count()
        )

        total_purchase_order_value = (
            PurchaseOrder.objects.aggregate(
                total=Sum("total_amount")
            )["total"]
        )

        if total_purchase_order_value is None:
            total_purchase_order_value = 0

        purchase_orders_by_status = (
            PurchaseOrder.objects
            .values("status")
            .annotate(total=Count("id"))
            .order_by("status")
        )

        return Response(
            {
                "total_vendors":
                    total_vendors,

                "total_purchase_requests":
                    total_purchase_requests,

                "total_purchase_orders":
                    total_purchase_orders,

                "total_purchase_order_value":
                    total_purchase_order_value,

                "purchase_orders_by_status":
                    list(purchase_orders_by_status),
            },
            status=status.HTTP_200_OK
        )


class MonthlyProcurementReportAPIView(APIView):

    def get(self, request):

        monthly_data = (
            PurchaseOrder.objects
            .annotate(
                month=TruncMonth("order_date")
            )
            .values("month")
            .annotate(
                total_orders=Count("id"),
                total_amount=Sum("total_amount"),
            )
            .order_by("month")
        )

        data = []

        for item in monthly_data:

            data.append(
                {
                    "month": item["month"],
                    "total_orders":
                        item["total_orders"],
                    "total_amount":
                        item["total_amount"],
                }
            )

        return Response(
            data,
            status=status.HTTP_200_OK
        )
