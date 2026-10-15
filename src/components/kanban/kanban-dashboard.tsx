"use client";

import { useEffect, useMemo, useState, type FormEvent, type ReactNode } from "react";

type IssueType = "Historia" | "Tarea" | "Bug";
type Status = "Pendiente" | "En curso" | "En revisión" | "Hecha";
type Issue = {
  id: string;
  code: string;
  title: string;
  type: IssueType;
  status: Status;
  labels: string[];
  assignee: string;
  initials: string;
  avatar: string;
  seconds: number;
};

const columns: { name: Status; tone: string; limit?: number }[] = [
  { name: "Pendiente", tone: "" },
  { name: "En curso", tone: "progress", limit: 4 },
  { name: "En revisión", tone: "review", limit: 3 },
  { name: "Hecha", tone: "done" },
];

const initialIssues: Issue[] = [
  { id: "i-24", code: "WEB-24", title: "Diseñar flujo de alta de proyectos", type: "Historia", status: "Pendiente", labels: ["Diseño", "Alta prioridad"], assignee: "Marina López", initials: "ML", avatar: "purple", seconds: 5400 },
  { id: "i-31", code: "WEB-31", title: "Añadir filtros por responsable y etiqueta", type: "Tarea", status: "Pendiente", labels: ["Tablero"], assignee: "Diego Ruiz", initials: "DR", avatar: "blue", seconds: 0 },
  { id: "i-36", code: "WEB-36", title: "Preparar estructura de informes", type: "Historia", status: "Pendiente", labels: ["Informes"], assignee: "Lucía Pérez", initials: "LP", avatar: "mint", seconds: 0 },
  { id: "i-08", code: "WEB-08", title: "Construir panel de actividad reciente", type: "Tarea", status: "En curso", labels: ["Dashboard", "En progreso"], assignee: "Leo Martín", initials: "LM", avatar: "orange", seconds: 5030 },
  { id: "i-17", code: "WEB-17", title: "Configurar permisos por rol", type: "Historia", status: "En curso", labels: ["Acceso"], assignee: "Marina López", initials: "ML", avatar: "purple", seconds: 7800 },
  { id: "i-13", code: "WEB-13", title: "Corregir orden de tarjetas al moverlas", type: "Bug", status: "En revisión", labels: ["Tablero", "Bug"], assignee: "Diego Ruiz", initials: "DR", avatar: "blue", seconds: 3900 },
  { id: "i-21", code: "WEB-21", title: "Guardar tiempo manual en una tarea", type: "Tarea", status: "En revisión", labels: ["Tiempo"], assignee: "Leo Martín", initials: "LM", avatar: "orange", seconds: 2700 },
  { id: "i-04", code: "WEB-04", title: "Crear navegación principal", type: "Historia", status: "Hecha", labels: ["Diseño"], assignee: "Lucía Pérez", initials: "LP", avatar: "mint", seconds: 6600 },
  { id: "i-06", code: "WEB-06", title: "Definir columnas iniciales de Kanban", type: "Tarea", status: "Hecha", labels: ["Tablero"], assignee: "Diego Ruiz", initials: "DR", avatar: "blue", seconds: 2400 },
];

const navItems = [
  { label: "Inicio", icon: "home" },
  { label: "Proyectos", icon: "projects", badge: "3" },
  { label: "Mi trabajo", icon: "tasks", badge: "4" },
  { label: "Equipo", icon: "team" },
  { label: "Informes", icon: "reports" },
];

