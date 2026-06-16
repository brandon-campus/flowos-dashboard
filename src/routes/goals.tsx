import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { useStore } from "@/lib/store";
import type { GoalPeriod } from "@/lib/store";
import { Target, TrendingUp, Plus, Trash2, FolderKanban } from "lucide-react";

export const Route = createFileRoute("/goals")({
  head: () => ({ meta: [{ title: "Metas y KPIs — FlowOS" }] }),
  component: GoalsModule,
});

const periods: { value: GoalPeriod; label: string }[] = [
  { value: "semanal", label: "Semanales" },
  { value: "mensual", label: "Mensuales" },
  { value: "trimestral", label: "Trimestrales" },
];

function GoalsModule() {
  const { goals, updateGoalProgress, deleteGoal, addGoal, socialAccounts, projects } = useStore();
  const [activeTab, setActiveTab] = useState<GoalPeriod>("semanal");
  const [adding, setAdding] = useState(false);
  
  // New goal state
  const [newTitle, setNewTitle] = useState("");
  const [newTarget, setNewTarget] = useState("");
  const [newAccountId, setNewAccountId] = useState("");
  const [newProjectId, setNewProjectId] = useState("");
  const [newDeadline, setNewDeadline] = useState("");

  const filteredGoals = goals.filter((g) => g.period === activeTab);

  const handleAddGoal = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim() || !newTarget || isNaN(Number(newTarget)) || !newDeadline) return;
    
    addGoal({
      title: newTitle.trim(),
      current: 0,
      target: Number(newTarget),
      period: activeTab,
      deadline: newDeadline,
      accountId: newAccountId || undefined,
      projectId: newProjectId || undefined,
    });
    
    setNewTitle("");
    setNewTarget("");
    setNewDeadline("");
    setNewAccountId("");
    setNewProjectId("");
    setAdding(false);
  };

  return (
    <div className="max-w-5xl mx-auto px-6 py-8">
      <div className="flex items-center gap-3 mb-1">
        <h1 className="text-2xl font-semibold text-[#111827]">Metas y KPIs</h1>
        <div className="px-2.5 py-1 text-xs font-medium rounded-full bg-[#6366F1]/10 text-[#6366F1] flex items-center gap-1">
          <TrendingUp className="w-3.5 h-3.5" /> Trackeando {goals.length} objetivos
        </div>
      </div>
      <p className="text-sm text-[#6B7280] mb-8">
        Mantené el foco en los números que importan.
      </p>

      {/* Tabs */}
      <div className="flex items-center gap-6 border-b border-[#E5E7EB] mb-8">
        {periods.map((p) => (
          <button
            key={p.value}
            onClick={() => setActiveTab(p.value)}
            className={`pb-3 text-sm font-medium transition relative ${
              activeTab === p.value ? "text-[#111827]" : "text-[#6B7280] hover:text-[#374151]"
            }`}
          >
            {p.label}
            {activeTab === p.value && (
              <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#111827] rounded-t-full" />
            )}
          </button>
        ))}
      </div>

      {/* Goal Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {filteredGoals.map((goal) => {
          const percent = Math.min(100, Math.round((goal.current / goal.target) * 100));
          const socialAccount = goal.accountId ? socialAccounts.find(a => a.id === goal.accountId) : null;
          const project = goal.projectId ? projects.find(p => p.id === goal.projectId) : null;
          
          let daysRemaining = null;
          let suggestedPace = null;
          if (goal.deadline) {
            const today = new Date();
            const deadlineDate = new Date(goal.deadline + "T00:00:00");
            const diffTime = deadlineDate.getTime() - today.getTime();
            daysRemaining = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
            
            if (daysRemaining > 0 && goal.current < goal.target) {
              const left = goal.target - goal.current;
              suggestedPace = Math.ceil(left / daysRemaining);
            }
          }
          
          return (
            <div key={goal.id} className="bg-white rounded-xl border border-[#E5E7EB] p-5 shadow-sm flex flex-col group relative overflow-hidden">
              <div className="flex items-start justify-between mb-4 relative z-10">
                <div className="flex flex-wrap gap-2 items-center">
                  <div className="w-8 h-8 rounded bg-[#F3F4F6] grid place-items-center text-[#6366F1]">
                    <Target className="w-4 h-4" />
                  </div>
                  {socialAccount && (
                    <div 
                      className="px-2 py-1 text-[10px] font-medium uppercase tracking-wider rounded-md border flex items-center h-8"
                      style={{ 
                        color: socialAccount.color,
                        borderColor: socialAccount.color + '40',
                        backgroundColor: socialAccount.color + '10'
                      }}
                    >
                      {socialAccount.name.replace("Instagram ", "IG ").replace("TikTok ", "TK ")}
                    </div>
                  )}
                  {project && (
                    <div 
                      className="px-2 py-1 text-[10px] font-medium uppercase tracking-wider rounded-md border flex items-center h-8"
                      style={{ 
                        color: project.color,
                        borderColor: project.color + '40',
                        backgroundColor: project.color + '10'
                      }}
                    >
                      <FolderKanban className="w-3 h-3 mr-1" />
                      {project.name}
                    </div>
                  )}
                </div>
                <button 
                  onClick={() => deleteGoal(goal.id)}
                  className="opacity-0 group-hover:opacity-100 p-1.5 text-[#9CA3AF] hover:text-[#EF4444] rounded hover:bg-[#FEE2E2] transition"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>

              <h3 className="font-medium text-[#111827] mb-2 flex-1 line-clamp-2">
                {goal.title}
              </h3>

              {daysRemaining !== null && (
                <div className="mb-4">
                  <span className={`text-[11px] font-semibold px-2 py-1 rounded-md ${
                    daysRemaining < 0 ? "bg-red-100 text-red-700" :
                    daysRemaining === 0 ? "bg-orange-100 text-orange-700" :
                    "bg-[#F3F4F6] text-[#4B5563]"
                  }`}>
                    {daysRemaining < 0 ? "Vencida" : daysRemaining === 0 ? "Vence hoy" : `⏳ Faltan ${daysRemaining} días`}
                  </span>
                </div>
              )}

              <div className="mt-auto relative z-10">
                <div className="flex items-end justify-between mb-2">
                  <div className="flex flex-col">
                    <span className="text-[10px] uppercase tracking-wider text-[#9CA3AF] font-medium mb-1">Total Actual</span>
                    <div className="flex items-center gap-1.5">
                      <input 
                        type="number"
                        value={goal.current === 0 ? "" : goal.current}
                        onChange={(e) => updateGoalProgress(goal.id, Number(e.target.value))}
                        placeholder="0"
                        className="w-20 px-2 py-1 text-sm font-semibold text-[#111827] bg-[#F9FAFB] border border-[#E5E7EB] rounded-md focus:outline-none focus:border-[#6366F1] focus:ring-1 focus:ring-[#6366F1]"
                      />
                      <span className="text-sm text-[#6B7280]">/ {goal.target.toLocaleString()}</span>
                    </div>
                  </div>
                  <div className="text-sm font-bold text-[#6366F1]">{percent}%</div>
                </div>
                <div className="w-full h-2 rounded-full bg-[#E5E7EB] overflow-hidden mb-1.5">
                  <div 
                    className="h-full bg-[#6366F1] rounded-full transition-all duration-500 ease-out" 
                    style={{ width: `${percent}%` }}
                  />
                </div>
                {suggestedPace !== null && (
                  <div className="text-[10px] text-[#6B7280] text-right h-3">
                    Ritmo sugerido: <span className="font-semibold text-[#4B5563]">+{suggestedPace.toLocaleString()} por día</span>
                  </div>
                )}
                {suggestedPace === null && <div className="h-3" />}
              </div>
            </div>
          );
        })}

        {/* Add Goal Card */}
        {adding ? (
          <form onSubmit={handleAddGoal} className="bg-white rounded-xl border-2 border-dashed border-[#6366F1] p-5 shadow-sm flex flex-col relative z-10">
            <input 
              autoFocus
              value={newTitle}
              onChange={(e) => setNewTitle(e.target.value)}
              placeholder="Ej. Llegar a 10K seguidores"
              className="w-full mb-3 text-sm font-medium text-[#111827] placeholder:text-[#9CA3AF] border-none outline-none"
            />
            <div className="flex items-center gap-2 mb-4">
              <input 
                type="number"
                value={newTarget}
                onChange={(e) => setNewTarget(e.target.value)}
                placeholder="Objetivo numérico (ej. 10000)"
                className="w-1/2 text-xs px-2 py-1.5 bg-[#F9FAFB] border border-[#E5E7EB] rounded-md outline-none focus:border-[#6366F1]"
              />
              <input 
                type="date"
                value={newDeadline}
                onChange={(e) => setNewDeadline(e.target.value)}
                className="w-1/2 text-xs px-2 py-1.5 bg-[#F9FAFB] border border-[#E5E7EB] rounded-md outline-none focus:border-[#6366F1] text-[#6B7280]"
              />
            </div>
            <div className="mb-4 space-y-2">
              <select
                value={newAccountId}
                onChange={(e) => {
                  setNewAccountId(e.target.value);
                  if (e.target.value) setNewProjectId(""); // Clear project if social is selected
                }}
                className="w-full text-xs font-medium px-2 py-1.5 rounded-md border border-[#E5E7EB] bg-[#F9FAFB] text-[#6B7280] outline-none focus:border-[#6366F1]"
              >
                <option value="">Ninguna red social</option>
                {socialAccounts.map(acc => (
                  <option key={acc.id} value={acc.id}>{acc.name}</option>
                ))}
              </select>
              <select
                value={newProjectId}
                onChange={(e) => {
                  setNewProjectId(e.target.value);
                  if (e.target.value) setNewAccountId(""); // Clear social if project is selected
                }}
                className="w-full text-xs font-medium px-2 py-1.5 rounded-md border border-[#E5E7EB] bg-[#F9FAFB] text-[#6B7280] outline-none focus:border-[#6366F1]"
              >
                <option value="">Ningún proyecto</option>
                {projects.map(p => (
                  <option key={p.id} value={p.id}>{p.name}</option>
                ))}
              </select>
            </div>
            <div className="flex items-center gap-2 mt-auto">
              <button 
                type="button"
                onClick={() => setAdding(false)}
                className="flex-1 py-1.5 text-xs text-[#6B7280] hover:bg-[#F3F4F6] rounded-md transition"
              >
                Cancelar
              </button>
              <button 
                type="submit"
                className="flex-1 py-1.5 text-xs font-medium bg-[#6366F1] text-white rounded-md hover:bg-[#4F46E5] transition"
              >
                Guardar
              </button>
            </div>
          </form>
        ) : (
          <button 
            onClick={() => setAdding(true)}
            className="flex flex-col items-center justify-center min-h-[200px] rounded-xl border-2 border-dashed border-[#E5E7EB] bg-[#F9FAFB] hover:border-[#6366F1] hover:bg-white text-[#9CA3AF] hover:text-[#6366F1] transition group"
          >
            <div className="w-10 h-10 rounded-full bg-white border border-[#E5E7EB] group-hover:border-[#6366F1] flex items-center justify-center mb-3 transition shadow-sm">
              <Plus className="w-5 h-5" />
            </div>
            <span className="text-sm font-medium">Agregar Meta {activeTab}</span>
          </button>
        )}
      </div>
    </div>
  );
}
