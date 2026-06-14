import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { Plus } from "lucide-react";
import { useStore } from "@/lib/store";

export const Route = createFileRoute("/projects/")({
  head: () => ({ meta: [{ title: "Proyectos — FlowOS" }] }),
  component: ProjectsList,
});

const filters = ["Todos", "Activos", "Pausados", "Cerrados"] as const;

function ProjectsList() {
  const { projects } = useStore();
  const [filter, setFilter] = useState<(typeof filters)[number]>("Todos");

  const list = projects.filter((p) => {
    if (filter === "Todos") return true;
    if (filter === "Activos") return p.status === "activo";
    if (filter === "Pausados") return p.status === "pausado";
    return p.status === "cerrado";
  });

  return (
    <div className="max-w-6xl mx-auto px-6 py-8">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-semibold">Proyectos</h1>
        <Link
          to="/projects/new"
          className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-[#6366F1] text-white text-sm rounded-md hover:bg-[#4F46E5]"
        >
          <Plus className="w-4 h-4" /> Nuevo proyecto
        </Link>
      </div>

      <div className="flex gap-1 border-b border-[#E5E7EB] mb-5">
        {filters.map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`px-3 py-2 text-sm -mb-px border-b-2 transition ${
              filter === f
                ? "border-[#6366F1] text-[#111827]"
                : "border-transparent text-[#6B7280] hover:text-[#111827]"
            }`}
          >
            {f}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
        {list.map((p) => (
          <Link
            key={p.id}
            to="/projects/$projectId"
            params={{ projectId: p.id }}
            className="bg-white border border-[#E5E7EB] rounded-lg p-4 pl-5 relative hover:-translate-y-0.5 hover:border-[#D1D5DB] transition"
          >
            <span
              className="absolute left-0 top-0 bottom-0 w-1 rounded-l-lg"
              style={{ backgroundColor: p.color }}
            />
            <div className="font-medium text-[#111827] mb-2">{p.name}</div>
            <div className="flex gap-1.5 mb-3">
              <span className="text-[10px] uppercase tracking-wide px-2 py-0.5 rounded bg-[#F3F4F6] text-[#6B7280]">
                {p.area}
              </span>
              <span
                className={`text-[10px] uppercase tracking-wide px-2 py-0.5 rounded ${
                  p.status === "activo"
                    ? "bg-[#D1FAE5] text-[#065F46]"
                    : p.status === "pausado"
                    ? "bg-[#F3F4F6] text-[#6B7280]"
                    : "bg-[#FEE2E2] text-[#991B1B]"
                }`}
              >
                {p.status}
              </span>
            </div>
            <div className="text-xs text-[#6B7280]">
              {p.tasks.filter((t) => !t.completed).length} tareas pendientes
            </div>
            <div className="text-xs text-[#9CA3AF] mt-1">Última actividad: {p.lastActivity}</div>
          </Link>
        ))}
      </div>
    </div>
  );
}