function Icon({ name, size = 16 }: { name: string; size?: number }) {
  const shared = { width: size, height: size, viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: 1.8, strokeLinecap: "round" as const, strokeLinejoin: "round" as const, "aria-hidden": true as const };
  const paths: Record<string, ReactNode> = {
    home: <><path d="m3 10 9-7 9 7" /><path d="M5 9v11h14V9M9 20v-6h6v6" /></>,
    projects: <><rect x="3" y="4" width="18" height="16" rx="2" /><path d="M3 9h18M8 4v5" /></>,
    tasks: <><rect x="4" y="4" width="16" height="17" rx="2" /><path d="M8 9h8M8 13h8M8 17h5M9 2v4M15 2v4" /></>,
    team: <><circle cx="9" cy="8" r="3" /><path d="M3 20c0-3.1 2.5-5 6-5s6 1.9 6 5M16 5.4a3 3 0 0 1 0 5.2M18 15c2 .6 3 2.1 3 4" /></>,
    reports: <><path d="M4 20V10M10 20V4M16 20v-7M22 20H2" /></>,
    settings: <><circle cx="12" cy="12" r="3" /><path d="m19.4 15 .1.1 1.4 1.1-1.4 2.4-1.7-.6a8 8 0 0 1-1.4.8l-.3 1.8h-2.8l-.3-1.8a8 8 0 0 1-1.4-.8l-1.7.6-1.4-2.4 1.4-1.1a7 7 0 0 1 0-1.7l-1.4-1.1L8 9.9l1.7.6a8 8 0 0 1 1.4-.8l.3-1.8h2.8l.3 1.8a8 8 0 0 1 1.4.8l1.7-.6 1.4 2.4-1.4 1.1a7 7 0 0 1-.2 1.6Z" /></>,
    search: <><circle cx="10.8" cy="10.8" r="6.8" /><path d="m16 16 5 5" /></>,
    bell: <><path d="M18 9a6 6 0 0 0-12 0c0 7-3 7-3 9h18c0-2-3-2-3-9M10 21h4" /></>,
    chevron: <path d="m8 10 4 4 4-4" />,
    plus: <><path d="M12 5v14M5 12h14" /></>,
    clock: <><circle cx="12" cy="12" r="9" /><path d="M12 7v5l3 2" /></>,
    calendar: <><rect x="3" y="5" width="18" height="16" rx="2" /><path d="M16 3v4M8 3v4M3 10h18" /></>,
    filter: <><path d="M4 6h16M7 12h10m-7 6h4" /></>,
    more: <><circle cx="5" cy="12" r="1" fill="currentColor" /><circle cx="12" cy="12" r="1" fill="currentColor" /><circle cx="19" cy="12" r="1" fill="currentColor" /></>,
    close: <><path d="m6 6 12 12M18 6 6 18" /></>,
    arrow: <><path d="M7 17 17 7M7 7h10v10" /></>,
    board: <><rect x="3" y="4" width="18" height="16" rx="2" /><path d="M9 4v16m6-16v16" /></>,
    activity: <><path d="M3 12h4l3-8 4 16 3-8h4" /></>,
    tag: <><path d="M20 13 13 20a2 2 0 0 1-3 0l-7-7V4h9l8 8a1 1 0 0 1 0 1Z" /><circle cx="7.5" cy="8" r="1" /></>,
  };
  return <svg {...shared}>{paths[name] ?? paths.board}</svg>;
}

function formatTime(seconds: number) {
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  return `${hours}h ${String(minutes).padStart(2, "0")}m`;
}

