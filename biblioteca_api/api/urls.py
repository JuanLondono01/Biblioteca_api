from django.urls import path
from .views import LibroFisicoView, LibroDigitalView, landing_page, buscar_libros_view, BuscarLibrosView

urlpatterns = [
    path('', landing_page, name='landing_page'),  # Ruta para la landing page
    path('buscar-libros/', buscar_libros_view, name='buscar_libros'),  # Renderiza la página de búsqueda
    path('libros/search/', BuscarLibrosView.as_view(), name='buscar_libros_api'),  # API para búsqueda
    
    path('libros/fisicos', LibroFisicoView.as_view(), name='libros_fisicos_list'),  # GET todos y POST
    path('libros/fisicos/<int:id>', LibroFisicoView.as_view(), name='libros_fisicos_detail'),  # GET, PUT, DELETE

    path('libros/digitales', LibroDigitalView.as_view(), name='libros_digitales_list'),  # GET todos y POST
    path('libros/digitales/<int:id>', LibroDigitalView.as_view(), name='libros_digitales_detail'),  # GET, PUT, DELETE
]
