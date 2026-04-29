const fs = require('fs');
const XLSX = require('xlsx');

// Leer Excel
const wb = XLSX.readFile('C:/Users/javie/.openclaw/workspace-contador/data/Bajadasbot.xlsx');
const sheet = wb.Sheets['Bajadadeavisos'];
const data = XLSX.utils.sheet_to_json(sheet);

// ======= DATOS =======

const total = data.length;
const cerrados = data.filter(r => (r['Status sistema'] || '').includes('MECE')).length;
const abiertos = data.filter(r => (r['Status sistema'] || '').includes('METR')).length;
const pctCerrados = Math.round((cerrados / total) * 100);
const pctAbiertos = Math.round((abiertos / total) * 100);

// Abril 2026
const abr26 = data.filter(r => {
  if (r['  Fecha     '] == null) return false;
  const d = new Date((r['  Fecha     '] - 25568) * 86400 * 1000);
  return d.getFullYear() === 2026 && d.getMonth() === 3;
});
const abrCerrados = abr26.filter(r => (r['Status sistema'] || '').includes('MECE')).length;
const abrAbiertos = abr26.filter(r => (r['Status sistema'] || '').includes('METR')).length;
const abrPct = Math.round((abrCerrados / abr26.length) * 100);

// Últimos avisos
const fechasValidas = data.filter(r => r['  Fecha     '] != null && r['Status sistema'] != null && r['Status sistema'].toString().trim() !== '');
const maxFecha = Math.max(...fechasValidas.map(r => r['  Fecha     ']));
const maxDate = new Date((maxFecha - 25568) * 86400 * 1000);
const fechaStr = String(maxDate.getDate()).padStart(2, '0') + '/' + String(maxDate.getMonth() + 1).padStart(2, '0') + '/' + maxDate.getFullYear();

const ultimos = data.filter(r => r['  Fecha     '] === maxFecha);
const abiertosU = ultimos.filter(r => (r['Status sistema'] || '').includes('METR')).length;
const cerradosU = ultimos.filter(r => (r['Status sistema'] || '').includes('MECE')).length;

// Meses 2025 - datos reales
const m2025 = [
  { mes: 'Ene', cer: 44, ab: 3, pct: 94 },      // total 47
  { mes: 'Feb', cer: 40, ab: 0, pct: 100 },     // total 40
  { mes: 'Mar', cer: 22, ab: 0, pct: 100 },     // total 22
  { mes: 'Abr', cer: 32, ab: 0, pct: 100 },     // total 32
  { mes: 'May', cer: 58, ab: 0, pct: 100 },     // total 59 (1 MEAB)
  { mes: 'Jun', cer: 35, ab: 0, pct: 100 },     // total 35
  { mes: 'Jul', cer: 127, ab: 4, pct: 94 },     // total 135 (4 otros)
  { mes: 'Ago', cer: 45, ab: 1, pct: 94 },      // total 48 (2 otros)
  { mes: 'Sep', cer: 56, ab: 7, pct: 89 },      // total 63
  { mes: 'Oct', cer: 64, ab: 8, pct: 89 },      // total 72
  { mes: 'Nov', cer: 59, ab: 14, pct: 81 },     // total 73
  { mes: 'Dic', cer: 68, ab: 9, pct: 88 },      // total 77
];

// Meses 2026
const m2026 = [
  { mes: 'Enero', cer: 98, ab: 27, pct: 78, danger: true },     // total 125
  { mes: 'Febrero', cer: 35, ab: 12, pct: 73, danger: true },   // total 48 (1 MEAB)
  { mes: 'Marzo', cer: 46, ab: 36, pct: 55, danger: true },     // total 84 (2 MEAB)
  { mes: 'Abril', cer: 18, ab: 20, pct: 44, danger: true },     // total 41 (3 MEAB)
];

// ======= GENERAR HTML =======

function barraMes25(m) {
  if (m.ab === 0) {
    return `                        <div style="display: flex; align-items: center; gap: 10px;">
                            <div style="width: 40px; font-weight: bold; color: #2c3e50; font-size: 12px;">${m.mes}</div>
                            <div style="flex: 1; display: flex; align-items: center; gap: 5px;">
                                <div style="height: 24px; background: #27ae60; border-radius: 4px; display: flex; align-items: center; justify-content: center; color: white; font-weight: bold; font-size: 12px; padding: 0 10px;">${m.cer} ✓</div>
                            </div>
                            <div style="width: 40px; text-align: right; font-size: 11px; color: #27ae60;">${m.pct}%</div>
                        </div>`;
  } else {
    const pctColor = m.pct >= 90 ? '#27ae60' : (m.pct >= 80 ? '#f39c12' : '#e74c3c');
    const warnLabel = m.pct < 80 ? ' ⚠' : '';
    const warnColor = m.pct < 80 ? '#e74c3c' : '#2c3e50';
    return `                        <div style="display: flex; align-items: center; gap: 10px;">
                            <div style="width: 40px; font-weight: bold; color: ${warnColor}; font-size: 12px;">${m.mes}${warnLabel}</div>
                            <div style="flex: 1; display: flex; align-items: center; gap: 5px;">
                                <div style="height: 24px; background: #27ae60; border-radius: 4px; display: flex; align-items: center; justify-content: center; color: white; font-weight: bold; font-size: 12px; padding: 0 10px;">${m.cer}</div>
                                <div style="height: 24px; background: #e74c3c; border-radius: 4px; display: flex; align-items: center; justify-content: center; color: white; font-weight: bold; font-size: 12px; padding: 0 8px;">${m.ab}</div>
                            </div>
                            <div style="width: 40px; text-align: right; font-size: 11px; color: ${pctColor};">${m.pct}%</div>
                        </div>`;
  }
}

