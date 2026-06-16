import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useStore } from "@/lib/store";
import { useEffect, useState } from "react";
import { Play, Pause, Square, X, CheckCircle2, Plus, Music } from "lucide-react";
import confetti from "canvas-confetti";
import ReactPlayer from "react-player";

export const Route = createFileRoute("/flow")({
  head: () => ({ meta: [{ title: "Flow — FlowOS" }] }),
  component: FlowMode,
});

type FlowPhase = "ready" | "breathing_in" | "breathing_out" | "focus" | "completed";

function FlowMode() {
  const navigate = useNavigate();
  const { activeFlow, endFlow, updateTimeBlock, timeBlocks } = useStore();
  
  const [phase, setPhase] = useState<FlowPhase>("ready");
  const [timeLeft, setTimeLeft] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [showMusic, setShowMusic] = useState(false);

  // Subtasks state
  const [subtasks, setSubtasks] = useState<{id: string, text: string, done: boolean}[]>([]);
  const [newTaskText, setNewTaskText] = useState("");

  const addSubtask = () => {
    if(!newTaskText.trim()) return;
    setSubtasks([...subtasks, { id: Date.now().toString(), text: newTaskText, done: false }]);
    setNewTaskText("");
  };

  const toggleSubtask = (id: string) => {
    setSubtasks(subtasks.map(t => t.id === id ? { ...t, done: !t.done } : t));
  };

  const deleteSubtask = (id: string) => {
    setSubtasks(subtasks.filter(t => t.id !== id));
  };

  useEffect(() => {
    if (!activeFlow) {
      navigate({ to: "/plan" });
      return;
    }
    setTimeLeft(activeFlow.minutes * 60);
  }, [activeFlow, navigate]);

  // Handle breathing phase transitions
  useEffect(() => {
    if (phase === "breathing_in") {
      const t = setTimeout(() => setPhase("breathing_out"), 3000);
      return () => clearTimeout(t);
    }
    if (phase === "breathing_out") {
      const t = setTimeout(() => setPhase("focus"), 3000);
      return () => clearTimeout(t);
    }
  }, [phase]);

  // Handle timer tick
  useEffect(() => {
    if (phase !== "focus" || isPaused || !activeFlow || timeLeft <= 0) return;

    const intervalId = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(intervalId);
          handleComplete();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(intervalId);
  }, [phase, isPaused, activeFlow, timeLeft]);

  const handleStart = () => {
    setPhase("breathing_in");
  };

  const handleComplete = () => {
    setPhase("completed");
    
    // Trigger confetti
    const duration = 2000;
    const end = Date.now() + duration;

    const frame = () => {
      confetti({
        particleCount: 5,
        angle: 60,
        spread: 55,
        origin: { x: 0 },
        colors: ['#6366F1', '#EC4899', '#10B981']
      });
      confetti({
        particleCount: 5,
        angle: 120,
        spread: 55,
        origin: { x: 1 },
        colors: ['#6366F1', '#EC4899', '#10B981']
      });

      if (Date.now() < end) {
        requestAnimationFrame(frame);
      }
    };
    frame();

    // After confetti, mark done and go back
    setTimeout(() => {
      if (activeFlow) {
        const currentText = timeBlocks[activeFlow.hour] || "";
        updateTimeBlock(activeFlow.hour, currentText + "\n✅ Completado");
      }
      endFlow();
      navigate({ to: "/plan" });
    }, 3000);
  };

  const handleCancel = () => {
    endFlow();
    navigate({ to: "/plan" });
  };

  const addTime = () => {
    setTimeLeft(prev => prev + 5 * 60);
  };

  if (!activeFlow) return null;

  const totalSeconds = activeFlow.minutes * 60;
  
  return (
    <div className="fixed inset-0 bg-[#09090B] text-white z-[100] flex flex-col md:flex-row h-screen overflow-hidden">
      
      {/* MAIN TIMER AREA */}
      <div className="flex-1 flex flex-col justify-between relative overflow-y-auto">
        {/* TOP BAR */}
      <div className="flex justify-between items-center p-6 sm:p-10 relative z-20">
        <div className="text-xl font-bold tracking-tight text-white/90">
          FlowOS
        </div>
        {(phase === "ready" || phase === "focus") && (
          <button 
            onClick={handleCancel}
            className="p-3 text-white/50 hover:text-white hover:bg-white/10 rounded-full transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        )}
      </div>

      {/* CENTER CONTENT */}
      <div className="flex-1 flex flex-col items-center justify-center p-6 text-center max-w-3xl mx-auto w-full relative z-10">
        
        {/* Subtle breathing background glow */}
        <div 
          className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[40vw] h-[40vw] max-w-[500px] max-h-[500px] bg-[#6366F1]/15 rounded-full blur-[100px] transition-all duration-[3000ms] ease-in-out
            ${phase === "breathing_in" ? "scale-150 opacity-100" : phase === "breathing_out" ? "scale-50 opacity-30" : "animate-pulse"}`} 
          style={{ animationDuration: '4s' }} 
        />

        <div className="relative z-10 flex flex-col items-center w-full">
          
          {phase === "ready" && (
            <div className="animate-in fade-in slide-in-from-bottom-8 duration-700 flex flex-col items-center w-full max-w-lg">
              <div className="w-full bg-white/5 border border-white/10 rounded-2xl p-8 mb-10 shadow-2xl backdrop-blur-md">
                <p className="text-white/40 uppercase tracking-widest text-xs font-semibold mb-4">
                  Tu próximo foco ({activeFlow.minutes} min)
                </p>
                <h2 className="text-2xl sm:text-3xl font-medium text-white/90 whitespace-pre-wrap leading-tight text-left">
                  {activeFlow.text}
                </h2>
              </div>
              <button 
                onClick={handleStart}
                className="group relative inline-flex items-center justify-center px-12 py-5 text-lg font-medium text-white bg-white/10 rounded-full overflow-hidden transition-all hover:bg-white/20 hover:scale-105 active:scale-95"
              >
                <span className="relative z-10 flex items-center gap-2">
                  <Play className="w-5 h-5 fill-current" /> Comenzar
                </span>
              </button>
            </div>
          )}

          {(phase === "breathing_in" || phase === "breathing_out") && (
            <div className="animate-in fade-in zoom-in duration-1000 flex flex-col items-center justify-center min-h-[300px]">
              <h2 className="text-4xl sm:text-6xl font-light tracking-widest text-white/90">
                {phase === "breathing_in" ? "Inhala..." : "Exhala..."}
              </h2>
            </div>
          )}

          {phase === "focus" && (
            <div className="animate-in fade-in zoom-in-95 duration-1000 flex flex-col items-center w-full">
              {/* Circular Progress Ring */}
              <div className="relative w-64 h-64 sm:w-80 sm:h-80 flex items-center justify-center mb-12">
                <svg className="absolute inset-0 w-full h-full -rotate-90" viewBox="0 0 100 100">
                  <circle cx="50" cy="50" r="48" fill="none" stroke="rgba(255,255,255,0.05)" strokeWidth="1" />
                  <circle 
                    cx="50" cy="50" r="48" 
                    fill="none" 
                    stroke="#6366F1" 
                    strokeWidth="1"
                    strokeDasharray={`${((totalSeconds - timeLeft) / totalSeconds) * 100 * 3.01} 301`} 
                    className="transition-all duration-1000 ease-linear"
                  />
                </svg>
                <div className="text-6xl sm:text-8xl font-light tracking-tighter tabular-nums font-mono">
                  {`${Math.floor(timeLeft / 60).toString().padStart(2, '0')}:${(timeLeft % 60).toString().padStart(2, '0')}`}
                </div>
              </div>

              {/* Task Text */}
              <h2 className="text-xl sm:text-2xl font-medium text-white/80 mb-12 max-w-2xl whitespace-pre-wrap leading-tight opacity-50">
                {activeFlow.text}
              </h2>

              {/* CONTROLS */}
              <div className="flex items-center gap-4 sm:gap-6">
                <button 
                  onClick={addTime}
                  className="px-4 py-3 rounded-2xl flex flex-col items-center justify-center bg-white/5 hover:bg-white/10 text-white/60 hover:text-white backdrop-blur-md transition-all active:scale-95"
                  title="Añadir 5 minutos"
                >
                  <Plus className="w-5 h-5 mb-1" />
                  <span className="text-[10px] font-bold tracking-widest uppercase">5 Min</span>
                </button>

                <button 
                  onClick={() => setIsPaused(!isPaused)}
                  className="w-16 h-16 rounded-full flex items-center justify-center bg-white/10 hover:bg-white/20 text-white backdrop-blur-md transition-all active:scale-95"
                >
                  {isPaused ? <Play className="w-6 h-6 fill-current ml-1" /> : <Pause className="w-6 h-6 fill-current" />}
                </button>

                <button 
                  onClick={handleComplete}
                  className="px-4 py-3 rounded-2xl flex flex-col items-center justify-center bg-[#10B981]/10 hover:bg-[#10B981]/20 text-[#10B981]/80 hover:text-[#10B981] backdrop-blur-md transition-all active:scale-95"
                  title="Marcar como Completado"
                >
                  <CheckCircle2 className="w-5 h-5 mb-1" />
                  <span className="text-[10px] font-bold tracking-widest uppercase">Hecho</span>
                </button>
              </div>
            </div>
          )}

          {phase === "completed" && (
            <div className="animate-in zoom-in duration-500 flex flex-col items-center justify-center min-h-[300px]">
              <div className="w-20 h-20 bg-[#10B981]/20 rounded-full flex items-center justify-center mb-6 text-[#10B981]">
                <CheckCircle2 className="w-10 h-10" />
              </div>
              <h2 className="text-3xl font-bold text-white mb-2">¡Excelente trabajo!</h2>
              <p className="text-white/50">Marcando tarea como completada...</p>
            </div>
          )}

        </div>
      </div>

      {/* AMBIENT MUSIC WIDGET */}
      <div className="absolute bottom-6 right-6 sm:bottom-10 sm:right-10 z-50 flex flex-col items-end gap-3">
        {/* React Player visually hidden but present in DOM so it plays */}
        <div className="absolute w-0 h-0 opacity-0 pointer-events-none overflow-hidden">
          {/* @ts-ignore: ReactPlayer types are sometimes missing in Vite fast refresh */}
          <ReactPlayer 
            url="https://www.youtube.com/watch?v=BrgfuE_bMC8" 
            playing={showMusic} 
            loop={true} 
            width="0" 
            height="0"
            volume={0.5} 
          />
        </div>
        
        {(phase === "focus" || phase === "ready") && (
          <button 
            onClick={() => setShowMusic(!showMusic)}
            className={`w-12 h-12 rounded-full flex items-center justify-center backdrop-blur-md transition-all shadow-lg ${showMusic ? 'bg-[#10B981] text-white hover:bg-[#059669]' : 'bg-white/10 text-white/60 hover:text-white hover:bg-white/20'}`}
            title={showMusic ? "Pausar Música Ambiental" : "Reproducir Música Ambiental"}
          >
            <Music className="w-5 h-5" />
          </button>
        )}
      </div>

        {/* BOTTOM FOOTER */}
        <div className="p-6 sm:p-10 text-center text-white/30 text-sm relative z-20">
          {phase === "focus" ? "Mantén este tab abierto. Las notificaciones están silenciadas." : ""}
        </div>
      </div>

      {/* RIGHT SIDEBAR: Mini Tareas */}
      {(phase === "ready" || phase === "focus") && (
        <div className="w-full md:w-80 lg:w-96 bg-black/40 border-t md:border-t-0 md:border-l border-white/10 flex flex-col h-[45vh] md:h-screen shrink-0 relative z-20 animate-in fade-in duration-500">
          <div className="p-4 md:p-6 border-b border-white/5 flex items-center justify-between shrink-0 bg-white/5">
            <h3 className="font-semibold text-white/90">Mini tareas</h3>
            <span className="text-xs bg-white/10 text-white/60 px-2 py-1 rounded-full">
              {subtasks.filter(t => t.done).length} / {subtasks.length}
            </span>
          </div>
          
          <div className="flex-1 overflow-y-auto p-4 space-y-2">
            {subtasks.map(task => (
              <div key={task.id} className="group flex items-start gap-3 bg-white/5 hover:bg-white/10 p-3 rounded-xl border border-white/5 transition">
                <button 
                  onClick={() => toggleSubtask(task.id)}
                  className={`mt-0.5 w-5 h-5 rounded flex items-center justify-center shrink-0 border transition ${task.done ? 'bg-[#10B981] border-[#10B981]' : 'border-white/20'}`}
                >
                  {task.done && <CheckCircle2 className="w-3.5 h-3.5 text-white" />}
                </button>
                <span className={`flex-1 text-sm ${task.done ? 'text-white/40 line-through' : 'text-white/90'}`}>
                  {task.text}
                </span>
                <button 
                  onClick={() => deleteSubtask(task.id)}
                  className="md:opacity-0 opacity-100 group-hover:opacity-100 text-white/40 hover:text-red-400 p-1 -mr-1 transition"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </div>
            ))}
            {subtasks.length === 0 && (
              <div className="text-center py-8 text-white/40 text-sm">
                Agregá los pasos para completar esta tarea.
              </div>
            )}
          </div>
          
          <div className="p-4 border-t border-white/5 shrink-0 bg-white/5 pb-safe">
            <div className="flex items-center gap-2 bg-black/20 border border-white/10 rounded-xl p-1 focus-within:border-[#6366F1] transition">
              <input 
                type="text" 
                value={newTaskText}
                onChange={e => setNewTaskText(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && addSubtask()}
                placeholder="Ej: Buscar el contenido..."
                className="flex-1 bg-transparent border-none px-3 py-2 text-base md:text-sm text-white placeholder:text-white/30 focus:outline-none"
              />
              <button 
                onClick={addSubtask}
                disabled={!newTaskText.trim()}
                className="w-8 h-8 rounded-lg bg-[#6366F1] text-white flex items-center justify-center hover:bg-[#4F46E5] disabled:opacity-50 disabled:hover:bg-[#6366F1] transition shrink-0"
              >
                <Plus className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
