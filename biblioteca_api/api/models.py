from django.db import models


# Create your models here.
class Libro(models.Model):
    title = models.CharField(max_length=20)
    author = models.CharField(max_length=25)
    published_date = models.DateField()

    class Meta:
        abstract = True


class LibroFisico(Libro):
    pages_amount = models.IntegerField()


class LibroDigital(Libro):
    file_format = models.CharField(max_length=10)
    size = models.FloatField()
