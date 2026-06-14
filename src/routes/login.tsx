import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { Hexagon } from "lucide-react";
import { supabase } from "@/lib/supabase";
import { toast } from "sonner";

export const Route = createFileRoute("/login")({
  head: () => ({ meta: [{ title: "Iniciar sesión — FlowOS" }] }),
  component: Login,
});

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      toast.error("Por favor completá todos los campos");
      return;
    }
    setLoading(true);
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    setLoading(false);
    
    if (error) {
      toast.error(error.message);
      return;
    }
    
    toast.success("¡Bienvenido a FlowOS!");
    navigate({ to: "/" });
  };

  return (
    <div className="flex min-h-screen items-center justify-center px-4 py-12 bg-[#FAFAFA] dark:bg-[#000000]">
      <div className="w-full max-w-[400px]">
        <div className="text-center mb-8">
          <div className="mx-auto w-12 h-12 bg-[#111827] dark:bg-[#18181B] border border-transparent dark:border-[#27272A] rounded-xl flex items-center justify-center mb-4">
            <Hexagon className="w-6 h-6 text-[#6366F1]" />
          </div>
          <h1 className="text-2xl font-bold text-[#111827] dark:text-[#F9FAFB]">Bienvenido de vuelta</h1>
          <p className="text-sm text-[#6B7280] dark:text-[#A1A1AA] mt-2">Iniciá sesión para continuar a FlowOS</p>
        </div>

        <div className="bg-white dark:bg-[#09090B] px-8 py-8 shadow-sm border border-[#E5E7EB] dark:border-[#27272A] rounded-2xl">
          <form onSubmit={handleLogin} className="space-y-5">
            <div>
              <label className="block text-sm font-medium text-[#374151] dark:text-[#D1D5DB] mb-1.5">
                Correo electrónico
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="brandon@labora.ar"
                className="w-full px-3 py-2 text-sm border border-[#E5E7EB] dark:border-[#27272A] bg-transparent text-[#111827] dark:text-[#F9FAFB] rounded-lg focus:outline-none focus:border-[#6366F1] focus:ring-1 focus:ring-[#6366F1]"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-[#374151] dark:text-[#D1D5DB] mb-1.5">
                Contraseña
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full px-3 py-2 text-sm border border-[#E5E7EB] dark:border-[#27272A] bg-transparent text-[#111827] dark:text-[#F9FAFB] rounded-lg focus:outline-none focus:border-[#6366F1] focus:ring-1 focus:ring-[#6366F1]"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-2.5 px-4 text-sm font-medium text-white bg-[#111827] dark:bg-white dark:text-black rounded-lg hover:bg-[#1F2937] dark:hover:bg-gray-200 transition disabled:opacity-50"
            >
              {loading ? "Iniciando..." : "Iniciar sesión"}
            </button>
          </form>

          <div className="mt-6 text-center text-sm text-[#6B7280] dark:text-[#A1A1AA]">
            ¿No tenés una cuenta?{" "}
            <Link to="/register" className="font-medium text-[#6366F1] hover:underline">
              Registrate acá
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