function barraMes26(m) {
  const pctColor = m.pct >= 90 ? '#27ae60' : (m.pct >= 80 ? '#f39c12' : '#e74c3c');
  const warnIcon = m.pct < 70 ? ' ⚠️' : '';
  return `                        <div style="display: flex; align-items: center; gap: 10px;">
                            <div style="width: 60px; font-weight: bold; color: #2c3e50; font-size: 13px;">${m.mes}</div>
                            <div style="flex: 1; display: flex; align-items: center; gap: 5px;">
                                <div style="height: 24px; background: #27ae60; border-radius: 4px; display: flex; align-items: center; justify-content: center; color: white; font-weight: bold; font-size: 12px; padding: 0 10px;">${m.cer}</div>
                                <div style="height: 24px; background: #e74c3c; border-radius: 4px; display: flex; align-items: center; justify-content: center; color: white; font-weight: bold; font-size: 12px; padding: 0 8px;">${m.ab}</div>
                            </div>
                            <div style="width: 50px; text-align: right; font-size: 12px; font-weight: bold; color: ${pctColor};">${m.pct}%${warnIcon}</div>
                        </div>`;
}

// Tabla últimos avisos
function estadoSpan(status) {
  if (status === 'Cerrado') {
    return '<span style="background:#27ae60;color:white;padding:2px 8px;border-radius:10px;">✅ Cerrado</span>';
  } else if (status === 'Abierto') {
    return '<span style="background:#e74c3c;color:white;padding:2px 8px;border-radius:10px;">⚠ Abierto</span>';
  }
  return `<span style="background:#95a5a6;color:white;padding:2px 8px;border-radius:10px;">${status}</span>`;
}

function tipoSpan(cl) {
  const colorMap = {
    'LD': '#3498db', 'LA': '#2ecc71', 'LB': '#f39c12',
    'LE': '#9b59b6', 'LF': '#1abc9c', 'Z8': '#e67e22',
    'Z9': '#e74c3c', 'MEAB': '#95a5a6'
  };
  const color = colorMap[cl] || '#3498db';
  return `<span style="background:${color};color:white;padding:2px 8px;border-radius:10px;">${cl}</span>`;
}

let tablaUltimos = '';
ultimos.forEach(r => {
  const notif = (r['Notific.   '] || '').toString().trim();
  const ubic = (r['Denominación de la ubicación técnica    '] || '').trim();
  const desc = (r['Descripción                             '] || '').trim();
  const cl = (r['Cl.'] || '').trim();
  const status = (r['Status sistema'] || '').trim().includes('MECE') ? 'Cerrado' : 
                 (r['Status sistema'] || '').trim().includes('METR') ? 'Abierto' : 
                 (r['Status sistema'] || '').trim();
  tablaUltimos += `                        <tr>
                            <td style="padding: 8px;">${notif}</td>
                            <td style="padding: 8px;">${ubic}</td>
                            <td style="padding: 8px;">${desc}</td>
                            <td style="text-align: center;">${tipoSpan(cl)}</td>
                            <td style="text-align: center;">${estadoSpan(status)}</td>
                        </tr>
`;
});

