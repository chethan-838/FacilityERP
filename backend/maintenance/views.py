from notifications.notification_utils import create_preventive_maintenance_notification
from notifications.notification_utils import create_maintenance_notification
from notifications.notification_utils import create_work_order_notification
from datetime import timedelta

from django.utils import timezone
from rest_framework import viewsets, status
from rest_framework.decorators import action
from rest_framework.response import Response

from .models import (
    MaintenanceRequest,
    Technician,
    WorkOrder,
    PreventiveMaintenance
)

from .serializers import (
    MaintenanceRequestSerializer,
    TechnicianSerializer,
    WorkOrderSerializer,
    PreventiveMaintenanceSerializer
)


class MaintenanceRequestViewSet(viewsets.ModelViewSet):

    queryset = MaintenanceRequest.objects.select_related(
        "requested_by",
        "asset",
        "location"
    ).all()

    serializer_class = MaintenanceRequestSerializer

    def perform_create(self, serializer):
        maintenance_request = serializer.save()

        create_maintenance_notification(
            maintenance_request.id
        )


class TechnicianViewSet(viewsets.ModelViewSet):

    queryset = Technician.objects.all()

    serializer_class = TechnicianSerializer


class WorkOrderViewSet(viewsets.ModelViewSet):

    queryset = WorkOrder.objects.select_related(
        "maintenance_request",
        "technician"
    ).all()

    serializer_class = WorkOrderSerializer

    def perform_create(self, serializer):
        work_order = serializer.save()

        create_work_order_notification(
            work_order.id
        )

class PreventiveMaintenanceViewSet(viewsets.ModelViewSet):

    queryset = PreventiveMaintenance.objects.select_related(
        "asset",
        "location",
        "technician"
    ).all()

    serializer_class = PreventiveMaintenanceSerializer

    def get_queryset(self):

        queryset = PreventiveMaintenance.objects.select_related(
            "asset",
            "location",
            "technician"
        ).all()

        # Status filtering
        status_filter = self.request.query_params.get("status")

        if status_filter:
            queryset = queryset.filter(
                status=status_filter
            )

        # Frequency filtering
        frequency_filter = self.request.query_params.get("frequency")

        if frequency_filter:
            queryset = queryset.filter(
                frequency=frequency_filter
            )

        return queryset

    def perform_create(self, serializer):

        preventive_maintenance = serializer.save()

        create_preventive_maintenance_notification(
            preventive_maintenance.id
        )

    @action(
        detail=False,
        methods=["get"],
        url_path="check-overdue"
    )
    def check_overdue(self, request):

        today = timezone.now().date()

        overdue_records = PreventiveMaintenance.objects.filter(
            next_due_date__lt=today
        ).exclude(
            status__in=["Completed", "Cancelled"]
        )

        updated_count = 0

        for pm in overdue_records:

            if pm.status != "Overdue":

                pm.status = "Overdue"

                pm.save(
                    update_fields=[
                        "status",
                        "updated_at"
                    ]
                )

                updated_count += 1

        return Response(
            {
                "message": "Overdue status check completed.",
                "updated_records": updated_count
            },
            status=status.HTTP_200_OK
        )

    @action(
        detail=False,
        methods=["get"],
        url_path="due-soon"
    )
    def due_soon(self, request):

        today = timezone.now().date()

        seven_days_later = today + timedelta(days=7)

        queryset = PreventiveMaintenance.objects.select_related(
            "asset",
            "location",
            "technician"
        ).filter(
            next_due_date__gte=today,
            next_due_date__lte=seven_days_later
        ).exclude(
            status__in=["Completed", "Cancelled"]
        )

        serializer = self.get_serializer(
            queryset,
            many=True
        )

        return Response(
            {
                "count": queryset.count(),
                "due_within_7_days": serializer.data
            },
            status=status.HTTP_200_OK
        )