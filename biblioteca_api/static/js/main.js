const apiBaseUrl = 'http://localhost:8000'; // Cambia esto a la URL de tu API

// Seleccionar elementos del DOM
const modal = document.getElementById('modal');
const showFormBtn = document.getElementById('show-form');
const closeModalBtn = document.querySelector('.close-btn');
const formContainer = document.getElementById('form-container');
const radios = document.querySelectorAll('.radio');
const librosFisicosContainer = document.querySelector('.libros_fisicos ul');
const librosDigitalesContainer = document.querySelector('.libros_digitales ul');

// Abrir modal
showFormBtn.addEventListener('click', () => {
    modal.style.display = 'block';
});

// Cerrar modal
closeModalBtn.addEventListener('click', () => {
    modal.style.display = 'none';
    formContainer.innerHTML = ''; // Limpiar formulario
});

// Cambiar formulario dinámicamente según el tipo seleccionado
radios.forEach((radio) => {
    radio.addEventListener('change', (e) => {
        const tipo = e.target.value;
        formContainer.innerHTML = '';
        formContainer.innerHTML = createForm(tipo); // Generar formulario dinámico
    });
});

// Crear formulario dinámico
function createForm(tipo, libro = {}) {
    console.log(libro, tipo);

    if (tipo === 'fisico') {
        return `
            <form id="libroForm" data-id="${libro.id || ''}">
                <label for="title">Título:</label>
                <input type="text" id="title" name="title" value="${libro.title || ''}" required />

                <label for="author">Autor:</label>
                <input type="text" id="author" name="author" value="${libro.author || ''}" required />

                <label for="published_date">Fecha de Publicación:</label>
                <input type="date" id="published_date" name="published_date" value="${
                    libro.published_date || ''
                }" required />

                <label for="pages_amount">Cantidad de Páginas:</label>
                <input type="number" id="pages_amount" name="pages_amount" value="${
                    libro.pages_amount || ''
                }" required />

                <button type="submit">Guardar</button>
            </form>
        `;
    } else if (tipo === 'digital') {
        return `
            <form id="libroForm" data-id="${libro.id || ''}">
                <label for="title">Título:</label>
                <input type="text" id="title" name="title" value="${libro.title || ''}" required />

                <label for="author">Autor:</label>
                <input type="text" id="author" name="author" value="${libro.author || ''}" required />

                <label for="published_date">Fecha de Publicación:</label>
                <input type="date" id="published_date" name="published_date" value="${
                    libro.published_date || ''
                }" required />

                <label for="file_format">Formato:</label>
                <select id="file_format" name="file_format" required>
                    <option value="PDF" ${libro.file_format === 'PDF' ? 'selected' : ''}>PDF</option>
                    <option value="EPUB" ${libro.file_format === 'EPUB' ? 'selected' : ''}>EPUB</option>
                    <option value="MOBI" ${libro.file_format === 'MOBI' ? 'selected' : ''}>MOBI</option>
                    <option value="AZW" ${libro.file_format === 'AZW' ? 'selected' : ''}>AZW</option>
                </select>

                <label for="size">Tamaño (MB):</label>
                <input type="number" id="size" name="size" step="0.1" value="${libro.size || ''}" required />

                <button type="submit">Guardar</button>
            </form>
        `;
    }
    return '';
}

// Manejar envío del formulario con delegación de eventos
document.addEventListener('submit', async (e) => {
    if (e.target.id !== 'libroForm') return; // Ignorar otros formularios

    e.preventDefault();
    const form = e.target;
    const formData = new FormData(form);
    const tipo = formData.has('pages_amount') ? 'fisico' : 'digital';

    const libroData = {
        title: formData.get('title'),
        author: formData.get('author'),
        published_date: formData.get('published_date'),
    };

    if (tipo === 'fisico') {
        libroData.pages_amount = parseInt(formData.get('pages_amount'), 10);
    } else {
        libroData.file_format = formData.get('file_format');
        libroData.size = parseFloat(formData.get('size'));
    }

    const libroId = parseInt(form.getAttribute('data-id')); // Obtener el ID del libro, si está disponible

    const tipoLibro = tipo === 'fisico' ? 'fisicos' : 'digitales';

    try {
        const method = libroId ? 'PUT' : 'POST'; // Si existe ID, actualizamos, si no, creamos
        const url = libroId ? `${apiBaseUrl}/libros/${tipoLibro}/${libroId}` : `${apiBaseUrl}/libros/${tipoLibro}`;

        const response = await fetch(url, {
            method: method,
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(libroData),
        });

        if (!response.ok) throw new Error('Error al guardar o actualizar el libro.');

        const data = await response.json();
        alert(data.message || 'Libro guardado/actualizado con éxito.');
        fetchLibros(); // Refrescar la lista de libros
        modal.style.display = 'none'; // Cerrar el modal
    } catch (error) {
        alert('Error al guardar/actualizar libro. Por favor, inténtelo de nuevo.');
        console.error('Error al guardar libro:', error);
    }
});

