from rest_framework import serializers

from .models import (
    MaintenanceRequest,
    Technician,
    WorkOrder,
    PreventiveMaintenance,
)


class MaintenanceRequestSerializer(serializers.ModelSerializer):
    requested_by_name = serializers.CharField(
        source="requested_by.employee_name",
        read_only=True
    )

    asset_name = serializers.CharField(
        source="asset.asset_name",
        read_only=True
    )

    location_name = serializers.CharField(
        source="location.location_name",
        read_only=True
    )

    class Meta:
        model = MaintenanceRequest
        fields = [
            "id",
            "request_code",
            "requested_by",
            "requested_by_name",
            "asset",
            "asset_name",
            "location",
            "location_name",
            "issue_title",
            "issue_description",
            "priority",
            "status",
            "requested_date",
            "completed_date",
            "created_at",
        ]


class TechnicianSerializer(serializers.ModelSerializer):

    class Meta:
        model = Technician
        fields = "__all__"


class WorkOrderSerializer(serializers.ModelSerializer):
    technician_name = serializers.CharField(
        source="technician.technician_name",
        read_only=True
    )

    request_code = serializers.CharField(
        source="maintenance_request.request_code",
        read_only=True
    )

    class Meta:
        model = WorkOrder
        fields = [
            "id",
            "work_order_code",
            "maintenance_request",
            "request_code",
            "technician",
            "technician_name",
            "assigned_date",
            "start_date",
            "completion_date",
            "work_description",
            "status",
            "estimated_cost",
            "actual_cost",
            "created_at",
        ]


class PreventiveMaintenanceSerializer(serializers.ModelSerializer):

    asset_name = serializers.CharField(
        source="asset.asset_name",
        read_only=True
    )

    location_name = serializers.CharField(
        source="location.location_name",
        read_only=True
    )

    technician_name = serializers.CharField(
        source="technician.technician_name",
        read_only=True
    )

    class Meta:
        model = PreventiveMaintenance

        fields = [
            "id",
            "pm_code",
            "asset",
            "asset_name",
            "location",
            "location_name",
            "technician",
            "technician_name",
            "maintenance_title",
            "maintenance_description",
            "frequency",
            "last_maintenance_date",
            "next_due_date",
            "status",
            "estimated_cost",
            "notes",
            "created_at",
            "updated_at",
        ]