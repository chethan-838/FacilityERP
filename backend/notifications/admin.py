from django.contrib import admin
from .models import Notification


@admin.register(Notification)
class NotificationAdmin(admin.ModelAdmin):
    list_display = (
        "id",
        "employee",
        "title",
        "notification_type",
        "priority",
        "is_read",
        "created_at",
    )
    

    search_fields = (
        "title",
        "message",
        "employee__employee_name",
        "employee__employee_code",
    )

    list_filter = (
        "notification_type",
        "priority",
        "is_read",
        "created_at",
    )

    ordering = ("id",)
