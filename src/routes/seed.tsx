import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { supabase } from "@/lib/supabase";
import { projects, inboxTasks, type Project } from "@/lib/mock-data";

export const Route = createFileRoute("/seed")({
  component: SeedPage,
});

function SeedPage() {
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState("");

  const runSeed = async () => {
    setLoading(true);
    setStatus("Verificando sesión...");
    
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        throw new Error("No hay sesión activa. Por favor iniciá sesión primero.");
      }
      
      const userId = session.user.id;
      setStatus(`Usuario detectado: ${userId}. Sembrando proyectos...`);

      for (const p of projects) {
        // 1. Insert Project
        const { data: projData, error: projError } = await supabase
          .from("projects")
          .insert({
            user_id: userId,
            name: p.name,
            area: p.area,
            color: p.color,
            status: p.status,
            summary: p.summary,
            summary_ago: p.summaryAgo,
            last_activity: p.lastActivity,
            contacts: p.contacts
          })
          .select()
          .single();

        if (projError) throw projError;
        const newProjId = projData.id;

        // 2. Insert Tasks
        if (p.tasks.length > 0) {
          const tasksToInsert = p.tasks.map(t => ({
            project_id: newProjId,
            user_id: userId,
            text: t.text,
            priority: t.priority,
            completed: t.completed || false,
            completed_ago: t.completedAgo
          }));
          const { error: taskError } = await supabase.from("tasks").insert(tasksToInsert);
          if (taskError) throw taskError;
        }

        // 3. Insert Notes
        if (p.notes.length > 0) {
          const notesToInsert = p.notes.map(n => ({
            project_id: newProjId,
            user_id: userId,
            text: n.text,
            ago: n.ago
          }));
          const { error: noteError } = await supabase.from("notes").insert(notesToInsert);
          if (noteError) throw noteError;
        }
      }

      setStatus("Sembrando Inbox...");
      if (inboxTasks.length > 0) {
        const inboxToInsert = inboxTasks.map(t => ({
          user_id: userId,
          text: t.text,
          completed: false
        }));
        const { error: inboxError } = await supabase.from("inbox_tasks").insert(inboxToInsert);
        if (inboxError) throw inboxError;
      }

      setStatus("¡Siembra completada con éxito! Podés volver al Dashboard.");
    } catch (err: any) {
      console.error(err);
      setStatus(`Error: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-black text-white p-12">
      <h1 className="text-3xl font-bold mb-4">Herramienta de Migración de Datos</h1>
      <p className="text-gray-400 mb-8 max-w-lg">
        Esta herramienta copiará los datos de prueba locales (Mock Data) de tus proyectos, tareas y notas, hacia la base de datos real en Supabase, vinculándolos a tu cuenta actual.
      </p>
      
      <button 
        onClick={runSeed}
        disabled={loading}
        className="px-6 py-3 bg-indigo-600 hover:bg-indigo-700 rounded-xl font-medium transition disabled:opacity-50"
      >
        {loading ? "Migrando..." : "Migrar Datos a Supabase"}
      </button>

      {status && (
        <div className="mt-8 p-4 bg-gray-900 border border-gray-800 rounded-xl font-mono text-sm">
          {status}
        </div>
      )}
    </div>
  );
}
