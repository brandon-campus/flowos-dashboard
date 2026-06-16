import { createFileRoute } from "@tanstack/react-router";
import { Mail, MessageSquare, Send } from "lucide-react";

export const Route = createFileRoute("/contact")({
  head: () => ({
    meta: [
      { title: "Contacto — FlowOS" },
      { name: "description", content: "Ponte en contacto con el equipo de FlowOS." },
    ],
  }),
  component: Contact,
});

function Contact() {
  return (
    <div className="max-w-4xl mx-auto px-6 py-10 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="mb-10">
        <h1 className="text-3xl md:text-4xl font-bold tracking-tight text-[#111827] dark:text-[#F9FAFB] mb-2">
          Contacto
        </h1>
        <p className="text-lg text-[#6B7280] dark:text-[#A1A1AA]">
          ¿Tienes alguna duda o sugerencia? Escríbenos y te responderemos lo antes posible.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="md:col-span-2">
          <form className="space-y-6 bg-white dark:bg-[#09090B] border border-[#E5E7EB] dark:border-[#27272A] rounded-2xl p-6 shadow-sm">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-sm font-medium text-[#111827] dark:text-[#F9FAFB]">Nombre</label>
                <input 
                  type="text" 
                  className="w-full bg-gray-50 dark:bg-[#18181B] border border-[#E5E7EB] dark:border-[#3F3F46] rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#6366F1]/50 transition-all"
                  placeholder="Tu nombre"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-[#111827] dark:text-[#F9FAFB]">Email</label>
                <input 
                  type="email" 
                  className="w-full bg-gray-50 dark:bg-[#18181B] border border-[#E5E7EB] dark:border-[#3F3F46] rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#6366F1]/50 transition-all"
                  placeholder="tu@email.com"
                />
              </div>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-[#111827] dark:text-[#F9FAFB]">Mensaje</label>
              <textarea 
                rows={5}
                className="w-full bg-gray-50 dark:bg-[#18181B] border border-[#E5E7EB] dark:border-[#3F3F46] rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#6366F1]/50 transition-all resize-none"
                placeholder="¿En qué te podemos ayudar?"
              />
            </div>
            <button 
              type="button"
              className="flex items-center justify-center gap-2 w-full bg-[#6366F1] hover:bg-[#4F46E5] text-white rounded-xl px-4 py-3 text-sm font-semibold transition-all hover:shadow-md"
            >
              <Send className="w-4 h-4" />
              Enviar mensaje
            </button>
          </form>
        </div>

        <div className="space-y-6">
          <div className="bg-white dark:bg-[#09090B] border border-[#E5E7EB] dark:border-[#27272A] rounded-2xl p-6 shadow-sm hover:shadow-md transition-shadow">
            <h3 className="text-lg font-semibold text-[#111827] dark:text-[#F9FAFB] mb-4 flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-[#6366F1]/10 flex items-center justify-center">
                <Mail className="w-4 h-4 text-[#6366F1]" />
              </div>
              Email
            </h3>
            <p className="text-sm text-[#6B7280] dark:text-[#A1A1AA]">
              Escríbenos directamente a:
            </p>
            <a href="mailto:hola@flowos.com" className="text-sm font-medium text-[#6366F1] hover:underline mt-1 inline-block">
              hola@flowos.com
            </a>
          </div>

          <div className="bg-white dark:bg-[#09090B] border border-[#E5E7EB] dark:border-[#27272A] rounded-2xl p-6 shadow-sm hover:shadow-md transition-shadow">
            <h3 className="text-lg font-semibold text-[#111827] dark:text-[#F9FAFB] mb-4 flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-[#10B981]/10 flex items-center justify-center">
                <MessageSquare className="w-4 h-4 text-[#10B981]" />
              </div>
              Soporte
            </h3>
            <p className="text-sm text-[#6B7280] dark:text-[#A1A1AA]">
              Estamos disponibles de Lunes a Viernes, de 9am a 6pm (GMT-3).
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
