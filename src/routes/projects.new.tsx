import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { toast } from "sonner";
import { useStore } from "@/lib/store";
import type { Area, Status } from "@/lib/mock-data";

export const Route = createFileRoute("/projects/new")({
  head: () => ({ meta: [{ title: "Nuevo proyecto — FlowOS" }] }),
  component: NewProject,
});

const areas = ["Trabajo", "Cliente", "Personal", "Comunidad"] as const;
const colors = ["#6366F1", "#10B981", "#F59E0B", "#8B5CF6", "#EF4444", "#06B6D4", "#EC4899", "#14B8A6"];

function NewProject() {
  const navigate = useNavigate();
  const { addProject } = useStore();
  const [name, setName] = useState("");
  const [area, setArea] = useState<Area>("trabajo");
  const [color, setColor] = useState(colors[0]);
  const [status, setStatus] = useState<Status>("activo");
  const [description, setDescription] = useState("");

  const handleCreate = () => {
    if (!name.trim()) {
      toast.error("El nombre es requerido");
      return;
    }
    
    addProject({
      name: name.trim(),
      area,
      color,
      status,
      lastActivity: "recién",
      summary: description || "Proyecto recién creado. Aún no hay suficiente contexto para un resumen.",
      summaryAgo: "recién",
      tasks: [],
      notes: [],
      contacts: [],
    });

    toast.success("Proyecto creado");
    navigate({ to: "/projects" });
  };

  return (
    <div className="max-w-xl mx-auto px-6 py-10">
      <h1 className="text-2xl font-semibold mb-6">Nuevo proyecto</h1>

      <div className="bg-white border border-[#E5E7EB] rounded-lg p-6 space-y-5">
        <div>
          <label className="block text-xs font-medium text-[#374151] mb-1.5">
            Nombre del proyecto *
          </label>
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full px-3 py-2 text-sm border border-[#E5E7EB] rounded-md focus:outline-none focus:border-[#6366F1]"
            placeholder="Ej. Lanzamiento Cohorte #17"
          />
        </div>

        <div>
          <label className="block text-xs font-medium text-[#374151] mb-1.5">Área</label>
          <div className="inline-flex rounded-md border border-[#E5E7EB] bg-[#F9FAFB] p-0.5">
            {areas.map((a) => (
              <button
                key={a}
                onClick={() => setArea(a.toLowerCase() as Area)}
                className={`px-3 py-1.5 text-xs rounded capitalize ${
                  area === a.toLowerCase() ? "bg-white shadow-sm text-[#111827]" : "text-[#6B7280]"
                }`}
              >
                {a}
              </button>
            ))}
          </div>
        </div>

        <div>
          <label className="block text-xs font-medium text-[#374151] mb-1.5">Color</label>
          <div className="flex gap-2">
            {colors.map((c) => (
              <button
                key={c}
                onClick={() => setColor(c)}
                className={`w-6 h-6 rounded-full transition ${
                  color === c ? "ring-2 ring-offset-2 ring-[#6366F1]" : ""
                }`}
                style={{ backgroundColor: c }}
              />
            ))}
          </div>
        </div>

        <div>
          <label className="block text-xs font-medium text-[#374151] mb-1.5">Estado</label>
          <select 
            value={status}
            onChange={(e) => setStatus(e.target.value as Status)}
            className="w-full px-3 py-2 text-sm border border-[#E5E7EB] rounded-md bg-white capitalize"
          >
            <option value="activo">Activo</option>
            <option value="pausado">Pausado</option>
            <option value="cerrado">Cerrado</option>
          </select>
        </div>

        <div>
          <label className="block text-xs font-medium text-[#374151] mb-1.5">
            Descripción (opcional)
          </label>
          <textarea
            rows={3}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="w-full px-3 py-2 text-sm border border-[#E5E7EB] rounded-md focus:outline-none focus:border-[#6366F1] resize-none"
          />
        </div>

        <div className="flex justify-end gap-2 pt-2">
          <button
            onClick={() => navigate({ to: "/projects" })}
            className="px-3 py-1.5 text-sm rounded-md text-[#111827] hover:bg-[#F3F4F6]"
          >
            Cancelar
          </button>
          <button
            onClick={handleCreate}
            className="px-3 py-1.5 text-sm rounded-md bg-[#6366F1] text-white hover:bg-[#4F46E5]"
          >
            Crear proyecto →
          </button>
        </div>
      </div>
    </div>
  );
}
