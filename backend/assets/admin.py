from django.contrib import admin

from .models import AssetCategory, Asset


@admin.register(AssetCategory)
class AssetCategoryAdmin(admin.ModelAdmin):
    list_display = (
        "id",
        "category_name",
        "description",
    )

    ordering = ("id",)

    search_fields = (
        "category_name",
    )


@admin.register(Asset)
class AssetAdmin(admin.ModelAdmin):
    list_display = (
        "id",
        "asset_code",
        "asset_name",
        "category",
        "location",
        "purchase_cost",
        "warranty_expiry",
        "status",
    )

    ordering = ("id",)

    search_fields = (
        "asset_code",
        "asset_name",
    )

    list_filter = (
        "category",
        "location",
        "status",
    )


# ---------------------------------------------------------
# Custom Admin Model Ordering
# ---------------------------------------------------------

_original_get_app_list = admin.site.get_app_list


def custom_get_app_list(request, app_label=None):
    app_list = _original_get_app_list(request, app_label)

    for app in app_list:
        if app["app_label"] == "assets":
            model_order = {
                "Assets": 1,
                "Asset Categories": 2,
            }

            app["models"].sort(
                key=lambda model: model_order.get(
                    model["name"],
                    999
                )
            )

    return app_list


admin.site.get_app_list = custom_get_app_list