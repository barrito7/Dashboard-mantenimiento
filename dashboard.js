// Datos de los escritorios
const escritorios = [
    { id: 1, icono: '📊', nombre: 'Tablero KPIs', agente: '', color: 'blue' },
    { id: 2, icono: '📅', nombre: 'Planificador', agente: 'Planificador', color: 'green' },
    { id: 3, icono: '🔧', nombre: 'Programador', agente: 'Programador', color: 'red' },
    { id: 4, icono: '👀', nombre: 'Supervisor', agente: 'Supervisor', color: 'purple' },
    { id: 5, icono: '👔', nombre: 'Jefe de Mant.', agente: 'Barrito', color: 'dark' },
    { id: 6, icono: '📦', nombre: 'Pañolero', agente: 'Pañolero', color: 'orange' },
    { id: 7, icono: '📋', nombre: 'Analista', agente: 'Analista', color: 'teal' },
    { id: 8, icono: '🔌', nombre: 'Servicios', agente: '', color: 'yellow' },
    { id: 9, icono: '🏗️', nombre: 'Edilicio', agente: '2 técnicos', color: 'gray' },
    { id: 10, icono: '💰', nombre: 'Contador $', agente: '', color: 'emerald' }
];

// Renderizar escritorios
function renderizarOficina() {
    const contenedor = document.querySelector('.oficina-grid');

    escritorios.forEach(e => {
        const tarjeta = document.createElement('div');
        tarjeta.className = 'escritorio';
        tarjeta.setAttribute('data-color', e.color);
        tarjeta.innerHTML = `
            <div class="escritorio-superficie">
                <div class="escritorio-icono">${e.icono}</div>
                <div class="escritorio-nombre">${e.nombre}</div>
                <div class="escritorio-agente">${e.agente}</div>
            </div>
            <div class="silla"></div>
        `;
        tarjeta.onclick = () => abrirEscritorio(e);
        contenedor.appendChild(tarjeta);
    });
}

// Al hacer clic en un escritorio
function abrirEscritorio(escritorio) {
    console.log('Abriendo:', escritorio.nombre);
    // Próximamente: panel desplegable con datos
}

// Iniciar
renderizarOficina();