import { createFileRoute, Link } from "@tanstack/react-router";
import { Inbox, FolderKanban, CheckCircle2, Target, ArrowRight } from "lucide-react";
import { useStore } from "@/lib/store";
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
  const { user, projects, inboxTasks, toggleTaskCompletion, toggleInboxTaskCompletion, goals } = useStore();
  const activeProjects = projects.filter((p) => p.status === "activo");

  const todayTasks = projects
    .map((p) => ({ project: p, tasks: p.tasks.filter((t) => t.priority === "hoy" && !t.completed) }))
    .filter((g) => g.tasks.length > 0);
    
  const todayInboxTasks = inboxTasks.filter(t => t.priority === "hoy" && !t.completed);
    
  const totalTodayTasks = todayTasks.reduce((a, g) => a + g.tasks.length, 0) + todayInboxTasks.length;
  const totalGoals = goals.length;
  const todayStr = new Date().toISOString().split('T')[0];
  
  // Format date dynamically
  const dateOptions: Intl.DateTimeFormatOptions = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
  const todayDateStr = new Intl.DateTimeFormat('es-AR', dateOptions).format(new Date());

  return (
    <div className="max-w-6xl mx-auto px-6 py-10 animate-in fade-in slide-in-from-bottom-4 duration-500">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-10">
        <div>
          <div className="text-sm font-medium text-[#6366F1] mb-1 capitalize">
            {todayDateStr}
          </div>
          <h1 className="text-3xl md:text-4xl font-bold tracking-tight text-[#111827] dark:text-[#F9FAFB]">
            Buenos días, <span className="bg-clip-text text-transparent bg-gradient-to-r from-[#6366F1] to-[#EC4899]">{user?.name?.split(" ")[0] || "creador"}</span> ☀️
          </h1>
        </div>
        <div className="flex gap-3">
          <Link
            to="/inbox"
            className="group relative overflow-hidden bg-white dark:bg-[#09090B] border border-[#E5E7EB] dark:border-[#27272A] hover:border-[#6366F1] shadow-sm rounded-xl px-4 py-2.5 transition-all hover:shadow-md flex items-center gap-3"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-[#6366F1]/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
            <div className="relative z-10 flex items-center justify-center w-8 h-8 rounded-lg bg-[#6366F1]/10 text-[#6366F1]">
              <Inbox className="w-4 h-4" />
            </div>
            <div className="relative z-10 flex flex-col">
              <span className="text-xs font-medium text-[#6B7280] dark:text-[#A1A1AA] uppercase tracking-wide">Inbox</span>
              <span className="text-sm font-bold text-[#111827] dark:text-[#F9FAFB]">{inboxTasks.length} pendientes</span>
            </div>
          </Link>
        </div>
      </div>

      {/* Metrics Widgets */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-10">
        <div className="bg-white dark:bg-[#09090B] rounded-2xl p-5 border border-[#E5E7EB] dark:border-[#27272A] shadow-sm hover:shadow-md transition-shadow">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 rounded-xl bg-[#10B981]/10 flex items-center justify-center text-[#10B981]">
              <CheckCircle2 className="w-5 h-5" />
            </div>
            <h3 className="text-sm font-medium text-[#6B7280] dark:text-[#A1A1AA]">Tareas para Hoy</h3>
          </div>
          <p className="text-3xl font-bold text-[#111827] dark:text-[#F9FAFB]">{totalTodayTasks}</p>
        </div>

        <div className="bg-white dark:bg-[#09090B] rounded-2xl p-5 border border-[#E5E7EB] dark:border-[#27272A] shadow-sm hover:shadow-md transition-shadow">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 rounded-xl bg-[#F59E0B]/10 flex items-center justify-center text-[#F59E0B]">
              <FolderKanban className="w-5 h-5" />
            </div>
            <h3 className="text-sm font-medium text-[#6B7280] dark:text-[#A1A1AA]">Proyectos Activos</h3>
          </div>
          <p className="text-3xl font-bold text-[#111827] dark:text-[#F9FAFB]">{activeProjects.length}</p>
        </div>

        <div className="bg-white dark:bg-[#09090B] rounded-2xl p-5 border border-[#E5E7EB] dark:border-[#27272A] shadow-sm hover:shadow-md transition-shadow">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 rounded-xl bg-[#6366F1]/10 flex items-center justify-center text-[#6366F1]">
              <Target className="w-5 h-5" />
            </div>
            <h3 className="text-sm font-medium text-[#6B7280] dark:text-[#A1A1AA]">Metas en Curso</h3>
          </div>
          <p className="text-3xl font-bold text-[#111827] dark:text-[#F9FAFB]">{totalGoals}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column: Projects */}
        <div className="lg:col-span-2 space-y-8">
          <section>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-[#111827] dark:text-[#F9FAFB]">Proyectos Destacados</h2>
              <Link to="/projects" className="text-sm font-medium text-[#6366F1] hover:underline flex items-center gap-1">
                Ver todos <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {activeProjects.slice(0, 4).map((p) => (
                <Link
                  key={p.id}
                  to="/projects/$projectId"
                  params={{ projectId: p.id }}
                  className="group block bg-white dark:bg-[#09090B] border border-[#E5E7EB] dark:border-[#27272A] rounded-2xl p-5 hover:-translate-y-1 hover:border-[#6366F1]/30 hover:shadow-lg transition-all duration-300"
                >
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-2.5">
                      <div className="w-10 h-10 rounded-xl grid place-items-center bg-gray-50 dark:bg-[#18181B] group-hover:scale-110 transition-transform">
                        <span className="w-3 h-3 rounded-full shadow-sm" style={{ backgroundColor: p.color }} />
                      </div>
                      <div>
                        <h3 className="font-semibold text-[#111827] dark:text-[#F9FAFB] group-hover:text-[#6366F1] transition-colors">{p.name}</h3>
                        <span className="text-[11px] uppercase tracking-wide font-medium text-[#6B7280] dark:text-[#A1A1AA]">
                          {p.area}
                        </span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="space-y-2 mb-4">
                    {p.tasks.filter((t) => !t.completed).slice(0, 2).map((t) => (
                      <div key={t.id} className="flex items-start gap-2.5 text-sm text-[#4B5563] dark:text-[#D1D5DB]">
                        <span className="w-3.5 h-3.5 rounded border border-[#D1D5DB] dark:border-[#3F3F46] shrink-0 mt-0.5" />
                        <span className="line-clamp-1">{t.text}</span>
                      </div>
                    ))}
                    {p.tasks.filter((t) => !t.completed).length === 0 && (
                      <div className="text-sm text-[#9CA3AF] italic bg-gray-50 dark:bg-[#18181B] rounded-lg p-2 text-center border border-dashed border-gray-200 dark:border-[#3F3F46]">
                        ¡Al día! Sin tareas pendientes.
                      </div>
                    )}
                  </div>
                  <div className="pt-3 border-t border-gray-100 dark:border-[#27272A] flex items-center justify-between">
                    <span className="text-xs text-[#9CA3AF]">Modificado {p.lastActivity}</span>
                    <span className="w-6 h-6 rounded-full bg-gray-50 dark:bg-[#18181B] flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                      <ArrowRight className="w-3 h-3 text-[#6366F1]" />
                    </span>
                  </div>
                </Link>
              ))}
            </div>
          </section>
        </div>

        {/* Right Column: Focus Today */}
        <div className="space-y-8">
          <section className="bg-gradient-to-b from-[#F8FAFC] to-white dark:from-[#09090B] dark:to-[#09090B] border border-[#E5E7EB] dark:border-[#27272A] rounded-2xl p-5 shadow-sm">
            <div className="flex items-center gap-2 mb-5">
              <div className="w-2 h-6 rounded-full bg-[#6366F1]" />
              <h2 className="text-lg font-semibold text-[#111827] dark:text-[#F9FAFB]">Foco de Hoy</h2>
            </div>
            
            {todayTasks.length === 0 && todayInboxTasks.length === 0 ? (
              <div className="text-center py-10 px-4">
                <div className="w-12 h-12 bg-[#10B981]/10 text-[#10B981] rounded-full flex items-center justify-center mx-auto mb-3">
                  <CheckCircle2 className="w-6 h-6" />
                </div>
                <p className="text-sm text-[#374151] dark:text-[#E5E7EB] font-medium">¡Día libre de urgencias!</p>
                <p className="text-xs text-[#6B7280] dark:text-[#A1A1AA] mt-1">No hay tareas programadas para hoy.</p>
              </div>
            ) : (
              <div className="space-y-6">
                {/* Project Tasks */}
                {todayTasks.map(({ project, tasks }) => (
                  <div key={project.id}>
                    <div className="flex items-center gap-2 mb-2">
                      <span className="w-2 h-2 rounded-full" style={{ backgroundColor: project.color }} />
                      <Link
                        to="/projects/$projectId"
                        params={{ projectId: project.id }}
                        className="text-sm font-semibold text-[#111827] dark:text-[#F9FAFB] hover:text-[#6366F1] transition-colors"
                      >
                        {project.name}
                      </Link>
                    </div>
                    <div className="pl-4 border-l-2 border-gray-100 dark:border-[#27272A] ml-1 space-y-1">
                      {tasks.map((t) => (
                        <TaskRow 
                          key={t.id} 
                          text={t.plannedDate && t.plannedDate < todayStr ? `⚠️ [Atrasada] ${t.text}` : t.text} 
                          initialDone={t.completed} 
                          onToggle={() => toggleTaskCompletion(project.id, t.id)} 
                        />
                      ))}
                    </div>
                  </div>
                ))}

                {/* Inbox Tasks */}
                {todayInboxTasks.length > 0 && (
                  <div>
                    <div className="flex items-center gap-2 mb-2">
                      <Inbox className="w-3.5 h-3.5 text-[#6B7280] dark:text-[#A1A1AA]" />
                      <span className="text-sm font-semibold text-[#111827] dark:text-[#F9FAFB]">Inbox</span>
                    </div>
                    <div className="pl-4 border-l-2 border-gray-100 dark:border-[#27272A] ml-1 space-y-1">
                      {todayInboxTasks.map((t) => (
                        <TaskRow 
                          key={t.id} 
                          text={t.plannedDate && t.plannedDate < todayStr ? `⚠️ [Atrasada] ${t.text}` : t.text} 
                          initialDone={t.completed || false} 
                          onToggle={() => toggleInboxTaskCompletion(t.id)} 
                        />
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}
          </section>
        </div>
      </div>
    </div>
  );
}
