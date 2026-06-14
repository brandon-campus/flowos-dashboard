import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { useStore } from "@/lib/store";
import { Hexagon, Briefcase, Video, Code, BookOpen, ArrowRight, Check } from "lucide-react";

export const Route = createFileRoute("/onboarding")({
  head: () => ({ meta: [{ title: "Configurar FlowOS" }] }),
  component: Onboarding,
});

const ROLES = [
  { id: "Creador", icon: Video, label: "Creador de Contenido" },
  { id: "Emprendedor", icon: Briefcase, label: "Emprendedor / Fundador" },
  { id: "Desarrollador", icon: Code, label: "Desarrollador / Freelancer" },
  { id: "Estudiante", icon: BookOpen, label: "Estudiante / Académico" },
];

function Onboarding() {
  const [step, setStep] = useState(1);
  const [role, setRole] = useState("");
  const [projects, setProjects] = useState(["", "", ""]);
  const [startHour, setStartHour] = useState(6);
  
  const { user, completeOnboarding } = useStore();
  const navigate = useNavigate();

  const handleFinish = () => {
    completeOnboarding(role, projects, startHour);
    navigate({ to: "/" });
  };

  return (
    <div className="min-h-screen bg-[#000000] text-[#F9FAFB] flex flex-col items-center justify-center p-6 relative overflow-hidden">
      
      {/* Background gradients */}
      <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[50%] bg-[#6366F1]/20 blur-[120px] rounded-full pointer-events-none" />
      <div className="absolute bottom-[-20%] right-[-10%] w-[50%] h-[50%] bg-[#EC4899]/10 blur-[120px] rounded-full pointer-events-none" />

      <div className="w-full max-w-2xl relative z-10 animate-in fade-in slide-in-from-bottom-8 duration-700">
        
        {/* Header */}
        <div className="text-center mb-12">
          <div className="mx-auto w-16 h-16 bg-[#18181B] border border-[#27272A] rounded-2xl flex items-center justify-center mb-6 shadow-2xl">
            <Hexagon className="w-8 h-8 text-[#6366F1]" />
          </div>
          <h1 className="text-3xl font-bold tracking-tight mb-3">
            Hola, {user?.name?.split(" ")[0] || "creador"}
          </h1>
          <p className="text-[#A1A1AA]">Vamos a configurar tu entorno para máxima productividad.</p>
        </div>

        {/* STEP 1: ROL */}
        {step === 1 && (
          <div className="bg-[#09090B] border border-[#27272A] rounded-3xl p-8 md:p-12 shadow-2xl animate-in zoom-in-95 duration-500">
            <h2 className="text-xl font-semibold mb-6">1. ¿Cuál es tu enfoque principal?</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {ROLES.map((r) => {
                const Icon = r.icon;
                const isSelected = role === r.id;
                return (
                  <button
                    key={r.id}
                    onClick={() => setRole(r.id)}
                    className={`flex items-center gap-4 p-5 rounded-2xl border transition-all text-left ${
                      isSelected 
                        ? "border-[#6366F1] bg-[#6366F1]/10 shadow-[0_0_20px_rgba(99,102,241,0.15)]" 
                        : "border-[#27272A] bg-[#18181B] hover:border-[#3F3F46] hover:bg-[#27272A]"
                    }`}
                  >
                    <div className={`w-10 h-10 rounded-xl grid place-items-center transition-colors ${isSelected ? "bg-[#6366F1] text-white" : "bg-[#27272A] text-[#A1A1AA]"}`}>
                      <Icon className="w-5 h-5" />
                    </div>
                    <span className={`font-medium ${isSelected ? "text-white" : "text-[#D1D5DB]"}`}>{r.label}</span>
                  </button>
                )
              })}
            </div>
            
            <div className="mt-10 flex justify-end">
              <button 
                onClick={() => setStep(2)}
                disabled={!role}
                className="flex items-center gap-2 px-6 py-3 bg-white text-black font-semibold rounded-xl hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
              >
                Siguiente paso <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* STEP 2: PROJECTS */}
        {step === 2 && (
          <div className="bg-[#09090B] border border-[#27272A] rounded-3xl p-8 md:p-12 shadow-2xl animate-in slide-in-from-right-8 duration-500">
            <h2 className="text-xl font-semibold mb-2">2. Tus Grandes Áreas</h2>
            <p className="text-[#A1A1AA] text-sm mb-8">Definí los 3 grandes proyectos o áreas que dividen tu atención actual.</p>
            
            <div className="space-y-4">
              {projects.map((proj, i) => (
                <div key={i} className="relative">
                  <div className="absolute left-4 top-1/2 -translate-y-1/2 w-6 h-6 rounded-full bg-[#18181B] border border-[#3F3F46] flex items-center justify-center text-xs font-bold text-[#A1A1AA]">
                    {i + 1}
                  </div>
                  <input 
                    type="text"
                    value={proj}
                    onChange={(e) => {
                      const newP = [...projects];
                      newP[i] = e.target.value;
                      setProjects(newP);
                    }}
                    placeholder={i === 0 ? "Ej: FlowOS App" : i === 1 ? "Ej: Creación de Contenido" : "Ej: Finanzas Personales"}
                    className="w-full bg-[#18181B] border border-[#27272A] rounded-xl py-4 pl-14 pr-4 text-white placeholder:text-[#52525B] focus:outline-none focus:border-[#6366F1] focus:ring-1 focus:ring-[#6366F1] transition-all"
                  />
                </div>
              ))}
            </div>
            
            <div className="mt-10 flex justify-between items-center">
              <button 
                onClick={() => setStep(1)}
                className="text-[#A1A1AA] hover:text-white text-sm font-medium transition"
              >
                Volver
              </button>
              <button 
                onClick={() => setStep(3)}
                disabled={projects.every(p => p.trim() === "")}
                className="flex items-center gap-2 px-6 py-3 bg-white text-black font-semibold rounded-xl hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
              >
                Siguiente paso <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* STEP 3: SCHEDULE */}
        {step === 3 && (
          <div className="bg-[#09090B] border border-[#27272A] rounded-3xl p-8 md:p-12 shadow-2xl animate-in slide-in-from-right-8 duration-500">
            <h2 className="text-xl font-semibold mb-2">3. Tu Rutina</h2>
            <p className="text-[#A1A1AA] text-sm mb-8">¿A qué hora arranca tu día? Ajustaremos el planificador para vos.</p>
            
            <div className="flex flex-col items-center py-8">
              <div className="text-6xl font-bold tracking-tighter text-white mb-8">
                {startHour.toString().padStart(2, "0")}:00
              </div>
              <input 
                type="range" 
                min="4" 
                max="12" 
                value={startHour} 
                onChange={(e) => setStartHour(parseInt(e.target.value))}
                className="w-full max-w-sm accent-[#6366F1]"
              />
              <div className="flex justify-between w-full max-w-sm text-xs text-[#6B7280] font-medium mt-3 px-1">
                <span>04:00</span>
                <span>08:00</span>
                <span>12:00</span>
              </div>
            </div>
            
            <div className="mt-10 flex justify-between items-center">
              <button 
                onClick={() => setStep(2)}
                className="text-[#A1A1AA] hover:text-white text-sm font-medium transition"
              >
                Volver
              </button>
              <button 
                onClick={handleFinish}
                className="flex items-center gap-2 px-6 py-3 bg-[#6366F1] text-white font-semibold rounded-xl hover:bg-[#4F46E5] shadow-[0_0_20px_rgba(99,102,241,0.4)] hover:shadow-[0_0_30px_rgba(99,102,241,0.6)] transition-all"
              >
                Comenzar <Check className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
