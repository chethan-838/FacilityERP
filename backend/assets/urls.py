from rest_framework.routers import DefaultRouter

from .views import AssetCategoryViewSet, AssetViewSet


router = DefaultRouter()

router.register(
    "asset-categories",
    AssetCategoryViewSet,
    basename="asset-category"
)

router.register(
    "assets",
    AssetViewSet,
    basename="asset"
)

urlpatterns = router.urls