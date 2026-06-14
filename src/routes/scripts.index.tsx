import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useStore } from "@/lib/store";
import { FileText, Plus, Clock, Trash2 } from "lucide-react";

export const Route = createFileRoute("/scripts/")({
  head: () => ({ meta: [{ title: "Guiones — FlowOS" }] }),
  component: ScriptsIndex,
});

function ScriptsIndex() {
  const { scripts, createScript, deleteScript, socialAccounts } = useStore();
  const navigate = useNavigate();

  const handleCreate = () => {
    const newId = createScript();
    navigate({ to: "/scripts/$scriptId", params: { scriptId: newId } });
  };

  return (
    <div className="max-w-5xl mx-auto px-6 py-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-semibold text-[#111827]">Guiones</h1>
          <p className="text-sm text-[#6B7280]">Tu página en blanco para crear contenido.</p>
        </div>
        <button 
          onClick={handleCreate}
          className="inline-flex items-center gap-2 px-4 py-2 bg-[#111827] text-white rounded-lg hover:bg-[#1F2937] transition text-sm font-medium"
        >
          <Plus className="w-4 h-4" /> Nuevo guion
        </button>
      </div>

      {scripts.length === 0 ? (
        <div className="bg-white border border-[#E5E7EB] rounded-2xl py-24 text-center">
          <FileText className="w-12 h-12 mx-auto text-[#D1D5DB] mb-4" />
          <div className="text-lg font-medium text-[#111827]">Sin guiones todavía</div>
          <div className="text-sm text-[#6B7280] mt-1 mb-6">
            Empezá a redactar el guion para tu próximo video.
          </div>
          <button 
            onClick={handleCreate}
            className="inline-flex items-center gap-2 px-4 py-2 bg-[#6366F1] text-white rounded-lg hover:bg-[#4F46E5] transition text-sm font-medium"
          >
            <Plus className="w-4 h-4" /> Escribir primer guion
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {scripts.map((script) => (
            <div key={script.id} className="group bg-white rounded-xl border border-[#E5E7EB] p-5 hover:border-[#6366F1] hover:shadow-sm transition relative flex flex-col">
              <Link to="/scripts/$scriptId" params={{ scriptId: script.id }} className="absolute inset-0 z-0" />
              
              <div className="flex items-start justify-between mb-3 z-10">
                <div className="flex flex-wrap gap-2">
                  <div className="w-8 h-8 rounded bg-[#F3F4F6] grid place-items-center text-[#6B7280]">
                    <FileText className="w-4 h-4" />
                  </div>
                  {script.accountId && socialAccounts.find(a => a.id === script.accountId) && (
                    <div 
                      className="px-2 py-1 text-[10px] font-medium uppercase tracking-wider rounded-md border flex items-center h-8"
                      style={{ 
                        color: socialAccounts.find(a => a.id === script.accountId)?.color,
                        borderColor: socialAccounts.find(a => a.id === script.accountId)?.color + '40', // 40 is 25% opacity in hex
                        backgroundColor: socialAccounts.find(a => a.id === script.accountId)?.color + '10' // 10 is ~6% opacity in hex
                      }}
                    >
                      {socialAccounts.find(a => a.id === script.accountId)?.name.replace("Instagram ", "IG ").replace("TikTok ", "TK ")}
                    </div>
                  )}
                </div>
                <button 
                  onClick={(e) => {
                    e.preventDefault();
                    if (confirm("¿Estás seguro de eliminar este guion?")) deleteScript(script.id);
                  }}
                  className="opacity-0 group-hover:opacity-100 p-1.5 text-[#9CA3AF] hover:text-[#EF4444] rounded hover:bg-[#FEE2E2] transition"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
              
              <h3 className="font-medium text-[#111827] mb-2 truncate">
                {script.title || "Sin título"}
              </h3>
              
              <p className="text-sm text-[#6B7280] line-clamp-3 mb-4 flex-1">
                {script.content || "Escribe algo..."}
              </p>
              
              <div className="flex items-center gap-1.5 text-xs text-[#9CA3AF] mt-auto">
                <Clock className="w-3.5 h-3.5" /> Editado {script.lastEdited}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
