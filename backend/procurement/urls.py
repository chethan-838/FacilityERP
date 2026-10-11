from django.urls import include, path

from rest_framework.routers import DefaultRouter

from .views import (
    VendorCategoryViewSet,
    VendorViewSet,
    PurchaseRequestViewSet,
    PurchaseRequestItemViewSet,
    PurchaseOrderViewSet,
    PurchaseOrderItemViewSet,
)


router = DefaultRouter()

router.register(
    "vendor-categories",
    VendorCategoryViewSet,
    basename="vendor-category"
)

router.register(
    "vendors",
    VendorViewSet,
    basename="vendor"
)

router.register(
    "purchase-requests",
    PurchaseRequestViewSet,
    basename="purchase-request"
)

router.register(
    "purchase-request-items",
    PurchaseRequestItemViewSet,
    basename="purchase-request-item"
)

router.register(
    "purchase-orders",
    PurchaseOrderViewSet,
    basename="purchase-order"
)

router.register(
    "purchase-order-items",
    PurchaseOrderItemViewSet,
    basename="purchase-order-item"
)


urlpatterns = [
    path(
        "",
        include(router.urls)
    ),
]