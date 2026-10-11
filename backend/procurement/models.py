from decimal import Decimal

from django.db import models
from django.utils import timezone

from employees.models import Employee
from inventory.models import SparePart


class VendorCategory(models.Model):

    category_name = models.CharField(
        max_length=100,
        unique=True
    )

    description = models.CharField(
        max_length=255,
        null=True,
        blank=True
    )

    created_at = models.DateTimeField(
        auto_now_add=True
    )

    class Meta:
        db_table = "vendor_categories"
        ordering = ["id"]
        verbose_name = "Vendor Category"
        verbose_name_plural = "Vendor Categories"

    def __str__(self):
        return self.category_name

class Vendor(models.Model):

    vendor_code = models.CharField(
        max_length=50,
        unique=True
    )

    vendor_name = models.CharField(
        max_length=150
    )

    category = models.ForeignKey(
        VendorCategory,
        on_delete=models.PROTECT,
        related_name="vendors"
    )

    contact_person = models.CharField(
        max_length=150,
        null=True,
        blank=True
    )

    email = models.EmailField(
        null=True,
        blank=True
    )

    phone = models.CharField(
        max_length=20,
        null=True,
        blank=True
    )

    address = models.TextField(
        null=True,
        blank=True
    )

    city = models.CharField(
        max_length=100,
        null=True,
        blank=True
    )

    state = models.CharField(
        max_length=100,
        null=True,
        blank=True
    )

    status = models.CharField(
        max_length=30,
        default="Active"
    )

    created_at = models.DateTimeField(
        auto_now_add=True
    )

    class Meta:
        db_table = "vendors"
        ordering = ["id"]
        verbose_name = "Vendor"
        verbose_name_plural = "Vendors"

    def __str__(self):
        return f"{self.vendor_code} - {self.vendor_name}"


class PurchaseRequest(models.Model):

    STATUS_CHOICES = [
        ("Draft", "Draft"),
        ("Pending", "Pending"),
        ("Approved", "Approved"),
        ("Rejected", "Rejected"),
        ("Converted", "Converted"),
        ("Cancelled", "Cancelled"),
    ]

    request_code = models.CharField(
        max_length=50,
        unique=True
    )

    requested_by = models.ForeignKey(
        Employee,
        on_delete=models.PROTECT,
        related_name="purchase_requests"
    )

    request_date = models.DateField(
        default=timezone.now
    )

    required_date = models.DateField(
        null=True,
        blank=True
    )

    purpose = models.TextField(
        null=True,
        blank=True
    )

    status = models.CharField(
        max_length=30,
        choices=STATUS_CHOICES,
        default="Draft"
    )

    created_at = models.DateTimeField(
        auto_now_add=True
    )

    updated_at = models.DateTimeField(
        auto_now=True
    )

    class Meta:
        db_table = "purchase_requests"
        ordering = ["id"]
        verbose_name = "Purchase Request"
        verbose_name_plural = "Purchase Requests"

    def __str__(self):
        return self.request_code

class PurchaseRequestItem(models.Model):

    purchase_request = models.ForeignKey(
        PurchaseRequest,
        on_delete=models.CASCADE,
        related_name="items"
    )

    spare_part = models.ForeignKey(
        SparePart,
        on_delete=models.PROTECT,
        related_name="purchase_request_items"
    )

    requested_quantity = models.DecimalField(
        max_digits=12,
        decimal_places=2
    )

    remarks = models.TextField(
        null=True,
        blank=True
    )

    class Meta:
        db_table = "purchase_request_items"
        ordering = ["id"]
        verbose_name = "Purchase Request Item"
        verbose_name_plural = "Purchase Request Items"

    def __str__(self):
        return (
            f"{self.purchase_request.request_code} - "
            f"{self.spare_part.part_code}"
        )

class PurchaseOrder(models.Model):

    STATUS_CHOICES = [
        ("Draft", "Draft"),
        ("Pending", "Pending"),
        ("Approved", "Approved"),
        ("Ordered", "Ordered"),
        ("Partially Received", "Partially Received"),
        ("Received", "Received"),
        ("Cancelled", "Cancelled"),
    ]

    purchase_order_code = models.CharField(
        max_length=50,
        unique=True
    )

    vendor = models.ForeignKey(
        Vendor,
        on_delete=models.PROTECT,
        related_name="purchase_orders"
    )

    purchase_request = models.ForeignKey(
        PurchaseRequest,
        on_delete=models.PROTECT,
        related_name="purchase_orders",
        null=True,
        blank=True
    )

    ordered_by = models.ForeignKey(
        Employee,
        on_delete=models.PROTECT,
        related_name="purchase_orders"
    )

    order_date = models.DateField(
        default=timezone.now
    )

    expected_delivery_date = models.DateField(
        null=True,
        blank=True
    )

    status = models.CharField(
        max_length=30,
        choices=STATUS_CHOICES,
        default="Draft"
    )

    notes = models.TextField(
        null=True,
        blank=True
    )

    total_amount = models.DecimalField(
        max_digits=14,
        decimal_places=2,
        default=Decimal("0.00")
    )

    created_at = models.DateTimeField(
        auto_now_add=True
    )

    updated_at = models.DateTimeField(
        auto_now=True
    )

    class Meta:
        db_table = "purchase_orders"
        ordering = ["id"]
        verbose_name = "Purchase Order"
        verbose_name_plural = "Purchase Orders"

    def __str__(self):
        return self.purchase_order_code

class PurchaseOrderItem(models.Model):

    purchase_order = models.ForeignKey(
        PurchaseOrder,
        on_delete=models.CASCADE,
        related_name="items"
    )

    spare_part = models.ForeignKey(
        SparePart,
        on_delete=models.PROTECT,
        related_name="purchase_order_items"
    )

    ordered_quantity = models.DecimalField(
        max_digits=12,
        decimal_places=2
    )

    unit_price = models.DecimalField(
        max_digits=12,
        decimal_places=2
    )

    received_quantity = models.DecimalField(
        max_digits=12,
        decimal_places=2,
        default=Decimal("0.00")
    )

    remarks = models.TextField(
        null=True,
        blank=True
    )

    @property
    def line_total(self):
        return self.ordered_quantity * self.unit_price

    @property
    def pending_quantity(self):
        return self.ordered_quantity - self.received_quantity

    class Meta:
        db_table = "purchase_order_items"
        ordering = ["id"]
        verbose_name = "Purchase Order Item"
        verbose_name_plural = "Purchase Order Items"

    def __str__(self):
        return (
            f"{self.purchase_order.purchase_order_code} - "
            f"{self.spare_part.part_code}"
        )


