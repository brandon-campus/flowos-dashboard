import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import {
  Outlet,
  Link,
  createRootRouteWithContext,
  useRouter,
  useRouterState,
  Navigate,
  HeadContent,
  Scripts,
} from "@tanstack/react-router";
import { useEffect, type ReactNode } from "react";

import appCss from "../styles.css?url";
import { reportLovableError } from "../lib/lovable-error-reporting";
import { AppSidebar } from "@/components/app-sidebar";
import { QuickCaptureProvider } from "@/components/quick-capture";
import { StoreProvider, useStore } from "@/lib/store";
import { Toaster } from "sonner";

function NotFoundComponent() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-[#FAFAFA] dark:bg-[#000000] px-4">
      <div className="max-w-md text-center">
        <h1 className="text-7xl font-bold text-[#111827] dark:text-white">404</h1>
        <h2 className="mt-4 text-xl font-semibold text-[#111827] dark:text-[#F9FAFB]">Página no encontrada</h2>
        <p className="mt-2 text-sm text-[#6B7280] dark:text-[#A1A1AA]">Esta ruta no existe en FlowOS.</p>
        <div className="mt-6">
          <Link to="/" className="inline-flex items-center justify-center rounded-md bg-[#6366F1] px-4 py-2 text-sm font-medium text-white hover:bg-[#4F46E5]">
            Ir al dashboard
          </Link>
        </div>
      </div>
    </div>
  );
}

function ErrorComponent({ error, reset }: { error: Error; reset: () => void }) {
  console.error(error);
  const router = useRouter();
  useEffect(() => {
    reportLovableError(error, { boundary: "tanstack_root_error_component" });
  }, [error]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-[#FAFAFA] dark:bg-[#000000] px-4">
      <div className="max-w-md text-center">
        <h1 className="text-xl font-semibold text-[#111827] dark:text-[#F9FAFB]">Algo salió mal</h1>
        <p className="mt-2 text-sm text-[#6B7280]">Intentá de nuevo o volvé al inicio.</p>
        <div className="mt-6 flex flex-wrap justify-center gap-2">
          <button
            onClick={() => { router.invalidate(); reset(); }}
            className="rounded-md bg-[#6366F1] px-4 py-2 text-sm font-medium text-white hover:bg-[#4F46E5]"
          >
            Reintentar
          </button>
          <a href="/" className="rounded-md border border-[#E5E7EB] dark:border-[#27272A] bg-white dark:bg-[#09090B] px-4 py-2 text-sm font-medium text-[#111827] dark:text-[#F9FAFB] hover:bg-[#F3F4F6] dark:hover:bg-[#27272A]">
            Ir al inicio
          </a>
        </div>
      </div>
    </div>
  );
}

export const Route = createRootRouteWithContext<{ queryClient: QueryClient }>()({
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      { title: "FlowOS — Tu sistema operativo personal" },
      { name: "description", content: "FlowOS no te dice qué hacer. Te recuerda en qué estabas." },
    ],
    links: [
      { rel: "stylesheet", href: appCss },
      { rel: "preconnect", href: "https://fonts.googleapis.com" },
      { rel: "preconnect", href: "https://fonts.gstatic.com", crossOrigin: "anonymous" },
      { rel: "stylesheet", href: "https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap" },
    ],
  }),
  shellComponent: RootShell,
  component: RootComponent,
  notFoundComponent: NotFoundComponent,
  errorComponent: ErrorComponent,
});

function RootShell({ children }: { children: ReactNode }) {
  return (
    <html lang="es">
      <head>
        <HeadContent />
      </head>
      <body style={{ fontFamily: "Inter, system-ui, sans-serif" }}>
        {children}
        <Scripts />
      </body>
    </html>
  );
}

function RootComponent() {
  const { queryClient } = Route.useRouteContext();

  return (
    <QueryClientProvider client={queryClient}>
      <StoreProvider>
        <AppLayout />
      </StoreProvider>
    </QueryClientProvider>
  );
}

function AppLayout() {
  const { user } = useStore();
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  
  if (!user) {
    if (pathname !== "/login" && pathname !== "/register") {
       return <Navigate to="/login" />;
    }
    return (
       <div className="min-h-screen bg-[#FAFAFA] dark:bg-[#000000] flex flex-col">
         <Outlet />
         <Toaster position="bottom-right" />
       </div>
    );
  }

  // If user exists but hasn't completed onboarding, force them there
  if (!user.onboarded && pathname !== "/onboarding") {
    return <Navigate to="/onboarding" />;
  }

  // If user has completed onboarding and tries to go to onboarding, send them home
  if (user.onboarded && pathname === "/onboarding") {
    return <Navigate to="/" />;
  }

  if (pathname === "/login" || pathname === "/register") {
    return <Navigate to="/" />;
  }

  const isFlowMode = pathname === "/flow";
  const isOnboarding = pathname === "/onboarding";

  return (
    <QuickCaptureProvider>
      <div className="flex flex-col md:flex-row h-screen bg-[#FAFAFA] dark:bg-[#000000] text-[#1A1A1A] dark:text-[#F9FAFB] font-sans overflow-hidden">
        {!isFlowMode && !isOnboarding && <AppSidebar />}
        <main className="flex-1 overflow-y-auto w-full md:w-auto">
          <Outlet />
        </main>
      </div>
      <Toaster position="bottom-right" />
    </QuickCaptureProvider>
  );
}
