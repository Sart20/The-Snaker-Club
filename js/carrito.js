const carrito = [];


function cargarProductos() {
    fetch('./productos.json')
        .then(response => response.json())
        .then(data => {
            mostrarProductos(data);
        })
        .catch(error => console.error('Error al cargar productos:', error));
}


function mostrarProductos(productos) {
    const contenedorProductos = document.querySelector('.productos-content');
    contenedorProductos.innerHTML = ''; 

    productos.forEach(producto => {
        const div = document.createElement('div');
        div.classList.add('producto');
        div.innerHTML = `
            <img src="${producto.imagen}" alt="${producto.nombre}">
            <h4>${producto.nombre}</h4>
            <a href="https://wa.me/5492634658613" class="boton-1" target="_blank">Whatsapp</a>
            <button class="btn btn-primary agregar-carrito" data-nombre="${producto.nombre}" data-precio="${producto.precio}">Agregar al carrito</button>
        `;
        contenedorProductos.appendChild(div);
    });

    asignarEventosCarrito();
}


function asignarEventosCarrito() {
    document.querySelectorAll('.agregar-carrito').forEach(boton => {
        boton.addEventListener('click', (e) => {
            const nombreProducto = e.target.getAttribute('data-nombre');
            const precioProducto = Number(e.target.getAttribute('data-precio'));
            carrito.push({ nombre: nombreProducto, precio: precioProducto });
            actualizarCarrito();
            guardarCarritoEnStorage();
        });
    });

    document.getElementById('vaciar-carrito').addEventListener('click', () => {
        carrito.length = 0;
        actualizarCarrito();
        guardarCarritoEnStorage();
    });
}


function actualizarCarrito() {
    const listaCarrito = document.getElementById('lista-carrito');
    const totalPrecio = document.getElementById('total-precio');
    const carritoCantidad = document.getElementById('carrito-cantidad');
    listaCarrito.innerHTML = '';

    let total = 0;
    carrito.forEach((producto, index) => {
        total += producto.precio;
        const li = document.createElement('li');
        li.classList.add('list-group-item');
        li.innerHTML = `${producto.nombre} - $${producto.precio} 
                        <button class="btn btn-sm btn-danger float-end eliminar-item" data-index="${index}">Eliminar</button>`;
        listaCarrito.appendChild(li);
    });

    totalPrecio.innerText = total;
    carritoCantidad.innerText = carrito.length;


    document.querySelectorAll('.eliminar-item').forEach(boton => {
        boton.addEventListener('click', (e) => {
            const index = e.target.getAttribute('data-index');
            carrito.splice(index, 1);
            actualizarCarrito();
            guardarCarritoEnStorage();
        });
    });
}


function guardarCarritoEnStorage() {
    localStorage.setItem('carrito', JSON.stringify(carrito));
}


function cargarCarritoDeStorage() {
    const carritoGuardado = localStorage.getItem('carrito');
    if (carritoGuardado) {
        carrito.push(...JSON.parse(carritoGuardado));
        actualizarCarrito();
    }
}


document.addEventListener('DOMContentLoaded', () => {
    cargarProductos();
    cargarCarritoDeStorage();
});