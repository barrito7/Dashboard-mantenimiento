// Datos del dashboard (cargados desde data.json)
let DASHBOARD_DATA = {};

async function cargarDatos() {
    try {
        const response = await fetch('data.json');
        DASHBOARD_DATA = await response.json();
        actualizarPanelContador();
    } catch (error) {
        console.log('Usando datos por defecto');
        DASHBOARD_DATA = getDatosDefecto();
    }
}

function getDatosDefecto() {
    return {
        contador: {
            gastoAcumulado: 892450,
            presupuesto: 1150000,
            gastoDiaAnterior: 45230
        }
    };
}

function actualizarPanelContador() {
    const c = DASHBOARD_DATA.contador;
    if (!c) return;
    
    // Actualizar KPIs
    document.querySelectorAll('.kpi-card')[0].querySelector('.valor').textContent = '$' + c.gastoAcumulado.toLocaleString();
    document.querySelectorAll('.kpi-card')[0].querySelector('.agente-or').textContent = Math.round(c.gastoAcumulado / c.presupuesto * 100) + '% del presupuesto';
    document.querySelectorAll('.kpi-card')[1].querySelector('.valor').textContent = '$' + c.presupuesto.toLocaleString();
    document.querySelectorAll('.kpi-card')[2].querySelector('.valor').textContent = '$' + c.gastoDiaAnterior.toLocaleString();
    document.querySelectorAll('.kpi-card')[3].querySelector('.valor').textContent = c.ocsPendientes;
    
    // Actualizar proyección
    const proy = c.proyeccion;
    if (proy) {
        const projectionSection = document.querySelector('.seccion-full .seccion-full h3');
        if (projectionSection && projectionSection.textContent.includes('Proyección')) {
            // Actualizar valores de proyección
        }
    }
}

cargarDatos();