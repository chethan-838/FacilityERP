from django.urls import path

from .views import (
    DashboardSummaryAPIView,
    MaintenanceReportAPIView,
    WorkOrderReportAPIView,
    InventoryReportAPIView,
    LowStockReportAPIView,
    ProcurementReportAPIView,
    MonthlyProcurementReportAPIView,
)


urlpatterns = [

    path(
        "summary/",
        DashboardSummaryAPIView.as_view(),
        name="dashboard-summary"
    ),

    path(
        "maintenance/",
        MaintenanceReportAPIView.as_view(),
        name="maintenance-report"
    ),

    path(
        "work-orders/",
        WorkOrderReportAPIView.as_view(),
        name="work-order-report"
    ),

    path(
        "inventory/",
        InventoryReportAPIView.as_view(),
        name="inventory-report"
    ),

    path(
        "low-stock/",
        LowStockReportAPIView.as_view(),
        name="low-stock-report"
    ),

    path(
        "procurement/",
        ProcurementReportAPIView.as_view(),
        name="procurement-report"
    ),

    path(
        "procurement/monthly/",
        MonthlyProcurementReportAPIView.as_view(),
        name="monthly-procurement-report"
    ),
]