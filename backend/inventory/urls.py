from django.urls import path, include
from rest_framework.routers import DefaultRouter

from .views import (
    SparePartCategoryViewSet,
    SparePartViewSet,
    InventoryViewSet,
    StockTransactionViewSet
)


router = DefaultRouter()

router.register(
    "spare-part-categories",
    SparePartCategoryViewSet,
    basename="spare-part-category"
)

router.register(
    "spare-parts",
    SparePartViewSet,
    basename="spare-part"
)

router.register(
    "inventory",
    InventoryViewSet,
    basename="inventory"
)

router.register(
    "stock-transactions",
    StockTransactionViewSet,
    basename="stock-transaction"
)


urlpatterns = [
    path("", include(router.urls)),
]