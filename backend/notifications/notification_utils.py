from maintenance.models import ( MaintenanceRequest, WorkOrder, PreventiveMaintenance )
from django.db import models

from .models import Notification
from inventory.models import Inventory
from employees.models import Employee
from maintenance.models import MaintenanceRequest, WorkOrder
from procurement.models import PurchaseOrder


def create_low_stock_notification(employee_id):
    employee = Employee.objects.get(id=employee_id)

    low_stock_items = Inventory.objects.filter(
        current_quantity__lte=models.F("minimum_stock_level")
    ).select_related("spare_part")

    notifications_created = 0

    for item in low_stock_items:

        existing_notification = Notification.objects.filter(
            employee=employee,
            notification_type="Inventory",
            title="Low Stock Alert",
            message__icontains=item.spare_part.part_code,
            is_read=False
        ).exists()

        if existing_notification:
            continue

        Notification.objects.create(
            employee=employee,
            title="Low Stock Alert",
            message=(
                f"{item.spare_part.part_name} "
                f"({item.spare_part.part_code}) is at or below "
                f"the minimum stock level. "
                f"Current quantity: {item.current_quantity}. "
                f"Minimum level: {item.minimum_stock_level}."
            ),
            notification_type="Inventory",
            priority="High",
        )

        notifications_created += 1

    return notifications_created


def create_maintenance_notification(maintenance_request_id):
    maintenance_request = MaintenanceRequest.objects.select_related(
        "requested_by",
        "asset",
        "location",
    ).get(id=maintenance_request_id)

    Notification.objects.create(
        employee=maintenance_request.requested_by,
        title="Maintenance Request Update",
        message=(
            f"Maintenance request "
            f"{maintenance_request.request_code} - "
            f"{maintenance_request.issue_title} "
            f"has status: {maintenance_request.status}. "
            f"Priority: {maintenance_request.priority}."
        ),
        notification_type="Maintenance",
        priority=(
            "Critical"
            if maintenance_request.priority == "Critical"
            else "High"
            if maintenance_request.priority == "High"
            else "Medium"
        ),
    )

    return True


def create_work_order_notification(work_order_id):
    work_order = WorkOrder.objects.select_related(
        "maintenance_request__requested_by",
        "technician",
    ).get(id=work_order_id)

    employee = work_order.maintenance_request.requested_by

    Notification.objects.create(
        employee=employee,
        title="Work Order Update",
        message=(
            f"Work order {work_order.work_order_code} "
            f"for maintenance request "
            f"{work_order.maintenance_request.request_code} "
            f"has status: {work_order.status}. "
            f"Technician: {work_order.technician.technician_name}."
        ),
        notification_type="Work Order",
        priority=(
            "High"
            if work_order.status in ["Assigned", "In Progress"]
            else "Medium"
        ),
    )

    return True


def create_procurement_notification(purchase_order_id):
    purchase_order = PurchaseOrder.objects.select_related(
        "ordered_by",
        "vendor",
    ).get(id=purchase_order_id)

    employee = purchase_order.ordered_by

    Notification.objects.create(
        employee=employee,
        title="Purchase Order Update",
        message=(
            f"Purchase order {purchase_order.purchase_order_code} "
            f"for vendor {purchase_order.vendor.vendor_name} "
            f"has status: {purchase_order.status}. "
            f"Total amount: {purchase_order.total_amount}."
        ),
        notification_type="Procurement",
        priority=(
            "High"
            if purchase_order.status in ["Pending", "Approved", "Ordered"]
            else "Medium"
        ),
    )

    return True

def create_preventive_maintenance_notification(preventive_maintenance_id):
    preventive_maintenance = PreventiveMaintenance.objects.select_related(
        "asset",
        "location",
        "technician",
    ).get(id=preventive_maintenance_id)

    employee = Employee.objects.order_by("id").first()

    if employee is None:
        return False

    Notification.objects.create(
        employee=employee,
        title="Preventive Maintenance Update",
        message=(
            f"Preventive maintenance "
            f"{preventive_maintenance.pm_code} - "
            f"{preventive_maintenance.maintenance_title} "
            f"is scheduled for {preventive_maintenance.next_due_date}. "
            f"Status: {preventive_maintenance.status}. "
            f"Technician: "
            f"{preventive_maintenance.technician.technician_name}."
        ),
        notification_type="Preventive Maintenance",
        priority=(
            "High"
            if preventive_maintenance.status == "Overdue"
            else "Medium"
        ),
    )

    return True