// Función para obtener libros
async function fetchLibros() {
    fetchLibrosFisicos();
    fetchLibrosDigitales();
}

async function fetchLibrosFisicos() {
    try {
        const response = await fetch(`${apiBaseUrl}/libros/fisicos`);
        const data = await response.json();
        if (data && data.libros_fisicos) {
            renderLibros(data.libros_fisicos, 'libros-fisicos', 'fisico'); // Pasamos el tipo 'fisico'
        } else {
            console.error('No se encontraron libros físicos');
        }
    } catch (error) {
        console.error('Error al obtener libros físicos:', error);
    }
}

async function fetchLibrosDigitales() {
    try {
        const response = await fetch(`${apiBaseUrl}/libros/digitales`);
        const data = await response.json();
        if (data && data.libros_digitales) {
            renderLibros(data.libros_digitales, 'libros-digitales', 'digital'); // Pasamos el tipo 'digital'
        } else {
            console.error('No se encontraron libros digitales');
        }
    } catch (error) {
        console.error('Error al obtener libros digitales:', error);
    }
}

// Crear y renderizar tarjetas de libros
function renderLibros(libros, containerId, tipo) {
    const container = document.getElementById(containerId); // Seleccionamos el contenedor por ID
    if (container) {
        container.innerHTML = ''; // Limpiamos el contenido existente
        libros.forEach((libro) => {
            const libroCard = createLibroCard(libro, tipo); // Crear la tarjeta del libro
            container.appendChild(libroCard); // Añadir la tarjeta del libro al contenedor
        });
    } else {
        console.error(`No se encontró el contenedor con ID ${containerId}`);
    }
}

function createLibroCard(libro, tipo) {
    const li = document.createElement('li');
    li.className = tipo === 'fisico' ? 'libro_card' : 'libro_card_dig';
    li.innerHTML = `
        <p>${libro.title}</p>
        <p>${libro.author}</p>
        <p>${libro.published_date}</p>
        ${tipo === 'fisico' ? `<p>${libro.pages_amount}</p>` : `<p>${libro.size} MB</p><p>${libro.file_format}</p>`}
        <div class="opciones">
            <i onclick="editBook('${
                libro.id
            }', '${tipo}')" class="fa-solid fa-pen-to-square fa-2xl" style="color: #74c0fc"></i>
            <i onclick="confirmDelete('${
                libro.id
            }', '${tipo}')" class="fa-solid fa-trash fa-2xl" style="color: #ff0000"></i>

        </div>
    `;
    return li;
}

// Confirmar eliminación del libro
function confirmDelete(id, tipo) {
    if (confirm('¿Estás seguro de que deseas eliminar este libro?')) {
        deleteBook(id, tipo);
    }
}

// Eliminar libro
async function deleteBook(id, tipo) {
    const tipoLibro = tipo === 'fisico' ? 'fisicos' : 'digitales';

    try {
        const response = await fetch(`${apiBaseUrl}/libros/${tipoLibro}/${id}`, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
            },
        });

        if (!response.ok) throw new Error('Error al eliminar el libro.');

        const data = await response.json();
        alert(data.message || 'Libro eliminado con éxito.');
        fetchLibros(); // Refrescar la lista de libros
    } catch (error) {
        alert('Error al eliminar el libro. Por favor, inténtelo de nuevo.');
        console.error('Error al eliminar libro:', error);
    }
}

// Manejar la edición de libros
async function editBook(id, tipo) {
    // Obtener los datos del libro a editar
    const tipoLibro = tipo === 'fisico' ? 'fisicos' : 'digitales';
    try {
        const response = await fetch(`${apiBaseUrl}/libros/${tipoLibro}/${id}`);
        const data = await response.json();
        // Acceder a libro_fisico
        const libro = tipoLibro == 'fisicos' ? data.libro_fisico : data.libro_digital

        console.log(libro); // Verifica que estás recibiendo el libro correctamente

        if (!libro) {
            alert('Libro no encontrado.');
            return;
        }

        // Mostrar el modal
        modal.style.display = 'block';

        // Prellenar el formulario con los datos del libro
        formContainer.innerHTML = createForm(tipo, libro); // Pasamos los datos del libro a la función createForm
    } catch (error) {
        alert('Error al cargar los datos del libro.');
        console.error('Error al cargar libro:', error);
    }
}



// Inicialización
fetchLibros(); // Cargar los libros al iniciar la página
