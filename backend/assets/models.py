from django.db import models


class AssetCategory(models.Model):
    category_name = models.CharField(max_length=100)
    description = models.CharField(max_length=255, null=True, blank=True)

    class Meta:
        db_table = "asset_categories"
        managed = False
        verbose_name = "Asset Category"
        verbose_name_plural = "Asset Categories"

    def __str__(self):
        return self.category_name


class Asset(models.Model):
    asset_code = models.CharField(max_length=50, unique=True)
    asset_name = models.CharField(max_length=150)

    category = models.ForeignKey(
        AssetCategory,
        on_delete=models.PROTECT,
        db_column="category_id"
    )

    location = models.ForeignKey(
        "locations.Location",
        on_delete=models.PROTECT,
        db_column="location_id"
    )

    purchase_date = models.DateField(null=True, blank=True)
    purchase_cost = models.DecimalField(
        max_digits=12,
        decimal_places=2,
        null=True,
        blank=True
    )
    warranty_expiry = models.DateField(null=True, blank=True)
    status = models.CharField(max_length=30, default="Active")
    description = models.CharField(max_length=255, null=True, blank=True)
    created_at = models.DateTimeField()

    class Meta:
        db_table = "assets"
        managed = False


    def __str__(self):
        return f"{self.asset_code} - {self.asset_name}"