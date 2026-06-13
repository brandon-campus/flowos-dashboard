import { createFileRoute } from "@tanstack/react-router";
import { Sparkles } from "lucide-react";

export const Route = createFileRoute("/settings")({
  head: () => ({ meta: [{ title: "Configuración — FlowOS" }] }),
  component: Settings,
});

function Settings() {
  return (
    <div className="max-w-2xl mx-auto px-6 py-8">
      <h1 className="text-2xl font-semibold mb-6">Configuración</h1>

      <div className="space-y-5">
        <section className="bg-white border border-[#E5E7EB] rounded-lg p-5">
          <h2 className="text-sm font-medium mb-3">Perfil</h2>
          <div className="text-sm space-y-1 text-[#374151]">
            <div><span className="text-[#6B7280]">Nombre:</span> Brandon Candia</div>
            <div><span className="text-[#6B7280]">Email:</span> brandon@labora.ar</div>
          </div>
          <button className="mt-3 px-3 py-1.5 text-xs border border-[#E5E7EB] rounded-md hover:bg-[#F3F4F6]">
            Editar perfil
          </button>
        </section>

        <section className="bg-white border border-[#E5E7EB] rounded-lg p-5">
          <h2 className="text-sm font-medium mb-3">Plan actual</h2>
          <div className="flex items-center gap-2">
            <span className="inline-flex items-center gap-1 px-2 py-0.5 text-xs rounded bg-[#EEF2FF] text-[#4338CA] font-medium">
              <Sparkles className="w-3 h-3" /> Pro
            </span>
            <span className="text-sm text-[#374151]">
              Proyectos ilimitados · Resumen IA activo
            </span>
          </div>
          <button className="mt-3 px-3 py-1.5 text-xs border border-[#E5E7EB] rounded-md hover:bg-[#F3F4F6]">
            Ver planes
          </button>
        </section>

        <section className="bg-white border border-[#E5E7EB] rounded-lg p-5">
          <h2 className="text-sm font-medium mb-3">Sesión</h2>
          <button className="px-3 py-1.5 text-xs border border-[#E5E7EB] rounded-md hover:bg-[#F3F4F6]">
            Cerrar sesión
          </button>
        </section>

        <section className="bg-white border border-[#FEE2E2] rounded-lg p-5">
          <h2 className="text-sm font-medium mb-1 text-[#991B1B]">Zona de peligro</h2>
          <p className="text-xs text-[#6B7280] mb-3">
            Esta acción es irreversible.
          </p>
          <button
            onClick={() => confirm("¿Eliminar tu cuenta de FlowOS? Esta acción no se puede deshacer.")}
            className="px-3 py-1.5 text-xs bg-[#EF4444] text-white rounded-md hover:bg-[#DC2626]"
          >
            Eliminar cuenta
          </button>
        </section>
      </div>
    </div>
  );
}
