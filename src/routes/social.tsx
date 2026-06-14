import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { useStore } from "@/lib/store";
import { Instagram, Video, CheckCircle2, Circle, Plus, Trophy } from "lucide-react";
import { toast } from "sonner";

export const Route = createFileRoute("/social")({
  head: () => ({ meta: [{ title: "Redes Sociales — FlowOS" }] }),
  component: SocialContent,
});

function SocialContent() {
  const { socialAccounts, addSocialAccount, logStory, toggleVideo } = useStore();
  
  const getLocalDateString = (d: Date) => {
    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };
  const today = getLocalDateString(new Date());

  const [adding, setAdding] = useState(false);
  const [newName, setNewName] = useState("");
  const [newIcon, setNewIcon] = useState("instagram");
  const [newColor, setNewColor] = useState("#E1306C");

  const handleAdd = () => {
    if (newName.trim()) {
      addSocialAccount(newName.trim(), newIcon, newColor);
      setAdding(false);
      setNewName("");
      toast.success("Cuenta agregada");
    }
  };

  return (
    <div className="max-w-5xl mx-auto px-6 py-8">
      <div className="flex items-center gap-3 mb-1">
        <h1 className="text-2xl font-semibold text-[#111827]">Redes Sociales</h1>
        <div className="px-2.5 py-1 text-xs font-medium rounded-full bg-[#10B981]/10 text-[#10B981] flex items-center gap-1">
          <Trophy className="w-3.5 h-3.5" /> Tracker Diario
        </div>
        <button
          onClick={() => setAdding(true)}
          className="ml-auto inline-flex items-center gap-1.5 px-3 py-1.5 bg-[#6366F1] text-white text-sm rounded-md hover:bg-[#4F46E5]"
        >
          <Plus className="w-4 h-4" /> Agregar Cuenta
        </button>
      </div>
      <p className="text-sm text-[#6B7280] mb-8">
        Mantené la constancia: 1 Video y 2 Historias por día.
      </p>

      {adding && (
        <div className="bg-white rounded-xl border border-[#E5E7EB] p-5 shadow-sm mb-6 flex flex-wrap items-end gap-4 animate-in fade-in slide-in-from-top-4">
          <div className="flex-1 min-w-[200px]">
            <label className="block text-xs font-medium text-[#6B7280] mb-1">Nombre (ej. Instagram Labora)</label>
            <input 
              autoFocus
              value={newName} 
              onChange={e => setNewName(e.target.value)}
              placeholder="Mi nueva cuenta..."
              className="w-full px-3 py-2 text-sm border border-[#E5E7EB] rounded-md focus:outline-none focus:border-[#6366F1]"
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-[#6B7280] mb-1">Plataforma</label>
            <select 
              value={newIcon}
              onChange={e => {
                setNewIcon(e.target.value);
                if (e.target.value === "instagram") setNewColor("#E1306C");
                if (e.target.value === "tiktok") setNewColor("#000000");
                if (e.target.value === "youtube") setNewColor("#FF0000");
              }}
              className="w-32 px-3 py-2 text-sm border border-[#E5E7EB] rounded-md focus:outline-none focus:border-[#6366F1]"
            >
              <option value="instagram">Instagram</option>
              <option value="tiktok">TikTok</option>
              <option value="youtube">YouTube</option>
            </select>
          </div>
          <div>
            <label className="block text-xs font-medium text-[#6B7280] mb-1">Color</label>
            <input 
              type="color"
              value={newColor}
              onChange={e => setNewColor(e.target.value)}
              className="w-10 h-10 p-0.5 border border-[#E5E7EB] rounded-md cursor-pointer"
            />
          </div>
          <div className="flex items-center gap-2">
            <button onClick={() => setAdding(false)} className="px-4 py-2 text-sm text-[#6B7280] hover:text-[#111827]">Cancelar</button>
            <button onClick={handleAdd} className="px-4 py-2 text-sm bg-[#6366F1] text-white rounded-md hover:bg-[#4F46E5]">Guardar</button>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
        {socialAccounts.map((account) => {
          const todayData = account.days.find((d) => d.date === today) || { date: today, videoCompleted: false, stories: 0 };
          const Icon = account.icon === "instagram" ? Instagram : Video;

          return (
            <div key={account.id} className="bg-white rounded-xl border border-[#E5E7EB] p-5 shadow-sm">
              <div className="flex items-center gap-3 mb-6">
                <div 
                  className="w-10 h-10 rounded-xl grid place-items-center text-white"
                  style={{ backgroundColor: account.color }}
                >
                  <Icon className="w-5 h-5" />
                </div>
                <div className="font-medium text-[#111827]">{account.name}</div>
              </div>

              <div className="space-y-4">
                {/* Video Tracker */}
                <div 
                  onClick={() => toggleVideo(account.id, today)}
                  className={`flex items-center justify-between p-3 rounded-lg border cursor-pointer transition ${
                    todayData.videoCompleted 
                      ? "bg-[#10B981]/5 border-[#10B981]/20" 
                      : "bg-[#F9FAFB] border-[#E5E7EB] hover:border-[#D1D5DB]"
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    {todayData.videoCompleted ? (
                      <CheckCircle2 className="w-5 h-5 text-[#10B981]" />
                    ) : (
                      <Circle className="w-5 h-5 text-[#D1D5DB]" />
                    )}
                    <span className={`text-sm font-medium ${todayData.videoCompleted ? "text-[#10B981]" : "text-[#374151]"}`}>
                      1 Video
                    </span>
                  </div>
                </div>

                {/* Stories Tracker */}
                <div className="p-3 rounded-lg border border-[#E5E7EB] bg-[#F9FAFB]">
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-sm font-medium text-[#374151]">Historias ({todayData.stories}/2)</span>
                    <button 
                      onClick={() => logStory(account.id, today)}
                      className="w-7 h-7 rounded bg-white border border-[#D1D5DB] flex items-center justify-center text-[#6B7280] hover:text-[#111827] hover:border-[#9CA3AF] shadow-sm transition"
                    >
                      <Plus className="w-4 h-4" />
                    </button>
                  </div>
                  <div className="flex gap-2">
                    {[1, 2].map((i) => (
                      <div 
                        key={i} 
                        className={`flex-1 h-2 rounded-full transition-colors ${
                          todayData.stories >= i ? "bg-[#6366F1]" : "bg-[#E5E7EB]"
                        }`} 
                      />
                    ))}
                  </div>
                  {todayData.stories > 2 && (
                    <div className="mt-2 text-[11px] text-[#6366F1] font-medium">
                      ¡Estás on fire! (+{todayData.stories - 2} extra)
                    </div>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <div>
        <h2 className="text-lg font-medium text-[#111827] mb-4">Progreso de la última semana</h2>
        <div className="bg-white rounded-xl border border-[#E5E7EB] overflow-hidden">
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="border-b border-[#E5E7EB] bg-[#F9FAFB]">
                <th className="px-5 py-3 font-medium text-[#6B7280]">Cuenta</th>
                {socialAccounts[0]?.days.map((d) => {
                  const dateObj = new Date(d.date + "T00:00:00");
                  const dayName = new Intl.DateTimeFormat('es-AR', { weekday: 'short' }).format(dateObj);
                  return (
                    <th key={d.date} className="px-3 py-3 font-medium text-[#6B7280] text-center capitalize">
                      {d.date === today ? "Hoy" : dayName}
                    </th>
                  );
                }).reverse() /* reverse so 'hoy' is on the right */}
              </tr>
            </thead>
            <tbody className="divide-y divide-[#E5E7EB]">
              {socialAccounts.map((account) => (
                <tr key={account.id}>
                  <td className="px-5 py-3 font-medium text-[#111827] flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full" style={{ backgroundColor: account.color }} />
                    {account.name}
                  </td>
                  {[...account.days].reverse().map((d) => {
                    const achieved = d.videoCompleted && d.stories >= 2;
                    const partial = d.videoCompleted || d.stories > 0;
                    
                    return (
                      <td key={d.date} className="px-3 py-3 text-center">
                        <div 
                          className={`w-6 h-6 mx-auto rounded-md flex items-center justify-center ${
                            achieved ? "bg-[#10B981] text-white" : partial ? "bg-[#F59E0B] text-white" : "bg-[#F3F4F6] text-transparent"
                          }`}
                          title={`Video: ${d.videoCompleted ? 'Sí' : 'No'} | Historias: ${d.stories}`}
                        >
                          {achieved ? <CheckCircle2 className="w-4 h-4" /> : partial ? <span className="w-2 h-2 bg-white rounded-full" /> : "-"}
                        </div>
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="mt-3 flex items-center gap-4 text-xs text-[#6B7280]">
          <div className="flex items-center gap-1.5"><div className="w-3 h-3 rounded bg-[#10B981]" /> Objetivo cumplido</div>
          <div className="flex items-center gap-1.5"><div className="w-3 h-3 rounded bg-[#F59E0B]" /> Progreso parcial</div>
          <div className="flex items-center gap-1.5"><div className="w-3 h-3 rounded bg-[#F3F4F6]" /> Sin actividad</div>
        </div>
      </div>
    </div>
  );
}
