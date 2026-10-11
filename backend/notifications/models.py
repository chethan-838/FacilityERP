from django.db import models

from employees.models import Employee


class Notification(models.Model):

    TYPE_CHOICES = [
        ("Maintenance", "Maintenance"),
        ("Work Order", "Work Order"),
        ("Inventory", "Inventory"),
        ("Procurement", "Procurement"),
        ("Preventive Maintenance", "Preventive Maintenance"),
        ("General", "General"),
    ]

    PRIORITY_CHOICES = [
        ("Low", "Low"),
        ("Medium", "Medium"),
        ("High", "High"),
        ("Critical", "Critical"),
    ]

    employee = models.ForeignKey(
        Employee,
        on_delete=models.CASCADE,
        related_name="notifications"
    )

    title = models.CharField(
        max_length=200
    )

    message = models.TextField()

    notification_type = models.CharField(
        max_length=50,
        choices=TYPE_CHOICES,
        default="General"
    )

    priority = models.CharField(
        max_length=20,
        choices=PRIORITY_CHOICES,
        default="Medium"
    )

    is_read = models.BooleanField(
        default=False
    )

    created_at = models.DateTimeField(
        auto_now_add=True
    )

    class Meta:
        db_table = "notifications"
        ordering = ["id"]
        verbose_name = "Notification"
        verbose_name_plural = "Notifications"

    def __str__(self):
        return (
            f"{self.employee} - "
            f"{self.title}"
        )