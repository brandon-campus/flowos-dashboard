import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import {
  Outlet,
  Link,
  createRootRouteWithContext,
  useRouter,
  HeadContent,
  Scripts,
} from "@tanstack/react-router";
import { useEffect, type ReactNode } from "react";

import appCss from "../styles.css?url";
import { reportLovableError } from "../lib/lovable-error-reporting";
import { AppSidebar } from "@/components/app-sidebar";
import { QuickCaptureProvider } from "@/components/quick-capture";
import { Toaster } from "sonner";

function NotFoundComponent() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-[#FAFAFA] px-4">
      <div className="max-w-md text-center">
        <h1 className="text-7xl font-bold text-[#111827]">404</h1>
        <h2 className="mt-4 text-xl font-semibold text-[#111827]">Página no encontrada</h2>
        <p className="mt-2 text-sm text-[#6B7280]">Esta ruta no existe en FlowOS.</p>
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
    <div className="flex min-h-screen items-center justify-center bg-[#FAFAFA] px-4">
      <div className="max-w-md text-center">
        <h1 className="text-xl font-semibold text-[#111827]">Algo salió mal</h1>
        <p className="mt-2 text-sm text-[#6B7280]">Intentá de nuevo o volvé al inicio.</p>
        <div className="mt-6 flex flex-wrap justify-center gap-2">
          <button
            onClick={() => { router.invalidate(); reset(); }}
            className="rounded-md bg-[#6366F1] px-4 py-2 text-sm font-medium text-white hover:bg-[#4F46E5]"
          >
            Reintentar
          </button>
          <a href="/" className="rounded-md border border-[#E5E7EB] bg-white px-4 py-2 text-sm font-medium text-[#111827] hover:bg-[#F3F4F6]">
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
      <QuickCaptureProvider>
        <div className="min-h-screen flex flex-col md:flex-row bg-[#FAFAFA] text-[#111827] text-sm">
          <AppSidebar />
          <main className="flex-1 min-w-0">
            <Outlet />
          </main>
        </div>
        <Toaster position="bottom-right" />
      </QuickCaptureProvider>
    </QueryClientProvider>
  );
}
