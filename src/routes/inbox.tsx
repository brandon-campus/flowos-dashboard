import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Trash2, Inbox as InboxIcon, Plus } from "lucide-react";
import { toast } from "sonner";
import { useStore } from "@/lib/store";

export const Route = createFileRoute("/inbox")({
  head: () => ({ meta: [{ title: "Inbox — FlowOS" }] }),
  component: Inbox,
});

function Inbox() {
  const { projects, inboxTasks, addTaskToInbox, assignInboxTaskToProject, deleteInboxTask } = useStore();
  const activeProjects = projects.filter((p) => p.status === "activo");
  const [openMenu, setOpenMenu] = useState<string | null>(null);
  const [adding, setAdding] = useState(false);
  const [newTask, setNewTask] = useState("");

  const handleAddTask = () => {
    if (newTask.trim()) {
      addTaskToInbox(newTask.trim());
      toast.success("Tarea agregada al Inbox");
    }
    setNewTask("");
    setAdding(false);
  };

  const assign = (taskId: string, projectId: string, projectName: string) => {
    assignInboxTaskToProject(taskId, projectId);
    setOpenMenu(null);
    toast.success(`Tarea asignada a ${projectName}`);
  };

  return (
    <div className="max-w-4xl mx-auto px-6 py-8">
      <h1 className="text-2xl font-semibold mb-1">Inbox</h1>
      <p className="text-sm text-[#6B7280] mb-6">Tareas sin clasificar</p>

      {adding ? (
        <input
          autoFocus
          value={newTask}
          onChange={(e) => setNewTask(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") handleAddTask();
            if (e.key === "Escape") { setAdding(false); setNewTask(""); }
          }}
          onBlur={handleAddTask}
          placeholder="Escribí una tarea y presioná Enter..."
          className="w-full max-w-sm px-3 py-2 text-sm border border-[#6366F1] rounded-md focus:outline-none mb-4"
        />
      ) : (
        <button 
          onClick={() => setAdding(true)}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 text-sm border border-[#E5E7EB] bg-white rounded-md hover:border-[#6366F1] mb-4 text-[#111827]"
        >
          <Plus className="w-3.5 h-3.5" /> Agregar tarea
        </button>
      )}

      {inboxTasks.length === 0 ? (
        <div className="bg-white border border-[#E5E7EB] rounded-lg py-16 text-center">
          <InboxIcon className="w-10 h-10 mx-auto text-[#D1D5DB] mb-3" />
          <div className="text-base font-medium text-[#111827]">Inbox vacío</div>
          <div className="text-sm text-[#6B7280] mt-1">
            Usá <kbd className="px-1.5 py-0.5 text-[11px] rounded bg-[#F3F4F6] border border-[#E5E7EB]">⌘K</kbd> para capturar tareas rápido.
          </div>
        </div>
      ) : (
        <div className="bg-white border border-[#E5E7EB] rounded-lg divide-y divide-[#E5E7EB]">
          {inboxTasks.map((t) => (
            <div
              key={t.id}
              className="flex items-center gap-3 px-4 py-3 transition animate-in fade-in"
            >
              <input type="checkbox" className="w-4 h-4 accent-[#6366F1]" />
              <span className="flex-1 text-sm">{t.text}</span>
              <div className="relative">
                <button
                  onClick={() => setOpenMenu(openMenu === t.id ? null : t.id)}
                  className="px-2.5 py-1 text-xs border border-[#E5E7EB] rounded-md hover:border-[#6366F1]"
                >
                  Asignar a proyecto ▾
                </button>
                {openMenu === t.id && (
                  <div className="absolute right-0 top-full mt-1 w-56 bg-white border border-[#E5E7EB] rounded-md shadow-lg z-10 py-1">
                    {activeProjects.map((p) => (
                      <button
                        key={p.id}
                        onClick={() => assign(t.id, p.id, p.name)}
                        className="w-full flex items-center gap-2 px-3 py-1.5 text-sm hover:bg-[#F3F4F6] text-left"
                      >
                        <span className="w-2 h-2 rounded-full" style={{ backgroundColor: p.color }} />
                        {p.name}
                      </button>
                    ))}
                  </div>
                )}
              </div>
              <button onClick={() => deleteInboxTask(t.id)} className="text-[#9CA3AF] hover:text-[#EF4444]">
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
