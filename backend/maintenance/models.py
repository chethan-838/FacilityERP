from django.db import models
from django.utils import timezone

from employees.models import Employee
from assets.models import Asset
from locations.models import Location


class MaintenanceRequest(models.Model):

    PRIORITY_CHOICES = [
        ("Low", "Low"),
        ("Medium", "Medium"),
        ("High", "High"),
        ("Critical", "Critical"),
    ]

    STATUS_CHOICES = [
        ("Open", "Open"),
        ("Assigned", "Assigned"),
        ("In Progress", "In Progress"),
        ("Completed", "Completed"),
        ("Closed", "Closed"),
        ("Cancelled", "Cancelled"),
    ]

    request_code = models.CharField(max_length=50, unique=True)

    requested_by = models.ForeignKey(
        Employee,
        on_delete=models.PROTECT,
        related_name="maintenance_requests"
    )

    asset = models.ForeignKey(
        Asset,
        on_delete=models.PROTECT,
        related_name="maintenance_requests"
    )

    location = models.ForeignKey(
        Location,
        on_delete=models.PROTECT,
        related_name="maintenance_requests"
    )

    issue_title = models.CharField(max_length=200)

    issue_description = models.TextField()

    priority = models.CharField(
        max_length=20,
        choices=PRIORITY_CHOICES,
        default="Medium"
    )

    status = models.CharField(
        max_length=30,
        choices=STATUS_CHOICES,
        default="Open"
    )

    requested_date = models.DateTimeField(auto_now_add=True)

    completed_date = models.DateTimeField(
        null=True,
        blank=True
    )

    created_at = models.DateTimeField(
        auto_now_add=True
    )

    class Meta:
        db_table = "maintenance_requests"
        ordering = ["-created_at"]

    def __str__(self):
        return f"{self.request_code} - {self.issue_title}"


class Technician(models.Model):

    technician_code = models.CharField(
        max_length=50,
        unique=True
    )

    technician_name = models.CharField(
        max_length=150
    )

    email = models.EmailField(
        unique=True,
        null=True,
        blank=True
    )

    phone = models.CharField(
        max_length=20,
        null=True,
        blank=True
    )

    specialization = models.CharField(
        max_length=100,
        null=True,
        blank=True
    )

    status = models.CharField(
        max_length=30,
        default="Available"
    )

    created_at = models.DateTimeField(
        auto_now_add=True
    )

    class Meta:
        db_table = "technicians"

    def __str__(self):
        return f"{self.technician_code} - {self.technician_name}"


class WorkOrder(models.Model):

    STATUS_CHOICES = [
        ("Assigned", "Assigned"),
        ("In Progress", "In Progress"),
        ("Completed", "Completed"),
        ("Closed", "Closed"),
        ("Cancelled", "Cancelled"),
    ]

    work_order_code = models.CharField(
        max_length=50,
        unique=True
    )

    maintenance_request = models.OneToOneField(
        MaintenanceRequest,
        on_delete=models.PROTECT,
        related_name="work_order"
    )

    technician = models.ForeignKey(
        Technician,
        on_delete=models.PROTECT,
        related_name="work_orders"
    )

    assigned_date = models.DateTimeField(
        auto_now_add=True
    )

    start_date = models.DateTimeField(
        null=True,
        blank=True
    )

    completion_date = models.DateTimeField(
        null=True,
        blank=True
    )

    work_description = models.TextField(
        null=True,
        blank=True
    )

    status = models.CharField(
        max_length=30,
        choices=STATUS_CHOICES,
        default="Assigned"
    )

    estimated_cost = models.DecimalField(
        max_digits=12,
        decimal_places=2,
        null=True,
        blank=True
    )

    actual_cost = models.DecimalField(
        max_digits=12,
        decimal_places=2,
        null=True,
        blank=True
    )

    created_at = models.DateTimeField(
        auto_now_add=True
    )

    class Meta:
        db_table = "work_orders"
        ordering = ["-created_at"]

    def __str__(self):
        return self.work_order_code


class PreventiveMaintenance(models.Model):

    FREQUENCY_CHOICES = [
        ("Daily", "Daily"),
        ("Weekly", "Weekly"),
        ("Monthly", "Monthly"),
        ("Quarterly", "Quarterly"),
        ("Half-Yearly", "Half-Yearly"),
        ("Yearly", "Yearly"),
    ]

    STATUS_CHOICES = [
        ("Scheduled", "Scheduled"),
        ("In Progress", "In Progress"),
        ("Completed", "Completed"),
        ("Overdue", "Overdue"),
        ("Cancelled", "Cancelled"),
    ]

    pm_code = models.CharField(
        max_length=50,
        unique=True
    )

    asset = models.ForeignKey(
        Asset,
        on_delete=models.PROTECT,
        related_name="preventive_maintenance"
    )

    location = models.ForeignKey(
        Location,
        on_delete=models.PROTECT,
        related_name="preventive_maintenance"
    )

    technician = models.ForeignKey(
        Technician,
        on_delete=models.PROTECT,
        related_name="preventive_maintenance"
    )

    maintenance_title = models.CharField(
        max_length=200
    )

    maintenance_description = models.TextField(
        null=True,
        blank=True
    )

    frequency = models.CharField(
        max_length=30,
        choices=FREQUENCY_CHOICES
    )

    last_maintenance_date = models.DateField(
        null=True,
        blank=True
    )

    next_due_date = models.DateField()

    status = models.CharField(
        max_length=30,
        choices=STATUS_CHOICES,
        default="Scheduled"
    )

    estimated_cost = models.DecimalField(
        max_digits=12,
        decimal_places=2,
        null=True,
        blank=True
    )

    notes = models.TextField(
        null=True,
        blank=True
    )

    created_at = models.DateTimeField(
        auto_now_add=True
    )

    updated_at = models.DateTimeField(
        auto_now=True
    )

    class Meta:
        db_table = "preventive_maintenance"
        ordering = ["next_due_date"]

    def update_overdue_status(self):
        today = timezone.now().date()

        if (
            self.next_due_date < today
            and self.status not in ["Completed", "Cancelled"]
        ):
            self.status = "Overdue"
            self.save(
                update_fields=[
                    "status",
                    "updated_at"
                ]
            )

    def __str__(self):
        return f"{self.pm_code} - {self.maintenance_title}"
