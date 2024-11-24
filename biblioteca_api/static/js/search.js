const apiBaseUrl = 'http://localhost:8000';  // Cambia esto a la URL de tu API

document.getElementById('searchBtn').addEventListener('click', async () => {
    const query = document.getElementById('searchInput').value.trim();
    if (!query) {
        alert('Por favor, escribe un término de búsqueda.');
        return;
    }

    try {
        // Hacer la solicitud a la API
        const response = await fetch(`${apiBaseUrl}/libros/search/?query=${encodeURIComponent(query)}`);
        if (!response.ok) throw new Error('Error al buscar libros.');

        // Obtener los datos JSON
        const data = await response.json();
        console.log(data);

        // Mostrar los resultados
        renderResults(data.libros || []);
    } catch (error) {
        console.error('Error al buscar libros:', error);
        alert('Ocurrió un error al realizar la búsqueda. Inténtalo más tarde.');
    }
});

function renderResults(libros) {
    const container = document.getElementById('resultsContainer');
    container.innerHTML = ''; // Limpiar resultados previos

    if (libros.length === 0) {
        container.innerHTML = '<p>No se encontraron libros.</p>';
        return;
    }

    // Separar los libros por tipo
    const librosFisicos = libros.filter(libro => libro.type === 'fisico');
    const librosDigitales = libros.filter(libro => libro.type === 'digital');

    // Crear las secciones para los libros físicos y digitales
    if (librosFisicos.length > 0) {
        const sectionFisicos = document.createElement('div');
        sectionFisicos.className = 'seccion-fisicos'
        sectionFisicos.innerHTML = '<h3>Libros Físicos</h3>';
        librosFisicos.forEach(libro => {
            const card = createBookCard(libro);
            sectionFisicos.appendChild(card);
        });
        container.appendChild(sectionFisicos);
    }

    if (librosDigitales.length > 0) {
        const sectionDigitales = document.createElement('div');
        sectionDigitales.className = 'seccion-digitales'
        sectionDigitales.innerHTML = '<h3>Libros Digitales</h3>';
        librosDigitales.forEach(libro => {
            const card = createBookCard(libro);
            sectionDigitales.appendChild(card);
        });
        container.appendChild(sectionDigitales);
    }
}

function createBookCard(libro) {
    const card = document.createElement('div');
    card.className = 'result-card';
    
    // Información básica del libro
    let cardHtml = `
        <p><strong>Título:</strong> ${libro.title}</p>
        <p><strong>Autor:</strong> ${libro.author}</p>
        <p><strong>Fecha de Publicación:</strong> ${libro.published_date}</p>
    `;

    // Información adicional según el tipo de libro
    if (libro.type === 'fisico') {
        cardHtml += `<p><strong>Páginas:</strong> ${libro.additional_info.pages}</p>`;
    } else if (libro.type === 'digital') {
        cardHtml += `
            <p><strong>Tamaño del archivo:</strong> ${libro.additional_info.file_size} MB</p>
            <p><strong>Formato:</strong> ${libro.additional_info.format}</p>
        `;
    }

    card.innerHTML = cardHtml;
    return card;
}
