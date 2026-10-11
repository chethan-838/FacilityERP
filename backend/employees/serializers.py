from rest_framework import serializers
from .models import Department, Employee


class DepartmentSerializer(serializers.ModelSerializer):
    class Meta:
        model = Department
        fields = "__all__"


class EmployeeSerializer(serializers.ModelSerializer):
    department_name = serializers.CharField(
        source="department.department_name",
        read_only=True
    )

    class Meta:
        model = Employee
        fields = [
            "id",
            "employee_code",
            "employee_name",
            "email",
            "phone",
            "department",
            "designation",
            "joining_date",
            "status",
            "created_at",
            "department_name",
        ]

        read_only_fields = [
            "id",
            "created_at",
            "department_name",
        ]

    def to_representation(self, instance):
        data = super().to_representation(instance)

        data["department_name"] = (
            instance.department.department_name
            if instance.department
            else None
        )

        return data