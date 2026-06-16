import { Link, useRouterState } from "@tanstack/react-router";
import { Home, FolderKanban, Inbox, Settings, Search, Hexagon, User, FileText, Smartphone, Target, CalendarDays, Mail } from "lucide-react";
import { activeProjects } from "@/lib/mock-data";
import { useQuickCapture } from "./quick-capture";
import { useState } from "react";
import { Menu, X, LogOut, Moon, Sun, Plus } from "lucide-react";
import { useStore } from "@/lib/store";

function NavItem({
  to,
  icon: Icon,
  label,
  badge,
  exact,
}: {
  to: string;
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  badge?: string | number;
  exact?: boolean;
}) {
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const active = exact ? pathname === to : pathname === to || pathname.startsWith(to + "/");
  return (
    <Link
      to={to}
      className={`flex items-center gap-2.5 px-2.5 py-1.5 rounded-md text-sm transition ${
        active ? "bg-[#1C1C1E] text-white" : "text-[#A1A1AA] hover:text-white hover:bg-[#18181B]"
      }`}
    >
      <Icon className="w-4 h-4 shrink-0" />
      <span className="flex-1 truncate">{label}</span>
      {badge != null && (
        <span className="text-[11px] px-1.5 py-0.5 rounded bg-[#27272A] text-[#A1A1AA]">{badge}</span>
      )}
    </Link>
  );
}

