from django.urls import path, include
from rest_framework.routers import DefaultRouter

from .views import (
    MaintenanceRequestViewSet,
    TechnicianViewSet,
    WorkOrderViewSet,
    PreventiveMaintenanceViewSet,
)


router = DefaultRouter()

router.register(
    "maintenance-requests",
    MaintenanceRequestViewSet,
    basename="maintenance-request"
)

router.register(
    "technicians",
    TechnicianViewSet,
    basename="technician"
)

router.register(
    "work-orders",
    WorkOrderViewSet,
    basename="work-order"
)

router.register(
    "preventive-maintenance",
    PreventiveMaintenanceViewSet,
    basename="preventive-maintenance"
)


urlpatterns = [
    path("", include(router.urls)),
]