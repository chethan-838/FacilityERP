from django.db import models


class SparePartCategory(models.Model):

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
        db_table = "spare_part_categories"
        ordering = ["id"]
        verbose_name = "Spare Parts Category"
        verbose_name_plural = "Spare Part Categories"
        

    def __str__(self):
        return self.category_name


class SparePart(models.Model):

    part_code = models.CharField(
        max_length=50,
        unique=True
    )

    part_name = models.CharField(
        max_length=150
    )

    category = models.ForeignKey(
        SparePartCategory,
        on_delete=models.PROTECT,
        related_name="spare_parts"
    )

    unit = models.CharField(
        max_length=30,
        default="Piece"
    )

    description = models.CharField(
        max_length=255,
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
        db_table = "spare_parts"
        ordering = ["id"]
        verbose_name = "Spare Part"
        verbose_name_plural = "Spare Parts"

    def __str__(self):
        return f"{self.part_code} - {self.part_name}"

class Inventory(models.Model):

    spare_part = models.OneToOneField(
        SparePart,
        on_delete=models.PROTECT,
        related_name="inventory"
    )

    current_quantity = models.DecimalField(
        max_digits=12,
        decimal_places=2,
        default=0
    )

    minimum_stock_level = models.DecimalField(
        max_digits=12,
        decimal_places=2,
        default=0
    )

    maximum_stock_level = models.DecimalField(
        max_digits=12,
        decimal_places=2,
        default=0
    )

    storage_location = models.CharField(
        max_length=150,
        null=True,
        blank=True
    )

    last_updated = models.DateTimeField(
        auto_now=True
    )

    class Meta:
        db_table = "inventory"
        ordering = ["id"]
        verbose_name = "Inventory"
        verbose_name_plural = "Inventory"
       

    def __str__(self):
        return f"{self.spare_part.part_code} - {self.spare_part.part_name}"

class StockTransaction(models.Model):

    TRANSACTION_TYPES = [
        ("RECEIVED", "Received"),
        ("ISSUED", "Issued"),
        ("ADJUSTMENT", "Adjustment"),
    ]

    spare_part = models.ForeignKey(
        SparePart,
        on_delete=models.PROTECT,
        related_name="stock_transactions"
    )

    transaction_type = models.CharField(
        max_length=20,
        choices=TRANSACTION_TYPES
    )

    quantity = models.DecimalField(
        max_digits=12,
        decimal_places=2
    )

    reference = models.CharField(
        max_length=100,
        null=True,
        blank=True
    )

    remarks = models.TextField(
        null=True,
        blank=True
    )

    transaction_date = models.DateTimeField(
        auto_now_add=True
    )

    class Meta:
        db_table = "stock_transactions"
        ordering = ["id"]
        verbose_name = "Stock Transaction"
        verbose_name_plural = "Stock Transactions"

    def __str__(self):
        return (
            f"{self.spare_part.part_code} - "
            f"{self.transaction_type} - "
            f"{self.quantity}"
        )