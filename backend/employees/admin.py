from django.contrib import admin
from .models import Department, Employee


@admin.register(Department)
class DepartmentAdmin(admin.ModelAdmin):
    list_display = ("id", "department_name", "description", "created_at")
    ordering = ("id",)
    search_fields = ("department_name",)


@admin.register(Employee)
class EmployeeAdmin(admin.ModelAdmin):
    list_display = (
        "id",
        "employee_code",
        "employee_name",
        "email",
        "department",
        "designation",
        "status",
    )
    ordering = ("id",)
    search_fields = (
        "employee_code",
        "employee_name",
        "email",
    )
    list_filter = (
        "department",
        "status",
    )


# ---------------------------------------------------------
# Custom Admin Model Ordering
# ---------------------------------------------------------

_original_get_app_list = admin.site.get_app_list


def custom_get_app_list(request, app_label=None):
    app_list = _original_get_app_list(request, app_label)

    for app in app_list:
        if app["app_label"] == "employees":
            model_order = {
                "Employees": 1,
                "Departments": 2,
            }

            app["models"].sort(
                key=lambda model: model_order.get(
                    model["name"],
                    999
                )
            )

    return app_list


admin.site.get_app_list = custom_get_app_list