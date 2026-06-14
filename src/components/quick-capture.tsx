import { createContext, useContext, useState, useEffect, type ReactNode } from "react";
import { X } from "lucide-react";
import { toast } from "sonner";
import { useStore } from "@/lib/store";
import type { Priority } from "@/lib/mock-data";

type Ctx = { open: () => void; close: () => void };
const QuickCaptureCtx = createContext<Ctx>({ open: () => {}, close: () => {} });

export const useQuickCapture = () => useContext(QuickCaptureCtx);

export function QuickCaptureProvider({ children }: { children: ReactNode }) {
  const [isOpen, setOpen] = useState(false);
  const [text, setText] = useState("");
  const { projects, addTask } = useStore();
  const activeProjects = projects.filter((p) => p.status === "activo");
  
  const [projectId, setProjectId] = useState<string>("inbox");
  const [priority, setPriority] = useState<Priority>("hoy");

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        setOpen((o) => !o);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  useEffect(() => {
    if (isOpen && activeProjects.length > 0 && projectId === "inbox") {
      setProjectId(activeProjects[0].id);
    }
  }, [isOpen, activeProjects]);

  const close = () => {
    setOpen(false);
    setText("");
    setProjectId("inbox");
  };

  const save = () => {
    if (!text.trim()) return;
    
    if (projectId === "inbox") {
      addTask(null, text, priority);
      toast.success("Tarea enviada a Inbox");
    } else {
      addTask(projectId, text, priority);
      const proj = projects.find((p) => p.id === projectId);
      toast.success(`Tarea guardada en ${proj?.name ?? "proyecto"}`);
    }
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
                  <option value="inbox">Inbox (Sin proyecto)</option>
                  {activeProjects.map((p) => (
                    <option key={p.id} value={p.id}>{p.name}</option>
                  ))}
                </select>
              </div>
              <div>
                <div className="text-xs text-[#6B7280] mb-1.5">Prioridad:</div>
                <div className="flex gap-2">
                  {(["hoy", "esta semana", "algún día"] as const).map((p) => (
                    <button
                      key={p}
                      onClick={() => setPriority(p)}
                      className={`px-3 py-1.5 text-xs rounded-md border transition capitalize ${
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
