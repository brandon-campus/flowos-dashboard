import { createFileRoute, useNavigate, notFound } from "@tanstack/react-router";
import { useStore } from "@/lib/store";
import { ArrowLeft, Check } from "lucide-react";
import { useState, useEffect } from "react";

export const Route = createFileRoute("/scripts/$scriptId")({
  component: ScriptEditor,
});

function ScriptEditor() {
  const { scriptId } = Route.useParams();
  const { scripts, updateScript, socialAccounts } = useStore();
  const navigate = useNavigate();
  
  const script = scripts.find(s => s.id === scriptId);
  
  const [title, setTitle] = useState(script?.title || "");
  const [content, setContent] = useState(script?.content || "");
  const [accountId, setAccountId] = useState<string | undefined>(script?.accountId);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (script) {
      setTitle(script.title);
      setContent(script.content);
      setAccountId(script.accountId);
    }
  }, [scriptId]); // Only re-sync on mount or if id changes

  // Auto-save debounce effect
  useEffect(() => {
    if (!script) return;
    setSaving(true);
    
    const timeout = setTimeout(() => {
      updateScript(scriptId, { title, content, accountId });
      setSaving(false);
    }, 1000); // Save 1s after last typing
    
    return () => clearTimeout(timeout);
  }, [title, content, accountId]);

  if (!script) {
    return <div className="p-8 text-center text-gray-500">Guion no encontrado.</div>;
  }

  return (
    <div className="flex flex-col h-screen max-w-4xl mx-auto">
      {/* Topbar */}
      <div className="flex items-center justify-between px-6 py-4 shrink-0">
        <button 
          onClick={() => navigate({ to: "/scripts" })}
          className="flex items-center gap-2 text-sm text-[#6B7280] hover:text-[#111827] transition"
        >
          <ArrowLeft className="w-4 h-4" /> Volver
        </button>
        <div className="flex items-center gap-2 text-xs text-[#9CA3AF]">
          {saving ? (
            <span>Guardando...</span>
          ) : (
            <>
              <Check className="w-3.5 h-3.5" /> Guardado
            </>
          )}
        </div>
      </div>

      {/* Editor Space */}
      <div className="flex-1 overflow-y-auto px-6 pb-24">
        <div className="mb-4">
          <select
            value={accountId || ""}
            onChange={(e) => setAccountId(e.target.value || undefined)}
            className="text-xs font-medium px-2.5 py-1.5 rounded-md border border-[#E5E7EB] bg-[#F9FAFB] text-[#6B7280] outline-none focus:border-[#6366F1] focus:ring-1 focus:ring-[#6366F1] transition"
          >
            <option value="">Sin red social</option>
            {socialAccounts.map(acc => (
              <option key={acc.id} value={acc.id}>{acc.name}</option>
            ))}
          </select>
        </div>
        
        <input
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Título del guion"
          className="w-full text-4xl font-bold text-[#111827] placeholder:text-[#D1D5DB] border-none outline-none bg-transparent mb-6"
        />
        <textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="Empezá a escribir acá... Podés usar atajos de teclado o simplemente dejar fluir tus ideas."
          className="w-full h-full min-h-[500px] text-base leading-relaxed text-[#374151] placeholder:text-[#D1D5DB] border-none outline-none bg-transparent resize-none"
        />
      </div>
    </div>
  );
}