export function AppSidebar() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const { open } = useQuickCapture();
  const { user, logout, theme, toggleTheme } = useStore();
  const pathname = useRouterState({ select: (s) => s.location.pathname });

  const sidebar = (
    <aside className="w-[240px] bg-[#0F0F0F] border-r border-[#1F1F1F] flex flex-col h-screen sticky top-0 shrink-0">
      <div className="px-4 py-4 flex items-center justify-between">
        <div className="flex items-center gap-2 text-white font-semibold">
          <Hexagon className="w-4 h-4 text-[#6366F1]" />
          <span>FlowOS</span>
        </div>
        <button className="md:hidden text-[#A1A1AA]" onClick={() => setMobileOpen(false)}>
          <X className="w-4 h-4" />
        </button>
      </div>

      <div className="px-3 pb-3">
        <button
          onClick={open}
          className="w-full flex items-center gap-2 px-2.5 py-1.5 rounded-md bg-[#18181B] border border-[#27272A] text-xs text-[#A1A1AA] hover:border-[#3F3F46]"
        >
          <Search className="w-3.5 h-3.5" />
          <span className="flex-1 text-left">Buscar...</span>
          <kbd className="text-[10px] px-1 py-0.5 rounded bg-[#27272A] border border-[#3F3F46]">⌘K</kbd>
        </button>
      </div>

      <nav className="px-3 space-y-0.5">
        <NavItem to="/" icon={Home} label="Dashboard" exact />
        <NavItem to="/plan" icon={CalendarDays} label="Planificar Día" />
        <NavItem to="/goals" icon={Target} label="Metas y KPIs" />
        <NavItem to="/projects" icon={FolderKanban} label="Proyectos" />
        <NavItem to="/inbox" icon={Inbox} label="Inbox" badge={2} />
      </nav>

      <div className="mt-5 px-3">
        <div className="text-[10px] uppercase tracking-wider text-[#52525B] px-2.5 mb-1.5">
          Contenido
        </div>
        <nav className="space-y-0.5">
          <NavItem to="/social" icon={Smartphone} label="Redes Sociales" />
          <NavItem to="/scripts" icon={FileText} label="Guiones" />
          <NavItem to="/contact" icon={Mail} label="Contacto" />
        </nav>
      </div>

      <div className="mt-5 px-3">
        <div className="text-[10px] uppercase tracking-wider text-[#52525B] px-2.5 mb-1.5">
          Proyectos activos
        </div>
        <div className="space-y-0.5">
          {activeProjects.map((p) => {
            const to = `/projects/${p.id}`;
            const active = pathname === to;
            return (
              <Link
                key={p.id}
                to="/projects/$projectId"
                params={{ projectId: p.id }}
                className={`flex items-center gap-2.5 px-2.5 py-1.5 rounded-md text-sm transition ${
                  active ? "bg-[#1C1C1E] text-white" : "text-[#A1A1AA] hover:text-white hover:bg-[#18181B]"
                }`}
              >
                <span className="w-2 h-2 rounded-full shrink-0" style={{ backgroundColor: p.color }} />
                <span className="truncate">{p.name}</span>
              </Link>
            );
          })}
        </div>
      </div>

      <div className="mt-auto px-3 pb-4">
        <div className="border-t border-[#1F1F1F] my-3" />
        <NavItem to="/settings" icon={Settings} label="Configuración" />
        <div className="mt-2 flex items-center justify-between px-2.5 py-1.5 text-sm text-[#A1A1AA]">
          <div className="flex items-center gap-2 min-w-0">
            <div className="w-6 h-6 rounded-full bg-[#27272A] grid place-items-center shrink-0 text-xs font-medium text-white uppercase">
              {user?.name?.[0] || <User className="w-3.5 h-3.5" />}
            </div>
            <span className="truncate">{user?.name}</span>
          </div>
          <div className="flex items-center gap-1">
            <button onClick={toggleTheme} className="p-1 hover:text-white rounded-md hover:bg-[#18181B] transition" title="Cambiar tema">
              {theme === "dark" ? <Sun className="w-3.5 h-3.5" /> : <Moon className="w-3.5 h-3.5" />}
            </button>
            <button onClick={logout} className="p-1 hover:text-white rounded-md hover:bg-[#18181B] transition" title="Cerrar sesión">
              <LogOut className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>
    </aside>
  );

  return (
    <>
      {/* Mobile header (Title only) */}
      <div className="md:hidden sticky top-0 z-30 flex items-center justify-center px-4 py-3 bg-[#0F0F0F] border-b border-[#1F1F1F]">
        <div className="flex items-center gap-2 text-white font-semibold text-sm">
          <Hexagon className="w-4 h-4 text-[#6366F1]" />
          FlowOS
        </div>
      </div>

      {/* Mobile Bottom Nav */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 z-30 bg-white dark:bg-[#0F0F0F] border-t border-[#E5E7EB] dark:border-[#1F1F1F] pb-safe">
        <div className="flex items-center justify-around h-16 px-2">
          <Link to="/" className={`flex flex-col items-center justify-center w-full gap-1 ${pathname === '/' ? 'text-[#6366F1]' : 'text-[#6B7280] dark:text-[#A1A1AA]'}`}>
            <Home className="w-5 h-5" />
            <span className="text-[10px] font-medium">Inicio</span>
          </Link>
          <Link to="/plan" className={`flex flex-col items-center justify-center w-full gap-1 ${pathname === '/plan' ? 'text-[#6366F1]' : 'text-[#6B7280] dark:text-[#A1A1AA]'}`}>
            <Sun className="w-5 h-5" />
            <span className="text-[10px] font-medium">Mi Día</span>
          </Link>
          <div className="relative -top-5">
            <button onClick={open} className="flex items-center justify-center w-14 h-14 bg-[#6366F1] text-white rounded-full shadow-lg shadow-[#6366F1]/30 border-4 border-[#FAFAFA] dark:border-[#000000] hover:scale-105 transition-transform" aria-label="Nueva Tarea">
              <Plus className="w-7 h-7" />
            </button>
          </div>
          <Link to="/scripts" className={`flex flex-col items-center justify-center w-full gap-1 ${pathname === '/scripts' || pathname.startsWith('/scripts/') ? 'text-[#6366F1]' : 'text-[#6B7280] dark:text-[#A1A1AA]'}`}>
            <FileText className="w-5 h-5" />
            <span className="text-[10px] font-medium">Guiones</span>
          </Link>
          <button onClick={() => setMobileOpen(true)} className="flex flex-col items-center justify-center w-full gap-1 text-[#6B7280] dark:text-[#A1A1AA]">
            <Menu className="w-5 h-5" />
            <span className="text-[10px] font-medium">Más</span>
          </button>
        </div>
      </div>

      {/* Desktop sidebar */}
      <div className="hidden md:block">{sidebar}</div>

      {/* Mobile drawer */}
      {mobileOpen && (
        <div className="md:hidden fixed inset-0 z-40 flex" onClick={() => setMobileOpen(false)}>
          <div onClick={(e) => e.stopPropagation()}>{sidebar}</div>
          <div className="flex-1 bg-black/40" />
        </div>
      )}
    </>
  );
}
