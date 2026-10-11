from django.db.models import Q
from rest_framework import status, viewsets
from rest_framework.decorators import action
from rest_framework.response import Response

from .models import Notification
from .serializers import NotificationSerializer


class NotificationViewSet(viewsets.ModelViewSet):
    queryset = Notification.objects.select_related("employee").all()
    serializer_class = NotificationSerializer

    def get_queryset(self):
     queryset = Notification.objects.select_related(
        "employee"
    ).all()

     employee_id = self.request.query_params.get("employee")
     notification_type = self.request.query_params.get("type")
     priority = self.request.query_params.get("priority")
     is_read = self.request.query_params.get("is_read")
     search = self.request.query_params.get("search")

     if employee_id:
        queryset = queryset.filter(
            employee_id=employee_id
        )

     if notification_type:
        queryset = queryset.filter(
            notification_type=notification_type
        )

     if priority:
        queryset = queryset.filter(
            priority=priority
        )

     if is_read is not None:
        queryset = queryset.filter(
            is_read=is_read.lower() == "true"
        )

     if search:
        queryset = queryset.filter(
            Q(title__icontains=search)
            | Q(message__icontains=search)
        )

     return queryset

    @action(detail=False, methods=["get"], url_path="unread")
    def unread(self, request):
        notifications = self.get_queryset().filter(is_read=False)

        serializer = self.get_serializer(
            notifications,
            many=True
        )

        return Response(
            serializer.data,
            status=status.HTTP_200_OK
        )

    @action(detail=False, methods=["get"], url_path="count")
    def count(self, request):
     queryset = self.get_queryset()

     total_count = queryset.count()
     unread_count = queryset.filter(is_read=False).count()
     read_count = queryset.filter(is_read=True).count()

     return Response(
        {
            "total": total_count,
            "unread": unread_count,
            "read": read_count,
        },
        status=status.HTTP_200_OK
    )

    @action(detail=True, methods=["post"], url_path="mark-read")
    def mark_read(self, request, pk=None):
        notification = self.get_object()

        notification.is_read = True
        notification.save(update_fields=["is_read"])

        return Response(
            {
                "message": "Notification marked as read.",
                "notification_id": notification.id,
                "is_read": notification.is_read,
            },
            status=status.HTTP_200_OK
        )

    @action(detail=False, methods=["post"], url_path="mark-all-read")
    def mark_all_read(self, request):
        queryset = self.get_queryset().filter(is_read=False)

        updated_count = queryset.update(is_read=True)

        return Response(
            {
                "message": "All notifications marked as read.",
                "updated_count": updated_count,
            },
            status=status.HTTP_200_OK
        )
