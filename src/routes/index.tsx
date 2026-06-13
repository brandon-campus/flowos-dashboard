import { createFileRoute, Link } from "@tanstack/react-router";
import { Inbox } from "lucide-react";
import { projects, activeProjects } from "@/lib/mock-data";
import { TaskRow } from "@/components/task-row";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Dashboard — FlowOS" },
      { name: "description", content: "Tu briefing diario en FlowOS." },
    ],
  }),
  component: Dashboard,
});

function Dashboard() {
  const todayTasks = projects
    .map((p) => ({ project: p, tasks: p.tasks.filter((t) => t.priority === "hoy" && !t.completed) }))
    .filter((g) => g.tasks.length > 0);

  return (
    <div className="max-w-5xl mx-auto px-6 py-8">
      <div className="flex flex-wrap items-baseline justify-between gap-2 mb-1">
        <h1 className="text-2xl font-semibold text-[#111827]">Buenos días, Brandon ☀️</h1>
        <div className="text-sm text-[#6B7280]">Sábado, 14 de junio</div>
      </div>
      <p className="text-sm text-[#6B7280] mb-8">
        Tenés {todayTasks.reduce((a, g) => a + g.tasks.length, 0)} tareas para hoy en {activeProjects.length} proyectos activos.
      </p>

      <section className="mb-10">
        <h2 className="text-xs uppercase tracking-wider text-[#6B7280] mb-3">Para hoy</h2>
        <div className="space-y-5">
          {todayTasks.map(({ project, tasks }) => (
            <div key={project.id}>
              <div className="flex items-center gap-2 mb-1.5">
                <span className="w-2 h-2 rounded-full" style={{ backgroundColor: project.color }} />
                <Link
                  to="/projects/$projectId"
                  params={{ projectId: project.id }}
                  className="text-sm font-medium text-[#111827] hover:text-[#6366F1]"
                >
                  {project.name}
                </Link>
              </div>
              <div className="pl-4">
                {tasks.map((t) => <TaskRow key={t.id} text={t.text} />)}
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="mb-10">
        <h2 className="text-xs uppercase tracking-wider text-[#6B7280] mb-3">Proyectos activos</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {activeProjects.map((p) => (
            <Link
              key={p.id}
              to="/projects/$projectId"
              params={{ projectId: p.id }}
              className="block bg-white border border-[#E5E7EB] rounded-lg p-4 hover:-translate-y-0.5 hover:border-[#D1D5DB] transition"
            >
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full" style={{ backgroundColor: p.color }} />
                  <span className="font-medium text-[#111827]">{p.name}</span>
                </div>
                <span className="text-[10px] uppercase tracking-wide px-2 py-0.5 rounded bg-[#F3F4F6] text-[#6B7280]">
                  {p.area}
                </span>
              </div>
              <div className="space-y-1 mb-2">
                {p.tasks.filter((t) => !t.completed).slice(0, 2).map((t) => (
                  <div key={t.id} className="flex items-center gap-2 text-sm text-[#374151]">
                    <span className="w-3 h-3 rounded border border-[#D1D5DB] shrink-0" />
                    <span className="truncate">{t.text}</span>
                  </div>
                ))}
                {p.tasks.filter((t) => !t.completed).length === 0 && (
                  <div className="text-xs text-[#9CA3AF] italic">Sin tareas pendientes</div>
                )}
              </div>
              <div className="text-xs text-[#9CA3AF]">Última actividad: {p.lastActivity}</div>
            </Link>
          ))}
        </div>
      </section>

      <Link
        to="/inbox"
        className="flex items-center justify-between bg-white border border-[#E5E7EB] rounded-lg px-4 py-3 hover:border-[#6366F1] transition"
      >
        <div className="flex items-center gap-2.5 text-sm text-[#374151]">
          <Inbox className="w-4 h-4 text-[#6366F1]" />
          Tenés 2 tareas sin clasificar en tu Inbox
        </div>
        <span className="text-sm text-[#6366F1]">Ver inbox →</span>
      </Link>
    </div>
  );
}
