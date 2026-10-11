from django.db import models


class Department(models.Model):
    department_name = models.CharField(max_length=100)
    description = models.CharField(max_length=255, null=True, blank=True)
    created_at = models.DateTimeField()

    class Meta:
        db_table = "departments"
        managed = False

    def __str__(self):
        return self.department_name


class Employee(models.Model):
   

    employee_code = models.CharField(max_length=50, unique=True)
    employee_name = models.CharField(max_length=150)
    email = models.CharField(max_length=150, unique=True, null=True, blank=True)
    phone = models.CharField(max_length=20, null=True, blank=True)

    department = models.ForeignKey(
        Department,
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        db_column="department_id"
    )

    designation = models.CharField(max_length=100, null=True, blank=True)
    joining_date = models.DateField(null=True, blank=True)
    status = models.CharField(max_length=30, default="Active")
    created_at = models.DateTimeField()

    class Meta:
        db_table = "employees"
        managed = False

    def __str__(self):
        return f"{self.employee_code} - {self.employee_name}"