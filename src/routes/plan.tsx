import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useStore } from "@/lib/store";
import { Sun, Plus, Minus, Inbox, Play, X } from "lucide-react";
import React, { useState } from "react";

export const Route = createFileRoute("/plan")({
  head: () => ({ meta: [{ title: "Planificar Día — FlowOS" }] }),
  component: DailyPlanner,
});


function DailyPlanner() {
  const navigate = useNavigate();
  const [showFlowModal, setShowFlowModal] = useState<string | null>(null); // store the hour being focused
  const [taskToSchedule, setTaskToSchedule] = useState<{ id: string, type: "inbox" | "project", projectId?: string, text: string } | null>(null);
  const [customTime, setCustomTime] = useState("");

  const { 
    projects, 
    inboxTasks, 
    toggleProjectTaskPriority, 
    setProjectTaskPriority,
    toggleInboxTaskPriority,
    setInboxTaskPriority,
    timeBlocks,
    updateTimeBlock,
    startFlow,
    startHour,
    toggleInboxTaskCompletion,
    toggleTaskCompletion
  } = useStore();

  // Generate hours dynamically starting from user's startHour
  const hours = Array.from({ length: 18 }, (_, i) => {
    const h = (i + startHour) % 24;
    return `${h.toString().padStart(2, "0")}:00`;
  });

  // ----- BACKLOG -----
  const backlogInbox = inboxTasks.filter(t => !t.completed && t.priority !== "hoy");
  const backlogProjects = projects.map(p => ({
    ...p,
    tasks: p.tasks.filter(t => !t.completed && t.priority !== "hoy")
  })).filter(p => p.tasks.length > 0);

  // ----- MI DÍA (Sueltas) -----
  const todayStr = new Date().toISOString().split('T')[0];

  const todayInbox = inboxTasks.filter(t => !t.completed && t.priority === "hoy" && (!t.plannedDate || t.plannedDate >= todayStr));
  const todayProjects = projects.map(p => ({
    ...p,
    tasks: p.tasks.filter(t => !t.completed && t.priority === "hoy" && (!t.plannedDate || t.plannedDate >= todayStr))
  })).filter(p => p.tasks.length > 0);

  const overdueInbox = inboxTasks.filter(t => !t.completed && t.priority === "hoy" && t.plannedDate && t.plannedDate < todayStr);
  const overdueProjects = projects.map(p => ({
    ...p,
    tasks: p.tasks.filter(t => !t.completed && t.priority === "hoy" && t.plannedDate && t.plannedDate < todayStr)
  })).filter(p => p.tasks.length > 0);

  // --- DRAG AND DROP HANDLERS ---
  const handleDragStart = (e: React.DragEvent, taskText: string, taskId: string, type: "inbox" | "project", projectId?: string) => {
    e.dataTransfer.setData("text/plain", taskText);
    e.dataTransfer.setData("application/json", JSON.stringify({ taskId, type, projectId }));
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault(); // allow drop
    e.currentTarget.classList.add("ring-2", "ring-[#6366F1]", "bg-white", "dark:bg-[#09090B]");
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.currentTarget.classList.remove("ring-2", "ring-[#6366F1]", "bg-white", "dark:bg-[#09090B]");
  };

  const handleDrop = (e: React.DragEvent, hour: string) => {
    e.preventDefault();
    e.currentTarget.classList.remove("ring-2", "ring-[#6366F1]", "bg-white", "dark:bg-[#09090B]");
    
    const taskText = e.dataTransfer.getData("text/plain");
    const metaStr = e.dataTransfer.getData("application/json");
    
    if (taskText && metaStr) {
      const meta = JSON.parse(metaStr);
      
      // Append text to the time block
      const currentBlockText = timeBlocks[hour] || "";
      const separator = currentBlockText.trim() === "" ? "" : "\n";
      updateTimeBlock(hour, currentBlockText + separator + "- " + taskText);
      
      // Consume the task (mark as 'hoy' so it disappears from backlog)
      // Note: If it's already 'hoy', this just reinforces it.
      if (meta.type === "inbox") {
        setInboxTaskPriority(meta.taskId, "hoy");
      } else if (meta.type === "project" && meta.projectId) {
        setProjectTaskPriority(meta.projectId, meta.taskId, "hoy");
      }
    }
  };

  const handleStartFlow = (minutes: number) => {
    if (showFlowModal && timeBlocks[showFlowModal]) {
      startFlow(showFlowModal, timeBlocks[showFlowModal], minutes);
      setShowFlowModal(null);
      navigate({ to: "/flow" });
    }
  };

  const handleScheduleTask = (hour: string | null) => {
    if (!taskToSchedule) return;

    if (hour) {
      const currentBlockText = timeBlocks[hour] || "";
      const separator = currentBlockText.trim() === "" ? "" : "\n";
      updateTimeBlock(hour, currentBlockText + separator + "- " + taskToSchedule.text);
    }
    
    if (taskToSchedule.type === "inbox") {
      setInboxTaskPriority(taskToSchedule.id, "hoy");
    } else if (taskToSchedule.type === "project" && taskToSchedule.projectId) {
      setProjectTaskPriority(taskToSchedule.projectId, taskToSchedule.id, "hoy");
    }
    
    setTaskToSchedule(null);
  };

  return (
    <div className="md:h-[calc(100vh-2rem)] flex flex-col px-4 md:px-6 py-6 md:py-8 max-w-7xl mx-auto md:overflow-hidden">
      {/* FLOW MODAL */}
      {showFlowModal && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-[#09090B] rounded-2xl shadow-xl w-full max-w-sm overflow-hidden animate-in fade-in zoom-in-95 duration-200 border dark:border-[#27272A]">
            <div className="p-5 border-b border-[#E5E7EB] dark:border-[#27272A] flex items-center justify-between">
              <h3 className="font-semibold text-[#111827] dark:text-[#F9FAFB]">Entrar en Flow</h3>
              <button onClick={() => setShowFlowModal(null)} className="text-[#9CA3AF] hover:text-[#111827] dark:hover:text-[#F9FAFB] transition p-2">
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="p-5">
              <p className="text-sm text-[#6B7280] dark:text-[#A1A1AA] mb-4">¿En cuánto tiempo planeás resolver esto?</p>
              <div className="grid grid-cols-2 gap-3 mb-4">
                {[15, 25, 45, 60].map(mins => (
                  <button
                    key={mins}
                    onClick={() => handleStartFlow(mins)}
                    className="py-2.5 px-4 rounded-xl border border-[#E5E7EB] dark:border-[#27272A] hover:border-[#6366F1] hover:bg-[#EEF2FF] dark:hover:bg-[#1E1B4B] text-[#374151] dark:text-[#D1D5DB] hover:text-[#6366F1] font-medium transition"
                  >
                    {mins} min
                  </button>
                ))}
              </div>
              <div className="flex gap-2">
                <input 
                  type="number" 
                  placeholder="Otro..." 
                  value={customTime}
                  onChange={e => setCustomTime(e.target.value)}
                  className="flex-1 bg-white dark:bg-[#09090B] text-base md:text-sm text-[#111827] dark:text-[#F9FAFB] border border-[#E5E7EB] dark:border-[#27272A] rounded-xl px-4 py-2 outline-none focus:border-[#6366F1] focus:ring-1 focus:ring-[#6366F1]"
                />
                <button 
                  onClick={() => customTime && handleStartFlow(parseInt(customTime))}
                  className="px-4 py-2 bg-[#111827] dark:bg-white text-white dark:text-[#111827] text-sm font-medium rounded-xl hover:bg-[#374151] dark:hover:bg-gray-200 transition"
                >
                  Iniciar
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* SCHEDULE MODAL (BOTTOM SHEET ON MOBILE) */}
      {taskToSchedule && (
        <div className="fixed inset-0 z-50 flex items-end md:items-center justify-center bg-black/40 md:p-4 animate-in fade-in duration-200" onClick={() => setTaskToSchedule(null)}>
          <div 
            className="bg-white dark:bg-[#09090B] w-full md:max-w-sm rounded-t-2xl md:rounded-2xl shadow-xl overflow-hidden animate-in slide-in-from-bottom-full md:slide-in-from-bottom-4 duration-300 border-t md:border dark:border-[#27272A] max-h-[80vh] flex flex-col"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="p-4 border-b border-[#E5E7EB] dark:border-[#27272A] flex items-center justify-between shrink-0">
              <h3 className="font-semibold text-[#111827] dark:text-[#F9FAFB] line-clamp-1 mr-4">Agendar: {taskToSchedule.text}</h3>
              <button onClick={() => setTaskToSchedule(null)} className="text-[#9CA3AF] hover:text-[#111827] dark:hover:text-[#F9FAFB] transition p-2">
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="overflow-y-auto p-2 pb-safe">
              <button
                onClick={() => handleScheduleTask(null)}
                className="w-full text-left px-4 py-3 text-sm font-medium text-[#F59E0B] hover:bg-[#FEF3C7] dark:hover:bg-[#451A03] rounded-xl transition flex items-center gap-2 mb-2"
              >
                <Sun className="w-4 h-4" /> Sin horario específico (Suelta)
              </button>
              
              <div className="text-xs font-semibold text-[#6B7280] dark:text-[#A1A1AA] uppercase tracking-wider px-4 py-2">
                Elegir Horario
              </div>
              <div className="grid grid-cols-2 gap-2 px-2 pb-4">
                {hours.map((hour) => (
                  <button
                    key={hour}
                    onClick={() => handleScheduleTask(hour)}
                    className="text-center px-4 py-3 text-sm font-medium text-[#374151] dark:text-[#D1D5DB] bg-[#F9FAFB] dark:bg-[#18181B] hover:bg-[#EEF2FF] hover:text-[#6366F1] dark:hover:bg-[#1E1B4B] border border-[#E5E7EB] dark:border-[#27272A] hover:border-[#6366F1] rounded-xl transition"
                  >
                    {hour}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="flex items-center gap-3 mb-6 shrink-0">
        <h1 className="text-2xl font-semibold text-[#111827] dark:text-[#F9FAFB]">Planificar mi día</h1>
        <div className="px-2.5 py-1 text-xs font-medium rounded-full bg-[#F59E0B]/10 text-[#F59E0B] flex items-center gap-1">
          <Sun className="w-3.5 h-3.5" /> Foco
        </div>
      </div>

      <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-8 min-h-0">
        
        {/* Left Column: BACKLOG */}
        <div className="flex flex-col bg-[#F9FAFB] dark:bg-[#18181B] border border-[#E5E7EB] dark:border-[#27272A] rounded-2xl overflow-hidden shadow-sm h-[50vh] md:h-auto">
          <div className="p-4 border-b border-[#E5E7EB] dark:border-[#27272A] bg-white dark:bg-[#09090B] flex items-center justify-between shrink-0">
            <h2 className="text-sm font-semibold text-[#111827] dark:text-[#F9FAFB]">Backlog</h2>
            <span className="text-xs text-[#6B7280] dark:text-[#A1A1AA]">Arrastrá tareas a tus horarios 👉</span>
          </div>
          
          <div className="flex-1 overflow-y-auto p-4 space-y-6">
            
            {/* Inbox Section */}
            {backlogInbox.length > 0 && (
              <div>
                <div className="flex items-center gap-2 mb-3 text-sm font-medium text-[#4B5563] dark:text-[#A1A1AA]">
                  <Inbox className="w-4 h-4" /> Inbox
                </div>
                <div className="space-y-1.5">
                  {backlogInbox.map(task => (
                    <div 
                      key={task.id} 
                      draggable
                      onDragStart={(e) => handleDragStart(e, task.text, task.id, "inbox")}
                      className="group flex items-center gap-2 bg-white dark:bg-[#09090B] border border-[#E5E7EB] dark:border-[#27272A] p-3 rounded-lg hover:border-[#6366F1] cursor-grab active:cursor-grabbing transition"
                    >
                      <button
                        onClick={() => toggleInboxTaskCompletion(task.id)}
                        className="w-4 h-4 shrink-0 rounded border flex items-center justify-center transition border-[#D1D5DB] dark:border-[#3F3F46] hover:border-[#10B981] hover:bg-[#10B981]/10"
                        title="Completar tarea"
                      />
                      <span className="flex-1 text-sm text-[#374151] dark:text-[#D1D5DB] select-none truncate">{task.text}</span>
                      <button 
                        onClick={() => setTaskToSchedule({ id: task.id, type: "inbox", text: task.text })}
                        className="md:opacity-0 opacity-100 group-hover:opacity-100 p-2 text-[#9CA3AF] hover:text-[#6366F1] bg-[#F3F4F6] dark:bg-[#27272A] hover:bg-[#EEF2FF] dark:hover:bg-[#1E1B4B] rounded-lg transition shrink-0"
                        title="Añadir como suelta"
                      >
                        <Plus className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Projects Section */}
            {backlogProjects.map(project => (
              <div key={project.id}>
                <div className="flex items-center gap-2 mb-3 text-sm font-medium text-[#4B5563] dark:text-[#A1A1AA]">
                  <span className="w-2 h-2 rounded-full" style={{ backgroundColor: project.color }} />
                  {project.name}
                </div>
                <div className="space-y-1.5">
                  {project.tasks.map(task => (
                    <div 
                      key={task.id} 
                      draggable
                      onDragStart={(e) => handleDragStart(e, task.text, task.id, "project", project.id)}
                      className="group flex items-center gap-2 bg-white dark:bg-[#09090B] border border-[#E5E7EB] dark:border-[#27272A] p-3 rounded-lg hover:border-[#6366F1] cursor-grab active:cursor-grabbing transition"
                    >
                      <button
                        onClick={() => toggleTaskCompletion(project.id, task.id)}
                        className="w-4 h-4 shrink-0 rounded border flex items-center justify-center transition border-[#D1D5DB] dark:border-[#3F3F46] hover:border-[#10B981] hover:bg-[#10B981]/10"
                        title="Completar tarea"
                      />
                      <span className="flex-1 text-sm text-[#374151] dark:text-[#D1D5DB] select-none truncate">{task.text}</span>
                      <button 
                        onClick={() => setTaskToSchedule({ id: task.id, type: "project", projectId: project.id, text: task.text })}
                        className="md:opacity-0 opacity-100 group-hover:opacity-100 p-2 text-[#9CA3AF] hover:text-[#6366F1] bg-[#F3F4F6] dark:bg-[#27272A] hover:bg-[#EEF2FF] dark:hover:bg-[#1E1B4B] rounded-lg transition shrink-0"
                        title="Añadir como suelta"
                      >
                        <Plus className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            ))}

            {backlogInbox.length === 0 && backlogProjects.length === 0 && (
              <div className="text-center py-12 text-[#9CA3AF] text-sm">
                No hay tareas pendientes en tu backlog.
              </div>
            )}
          </div>
        </div>

        {/* Right Column: MI DÍA (Bloc de notas / Cronograma) */}
        <div className="flex flex-col bg-white dark:bg-[#09090B] border border-[#E5E7EB] dark:border-[#27272A] rounded-2xl overflow-hidden shadow-md relative h-[80vh] md:h-auto">
          <div className="p-4 border-b border-[#E5E7EB] dark:border-[#27272A] bg-gradient-to-r from-[#FEF3C7] to-white dark:from-[#201A09] dark:to-[#09090B] flex items-center justify-between shrink-0 z-10">
            <h2 className="text-sm font-semibold text-[#F59E0B] flex items-center gap-2">
              <Sun className="w-4 h-4" /> Mi Día
            </h2>
            <span className="text-xs text-[#6B7280] dark:text-[#A1A1AA]">Escribí o arrastrá tareas acá</span>
          </div>
          
          <div className="flex-1 overflow-y-auto p-4 bg-[#F8FAFC] dark:bg-[#18181B]">
            
            {/* Overdue Tasks (Atrasadas) */}
            {(overdueInbox.length > 0 || overdueProjects.length > 0) && (
              <div className="mb-6 p-4 bg-red-50 dark:bg-red-950/20 rounded-xl border border-red-200 dark:border-red-900 shadow-sm">
                <h3 className="text-xs font-semibold text-red-600 dark:text-red-400 mb-3 uppercase tracking-wider">⚠️ Pendientes de Ayer</h3>
                
                <div className="space-y-1.5">
                  {overdueInbox.map(task => (
                    <div 
                      key={task.id} 
                      draggable
                      onDragStart={(e) => handleDragStart(e, task.text, task.id, "inbox")}
                      className="group flex items-center justify-between gap-2 bg-white dark:bg-[#09090B] border border-red-100 dark:border-red-900/50 p-2 rounded-md hover:border-red-300 cursor-grab active:cursor-grabbing transition"
                    >
                      <div className="flex items-center gap-2 flex-1 min-w-0 opacity-80">
                        <button
                          onClick={() => toggleInboxTaskCompletion(task.id)}
                          className="w-3.5 h-3.5 shrink-0 rounded border flex items-center justify-center transition border-[#D1D5DB] dark:border-[#3F3F46] hover:border-[#10B981] hover:bg-[#10B981]/10"
                          title="Completar tarea"
                        />
                        <span className="text-xs font-medium text-[#111827] dark:text-[#F9FAFB] truncate">{task.text}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <button 
                          onClick={() => setInboxTaskPriority(task.id, "hoy")}
                          className="p-1.5 text-xs font-medium text-[#6366F1] hover:bg-[#EEF2FF] dark:hover:bg-[#1E1B4B] rounded-lg transition shrink-0"
                          title="Pasar a hoy"
                        >
                          Mover a Hoy
                        </button>
                        <button 
                          onClick={() => setInboxTaskPriority(task.id, undefined)}
                          className="p-1.5 text-[#9CA3AF] hover:text-red-500 rounded-lg transition shrink-0"
                          title="Devolver al Backlog"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  ))}
                  
                  {overdueProjects.flatMap(project => 
                    project.tasks.map(task => (
                      <div 
                        key={task.id} 
                        draggable
                        onDragStart={(e) => handleDragStart(e, task.text, task.id, "project", project.id)}
                        className="group flex items-center justify-between gap-2 bg-white dark:bg-[#09090B] border border-red-100 dark:border-red-900/50 p-2 rounded-md hover:border-red-300 cursor-grab active:cursor-grabbing transition"
                      >
                        <div className="flex items-center gap-2 flex-1 min-w-0 opacity-80">
                          <button
                            onClick={() => toggleTaskCompletion(project.id, task.id)}
                            className="w-3.5 h-3.5 shrink-0 rounded border flex items-center justify-center transition border-[#D1D5DB] dark:border-[#3F3F46] hover:border-[#10B981] hover:bg-[#10B981]/10"
                            title="Completar tarea"
                          />
                          <span className="w-1.5 h-1.5 shrink-0 rounded-full" style={{ backgroundColor: project.color }} />
                          <span className="text-xs font-medium text-[#111827] dark:text-[#F9FAFB] truncate">{task.text}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <button 
                            onClick={() => setProjectTaskPriority(project.id, task.id, "hoy")}
                            className="p-1.5 text-xs font-medium text-[#6366F1] hover:bg-[#EEF2FF] dark:hover:bg-[#1E1B4B] rounded-lg transition shrink-0"
                            title="Pasar a hoy"
                          >
                            Mover a Hoy
                          </button>
                          <button 
                            onClick={() => setProjectTaskPriority(project.id, task.id, undefined)}
                            className="p-1.5 text-[#9CA3AF] hover:text-red-500 rounded-lg transition shrink-0"
                            title="Devolver al Backlog"
                          >
                            <X className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            )}
            
            {/* Unscheduled Today Tasks (Sueltas) */}
            {(todayInbox.length > 0 || todayProjects.length > 0) && (
              <div className="mb-6 p-4 bg-white dark:bg-[#09090B] rounded-xl border border-dashed border-[#F59E0B] shadow-sm">
                <h3 className="text-xs font-semibold text-[#F59E0B] mb-3 uppercase tracking-wider">Tareas para hoy (Sin horario)</h3>
                
                <div className="space-y-1.5">
                  {todayInbox.map(task => (
                    <div 
                      key={task.id} 
                      draggable
                      onDragStart={(e) => handleDragStart(e, task.text, task.id, "inbox")}
                      className="group flex items-center justify-between gap-2 bg-[#F9FAFB] dark:bg-[#18181B] border border-[#E5E7EB] dark:border-[#27272A] p-2 rounded-md hover:border-[#6366F1] cursor-grab active:cursor-grabbing transition"
                    >
                      <div className="flex items-center gap-2 flex-1 min-w-0">
                        <button
                          onClick={() => toggleInboxTaskCompletion(task.id)}
                          className="w-3.5 h-3.5 shrink-0 rounded border flex items-center justify-center transition border-[#D1D5DB] dark:border-[#3F3F46] hover:border-[#10B981] hover:bg-[#10B981]/10"
                          title="Completar tarea"
                        />
                        <span className="text-xs font-medium text-[#111827] dark:text-[#F9FAFB] truncate">{task.text}</span>
                      </div>
                      <button 
                        onClick={() => toggleInboxTaskPriority(task.id)}
                        className="md:opacity-0 opacity-100 group-hover:opacity-100 p-2 text-[#9CA3AF] hover:text-[#EF4444] rounded-lg transition shrink-0"
                      >
                        <Minus className="w-3 h-3" />
                      </button>
                    </div>
                  ))}
                  
                  {todayProjects.flatMap(project => 
                    project.tasks.map(task => (
                      <div 
                        key={task.id} 
                        draggable
                        onDragStart={(e) => handleDragStart(e, task.text, task.id, "project", project.id)}
                        className="group flex items-center justify-between gap-2 bg-[#F9FAFB] dark:bg-[#18181B] border border-[#E5E7EB] dark:border-[#27272A] p-2 rounded-md hover:border-[#6366F1] cursor-grab active:cursor-grabbing transition"
                      >
                        <div className="flex items-center gap-2 flex-1 min-w-0">
                          <button
                            onClick={() => toggleTaskCompletion(project.id, task.id)}
                            className="w-3.5 h-3.5 shrink-0 rounded border flex items-center justify-center transition border-[#D1D5DB] dark:border-[#3F3F46] hover:border-[#10B981] hover:bg-[#10B981]/10"
                            title="Completar tarea"
                          />
                          <span className="w-1.5 h-1.5 shrink-0 rounded-full" style={{ backgroundColor: project.color }} />
                          <span className="text-xs font-medium text-[#111827] dark:text-[#F9FAFB] truncate">{task.text}</span>
                        </div>
                        <button 
                          onClick={() => toggleProjectTaskPriority(project.id, task.id)}
                          className="md:opacity-0 opacity-100 group-hover:opacity-100 p-2 text-[#9CA3AF] hover:text-[#EF4444] rounded-lg transition shrink-0"
                        >
                          <Minus className="w-3 h-3" />
                        </button>
                      </div>
                    ))
                  )}
                </div>
              </div>
            )}

            {/* Time Blocks */}
            <div className="space-y-3 relative">
              {/* Decorative line */}
              <div className="absolute left-10 top-0 bottom-0 w-px bg-[#E5E7EB] dark:bg-[#27272A] z-0" />
              
              {hours.map((hour) => (
                <div key={hour} className="flex gap-3 relative z-10 group">
                  <div className="w-16 shrink-0 pt-2 text-right">
                    <span className="text-xs font-medium text-[#6B7280] dark:text-[#A1A1AA]">{hour}</span>
                  </div>
                  
                  <div 
                    className="flex-1 bg-transparent rounded-lg border-2 border-transparent transition-all duration-200 relative"
                    onDragOver={handleDragOver}
                    onDragLeave={handleDragLeave}
                    onDrop={(e) => handleDrop(e, hour)}
                  >
                    <textarea
                      value={timeBlocks[hour] || ""}
                      onChange={(e) => updateTimeBlock(hour, e.target.value)}
                      placeholder="Escribí o arrastrá una tarea acá..."
                      className="w-full min-h-[60px] p-3 text-sm text-[#374151] dark:text-[#F9FAFB] bg-white dark:bg-[#09090B] border border-[#E5E7EB] dark:border-[#27272A] rounded-lg shadow-sm placeholder:text-[#D1D5DB] dark:placeholder:text-[#52525B] resize-none focus:outline-none focus:ring-1 focus:ring-[#6366F1] focus:border-[#6366F1] transition-shadow"
                      rows={1}
                      onInput={(e) => {
                        // Auto-resize height
                        const target = e.target as HTMLTextAreaElement;
                        target.style.height = "60px";
                        target.style.height = `${Math.max(60, target.scrollHeight)}px`;
                      }}
                      style={{ height: timeBlocks[hour] ? 'auto' : '60px' }}
                    />
                    
                    {timeBlocks[hour] && timeBlocks[hour].trim() !== "" && (
                      <button 
                        onClick={() => setShowFlowModal(hour)}
                        className="absolute right-3 top-3 p-2 bg-[#EEF2FF] dark:bg-[#1E1B4B] text-[#6366F1] rounded-lg md:opacity-0 opacity-100 group-hover:opacity-100 transition shadow-sm hover:bg-[#6366F1] hover:text-white dark:hover:bg-[#6366F1]"
                        title="Entrar en Flow"
                      >
                        <Play className="w-4 h-4 fill-current" />
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>

          </div>
        </div>

      </div>
    </div>
  );
}
