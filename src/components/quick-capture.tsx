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
  const { projects, addTask, addTaskToInbox } = useStore();
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
      addTaskToInbox(text, priority);
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
          className="fixed inset-0 z-50 flex items-end md:items-start justify-center bg-black/40 md:pt-32 md:px-4 animate-in fade-in duration-200"
          onClick={close}
        >
          <div
            className="w-full md:max-w-lg rounded-t-2xl md:rounded-xl bg-white dark:bg-[#09090B] shadow-2xl border-t md:border border-[#E5E7EB] dark:border-[#27272A] overflow-hidden animate-in slide-in-from-bottom-full md:slide-in-from-top-4 md:fade-in duration-300 flex flex-col max-h-[90vh]"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between px-4 py-3 border-b border-[#E5E7EB] dark:border-[#27272A] shrink-0">
              <div className="flex items-center gap-2 text-sm text-[#111827] dark:text-[#F9FAFB]">
                <kbd className="px-1.5 py-0.5 text-[11px] rounded bg-[#F3F4F6] dark:bg-[#18181B] border border-[#E5E7EB] dark:border-[#27272A] text-[#6B7280] dark:text-[#A1A1AA]">⌘K</kbd>
                <span className="font-medium">Captura rápida</span>
              </div>
              <button onClick={close} className="text-[#6B7280] dark:text-[#A1A1AA] hover:text-[#111827] dark:hover:text-white p-2 -mr-2">
                <X className="w-5 h-5 md:w-4 md:h-4" />
              </button>
            </div>
            <div className="p-4 space-y-4 overflow-y-auto">
              <input
                autoFocus
                value={text}
                onChange={(e) => setText(e.target.value)}
                placeholder="Escribí una tarea o nota..."
                className="w-full px-3 py-2 text-base md:text-sm bg-transparent text-[#111827] dark:text-[#F9FAFB] border border-[#E5E7EB] dark:border-[#27272A] rounded-md focus:outline-none focus:border-[#6366F1] focus:ring-1 focus:ring-[#6366F1] placeholder:text-[#9CA3AF] dark:placeholder:text-[#52525B]"
              />
              <div>
                <div className="text-xs text-[#6B7280] dark:text-[#A1A1AA] mb-1.5">Asignar a proyecto:</div>
                <select
                  value={projectId}
                  onChange={(e) => setProjectId(e.target.value)}
                  className="w-full px-3 py-2 text-base md:text-sm bg-white dark:bg-[#09090B] text-[#111827] dark:text-[#F9FAFB] border border-[#E5E7EB] dark:border-[#27272A] rounded-md focus:outline-none focus:border-[#6366F1]"
                >
                  <option value="inbox">Inbox (Sin proyecto)</option>
                  {activeProjects.map((p) => (
                    <option key={p.id} value={p.id}>{p.name}</option>
                  ))}
                </select>
              </div>
              <div>
                <div className="text-xs text-[#6B7280] dark:text-[#A1A1AA] mb-1.5">Prioridad:</div>
                <div className="flex gap-2 flex-wrap">
                  {(["hoy", "esta semana", "algún día"] as const).map((p) => (
                    <button
                      key={p}
                      onClick={() => setPriority(p)}
                      className={`px-3 py-1.5 text-xs rounded-md border transition capitalize ${
                        priority === p
                          ? "bg-[#6366F1] text-white border-[#6366F1]"
                          : "bg-white dark:bg-[#09090B] text-[#111827] dark:text-[#F9FAFB] border-[#E5E7EB] dark:border-[#27272A] hover:border-[#6366F1]"
                      }`}
                    >
                      {p}
                    </button>
                  ))}
                </div>
              </div>
            </div>
            <div className="flex justify-end gap-2 px-4 py-3 border-t border-[#E5E7EB] dark:border-[#27272A] bg-[#FAFAFA] dark:bg-[#0F0F0F] shrink-0 pb-safe">
              <button
                onClick={close}
                className="px-3 py-1.5 text-sm rounded-md text-[#111827] dark:text-[#F9FAFB] hover:bg-[#F3F4F6] dark:hover:bg-[#18181B] transition"
              >
                Cancelar
              </button>
              <button
                onClick={save}
                className="px-3 py-1.5 text-sm rounded-md bg-[#6366F1] text-white hover:bg-[#4F46E5] transition"
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
