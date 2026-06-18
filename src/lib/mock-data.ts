export type Area = "trabajo" | "cliente" | "personal" | "comunidad";
export type Status = "activo" | "pausado" | "cerrado";
export type Priority = "hoy" | "mañana" | "esta_semana" | "esta semana" | "algún día";

export interface Task {
  id: string;
  text: string;
  priority?: Priority;
  completed?: boolean;
  completedAgo?: string;
  plannedDate?: string;
}

export interface Note {
  id: string;
  ago: string;
  text: string;
}

export interface Contact {
  name: string;
  role: string;
  channel: string;
}

export interface Project {
  id: string;
  name: string;
  area: Area;
  color: string;
  status: Status;
  lastActivity: string;
  tasks: Task[];
  notes: Note[];
  contacts: Contact[];
  summary: string;
  summaryAgo: string;
}

export const projects: Project[] = [
  {
    id: "academia-labora",
    name: "Academia Labora",
    area: "trabajo",
    color: "#6366F1",
    status: "activo",
    lastActivity: "hace 1 día",
    summaryAgo: "hace 8 minutos",
    summary:
      "El proyecto está activo con el Cohorte #16 en curso. Las prioridades inmediatas son grabar el TikTok de Supabase RLS (José está esperando la señal) y dar seguimiento a los 3 leads de Briggit que aún no convirtieron. La próxima clase es el jueves — preparar el ejercicio práctico de RLS que quedó pendiente del martes.",
    tasks: [
      { id: "al-1", text: "Grabar TikTok — tema: Supabase RLS", priority: "hoy" },
      { id: "al-2", text: "Responder leads de Briggit en WhatsApp", priority: "hoy" },
      { id: "al-3", text: "Preparar clase del jueves (Cohorte #16)", priority: "esta semana" },
      { id: "al-4", text: "Revisar propuesta para cliente nuevo", priority: "esta semana" },
      { id: "al-5", text: "Rediseñar la página de ventas del bootcamp", priority: "algún día" },
      { id: "al-6", text: "Confirmar horario Cohorte #16", priority: "hoy", completed: true, completedAgo: "completada hace 2 días" },
      { id: "al-7", text: "Enviar factura a Servasa", priority: "hoy", completed: true, completedAgo: "completada hace 4 días" },
    ],
    notes: [
      { id: "n1", ago: "hace 1 día", text: "Quedó pendiente conectar Supabase en la clase del martes. Los alumnos tienen dudas con RLS — preparar ejercicio práctico." },
      { id: "n2", ago: "hace 3 días", text: "Briggit reportó 3 leads nuevos de la campaña de Facebook. Ninguno completó el pago todavía." },
      { id: "n3", ago: "hace 5 días", text: "La clase del jueves fue muy bien. El tema de n8n generó mucho interés — considerar módulo extra." },
    ],
    contacts: [
      { name: "José", role: "Edición y contenido", channel: "WhatsApp" },
      { name: "Briggit", role: "Ventas", channel: "WhatsApp" },
    ],
  },
  {
    id: "ditobanx",
    name: "Ditobanx",
    area: "cliente",
    color: "#10B981",
    status: "activo",
    lastActivity: "hace 3 horas",
    summaryAgo: "hace 12 minutos",
    summary:
      "El proyecto avanza hacia la arquitectura V2. La reunión con Raúl de hoy es clave para definir los endpoints. Guillermo está esperando los mockups para aprobar el diseño antes de fin de semana.",
    tasks: [
      { id: "d-1", text: "Reunión con Raúl — revisión arquitectura V2", priority: "hoy" },
      { id: "d-2", text: "Documentar endpoints del módulo de recompensas", priority: "esta semana" },
      { id: "d-3", text: "Revisar mockups con Guillermo", priority: "esta semana" },
    ],
    notes: [],
    contacts: [
      { name: "Guillermo Contreras", role: "CEO", channel: "Slack" },
      { name: "Raúl", role: "Tech lead", channel: "Slack" },
    ],
  },
  {
    id: "fju-proyecto-medios",
    name: "FJU Proyecto Medios",
    area: "comunidad",
    color: "#F59E0B",
    status: "activo",
    lastActivity: "hace 2 días",
    summaryAgo: "hace 1 hora",
    summary:
      "El retiro terminó con buen material para editar. La prioridad esta semana es el video resumen. Pendiente coordinar con Unife el calendario de contenido del próximo trimestre.",
    tasks: [
      { id: "f-1", text: "Editar video resumen del retiro", priority: "esta semana" },
      { id: "f-2", text: "Armar calendario de contenido para Unife", priority: "algún día" },
    ],
    notes: [],
    contacts: [],
  },
  {
    id: "club-del-laburo",
    name: "Club del Laburo",
    area: "trabajo",
    color: "#8B5CF6",
    status: "activo",
    lastActivity: "hace 4 días",
    summaryAgo: "hace 2 horas",
    summary:
      "Comunidad activa con buen engagement. Falta definir el próximo evento mensual y renovar la landing.",
    tasks: [],
    notes: [],
    contacts: [],
  },
  {
    id: "rediseno-labora-ar",
    name: "Rediseño labora.ar",
    area: "personal",
    color: "#EF4444",
    status: "pausado",
    lastActivity: "hace 3 semanas",
    summaryAgo: "hace 3 semanas",
    summary: "En pausa hasta cerrar Cohorte #16.",
    tasks: [],
    notes: [],
    contacts: [],
  },
];

export const inboxTasks = [
  { id: "i-1", text: "Llamar al contador sobre el monotributo" },
  { id: "i-2", text: "Revisar contrato de Jordi" },
];

export const activeProjects = projects.filter((p) => p.status === "activo");

export const getProject = (id: string) => projects.find((p) => p.id === id);

export const areaLabel: Record<Area, string> = {
  trabajo: "trabajo",
  cliente: "cliente",
  personal: "personal",
  comunidad: "comunidad",
};
