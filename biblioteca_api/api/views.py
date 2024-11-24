from django.shortcuts import render
from django.views import View
from django.utils.decorators import method_decorator
from django.views.decorators.csrf import csrf_exempt
from django.http.response import JsonResponse
from .models import LibroFisico, LibroDigital
import json


def landing_page(request):
    libros_fisicos = LibroFisico.objects.all()
    libros_digitales = LibroDigital.objects.all()

    # Combinar ambos tipos en una lista
    libros = list(libros_fisicos) + list(libros_digitales)

    return render(request, "base.html", {"libros": libros})


@method_decorator(csrf_exempt, name="dispatch")
class LibroFisicoView(View):
    def get(self, req, id=0):
        if id > 0:
            libro = list(LibroFisico.objects.filter(id=id).values())
            if libro:
                datos = {"message": "success", "libro_fisico": libro[0]}
            else:
                datos = {"message": "Libro físico no encontrado."}
        else:
            libros = list(LibroFisico.objects.values())
            datos = (
                {"message": "success", "libros_fisicos": libros}
                if libros
                else {"message": "No hay libros físicos disponibles."}
            )

        return JsonResponse(datos)

    def post(self, req):
        jd = json.loads(req.body)
        nuevo_libro = LibroFisico.objects.create(
            title=jd["title"],
            author=jd["author"],
            published_date=jd["published_date"],
            pages_amount=jd["pages_amount"],
        )
        datos = {"message": "Libro físico creado exitosamente.", "id": nuevo_libro.id}
        return JsonResponse(datos)

    def put(self, req, id):
        jd = json.loads(req.body)
        libro = LibroFisico.objects.filter(id=id).first()
        if libro:
            libro.title = jd.get("title", libro.title)
            libro.author = jd.get("author", libro.author)
            libro.published_date = jd.get("published_date", libro.published_date)
            libro.pages_amount = jd.get("pages_amount", libro.pages_amount)
            libro.save()
            datos = {"message": "Libro físico actualizado correctamente."}
        else:
            datos = {"message": "Libro físico no encontrado."}
            return JsonResponse(datos, status=404)

        return JsonResponse(datos)

    def delete(self, req, id):
        libro = LibroFisico.objects.filter(id=id).first()
        if libro:
            libro.delete()
            datos = {"message": "Libro físico eliminado correctamente."}
        else:
            datos = {"message": "Libro físico no encontrado."}
            return JsonResponse(datos, status=404)

        return JsonResponse(datos)


@method_decorator(csrf_exempt, name="dispatch")
class LibroDigitalView(View):
    def get(self, req, id=0):
        if id > 0:
            libro = list(LibroDigital.objects.filter(id=id).values())
            if libro:
                datos = {"message": "success", "libro_digital": libro[0]}
            else:
                datos = {"message": "Libro digital no encontrado."}
        else:
            libros = list(LibroDigital.objects.values())
            datos = (
                {"message": "success", "libros_digitales": libros}
                if libros
                else {"message": "No hay libros digitales disponibles."}
            )

        return JsonResponse(datos)

    def post(self, req):
        jd = json.loads(req.body)
        nuevo_libro = LibroDigital.objects.create(
            title=jd["title"],
            author=jd["author"],
            published_date=jd["published_date"],
            file_format=jd["file_format"],
            size=jd["size"],
        )
        datos = {"message": "Libro digital creado exitosamente.", "id": nuevo_libro.id}
        return JsonResponse(datos)

    def put(self, req, id):
        jd = json.loads(req.body)
        libro = LibroDigital.objects.filter(id=id).first()
        if libro:
            libro.title = jd.get("title", libro.title)
            libro.author = jd.get("author", libro.author)
            libro.published_date = jd.get("published_date", libro.published_date)
            libro.file_format = jd.get("file_format", libro.file_format)
            libro.size = jd.get("size", libro.size)
            libro.save()
            datos = {"message": "Libro digital actualizado correctamente."}
        else:
            datos = {"message": "Libro digital no encontrado."}
            return JsonResponse(datos, status=404)

        return JsonResponse(datos)

    def delete(self, req, id):
        libro = LibroDigital.objects.filter(id=id).first()
        if libro:
            libro.delete()
            datos = {"message": "Libro digital eliminado correctamente."}
        else:
            datos = {"message": "Libro digital no encontrado."}
            return JsonResponse(datos, status=404)

        return JsonResponse(datos)


from django.http.response import JsonResponse
from django.views import View
from django.utils.decorators import method_decorator
from django.views.decorators.csrf import csrf_exempt
from .models import LibroFisico, LibroDigital


class BuscarLibrosView(View):
    def get(self, req):
        query = req.GET.get("query", "").lower()  # Obtén el término de búsqueda
        libros_fisicos = LibroFisico.objects.none()
        libros_digitales = LibroDigital.objects.none()

        if query:
            # Busca en libros físicos y digitales
            libros_fisicos = LibroFisico.objects.filter(title__icontains=query) | LibroFisico.objects.filter(author__icontains=query)
            libros_digitales = LibroDigital.objects.filter(title__icontains=query) | LibroDigital.objects.filter(author__icontains=query)

        # Combina los resultados
        libros = list(libros_fisicos) + list(libros_digitales)

        # Crear el JSON de libros con toda la información
        libros_json = [
            {
                "type": "fisico" if isinstance(libro, LibroFisico) else "digital",
                "title": libro.title,
                "author": libro.author,
                "published_date": libro.published_date,
                "additional_info": {
                    "pages": getattr(libro, 'pages_amount', None),  # Si es físico, obtiene las páginas
                    "file_size": getattr(libro, 'size', None),  # Si es digital, obtiene el tamaño
                    "format": getattr(libro, 'file_format', None)  # Si es digital, obtiene el formato
                }
            }
            for libro in libros
        ]
        
        return JsonResponse({"message": "success", "libros": libros_json})


def buscar_libros_view(request):
    # Renderiza la plantilla de búsqueda sin devolver JSON
    return render(request, 'buscar_libros.html')