from django.contrib import admin
from .models import (
    MaintenanceRequest,
    Technician,
    WorkOrder,
    PreventiveMaintenance,
)


@admin.register(MaintenanceRequest)
class MaintenanceRequestAdmin(admin.ModelAdmin):
    list_display = (
        "id",
        "request_code",
        "issue_title",
        "requested_by",
        "asset",
        "location",
        "priority",
        "status",
        "requested_date",
    )

    ordering = ("id",)

    search_fields = (
        "request_code",
        "issue_title",
        "issue_description",
    )

    list_filter = (
        "priority",
        "status",
        "location",
    )


@admin.register(Technician)
class TechnicianAdmin(admin.ModelAdmin):
    list_display = (
        "id",
        "technician_code",
        "technician_name",
        "specialization",
        "status",
    )

    ordering = ("id",)

    search_fields = (
        "technician_code",
        "technician_name",
        "email",
    )

    list_filter = (
        "status",
        "specialization",
    )


@admin.register(WorkOrder)
class WorkOrderAdmin(admin.ModelAdmin):
    list_display = (
        "id",
        "work_order_code",
        "maintenance_request",
        "technician",
        "status",
        "estimated_cost",
        "actual_cost",
    )

    ordering = ("id",)

    search_fields = (
        "work_order_code",
        "work_description",
    )

    list_filter = (
        "status",
        "technician",
    )


@admin.register(PreventiveMaintenance)
class PreventiveMaintenanceAdmin(admin.ModelAdmin):
    list_display = (
        "id",
        "pm_code",
        "maintenance_title",
        "asset",
        "location",
        "technician",
        "frequency",
        "next_due_date",
        "status",
        "estimated_cost",
    )

    ordering = ("id",)

    search_fields = (
        "pm_code",
        "maintenance_title",
        "maintenance_description",
    )

    list_filter = (
        "frequency",
        "status",
        "technician",
        "location",
    )