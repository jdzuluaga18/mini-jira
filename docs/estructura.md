# Estructura de la aplicación

## Objetivo

Aplicación web para planificar y dar seguimiento al trabajo de equipos mediante tableros Kanban. El equipo puede organizar proyectos e issues, consultar cambios recientes y registrar el tiempo trabajado.

## Alcance inicial

- Kanban como único marco de trabajo inicial.
- No habrá configuración Scrum ni sprints en esta primera versión.
- Cada proyecto tendrá un tablero con columnas configurables y límites de trabajo en curso opcionales.
- Las columnas iniciales serán: Pendiente, En curso, En revisión y Hecha.
- Las actualizaciones del tablero y la actividad reciente deberán reflejar cambios compartidos en tiempo real.
- El tiempo se podrá registrar con un cronómetro de inicio y parada o añadirse y corregirse manualmente.

## Jerarquía de trabajo

```text
Espacio de trabajo
└── Proyecto
    ├── Tablero Kanban
    ├── Épica
    │   └── Issue estándar (historia, tarea o bug)
    │       └── Subtask
    └── Equipo
```

Un issue estándar puede pertenecer a una épica y tener subtasks. Los issues que no pertenezcan a una épica también podrán aparecer en el tablero del proyecto.

## Roles iniciales

- **Administrador:** administra el espacio de trabajo, sus integrantes y proyectos.
- **Responsable de proyecto:** organiza el proyecto, el tablero, las épicas y los issues.
- **Miembro:** consulta el trabajo del equipo, actualiza issues y registra tiempo; la creación y organización del trabajo queda a cargo del responsable de proyecto.

Los permisos concretos se aplicarán también a las actualizaciones en tiempo real, para que cada persona solo reciba información de los espacios y proyectos a los que tiene acceso.

## Navegación principal

- **Inicio:** proyectos activos, progreso de tableros, tareas asignadas y actividad reciente.
- **Proyectos:** resumen del proyecto y acceso a su tablero e issues.
- **Mi trabajo:** issues asignados y tiempo registrado por la persona.
- **Equipo:** integrantes y roles.
- **Informes:** avance y tiempo por proyecto, issue y miembro.
- **Configuración:** administración del espacio de trabajo y sus proyectos.

## Entidades de datos principales

- `profiles`: perfil de cada usuario autenticado.
- `workspaces`: espacios de trabajo.
- `workspace_members`: usuarios y roles dentro de un espacio.
- `projects`: proyectos asociados a un espacio.
- `project_members`: participación y rol de cada usuario en un proyecto.
- `board_columns`: columnas, orden y límites opcionales de trabajo en curso.
- `epics`: agrupaciones de trabajo por proyecto.
- `issues`: historias, tareas, bugs y subtasks; incluye estado, asignación y relaciones jerárquicas.
- `time_entries`: intervalos del cronómetro y registros manuales asociados a un issue y usuario.
- `activity_events`: cambios relevantes que alimentan la actividad reciente.

### Campos mínimos del modelo

- `workspaces`: nombre, propietario y fechas de creación/actualización.
- `workspace_members`: espacio, usuario y rol de administrador.
- `projects`: espacio, nombre, descripción y estado activo/archivado.
- `project_members`: proyecto, usuario y rol de responsable de proyecto o miembro.
- `board_columns`: proyecto, nombre, posición y límite WIP opcional.
- `epics`: proyecto, título y descripción.
- `issues`: proyecto, épica opcional, issue padre opcional, columna, tipo, título, descripción, responsable, posición y fechas.
- `time_entries`: issue, usuario, origen (cronómetro o manual), duración, fecha y nota opcional. Las entradas activas del cronómetro guardan su hora de inicio y se cierran al detenerlo.
- `activity_events`: espacio/proyecto, autor, elemento afectado, tipo de cambio y fecha.

El estado visible de cada issue corresponde a su columna Kanban. Los issues se ordenan dentro de la columna para poder reordenar las tarjetas. Las subtasks usan un issue padre; la épica se guarda como una relación separada.

## Estructura de carpetas propuesta

```text
docs/
  estructura.md            # decisiones funcionales y técnicas
src/
  app/                     # rutas y páginas de Next.js
    (auth)/                # acceso y autenticación
    (workspace)/           # páginas protegidas de la aplicación
      dashboard/
      projects/[projectId]/
        board/
        issues/
      my-work/
      team/
      reports/
      settings/
  components/
    layout/                # navegación y elementos comunes
    kanban/                # tablero, columnas y tarjetas
    issues/                # épicas, issues, subtasks y formularios
    time-tracking/         # cronómetro y entradas manuales
  features/                # lógica y consultas por área funcional
  lib/
    supabase/              # clientes y configuración de Supabase
    permissions/           # comprobación de acceso por rol y proyecto
  types/                   # tipos compartidos
supabase/
  migrations/              # esquema SQL e índices
  seed/                    # datos locales de ejemplo
```

## Base técnica propuesta

- **Next.js App Router y TypeScript** para la aplicación web.
- **Supabase Auth** para autenticación.
- **PostgreSQL de Supabase** para los datos.
- **Supabase Realtime** para los cambios compartidos del tablero y la actividad.
- Políticas de acceso en la base de datos para aislar los espacios y proyectos.

## Pendiente de definir antes de cerrar el modelo

- Si habrá comentarios, notificaciones y fechas límite en la primera versión.
- Reglas para mover issues entre columnas y actualizar subtasks.
- Métricas y filtros incluidos en los informes iniciales.

El README se preparará después de crear la base de la aplicación.

## Estado actual de la implementación

- La base de Next.js está creada en esta carpeta.
- El tablero actual es un prototipo de interfaz con datos de ejemplo: permite crear issues, moverlos entre columnas y registrar tiempo localmente.
- La autenticación, persistencia y sincronización entre personas todavía se conectarán con Supabase.
- El README de plantilla se retiró para escribir el README del producto más adelante, según lo acordado.
