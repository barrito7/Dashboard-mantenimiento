# Oficina Virtual de Mantenimiento - Godrej

## Estructura de Escritorios

| # | Escritorio | Agente | Función |
|---|------------|--------|---------|
| 1 | 📊 **Tablero KPIs** | - | Vista rápida de indicadores (MTBF, MTTR, disponibilidad, backlog) |
| 2 | 📅 **Planificador** | Planificador | Programa preventivos, distribuye carga por turnos, calendario semanal/mensual |
| 3 | 🔧 **Programador** | Programador | Genera OTs, gestiona prioridades del día, asigna técnicos |
| 4 | 👀 **Supervisor** | Supervisor | Seguimiento de tareas en curso, incidencias, novedades por turno |
| 5 | 👔 **Jefe de Mantenimiento** | Jefe | Resumen ejecutivo, decisiones, pendientes, reportes a gerencia |
| 6 | 📦 **Pañolero** | Pañolero | Stock de repuestos, pedidos pendientes, consumos, órdenes de compra |
| 7 | 📋 **Analista** | Analista de Confiabilidad | Análisis de fallas, tendencias, causas raíz, criticidad de equipos |
| 8 | 🔌 **Servicios** | Encargado de Servicios | Electricidad, agua, aire comprimido, vapor, gas - consumos y disponibilidades |
| 9 | 🏗️ **Mantenimiento Edilicio** | Encargado Edilicio | Reparaciones de edificio, pintura, cloacas, estructuras, limpieza técnica |
| 10 | 💰 **Contador $** | Control Financiero | Presupuesto de mantenimiento, gastos por OT, costos de repuestos, desviaciones |

---

## Responsables por Escritorio

| Escritorio | Responsable Real |
|------------|------------------|
| Planificador | Analista de Confiabilidad |
| Programador | Jefe de Mantenimiento |
| Supervisor | Mecánico líder por turno |
| Jefe de Mantenimiento | Barrito |
| Pañolero | Pañolero |
| Analista | Analista de Confiabilidad |
| Servicios | A definir |
| Mantenimiento Edilicio | 2 técnicos edilicio |
| Contador $ | Barrito / Administración |

---

## Flujo de Información

```
                    ┌─────────────────┐
                    │   Jefe de Mant. │ ← Barrito
                    │    (Escritorio) │
                    └────────┬────────┘
                             │
        ┌────────────────────┼────────────────────┐
        │                    │                    │
        ▼                    ▼                    ▼
┌───────────────┐    ┌───────────────┐    ┌───────────────┐
│  Planificador │    │  Supervisor   │    │   Contador $  │
│   (prev)      │    │  (ejecución)  │    │   (costos)    │
└───────┬───────┘    └───────┬───────┘    └───────────────┘
        │                    │
        ▼                    ▼
┌───────────────┐    ┌───────────────┐
│  Programador  │    │  Pañolero     │
│   (OTs)       │    │  (stock)      │
└───────────────┘    └───────────────┘

        ┌────────────────────┐
        │  Analista          │ ← Apoyo transversal
        │  (Confiabilidad)   │
        └────────┬───────────┘
                 │
        ┌────────┴────────┐
        │                 │
        ▼                 ▼
┌───────────────┐  ┌───────────────┐
│   Servicios   │  │   Edilicio    │
└───────────────┘  └───────────────┘
```

---

## Próximos Pasos

1. Definir qué datos alimenta cada escritorio
2. Crear dashboard HTML con los 10 escritorios
3. Conectar con Google Sheets (cuando esté listo)
4. Habilitar agentes especializados por escritorio