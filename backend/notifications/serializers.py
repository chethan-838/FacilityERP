from rest_framework import serializers
from .models import Notification


class NotificationSerializer(serializers.ModelSerializer):
    employee_name = serializers.SerializerMethodField()

    class Meta:
        model = Notification
        fields = [
            "id",
            "employee",
            "employee_name",
            "title",
            "message",
            "notification_type",
            "priority",
            "is_read",
            "created_at",
        ]
        read_only_fields = ["created_at"]

    def get_employee_name(self, obj):
        return str(obj.employee)