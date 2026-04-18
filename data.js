// Datos del dashboard - carga desde data.json y actualiza el panel Contador
let DASHBOARD_DATA = {};

function fmt(n) { return '$' + Math.round(n).toLocaleString('es-AR'); }
function pct(n) { return n.toFixed(1) + '%'; }

async function cargarDatos() {
    try {
        const response = await fetch('data.json');
        DASHBOARD_DATA = await response.json();
        actualizarPanelContador();
    } catch (error) {
        console.log('Error cargando data.json:', error);
    }
}

function actualizarPanelContador() {
    const c = DASHBOARD_DATA.contador;
    if (!c) return;

    // KPIs - update by position in kpi-grid
    const kpis = document.querySelectorAll('#panel-contador .kpi-card');
    if (kpis.length >= 4) {
        kpis[0].querySelector('.valor').textContent = fmt(c.gastoAbril);
        kpis[0].querySelector('.agente-or').textContent = pct(c.porcentajeGastado) + ' del presupuesto';
        kpis[1].querySelector('.valor').textContent = fmt(c.disponible);
        kpis[1].querySelector('.agente-or').textContent = pct(c.porcentajeDisponible) + ' restante';
        kpis[2].querySelector('.valor').textContent = fmt(c.gastoAcumulado2026);
        kpis[2].querySelector('.agente-or').textContent = pct(c.porcentajeAcumulado) + ' del presupuesto';
        kpis[3].querySelector('.valor').textContent = fmt(c.presupuestoAnual);
        kpis[3].querySelector('.agente-or').textContent = 'Ene-Abr 2026';
    }

    // Top 5 OCs
    const ocsSection = document.querySelector('#panel-contador .seccion-full[style*="rgba(243, 156, 18"] ul');
    if (ocsSection) {
        ocsSection.innerHTML = c.top5OCs.map((oc, i) =>
            `<li><strong>${i+1}.</strong> ${oc.concepto}: ${oc.moneda} ${oc.monto.toLocaleString('es-AR')} (~${fmt(oc.montoARS)})</li>`
        ).join('');
    }

    // Acciones recomendadas
    const accionesUl = document.querySelectorAll('#panel-contador .seccion-full ul')[3];
    if (accionesUl) {
        accionesUl.innerHTML = c.accionesRecomendadas.map(a => {
            const parts = a.split(':');
            return `<li><strong>${parts[0]}:</strong>${parts.slice(1).join(':')}</li>`;
        }).join('');
    }

    // Chat
    const chatMsg = document.querySelector('#panel-contador .chat-msg.agente');
    if (chatMsg) chatMsg.textContent = c.chatMensaje;

    // Top 5 gastos del día
    const secciones = document.querySelectorAll('#panel-contador .seccion');
    // Find "Top 5 gastos del día" section
    secciones.forEach(sec => {
        const h3 = sec.querySelector('h3');
        if (h3 && h3.textContent.includes('Top 5 gastos del día')) {
            h3.textContent = '💸 Top 5 gastos del día (' + c.top5Dia.fecha + ')';
            const ul = sec.querySelector('ul');
            if (ul) ul.innerHTML = c.top5Dia.items.map((item, i) =>
                `<li><strong>${i+1}.</strong> ${item.concepto}: ${fmt(item.monto)}</li>`
            ).join('');
        }
    });

    // Top 10 gastos del mes
    secciones.forEach(sec => {
        const h3 = sec.querySelector('h3');
        if (h3 && h3.textContent.includes('Top 10 gastos del mes')) {
            const ul = sec.querySelector('ul');
            if (ul) ul.innerHTML = c.top10Mes.map((item, i) =>
                `<li><strong>${i+1}.</strong> ${item.concepto}: ${fmt(item.monto)}</li>`
            ).join('');
        }
    });

    // Gasto por cuenta
    const cuentasUl = document.querySelectorAll('#panel-contador .seccion-full ul');
    cuentasUl.forEach(ul => {
        const prev = ul.previousElementSibling;
        if (prev && prev.textContent.includes('Gasto por cuenta')) {
            ul.innerHTML = c.cuentas.map(cta =>
                `<li><strong>${cta.codigo} - ${cta.nombre}:</strong> ${fmt(cta.total)} (${pct(cta.porcentaje)})</li>`
            ).join('') + `<li style="border-top: 2px solid #27ae60; padding-top: 12px; margin-top: 8px;"><strong style="color: #f39c12;">Total: ${fmt(c.gastoAbril)}</strong> (${pct(c.porcentajeGastado)} del presupuesto)</li>`;
        }
    });

    // Tabla gasto por mes
    const tables = document.querySelectorAll('#panel-contador table');
    tables.forEach(table => {
        const header = table.querySelector('th');
        if (header && header.textContent.includes('Mes')) {
            const rows = table.querySelectorAll('tbody tr');
            rows.forEach(row => {
                const firstTd = row.querySelector('td');
                if (!firstTd) return;
                const mes = firstTd.textContent.trim();
                const data = c.meses.find(m => m.mes === mes);
                if (data) {
                    const tds = row.querySelectorAll('td');
                    tds[1].textContent = fmt(data.gasto);
                    tds[2].textContent = fmt(data.presupuesto);
                    tds[3].textContent = pct(data.porcentaje) + (data.alerta === 'rojo' ? ' 🔴' : data.alerta === 'verde' ? ' ✅' : '');
                    tds[3].style.color = data.alerta === 'rojo' ? '#e74c3c' : data.alerta === 'verde' ? '#27ae60' : '#f39c12';
                }
            });
            // Total row
            const totalRow = table.querySelector('tr[style*="background: rgba(39, 174"]');
            if (totalRow) {
                const tds = totalRow.querySelectorAll('td');
                tds[1].textContent = fmt(c.gastoAcumulado2026);
                tds[2].textContent = fmt(c.presupuestoAnual);
                tds[3].textContent = pct(c.porcentajeAcumulado);
                tds[3].style.color = c.porcentajeAcumulado > 95 ? '#e74c3c' : '#f39c12';
            }
        }
    });

    // OCs por mes table
    tables.forEach(table => {
        const header = table.querySelector('th');
        if (header && header.textContent.includes('OCs pendientes')) {
            const rows = table.querySelectorAll('tbody tr');
            rows.forEach(row => {
                const firstTd = row.querySelector('td');
                if (!firstTd) return;
                const mes = firstTd.textContent.trim();
                const data = c.ocsPorMes.find(o => o.mes === mes || (o.mes.startsWith('20') && firstTd.textContent.includes(o.mes.substring(0,3))));
                // Try to match by month name or partial match
                if (data) {
                    const tds = row.querySelectorAll('td');
                    if (tds.length >= 4) {
                        tds[1].textContent = fmt(data.total);
                        tds[3].textContent = fmt(data.total);
                    }
                }
            });
            // Total row
            const totalRow2 = table.querySelector('tr[style*="background: rgba(39, 174"]');
            if (totalRow2) {
                const tds = totalRow2.querySelectorAll('td');
                if (tds.length >= 4) {
                    tds[1].textContent = fmt(c.totalOCs);
                    tds[3].textContent = fmt(c.totalOCs);
                }
            }
        }
    });
}

cargarDatos();