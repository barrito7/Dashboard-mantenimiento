import re

with open('index.html', 'r', encoding='utf-8') as f:
    content = f.read()

# Buscar el patrón del gráfico viejo
start_marker = '<!-- Gr'
end_marker = '</div>\n        </div>\n    </div>\n    \n    <script src="data.js">'

# Encontrar donde empieza y termina
start_idx = content.find('<!-- Gr')
if start_idx == -1:
    print('No found start')
    exit(1)

end_idx = content.find('</script>\n</body>\n</html>')
if end_idx == -1:
    print('No found end')
    exit(1)

# Nuevo gráfico simplificado
new_graph = '''<!-- Grafico Presupuesto -->
            <div class="seccion seccion-full">
                <h3>📊 Presupuesto Abril 2026</h3>
                <div style="background: #f8f9fa; padding: 15px; border-radius: 8px;">
                    <div style="margin-bottom: 10px;">
                        <div style="font-size: 12px; color: #7f8c8d; margin-bottom: 5px;">Gastado: $892,450 de $1,150,000 (78%)</div>
                        <div style="background: #ecf0f1; height: 30px; border-radius: 4px; overflow: hidden;">
                            <div style="background: linear-gradient(90deg, #27ae60, #f39c12); height: 100%; width: 78%;"></div>
                        </div>
                    </div>
                    <div style="display: grid; grid-template-columns: repeat(3, 1fr); gap: 10px; margin-top: 15px;">
                        <div style="text-align: center; padding: 10px; background: white; border-radius: 6px;">
                            <div style="font-size: 18px; font-weight: bold; color: #27ae60;">$892,450</div>
                            <div style="font-size: 11px; color: #7f8c8d;">Gastado</div>
                        </div>
                        <div style="text-align: center; padding: 10px; background: white; border-radius: 6px;">
                            <div style="font-size: 18px; font-weight: bold; color: #3498db;">$257,550</div>
                            <div style="font-size: 11px; color: #7f8c8d;">Disponible</div>
                        </div>
                        <div style="text-align: center; padding: 10px; background: white; border-radius: 6px;">
                            <div style="font-size: 18px; font-weight: bold; color: #e74c3c;">$212,800</div>
                            <div style="font-size: 11px; color: #7f8c8d;">OCs + OTs</div>
                        </div>
                    </div>
                    <div style="margin-top: 15px; padding: 10px; background: #fff3cd; border-radius: 6px; text-align: center;">
                        <span style="font-size: 13px;"><strong>Proyeccion:</strong> $1,105,250 (96% del presupuesto)</span>
                    </div>
                </div>
            </div>
        </div>
    </div>
    
    <script src="data.js"></script>
    <script>
        function abrirPanel(escritorio) {
            document.getElementById('panel-' + escritorio).classList.add('activo');
        }
        function cerrarPanel() {
            document.querySelectorAll('.panel').forEach(p => p.classList.remove('activo'));
        }
        function abrirAgente(agente) {
            if (agente === 'pañolero') {
                window.open('https://manteniemientogodrej.github.io/pa-ol-godrej-/', '_blank');
            } else {
                alert('Próximamente: Chat con ' + agente);
            }
        }
    </script>
</body>
</html>'''

# Buscar el final del gráfico viejo (donde empieza el script)
script_start = content.find('<script src="data.js">')

# Reemplazar desde el inicio del gráfico hasta el final del archivo
new_content = content[:start_idx] + new_graph

with open('index.html', 'w', encoding='utf-8') as f:
    f.write(new_content)

print('Done')