const panelHTML = `            <!-- Panel Analista -->
            <div class="panel" id="panel-analista">
        <button class="panel-cerrar" onclick="cerrarPanel()">&times;</button>
        <div class="panel-header" style="background: #9b59b6;">
            <h2>📋 Analista de Confiabilidad</h2>
            <div class="subtitulo">Análisis de fallas, tendencias y causas raíz - Desde 2025</div>
            <button class="btn-agente" onclick="abrirAgente('analista')">🤖 Abrir agente</button>
        </div>
        <div class="panel-contenido">
            
            <!-- KPIs del Analista -->
            <div class="kpi-grid">
                <div class="kpi-card">
                    <div class="valor">${total.toLocaleString()}</div>
                    <div class="label">Avisos totales</div>
                    <div class="agente-or">Ene 2025 - Abr 2026</div>
                </div>
                <div class="kpi-card bueno">
                    <div class="valor">${cerrados.toLocaleString()}</div>
                    <div class="label">Cerrados</div>
                    <div class="agente-or">${pctCerrados}%</div>
                </div>
                <div class="kpi-card malo">
                    <div class="valor">${abiertos.toLocaleString()}</div>
                    <div class="label">Abiertos</div>
                    <div class="agente-or">${pctAbiertos}%</div>
                </div>
                <div class="kpi-card alerta">
                    <div class="valor">${abrPct}%</div>
                    <div class="label">Tasa cierre Abril</div>
                    <div class="agente-or">⚠️ ${abrAbiertos} abiertos</div>
                </div>
            </div>
            
            <!-- Avisos del día anterior -->
            <div class="seccion seccion-full">
                <h3>📅 Último día con avisos (${fechaStr})</h3>
                <table style="width: 100%; border-collapse: collapse; font-size: 13px;">
                    <thead>
                        <tr style="border-bottom: 2px solid #9b59b6; background: rgba(155,89,182,0.1);">
                            <th style="text-align: left; padding: 8px;">Aviso</th>
                            <th style="text-align: left; padding: 8px;">Ubicación</th>
                            <th style="text-align: left; padding: 8px;">Descripción</th>
                            <th style="text-align: center; padding: 8px;">Tipo</th>
                            <th style="text-align: center; padding: 8px;">Estado</th>
                        </tr>
                    </thead>
                    <tbody>
${tablaUltimos}
                    </tbody>
                </table>
                <p style="font-size: 11px; color: #666; margin-top: 8px;">📌 Total: ${ultimos.length} aviso${ultimos.length !== 1 ? 's' : ''} | ${cerradosU} cerrado${cerradosU !== 1 ? 's' : ''}${abiertosU > 0 ? ' | ' + abiertosU + ' abierto' + (abiertosU !== 1 ? 's' : '') : ''} | Fuente: Bajadasbot.xlsx</p>
            </div>
            
            <!-- Gráfico: Cerrados vs Abiertos por mes (2025) -->
            <div class="seccion seccion-full">
                <h3>📊 Cerrados vs Abiertos por mes (2025)</h3>
                <div style="background: white; border-radius: 8px; padding: 15px; margin-top: 15px;">
                    <div style="display: flex; flex-direction: column; gap: 10px;">
${m2025.map(barraMes25).join('\n')}
                    </div>
                </div>
                <div style="display: flex; justify-content: center; gap: 30px; margin-top: 12px; font-size: 12px;">
                    <div><span style="display: inline-block; width: 14px; height: 14px; background: #27ae60; border-radius: 3px;"></span> Cerrados</div>
                    <div><span style="display: inline-block; width: 14px; height: 14px; background: #e74c3c; border-radius: 3px;"></span> Abiertos</div>
                    <div style="color: #666;">✓ = 100% cerrado</div>
                </div>
            </div>

            <!-- Gráfico: Cerrados vs Abiertos por mes (2026) -->
            <div class="seccion seccion-full">
                <h3>📊 Cerrados vs Abiertos por mes (2026)</h3>
                <div style="background: white; border-radius: 8px; padding: 15px; margin-top: 15px;">
                    <div style="display: flex; flex-direction: column; gap: 12px;">
${m2026.map(barraMes26).join('\n')}
                    </div>
                </div>
                <div style="display: flex; justify-content: center; gap: 30px; margin-top: 12px; font-size: 12px;">
                    <div><span style="display: inline-block; width: 14px; height: 14px; background: #27ae60; border-radius: 3px;"></span> Cerrados</div>
                    <div><span style="display: inline-block; width: 14px; height: 14px; background: #e74c3c; border-radius: 3px;"></span> Abiertos</div>
                    <div style="color: #666;">⚠️ = < 70% cierre</div>
                </div>
            </div>

        </div>
    </div>`;

console.log('Panel HTML generated, length:', panelHTML.length);

// ======= REEMPLAZAR EN EL HTML =======

let html = fs.readFileSync('index.html', 'utf8');

const startMarker = '<!-- Panel Analista -->';
const divStart = html.indexOf(startMarker);
const divOpen = html.indexOf('<div class="panel" id="panel-analista">', divStart);
const nextPanel = html.indexOf('<div class="panel"', divOpen + 50);
const lastClose = html.lastIndexOf('</div>', nextPanel);
const panelEnd = lastClose + '</div>'.length;

const before = html.substring(0, divStart);
const after = html.substring(panelEnd);

const newHTML = before + panelHTML + after;

fs.writeFileSync('index.html', newHTML, 'utf8');
console.log('File written successfully!');
console.log('Old section length:', panelEnd - divStart);
console.log('New section length:', panelHTML.length);

// Verificar que se haya reemplazado correctamente
const verify = fs.readFileSync('index.html', 'utf8');
const verifyStart = verify.indexOf(startMarker);
const verifyDiv = verify.indexOf('id="panel-analista"', verifyStart);
console.log('Verification - analista panel found:', verifyDiv !== -1);
