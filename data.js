// Datos del dashboard - carga desde data.json y actualiza el panel Contador
let DASHBOARD_DATA = {};

function fmt(n) { return '$' + Math.round(n).toLocaleString('es-AR'); }
function pct(n) { return n.toFixed(1) + '%'; }

async function cargarDatos() {
    try {
        const response = await fetch('data.json?t=' + Date.now());
        DASHBOARD_DATA = await response.json();
        actualizarPanelContador();
    } catch (error) {
        console.log('Error cargando data.json:', error);
    }
}

function actualizarPanelContador() {
    const c = DASHBOARD_DATA.contador;
    if (!c) return;

    const nombreMes = c.mesActual || 'Mayo';

    // KPIs
    const kpis = document.querySelectorAll('#panel-contador .kpi-card');
    if (kpis.length >= 4) {
        kpis[0].querySelector('.valor').textContent = fmt(c.gastoMesActual);
        kpis[0].querySelector('.agente-or').textContent = pct(c.porcentajeGastado) + ' del presupuesto';
        kpis[1].querySelector('.valor').textContent = fmt(c.disponible);
        kpis[1].querySelector('.agente-or').textContent = pct(c.porcentajeDisponible) + ' restante';
        kpis[2].querySelector('.valor').textContent = fmt(c.gastoAcumulado2026);
        kpis[2].querySelector('.agente-or').textContent = pct(c.porcentajeAcumulado) + ' del presupuesto';
        kpis[3].querySelector('.valor').textContent = fmt(c.presupuestoAnual);
        kpis[3].querySelector('.agente-or').textContent = 'Ene-' + nombreMes.substring(0,3) + ' 2026';
    }

    // Presupuesto bars
    const gastadoLabel = document.querySelector('[id="cnt-gastado-label"]');
    if (gastadoLabel) {
        gastadoLabel.querySelector('span:first-child').textContent = '🔴 Gastado (' + pct(c.porcentajeGastado) + ')';
        gastadoLabel.querySelector('span:last-child').textContent = fmt(c.gastoMesActual);
    }
    const gastadoBar = document.querySelector('[id="cnt-gastado-bar"]');
    if (gastadoBar) gastadoBar.style.width = pct(c.porcentajeGastado);

    const ocsLabel = document.querySelector('[id="cnt-ocs-label"]');
    if (ocsLabel) {
        ocsLabel.querySelector('span:first-child').textContent = '🟡 Pendiente OCs entrega ' + nombreMes.toLowerCase() + ' (' + pct(c.porcentajeOCs) + ')';
        ocsLabel.querySelector('span:last-child').textContent = fmt(c.ocsPendientesMesActual);
    }
    const ocsBar = document.querySelector('[id="cnt-ocs-bar"]');
    if (ocsBar) ocsBar.style.width = pct(c.porcentajeOCs);

    const dispLabel = document.querySelector('[id="cnt-disp-label"]');
    if (dispLabel) {
        dispLabel.querySelector('span:first-child').textContent = '✅ Disponible sin OCs (' + pct(c.porcentajeDisponible) + ')';
        dispLabel.querySelector('span:last-child').textContent = fmt(c.disponible);
    }
    const dispBar = document.querySelector('[id="cnt-disp-bar"]');
    if (dispBar) dispBar.style.width = pct(c.porcentajeDisponible);

    const proy = document.querySelector('[id="cnt-proyeccion"]');
    if (proy) proy.textContent = fmt(c.proyeccionTotal) + ' (' + pct(c.proyeccionPorcentaje) + ')';

    const proyDetalle = document.querySelector('[id="cnt-proyeccion-detalle"]');
    if (proyDetalle) {
        const excede = c.excedente < 0;
        proyDetalle.innerHTML = 'Gasto actual ' + (c.gastoMesActual/1000000).toFixed(1) + 'M + OCs pendientes ' + nombreMes.toLowerCase() + ' ' + (c.ocsPendientesMesActual/1000000).toFixed(1) + 'M = <strong>' + (c.proyeccionTotal/1000000).toFixed(1) + 'M</strong><br>' +
            '<span style="color: #e74c3c;">🔴 ' + (excede ? 'EXCEDE presupuesto por ' + fmt(Math.abs(c.excedente)) + ' (' + pct(c.proyeccionPorcentaje) + ')' : 'Solo ' + fmt(c.disponible) + ' de margen') + '</span>';
    }

    // Todas las OCs pendientes del mes
    const ocsJunioList = document.querySelector('[id="cnt-top5-ocs"]');
    if (ocsJunioList) {
        const ocs = c.ocsJunio || c.top5OCs;
        ocsJunioList.innerHTML = ocs.map((oc, i) =>
            '<li><strong>' + (i+1) + '.</strong> ' + oc.concepto + ': ' + oc.moneda + ' ' + Number(oc.monto).toLocaleString('es-AR') + ' (~' + fmt(oc.montoARS) + ')</li>'
        ).join('');
    }

    // Acciones recomendadas
    const accionesList = document.querySelector('[id="cnt-acciones"]');
    if (accionesList) {
        accionesList.innerHTML = c.accionesRecomendadas.map(a => {
            const idx = a.indexOf(':');
            return '<li><strong>' + a.substring(0, idx+1) + '</strong>' + a.substring(idx+1) + '</li>';
        }).join('');
    }

    // Chat
    const chatMsg = document.querySelector('#panel-contador .chat-msg.agente');
    if (chatMsg) chatMsg.textContent = c.chatMensaje;

    // Top 10 gastos del día anterior
    const top10title = document.querySelector('[id="cnt-top10-dia-title"]');
    if (top10title) top10title.textContent = '💸 Top 10 gastos del período (' + c.top10DiaAnterior.fecha + ')';
    const top10list = document.querySelector('[id="cnt-top10-dia"]');
    if (top10list) {
        top10list.innerHTML = c.top10DiaAnterior.items.map((item, i) =>
            '<li><strong>' + (i+1) + '.</strong> ' + item.concepto + ': ' + fmt(item.monto) + '</li>'
        ).join('');
    }

    // Top 10 gastos del mes
    const top10listMes = document.querySelector('[id="cnt-top10-mes"]');
    if (top10listMes) {
        top10listMes.innerHTML = c.top10Mes.map((item, i) =>
            '<li><strong>' + (i+1) + '.</strong> ' + item.concepto + ': ' + fmt(item.monto) + '</li>'
        ).join('');
    }

    // Gasto por cuenta
    const cuentasList = document.querySelector('[id="cnt-cuentas"]');
    if (cuentasList) {
        cuentasList.innerHTML = c.cuentas.map(cta =>
            '<li><strong>' + cta.codigo + ' - ' + cta.nombre + ':</strong> ' + fmt(cta.total) + ' (' + pct(cta.porcentaje) + ')</li>'
        ).join('') + '<li style="border-top: 2px solid #27ae60; padding-top: 12px; margin-top: 8px;"><strong style="color: #f39c12;">Total: ' + fmt(c.gastoMesActual) + '</strong> (' + pct(c.porcentajeGastado) + ' del presupuesto)</li>';
    }

    // Tabla gasto por mes vs presupuesto (usando data-mes attributes)
    c.meses.forEach(data => {
        const gastoTd = document.querySelector(`[data-mes="${data.mes}"]`);
        const presTd = document.querySelector(`[data-mes-pres="${data.mes}"]`);
        const porcTd = document.querySelector(`[data-mes-porc="${data.mes}"]`);
        if (gastoTd) {
            gastoTd.textContent = fmt(data.gasto);
            gastoTd.style.color = data.alerta === 'rojo' ? '#e74c3c' : data.alerta === 'verde' ? '#27ae60' : '#f39c12';
        }
        if (presTd) presTd.textContent = fmt(data.presupuesto);
        if (porcTd) {
            porcTd.textContent = pct(data.porcentaje) + (data.alerta === 'rojo' ? ' 🔴' : data.alerta === 'verde' ? ' ✅' : '');
            porcTd.style.color = data.alerta === 'rojo' ? '#e74c3c' : data.alerta === 'verde' ? '#27ae60' : '#f39c12';
        }
        // Highlight current month row
        const row = document.querySelector(`[data-mes-row="${data.mes}"]`);
        if (row) row.style.background = data.alerta === 'rojo' ? 'rgba(231,76,60,0.1)' : data.alerta === 'verde' ? 'rgba(39,174,96,0.1)' : 'rgba(243,156,18,0.1)';
    });
    // Total row
    const totalGasto = document.querySelector('[data-mes="Total"]');
    const totalPres = document.querySelector('[data-mes-pres="Total"]');
    const totalPorc = document.querySelector('[data-mes-porc="Total"]');
    if (totalGasto) {
        totalGasto.textContent = fmt(c.gastoAcumulado2026);
        totalGasto.style.color = '#e74c3c';
    }
    if (totalPres) totalPres.textContent = fmt(c.presupuestoAnual);
    if (totalPorc) {
        totalPorc.textContent = pct(c.porcentajeAcumulado);
        totalPorc.style.color = c.porcentajeAcumulado > 95 ? '#e74c3c' : '#f39c12';
    }

    // OCs title
    const ocsTitle = document.querySelector('[id="cnt-ocs-title"]');
    if (ocsTitle) ocsTitle.textContent = '🟡 OCs pendientes de entrega (' + nombreMes.toLowerCase() + ') - ' + (c.ocsJunio ? c.ocsJunio.length : c.top5OCs.length) + ' órdenes';

    // OCs footer
    const ocsFooter = document.querySelector('[id="cnt-ocs-footer"]');
    if (ocsFooter) {
        const totalOCsAll = c.totalOCs || 0;
        const ocsMesCount = c.ocsPorMes ? c.ocsPorMes.find(m => m.mes === nombreMes.substring(0,3)) : null;
        ocsFooter.textContent = 'Fuente: Bajadasbot.xlsx | ' + (ocsMesCount ? ocsMesCount.count : '') + ' OCs pendientes | Total: ' + fmt(totalOCsAll);
    }
}

cargarDatos();