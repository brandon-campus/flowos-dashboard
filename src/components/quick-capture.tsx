import { createContext, useContext, useState, type ReactNode } from "react";
import { X } from "lucide-react";
import { toast } from "sonner";
import { activeProjects } from "@/lib/mock-data";

type Ctx = { open: () => void; close: () => void };
const QuickCaptureCtx = createContext<Ctx>({ open: () => {}, close: () => {} });

export const useQuickCapture = () => useContext(QuickCaptureCtx);

export function QuickCaptureProvider({ children }: { children: ReactNode }) {
  const [isOpen, setOpen] = useState(false);
  const [text, setText] = useState("");
  const [projectId, setProjectId] = useState(activeProjects[0].id);
  const [priority, setPriority] = useState<"Hoy" | "Esta semana" | "Algún día">("Hoy");

  const close = () => {
    setOpen(false);
    setText("");
  };

  const save = () => {
    const proj = activeProjects.find((p) => p.id === projectId);
    toast.success(`Tarea guardada en ${proj?.name ?? "proyecto"}`);
    close();
  };

  return (
    <QuickCaptureCtx.Provider value={{ open: () => setOpen(true), close }}>
      {children}
      {isOpen && (
        <div
          className="fixed inset-0 z-50 flex items-start justify-center bg-black/40 pt-32 px-4"
          onClick={close}
        >
          <div
            className="w-full max-w-lg rounded-xl bg-white shadow-2xl border border-[#E5E7EB] overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between px-4 py-3 border-b border-[#E5E7EB]">
              <div className="flex items-center gap-2 text-sm text-[#111827]">
                <kbd className="px-1.5 py-0.5 text-[11px] rounded bg-[#F3F4F6] border border-[#E5E7EB]">⌘K</kbd>
                <span className="font-medium">Captura rápida</span>
              </div>
              <button onClick={close} className="text-[#6B7280] hover:text-[#111827]">
                <X className="w-4 h-4" />
              </button>
            </div>
            <div className="p-4 space-y-4">
              <input
                autoFocus
                value={text}
                onChange={(e) => setText(e.target.value)}
                placeholder="Escribí una tarea o nota..."
                className="w-full px-3 py-2 text-sm border border-[#E5E7EB] rounded-md focus:outline-none focus:border-[#6366F1]"
              />
              <div>
                <div className="text-xs text-[#6B7280] mb-1.5">Asignar a proyecto:</div>
                <select
                  value={projectId}
                  onChange={(e) => setProjectId(e.target.value)}
                  className="w-full px-3 py-2 text-sm border border-[#E5E7EB] rounded-md bg-white"
                >
                  {activeProjects.map((p) => (
                    <option key={p.id} value={p.id}>{p.name}</option>
                  ))}
                </select>
              </div>
              <div>
                <div className="text-xs text-[#6B7280] mb-1.5">Prioridad:</div>
                <div className="flex gap-2">
                  {(["Hoy", "Esta semana", "Algún día"] as const).map((p) => (
                    <button
                      key={p}
                      onClick={() => setPriority(p)}
                      className={`px-3 py-1.5 text-xs rounded-md border transition ${
                        priority === p
                          ? "bg-[#6366F1] text-white border-[#6366F1]"
                          : "bg-white text-[#111827] border-[#E5E7EB] hover:border-[#6366F1]"
                      }`}
                    >
                      {p}
                    </button>
                  ))}
                </div>
              </div>
            </div>
            <div className="flex justify-end gap-2 px-4 py-3 border-t border-[#E5E7EB] bg-[#FAFAFA]">
              <button
                onClick={close}
                className="px-3 py-1.5 text-sm rounded-md text-[#111827] hover:bg-[#F3F4F6]"
              >
                Cancelar
              </button>
              <button
                onClick={save}
                className="px-3 py-1.5 text-sm rounded-md bg-[#6366F1] text-white hover:bg-[#4F46E5]"
              >
                Guardar →
              </button>
            </div>
          </div>
        </div>
      )}
    </QuickCaptureCtx.Provider>
  );
}
