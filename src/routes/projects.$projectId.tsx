import { createFileRoute, notFound } from "@tanstack/react-router";
import { useState } from "react";
import { Sparkles, RefreshCw, Plus, Trash2, MessageCircle, Settings2 } from "lucide-react";
import { toast } from "sonner";
import { useStore } from "@/lib/store";
import type { Priority, Note, Contact, Area, Status } from "@/lib/mock-data";
import { TaskRow } from "@/components/task-row";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";

export const Route = createFileRoute("/projects/$projectId")({
  loader: ({ params }) => {
    // We just return the projectId, the actual data comes from the store inside the component
    return { projectId: params.projectId };
  },
  head: () => ({
    meta: [{ title: `Proyecto — FlowOS` }],
  }),
  component: ProjectView,
});

const groupLabels: Record<Priority, string> = {
  hoy: "HOY",
  "mañana": "MAÑANA",
  "esta_semana": "ESTA SEMANA",
  "esta semana": "ESTA SEMANA",
  "algún día": "ALGÚN DÍA",
};

function ProjectView() {
  const { projectId } = Route.useLoaderData();
  const { projects, addTask, addNote, toggleTaskCompletion, updateProject } = useStore();
  const project = projects.find(p => p.id === projectId);
  
  const [tab, setTab] = useState<"pendientes" | "completadas">("pendientes");
  const [regenerating, setRegenerating] = useState(false);
  const [adding, setAdding] = useState(false);
  const [newTask, setNewTask] = useState("");
  const [addingNote, setAddingNote] = useState(false);
  const [newNote, setNewNote] = useState("");
  const [editingProject, setEditingProject] = useState(false);
  const [editForm, setEditForm] = useState({ name: "", area: "trabajo" as Area, color: "", status: "activo" as Status });

  if (!project) return <div className="p-8 text-center text-gray-500">Proyecto no encontrado.</div>;

  const pending = project.tasks.filter((t) => !t.completed);
  const completed = project.tasks.filter((t) => t.completed);

  const regenerate = () => {
    setRegenerating(true);
    setTimeout(() => setRegenerating(false), 1500);
  };

  const handleAddTask = () => {
    if (newTask.trim()) {
      addTask(project.id, newTask.trim());
      toast.success("Tarea guardada");
    }
    setNewTask("");
    setAdding(false);
  };

  const saveNote = () => {
    if (newNote.trim()) {
      addNote(project.id, newNote.trim());
      toast.success("Nota guardada");
    }
    setNewNote("");
    setAddingNote(false);
  };

  const handleEditOpen = () => {
    setEditForm({ name: project.name, area: project.area, color: project.color, status: project.status });
    setEditingProject(true);
  };

  const handleEditSave = () => {
    if (!editForm.name.trim()) {
      toast.error("El nombre no puede estar vacío");
      return;
    }
    updateProject(project.id, {
      name: editForm.name.trim(),
      area: editForm.area,
      color: editForm.color,
      status: editForm.status
    });
    setEditingProject(false);
    toast.success("Proyecto actualizado");
  };

  const groups: Priority[] = ["hoy", "esta semana", "algún día"];

  return (
    <div className="max-w-6xl mx-auto px-6 py-8">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-3 mb-6">
        <div className="flex items-center gap-3 min-w-0">
          <span className="w-3 h-3 rounded-full shrink-0" style={{ backgroundColor: project.color }} />
          <h1 className="text-2xl font-semibold truncate">{project.name}</h1>
          <span className="text-[10px] uppercase tracking-wide px-2 py-0.5 rounded bg-[#F3F4F6] text-[#6B7280]">
            {project.area}
          </span>
          <span
            className={`text-[10px] uppercase tracking-wide px-2 py-0.5 rounded ${
              project.status === "activo"
                ? "bg-[#D1FAE5] text-[#065F46]"
                : "bg-[#F3F4F6] text-[#6B7280]"
            }`}
          >
            {project.status}
          </span>
        </div>
        <div className="flex items-center gap-3">
          <span className="text-xs text-[#9CA3AF]">Última actividad: {project.lastActivity}</span>
          <Dialog open={editingProject} onOpenChange={setEditingProject}>
            <DialogTrigger asChild>
              <button onClick={handleEditOpen} className="px-2.5 py-1 text-xs border border-[#E5E7EB] dark:border-[#27272A] rounded-md hover:bg-[#F3F4F6] dark:hover:bg-[#27272A] flex items-center gap-1 transition-colors">
                <Settings2 className="w-3.5 h-3.5" /> Editar
              </button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
              <DialogHeader>
                <DialogTitle>Editar Proyecto</DialogTitle>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid gap-2">
                  <label className="text-sm font-medium">Nombre</label>
                  <input
                    value={editForm.name}
                    onChange={e => setEditForm({ ...editForm, name: e.target.value })}
                    className="w-full px-3 py-2 text-sm border border-[#E5E7EB] dark:border-[#27272A] bg-transparent rounded-md focus:outline-none focus:ring-1 focus:ring-[#6366F1]"
                  />
                </div>
                <div className="grid gap-2">
                  <label className="text-sm font-medium">Área</label>
                  <select
                    value={editForm.area}
                    onChange={e => setEditForm({ ...editForm, area: e.target.value as Area })}
                    className="w-full px-3 py-2 text-sm border border-[#E5E7EB] dark:border-[#27272A] bg-background rounded-md focus:outline-none focus:ring-1 focus:ring-[#6366F1]"
                  >
                    <option value="trabajo">Trabajo</option>
                    <option value="cliente">Cliente</option>
                    <option value="personal">Personal</option>
                    <option value="comunidad">Comunidad</option>
                  </select>
                </div>
                <div className="grid gap-2">
                  <label className="text-sm font-medium">Estado</label>
                  <select
                    value={editForm.status}
                    onChange={e => setEditForm({ ...editForm, status: e.target.value as Status })}
                    className="w-full px-3 py-2 text-sm border border-[#E5E7EB] dark:border-[#27272A] bg-background rounded-md focus:outline-none focus:ring-1 focus:ring-[#6366F1]"
                  >
                    <option value="activo">Activo</option>
                    <option value="pausado">Pausado</option>
                    <option value="cerrado">Cerrado</option>
                  </select>
                </div>
                <div className="grid gap-2">
                  <label className="text-sm font-medium mb-1">Color representativo</label>
                  <div className="flex gap-2 flex-wrap">
                    {["#6366F1", "#10B981", "#F59E0B", "#EF4444", "#8B5CF6", "#EC4899", "#06B6D4", "#3B82F6", "#14B8A6"].map(c => (
                      <button
                        key={c}
                        onClick={() => setEditForm({ ...editForm, color: c })}
                        className={`w-6 h-6 rounded-full transition-transform ${editForm.color === c ? "ring-2 ring-offset-2 ring-black dark:ring-white scale-110" : "hover:scale-110"}`}
                        style={{ backgroundColor: c }}
                      />
                    ))}
                  </div>
                </div>
              </div>
              <div className="flex justify-end gap-2 mt-2">
                <button onClick={() => setEditingProject(false)} className="px-4 py-2 text-sm font-medium border border-[#E5E7EB] dark:border-[#27272A] rounded-md hover:bg-[#F3F4F6] dark:hover:bg-[#27272A] transition-colors">
                  Cancelar
                </button>
                <button onClick={handleEditSave} className="px-4 py-2 text-sm font-medium bg-[#6366F1] text-white rounded-md hover:bg-[#4F46E5] transition-colors">
                  Guardar
                </button>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
        {/* LEFT */}
        <div className="lg:col-span-3 space-y-6">
          {/* AI Summary */}
          <div className="bg-white border border-[#E5E7EB] rounded-lg border-l-4 border-l-[#6366F1] p-5">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2 text-sm font-medium text-[#111827]">
                <Sparkles className="w-4 h-4 text-[#6366F1]" />
                Resumen de estado
              </div>
              <button
                onClick={regenerate}
                className="flex items-center gap-1 text-xs text-[#6366F1] hover:underline"
              >
                <RefreshCw className={`w-3 h-3 ${regenerating ? "animate-spin" : ""}`} />
                Regenerar
              </button>
            </div>
            {regenerating ? (
              <div className="space-y-2 animate-pulse">
                <div className="h-3 bg-[#F3F4F6] rounded w-full" />
                <div className="h-3 bg-[#F3F4F6] rounded w-[95%]" />
                <div className="h-3 bg-[#F3F4F6] rounded w-[88%]" />
                <div className="h-3 bg-[#F3F4F6] rounded w-[70%]" />
              </div>
            ) : (
              <p className="text-sm text-[#374151] leading-relaxed">{project.summary}</p>
            )}
            <div className="mt-3 text-xs text-[#9CA3AF]">Generado {project.summaryAgo}</div>
          </div>

          {/* Tasks */}
          <div className="bg-white border border-[#E5E7EB] rounded-lg p-5">
            <div className="flex gap-1 border-b border-[#E5E7EB] mb-3 -mx-5 px-5">
              <button
                onClick={() => setTab("pendientes")}
                className={`px-3 py-2 text-sm -mb-px border-b-2 ${
                  tab === "pendientes"
                    ? "border-[#6366F1] text-[#111827]"
                    : "border-transparent text-[#6B7280]"
                }`}
              >
                Pendientes ({pending.length})
              </button>
              <button
                onClick={() => setTab("completadas")}
                className={`px-3 py-2 text-sm -mb-px border-b-2 ${
                  tab === "completadas"
                    ? "border-[#6366F1] text-[#111827]"
                    : "border-transparent text-[#6B7280]"
                }`}
              >
                Completadas ({completed.length})
              </button>
            </div>

            {tab === "pendientes" ? (
              <div className="space-y-5">
                {groups.map((g) => {
                  const ts = pending.filter((t) => t.priority === g);
                  if (ts.length === 0) return null;
                  return (
                    <div key={g}>
                      <div className="text-[10px] uppercase tracking-wider text-[#9CA3AF] mb-1">
                        {groupLabels[g]}
                      </div>
                      {ts.map((t) => <TaskRow key={t.id} text={t.text} initialDone={t.completed} onToggle={() => toggleTaskCompletion(project.id, t.id)} />)}
                    </div>
                  );
                })}
                {pending.length === 0 && (
                  <div className="text-sm text-[#9CA3AF] italic py-4 text-center">
                    Sin tareas pendientes. ¡Buen trabajo!
                  </div>
                )}

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
                    placeholder="Nueva tarea..."
                    className="w-full px-3 py-2 text-sm border border-[#6366F1] rounded-md focus:outline-none"
                  />
                ) : (
                  <button
                    onClick={() => setAdding(true)}
                    className="flex items-center gap-1.5 text-sm text-[#6B7280] hover:text-[#6366F1]"
                  >
                    <Plus className="w-3.5 h-3.5" /> Agregar tarea
                  </button>
                )}
              </div>
            ) : (
              <div className="space-y-2">
                {completed.length === 0 && (
                  <div className="text-sm text-[#9CA3AF] italic py-4 text-center">
                    Aún no completaste tareas en este proyecto.
                  </div>
                )}
                {completed.map((t) => (
                  <div key={t.id} className="flex items-center justify-between py-1">
                    <div className="flex items-center gap-3">
                      <div className="w-4 h-4 rounded bg-[#10B981] grid place-items-center">
                        <svg viewBox="0 0 16 16" className="w-3 h-3 text-white" fill="none" stroke="currentColor" strokeWidth="2.5">
                          <path d="M3 8l3 3 7-7" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                      </div>
                      <span className="text-sm line-through text-[#9CA3AF]">{t.text}</span>
                    </div>
                    <span className="text-xs text-[#9CA3AF]">{t.completedAgo}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* RIGHT */}
        <div className="lg:col-span-2 space-y-6">
          {/* Notes */}
          <div className="bg-white border border-[#E5E7EB] rounded-lg p-5">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-sm font-medium">Notas del proyecto</h3>
              <button
                onClick={() => setAddingNote(true)}
                className="flex items-center gap-1 text-xs text-[#6366F1] hover:underline"
              >
                <Plus className="w-3 h-3" /> Agregar nota
              </button>
            </div>

            {addingNote && (
              <div className="mb-4 border border-[#E5E7EB] rounded-md p-2">
                <textarea
                  autoFocus
                  value={newNote}
                  onChange={(e) => setNewNote(e.target.value)}
                  rows={3}
                  placeholder="Escribí una nota..."
                  className="w-full text-sm focus:outline-none resize-none"
                />
                <div className="flex justify-end gap-2 mt-1">
                  <button
                    onClick={() => { setAddingNote(false); setNewNote(""); }}
                    className="px-2 py-1 text-xs text-[#6B7280]"
                  >
                    Cancelar
                  </button>
                  <button
                    onClick={saveNote}
                    className="px-2 py-1 text-xs bg-[#6366F1] text-white rounded"
                  >
                    Guardar
                  </button>
                </div>
              </div>
            )}

            {project.notes.length === 0 && !addingNote && (
              <div className="text-sm text-[#9CA3AF] italic py-4 text-center">
                Sin notas todavía.
              </div>
            )}

            <div className="space-y-4">
              {project.notes.map((n) => (
                <div key={n.id} className="text-sm">
                  <div className="flex items-center gap-2 text-[10px] uppercase tracking-wider text-[#9CA3AF] mb-1">
                    <span className="h-px flex-1 bg-[#E5E7EB]" />
                    {n.ago}
                    <span className="h-px flex-1 bg-[#E5E7EB]" />
                  </div>
                  <p className="text-[#374151] leading-relaxed">{n.text}</p>
                  <button className="mt-1 text-xs text-[#9CA3AF] hover:text-[#EF4444] flex items-center gap-1 ml-auto">
                    <Trash2 className="w-3 h-3" /> Eliminar
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Contacts */}
          <div className="bg-white border border-[#E5E7EB] rounded-lg p-5">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-sm font-medium">Personas clave</h3>
              <button className="flex items-center gap-1 text-xs text-[#6366F1] hover:underline">
                <Plus className="w-3 h-3" /> Agregar
              </button>
            </div>
            {project.contacts.length === 0 ? (
              <div className="text-sm text-[#9CA3AF] italic py-2 text-center">
                Sin contactos asignados.
              </div>
            ) : (
              <div className="space-y-2">
                {project.contacts.map((c: Contact) => (
                  <div key={c.name} className="flex items-center gap-3 py-1.5">
                    <div className="w-8 h-8 rounded-full bg-[#F3F4F6] grid place-items-center text-xs font-medium text-[#6B7280]">
                      {c.name[0]}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="text-sm font-medium truncate">{c.name}</div>
                      <div className="text-xs text-[#6B7280] truncate">{c.role}</div>
                    </div>
                    <div className="flex items-center gap-1 text-xs text-[#6B7280]">
                      <MessageCircle className="w-3 h-3" />
                      {c.channel}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
