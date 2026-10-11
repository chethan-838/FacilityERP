from django.db import models


class Location(models.Model):
    location_name = models.CharField(max_length=150)
    building = models.CharField(max_length=100, null=True, blank=True)
    floor = models.CharField(max_length=50, null=True, blank=True)
    room = models.CharField(max_length=50, null=True, blank=True)
    description = models.CharField(max_length=255, null=True, blank=True)
    created_at = models.DateTimeField()

    class Meta:
        db_table = "locations"
        managed = False

    def __str__(self):
        return self.location_name