export function KanbanDashboard() {
  const [issues, setIssues] = useState(initialIssues);
  const [activeTimerId, setActiveTimerId] = useState<string | null>(null);
  const [draggedIssueId, setDraggedIssueId] = useState<string | null>(null);
  const [activeNav, setActiveNav] = useState("Inicio");
  const [query, setQuery] = useState("");
  const [showNewIssue, setShowNewIssue] = useState(false);
  const [showManualTime, setShowManualTime] = useState(false);
  const [selectedIssue, setSelectedIssue] = useState<string | null>(null);
  const [newIssueTitle, setNewIssueTitle] = useState("");
  const [newIssueType, setNewIssueType] = useState<IssueType>("Tarea");
  const [manualMinutes, setManualMinutes] = useState("30");

  useEffect(() => {
    if (!activeTimerId) return;
    const interval = window.setInterval(() => {
      setIssues((current) => current.map((issue) => issue.id === activeTimerId ? { ...issue, seconds: issue.seconds + 1 } : issue));
    }, 1000);
    return () => window.clearInterval(interval);
  }, [activeTimerId]);

  const visibleIssues = useMemo(() => issues.filter((issue) => {
    const text = `${issue.code} ${issue.title} ${issue.assignee} ${issue.labels.join(" ")}`.toLowerCase();
    return text.includes(query.toLowerCase());
  }), [issues, query]);

  const trackedSeconds = issues.reduce((total, issue) => total + issue.seconds, 0);
  const pendingCount = issues.filter((issue) => issue.status !== "Hecha").length;
  const myCount = issues.filter((issue) => issue.assignee === "Leo Martín" && issue.status !== "Hecha").length;

  function submitNewIssue(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!newIssueTitle.trim()) return;
    const nextNumber = issues.length + 24;
    setIssues((current) => [{
      id: `local-${Date.now()}`,
      code: `WEB-${nextNumber}`,
      title: newIssueTitle.trim(),
      type: newIssueType,
      status: "Pendiente",
      labels: ["Nuevo"],
      assignee: "Sin asignar",
      initials: "—",
      avatar: "",
      seconds: 0,
    }, ...current]);
    setNewIssueTitle("");
    setShowNewIssue(false);
  }

  function submitManualTime(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const minutes = Number(manualMinutes);
    if (!selectedIssue || !Number.isFinite(minutes) || minutes <= 0) return;
    setIssues((current) => current.map((issue) => issue.id === selectedIssue ? { ...issue, seconds: issue.seconds + minutes * 60 } : issue));
    setShowManualTime(false);
    setSelectedIssue(null);
  }

  function toggleTimer(issueId: string) {
    setActiveTimerId((current) => current === issueId ? null : issueId);
  }

  function moveIssue(issueId: string, status: Status) {
    setIssues((current) => current.map((issue) => issue.id === issueId ? { ...issue, status } : issue));
    setDraggedIssueId(null);
  }

  return (
    <div className="app-shell">
      <aside className="sidebar">
        <div className="brand-row">
          <div className="brand-mark">n</div>
          <div className="brand-copy"><div className="brand-name">nexo<span style={{ color: "#8aa0ff" }}>.</span></div><span className="brand-caption">gestión de trabajo</span></div>
        </div>

        <button className="workspace-switcher" type="button">
          <span className="workspace-icon">C</span>
          <span className="workspace-copy"><strong>Cooperativa</strong><span>Espacio de trabajo</span></span>
          <Icon name="chevron" size={14} />
        </button>

        <div className="nav-label">Espacio de trabajo</div>
        <nav className="nav-list" aria-label="Navegación principal">
          {navItems.map((item) => (
            <button key={item.label} type="button" className={`nav-item ${activeNav === item.label ? "active" : ""}`} onClick={() => setActiveNav(item.label)}>
              <Icon name={item.icon} size={16} /><span>{item.label}</span>{item.badge && <span className="nav-trailing">{item.badge}</span>}
            </button>
          ))}
        </nav>
        <div className="nav-spacer" />
        <div className="nav-label">Proyectos recientes</div>
        <div className="project-shortcut"><span className="project-dot" />Plataforma web</div>
        <div className="project-shortcut"><span className="project-dot green" />Portal de clientes</div>
        <div className="project-shortcut"><span className="project-dot orange" />Operaciones</div>
        <div className="sidebar-bottom">
          <button className="nav-item" type="button" onClick={() => setActiveNav("Configuración")}><Icon name="settings" size={16} /><span>Configuración</span></button>
          <div className="sidebar-user">
            <span className="avatar orange">JD</span>
            <span className="sidebar-user-copy"><strong>Juan D.</strong><span>Administrador</span></span>
            <Icon name="more" size={16} />
          </div>
        </div>
      </aside>

      <div className="main-area">
        <header className="topbar">
          <div className="breadcrumbs"><span>Cooperativa</span><span>›</span><strong>{activeNav}</strong></div>
          <div className="topbar-actions">
            <label className="search-box"><Icon name="search" size={15} /><input aria-label="Buscar" value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Buscar tareas…" /></label>
            <button className="icon-button" type="button" aria-label="Notificaciones"><Icon name="bell" size={17} /></button>
            <span className="user-avatar" aria-label="Perfil de Juan" />
          </div>
        </header>

        <main className="page-content">
          {activeNav === "Inicio" || activeNav === "Proyectos" ? (
          <>
          <div className="page-kicker">RESUMEN DEL EQUIPO</div>
          <div className="project-heading">
            <div className="project-title-row">
              <div className="project-logo">P</div>
              <div><h1>{activeNav === "Inicio" ? "Buenos días, Juan" : "Plataforma web"}</h1><p className="project-subtitle">{activeNav === "Inicio" ? "Aquí tienes el estado de tus proyectos y el trabajo del equipo." : "Tablero Kanban · actualiza el estado del trabajo del equipo."}</p></div>
            </div>
            <div className="project-actions">
              <button className="button" type="button"><Icon name="calendar" size={14} />Esta semana</button>
              <button className="button primary" type="button" onClick={() => setShowNewIssue(true)}><Icon name="plus" size={15} />Nuevo issue</button>
            </div>
          </div>

          <div className="project-meta">
            <span className="status-pill">3 proyectos activos</span>
            <span className="meta-item"><Icon name="team" size={14} /> 8 personas en el equipo</span>
            <span className="meta-item"><Icon name="activity" size={14} /> Actividad actualizada</span>
          </div>

          <section className="stats-grid" aria-label="Resumen">
            <article className="stat-card"><div className="stat-heading"><span>Issues abiertos</span><span className="stat-icon"><Icon name="tasks" size={15} /></span></div><div className="stat-value">{pendingCount}</div><div className="stat-note"><span className="positive">+3</span> esta semana</div></article>
            <article className="stat-card"><div className="stat-heading"><span>En curso</span><span className="stat-icon"><Icon name="board" size={15} /></span></div><div className="stat-value">{issues.filter((issue) => issue.status === "En curso").length}<span style={{ color: "#8a94a2", fontSize: 13, fontWeight: 500 }}> / 4 WIP</span></div><div className="stat-note">Límite del tablero</div></article>
            <article className="stat-card"><div className="stat-heading"><span>Completados</span><span className="stat-icon"><Icon name="arrow" size={15} /></span></div><div className="stat-value">{issues.filter((issue) => issue.status === "Hecha").length}</div><div className="stat-note"><span className="positive">+2</span> desde la semana pasada</div></article>
            <article className="stat-card"><div className="stat-heading"><span>Tiempo registrado</span><span className="stat-icon"><Icon name="clock" size={15} /></span></div><div className="stat-value">{formatTime(trackedSeconds)}</div><div className="stat-note">En todos los proyectos</div></article>
          </section>

          <div className="board-toolbar">
            <div className="view-tabs"><span className="view-tab active"><Icon name="board" size={14} /> Tablero Kanban</span></div>
            <div className="toolbar-actions">
              <button className="button filter-button" type="button"><Icon name="filter" size={13} />Filtros</button>
              <div className="avatar-stack" aria-label="Miembros del equipo"><span className="avatar purple">ML</span><span className="avatar blue">DR</span><span className="avatar mint">LP</span><span className="avatar orange">LM</span><span className="avatar-more">+4</span></div>
            </div>
          </div>

          <section className="board" aria-label="Tablero Kanban de Plataforma web">
            {columns.map((column) => {
              const columnIssues = visibleIssues.filter((issue) => issue.status === column.name);
              const nearLimit = column.limit !== undefined && columnIssues.length >= column.limit - 1;
              return (
                <div className="board-column" key={column.name} onDragOver={(event) => event.preventDefault()} onDrop={(event) => { event.preventDefault(); const issueId = event.dataTransfer.getData("text/plain") || draggedIssueId; if (issueId) moveIssue(issueId, column.name); }}>
                  <div className="column-heading">
                    <div className="column-title-wrap"><span className={`column-marker ${column.tone}`} /><h2>{column.name}</h2><span className="column-count">{columnIssues.length}</span></div>
                    {column.limit !== undefined && <span className={`wip-label ${nearLimit ? "near-limit" : ""}`}>WIP {columnIssues.length}/{column.limit}</span>}
                  </div>
                  <div className="issue-list">
                    {columnIssues.map((issue) => (
                      <article className="issue-card" key={issue.id} draggable onDragStart={(event) => { setDraggedIssueId(issue.id); event.dataTransfer.setData("text/plain", issue.id); event.dataTransfer.effectAllowed = "move"; }} onDragEnd={() => setDraggedIssueId(null)}>
                        <div className="issue-meta"><span className={`issue-type ${issue.type === "Historia" ? "story" : issue.type === "Bug" ? "bug" : "task"}`}>{issue.type === "Historia" ? "◇" : issue.type === "Bug" ? "⚑" : "▤"} {issue.type}</span><span><span className="issue-code">{issue.code}</span> <button className="more-button" type="button" aria-label={`Más opciones para ${issue.code}`}><Icon name="more" size={14} /></button></span></div>
                        <p className="issue-title">{issue.title}</p>
                        <div className="issue-tags">{issue.labels.map((label, index) => <span className={`tag ${index === 0 && issue.type === "Historia" ? "violet" : index === 0 && issue.type === "Bug" ? "cyan" : ""}`} key={label}>{label}</span>)}</div>
                        <div className="issue-footer">
                          <div className="issue-assignee"><span className={`avatar ${issue.avatar}`}>{issue.initials}</span><span>{issue.assignee.split(" ")[0]}</span></div>
                          <div className="time-controls">
                          <button className={`issue-time ${activeTimerId === issue.id ? "running" : ""}`} type="button" onClick={() => toggleTimer(issue.id)} title={activeTimerId === issue.id ? "Detener cronómetro" : "Iniciar cronómetro"}>
                            {activeTimerId === issue.id ? <span className="running-dot" /> : <Icon name="clock" size={12} />}{formatTime(issue.seconds)}
                          </button>
                          <button className="time-add-button" type="button" aria-label={`Añadir tiempo a ${issue.code}`} title="Registrar tiempo manual" onClick={() => { setSelectedIssue(issue.id); setShowManualTime(true); }}>+</button>
                          </div>
                        </div>
                      </article>
                    ))}
                  </div>
                  {column.name === "Pendiente" && <button className="add-card" type="button" onClick={() => setShowNewIssue(true)}><Icon name="plus" size={13} />Añadir issue</button>}
                </div>
              );
            })}
          </section>

          <div className="activity-strip"><span className="activity-indicator">Vista de demostración</span><span>Los cambios y el tiempo se guardan en esta sesión. La sincronización del equipo se conectará con Supabase.</span></div>
          </>
          ) : (
            <section className="section-placeholder">
              <span className="stat-icon"><Icon name={navItems.find((item) => item.label === activeNav)?.icon ?? "settings"} size={18} /></span>
              <h1>{activeNav}</h1>
              <p>Esta sección está incluida en la estructura de la app. La construiremos después del tablero Kanban.</p>
              <button className="button" type="button" onClick={() => setActiveNav("Inicio")}>Volver al inicio</button>
            </section>
          )}
        </main>
      </div>

      {showNewIssue && <div className="modal-backdrop" role="presentation" onMouseDown={(event) => { if (event.target === event.currentTarget) setShowNewIssue(false); }}>
        <form className="modal" onSubmit={submitNewIssue}>
          <div className="modal-heading"><h2>Crear issue</h2><button className="modal-close" type="button" aria-label="Cerrar" onClick={() => setShowNewIssue(false)}><Icon name="close" size={18} /></button></div>
          <div className="form-field"><label htmlFor="issue-title">Título</label><input id="issue-title" autoFocus required value={newIssueTitle} onChange={(event) => setNewIssueTitle(event.target.value)} placeholder="¿Qué trabajo hay que hacer?" /></div>
          <div className="form-field"><label htmlFor="issue-type">Tipo</label><select id="issue-type" value={newIssueType} onChange={(event) => setNewIssueType(event.target.value as IssueType)}><option>Historia</option><option>Tarea</option><option>Bug</option></select></div>
          <div className="modal-actions"><button className="button" type="button" onClick={() => setShowNewIssue(false)}>Cancelar</button><button className="button primary" type="submit"><Icon name="plus" size={14} />Crear issue</button></div>
        </form>
      </div>}

      {showManualTime && <div className="modal-backdrop" role="presentation" onMouseDown={(event) => { if (event.target === event.currentTarget) setShowManualTime(false); }}>
        <form className="modal" onSubmit={submitManualTime}>
          <div className="modal-heading"><h2>Registrar tiempo</h2><button className="modal-close" type="button" aria-label="Cerrar" onClick={() => setShowManualTime(false)}><Icon name="close" size={18} /></button></div>
          <div className="form-field"><label htmlFor="manual-minutes">Tiempo dedicado (minutos)</label><input id="manual-minutes" type="number" min="1" required value={manualMinutes} onChange={(event) => setManualMinutes(event.target.value)} /></div>
          <div className="modal-actions"><button className="button" type="button" onClick={() => setShowManualTime(false)}>Cancelar</button><button className="button primary" type="submit">Guardar tiempo</button></div>
        </form>
      </div>}
    </div>
  );
}
