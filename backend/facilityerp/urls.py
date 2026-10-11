"""
URL configuration for facilityerp project.

The `urlpatterns` list routes URLs to views.
"""

from django.contrib import admin
from django.urls import path, include

from rest_framework_simplejwt.views import (
    TokenObtainPairView,
    TokenRefreshView,
)


urlpatterns = [
    path('admin/', admin.site.urls),

    # JWT Authentication
    path(
        "api/token/",
        TokenObtainPairView.as_view(),
        name="token_obtain_pair",
    ),
    path(
        "api/token/refresh/",
        TokenRefreshView.as_view(),
        name="token_refresh",
    ),

    # Application APIs
    path("api/", include("employees.urls")),
    path("api/", include("assets.urls")),
    path("api/", include("maintenance.urls")),
    path("api/", include("inventory.urls")),
    path("api/", include("procurement.urls")),
    path("api/dashboard/", include("dashboard.urls")),
    path("api/", include("notifications.urls")),
    path("api/", include("locations.urls")),
]
