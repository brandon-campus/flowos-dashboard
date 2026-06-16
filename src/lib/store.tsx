import { createContext, useContext, useState, useEffect, type ReactNode } from "react";
import { projects as initialProjects, type Project, type Task, type Note, type Priority } from "./mock-data";
import { supabase } from "./supabase";

type User = {
  name: string;
  email: string;
  onboarded: boolean;
};

export type Script = {
  id: string;
  title: string;
  content: string;
  lastEdited: string;
  accountId?: string; // Links to SocialAccount.id
};

export type InboxTask = {
  id: string;
  text: string;
  completed?: boolean;
  priority?: "hoy" | "mañana" | "esta_semana";
};

export type SocialDay = {
  date: string;
  videoCompleted: boolean;
  stories: number; // Max 2 generally, but can be more
};

export type SocialAccount = {
  id: string;
  name: string;
  icon: string;
  color: string;
  days: SocialDay[]; // Array of past 7 days including today
};

export type GoalPeriod = "semanal" | "mensual" | "trimestral";

export type Goal = {
  id: string;
  title: string;
  current: number;
  target: number;
  period: GoalPeriod;
  deadline?: string; // YYYY-MM-DD
  history?: { date: string, value: number }[]; // Daily log
  accountId?: string; // Optional link to a social account
  projectId?: string; // Optional link to a project
};

type StoreContextType = {
  user: User | null;
  logout: () => void;
  completeOnboarding: (role: string, projects: string[], startHour: number) => void;

  theme: "light" | "dark";
  toggleTheme: () => void;

  projects: Project[];
  inboxTasks: InboxTask[];
  scripts: Script[];
  socialAccounts: SocialAccount[];
  goals: Goal[];
  timeBlocks: Record<string, string>;
  startHour: number;
  activeFlow: { hour: string; text: string; minutes: number; startedAt: number } | null;
  
  // Mutations
  addProject: (project: Omit<Project, "id">) => void;
  updateProject: (id: string, updates: Partial<Project>) => void;
  addTask: (projectId: string, text: string) => void;
  toggleTaskCompletion: (projectId: string, taskId: string) => void;
  toggleProjectTaskPriority: (projectId: string, taskId: string) => void;
  addNote: (projectId: string, noteText: string) => void;

  addTaskToInbox: (text: string) => void;
  assignInboxTaskToProject: (taskId: string, projectId: string) => void;
  deleteInboxTask: (taskId: string) => void;
  toggleInboxTaskCompletion: (taskId: string) => void;
  toggleInboxTaskPriority: (taskId: string) => void;
  setInboxTaskPriority: (taskId: string, priority: "hoy" | undefined) => void;
  setProjectTaskPriority: (projectId: string, taskId: string, priority: "hoy" | undefined) => void;
  
  createScript: () => string; // returns id
  updateScript: (id: string, updates: Partial<Script>) => void;
  deleteScript: (id: string) => void;
  
  addSocialAccount: (name: string, icon: string, color: string) => void;
  logStory: (accountId: string, date: string) => void;
  toggleVideo: (accountId: string, date: string) => void;

  addGoal: (goal: Omit<Goal, "id" | "history">) => void;
  updateGoalProgress: (id: string, current: number) => void;
  deleteGoal: (id: string) => void;

  updateTimeBlock: (time: string, text: string) => void;

  startFlow: (hour: string, text: string, minutes: number) => void;
  endFlow: () => void;
};

const StoreContext = createContext<StoreContextType | null>(null);

const initialScripts: Script[] = [
  { id: "s1", title: "Idea de TikTok: Qué es Supabase", content: "Hola! Hoy te cuento por qué usamos Supabase...", lastEdited: "hoy", accountId: "tk-lab" },
  { id: "s2", title: "Video Labora: 3 errores en tu CV", content: "El primer error es...", lastEdited: "ayer", accountId: "ig-lab" }
];

const buildWeek = () => {
  const days: SocialDay[] = [];
  for (let i = 6; i >= 0; i--) {
    const d = new Date(Date.now() - i * 86400000).toISOString().split('T')[0];
    const isToday = i === 0;
    days.push({
      date: d,
      videoCompleted: isToday ? false : Math.random() > 0.3,
      stories: isToday ? 0 : Math.floor(Math.random() * 3),
    });
  }
  return days;
};

const initialSocial: SocialAccount[] = [
  { id: "ig-bc", name: "Instagram (Brandon)", icon: "instagram", color: "#EC4899", days: buildWeek() },
  { id: "ig-lab", name: "Instagram (Labora)", icon: "instagram", color: "#8B5CF6", days: buildWeek() },
  { id: "tk-lab", name: "TikTok (Labora)", icon: "video", color: "#111827", days: buildWeek() }
];

const initialInboxTasks: InboxTask[] = [
  { id: "i1", text: "Responder correo a potencial cliente" },
  { id: "i2", text: "Comprar luces para grabar" },
];

const initialGoals: Goal[] = [
  { 
    id: "g1", 
    title: "Llegar a 10K Seguidores en IG", 
    current: 8500, 
    target: 10000, 
    period: "mensual", 
    deadline: "2026-06-30",
    history: [{ date: "2026-06-15", value: 8400 }],
    accountId: "ig-lab" 
  },
  { 
    id: "g2", 
    title: "Subir 3 videos virales", 
    current: 1, 
    target: 3, 
    period: "semanal",
    deadline: "2026-06-21", 
    history: [],
    accountId: "tk-lab" 
  },
  { 
    id: "g3", 
    title: "Cerrar 5 clientes B2B", 
    current: 2, 
    target: 5, 
    period: "trimestral",
    deadline: "2026-09-30",
    history: []
  }
];

export function StoreProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [theme, setTheme] = useState<"light" | "dark">("light");
  const [projects, setProjects] = useState<Project[]>([]);
  const [inboxTasks, setInboxTasks] = useState<InboxTask[]>([]);
  const [scripts, setScripts] = useState<Script[]>(initialScripts);
  const [socialAccounts, setSocialAccounts] = useState<SocialAccount[]>([]);
  const [goals, setGoals] = useState<Goal[]>(initialGoals);
  const [timeBlocks, setTimeBlocks] = useState<Record<string, string>>({});
  const [startHour, setStartHour] = useState<number>(6);
  const [activeFlow, setActiveFlow] = useState<{ hour: string; text: string; minutes: number; startedAt: number } | null>(null);

  useEffect(() => {
    // Initial fetch
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session) {
        fetchProfile(session.user);
      } else {
        setUser(null);
      }
    });

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session) {
        fetchProfile(session.user);
      } else {
        setUser(null);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  const fetchProfile = async (authUser: any) => {
    const { data } = await supabase.from("profiles").select("*").eq("id", authUser.id).single();
    if (data) {
      setUser({
        name: data.full_name || authUser.email.split("@")[0],
        email: authUser.email,
        onboarded: data.onboarded
      });
      if (data.start_hour) setStartHour(data.start_hour);
      if (data.onboarded) {
        await fetchWorkspace(authUser.id);
      }
    } else {
      setUser({
        name: authUser.email.split("@")[0],
        email: authUser.email,
        onboarded: false
      });
    }
  };

  const fetchWorkspace = async (userId: string) => {
    const getLocalDateString = (d: Date) => {
      const year = d.getFullYear();
      const month = String(d.getMonth() + 1).padStart(2, '0');
      const day = String(d.getDate()).padStart(2, '0');
      return `${year}-${month}-${day}`;
    };

    const sevenDaysAgoDate = new Date(Date.now() - 7 * 86400000);
    const sevenDaysAgo = getLocalDateString(sevenDaysAgoDate);

    const [
      { data: dbProjects },
      { data: dbTasks },
      { data: dbNotes },
      { data: dbInbox },
      { data: dbTimeBlocks },
      { data: dbSocialAccounts },
      { data: dbSocialDays }
    ] = await Promise.all([
      supabase.from("projects").select("*").eq("user_id", userId),
      supabase.from("tasks").select("*").eq("user_id", userId),
      supabase.from("notes").select("*").eq("user_id", userId),
      supabase.from("inbox_tasks").select("*").eq("user_id", userId),
      supabase.from("time_blocks").select("*").eq("user_id", userId),
      supabase.from("social_accounts").select("*").eq("user_id", userId),
      supabase.from("social_days").select("*").eq("user_id", userId).gte("date_key", sevenDaysAgo)
    ]);

    if (dbProjects) {
      const assembled = dbProjects.map(p => ({
        id: p.id,
        name: p.name,
        area: p.area as any,
        color: p.color,
        status: p.status as any,
        summary: p.summary || "",
        summaryAgo: p.summary_ago || "recién",
        lastActivity: p.last_activity || "recién",
        contacts: p.contacts || [],
        tasks: (dbTasks || []).filter(t => t.project_id === p.id).map(t => ({
          id: t.id,
          text: t.text,
          completed: t.completed,
          priority: t.priority
        })),
        notes: (dbNotes || []).filter(n => n.project_id === p.id).map(n => ({
          id: n.id,
          text: n.text,
          ago: n.ago
        }))
      }));
      setProjects(assembled);
    }
    
    if (dbInbox) {
      setInboxTasks(dbInbox.map(i => ({ id: i.id, text: i.text, completed: i.completed, priority: i.priority })));
    }
    
    const tb: Record<string, string> = {};
    if (dbTimeBlocks) {
      dbTimeBlocks.forEach(t => tb[t.hour_key] = t.text);
    }
    setTimeBlocks(tb);

    if (dbSocialAccounts) {
      const assembledSocial = dbSocialAccounts.map(sa => {
        const days: SocialDay[] = [];
        for (let i = 6; i >= 0; i--) {
          const d = new Date(Date.now() - i * 86400000);
          const dateStr = getLocalDateString(d);
          const found = (dbSocialDays || []).find(sd => sd.account_id === sa.id && sd.date_key === dateStr);
          days.push({
            date: dateStr,
            videoCompleted: found?.video_completed || false,
            stories: found?.stories || 0
          });
        }
        return {
          id: sa.id,
          name: sa.name,
          icon: sa.icon,
          color: sa.color,
          days
        };
      });
      setSocialAccounts(assembledSocial);
    }
  };

  const logout = async () => {
    await supabase.auth.signOut();
    setUser(null);
  };

  const completeOnboarding = async (role: string, projectNames: string[], selectedStartHour: number) => {
    setUser(prev => prev ? { ...prev, onboarded: true } : prev);
    setStartHour(selectedStartHour);
    
    // Save to Supabase Profile
    const { data: { user: authUser } } = await supabase.auth.getUser();
    if (authUser) {
      await supabase.from("profiles").update({ 
        role, 
        start_hour: selectedStartHour, 
        onboarded: true 
      }).eq("id", authUser.id);
    }
    
    const colors = ["#6366F1", "#10B981", "#F59E0B"];
    const newProjectsData = projectNames.filter(n => n.trim() !== "").map((name, i) => ({
      user_id: authUser?.id,
      name: name.trim(),
      area: "personal",
      status: "activo",
      color: colors[i % colors.length],
      last_activity: "recién",
      summary: "Proyecto nuevo inicializado.",
      summary_ago: "recién"
    }));

    if (authUser && newProjectsData.length > 0) {
      const { data: insertedProjects } = await supabase.from("projects").insert(newProjectsData).select();
      if (insertedProjects) {
        const localProjects: Project[] = insertedProjects.map(p => ({
          id: p.id,
          name: p.name,
          area: p.area as any,
          status: p.status as any,
          color: p.color,
          lastActivity: p.last_activity || "recién",
          summary: p.summary || "",
          summaryAgo: p.summary_ago || "recién",
          tasks: [],
          notes: [],
          contacts: []
        }));
        setProjects(localProjects);
      }
    } else {
      setProjects([]);
    }
  };

  const toggleTheme = () => {
    setTheme(prev => prev === "light" ? "dark" : "light");
  };

  useEffect(() => {
    if (theme === "dark") {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, [theme]);

  const addProject = async (projectData: Omit<Project, "id">) => {
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) return;
    const tempId = `proj-temp-${Date.now()}`;
    setProjects(prev => [...prev, { ...projectData, id: tempId }]);
    
    const { data } = await supabase.from("projects").insert({
      user_id: session.user.id,
      name: projectData.name,
      area: projectData.area,
      color: projectData.color,
      status: projectData.status,
      summary: projectData.summary,
      summary_ago: projectData.summaryAgo,
      last_activity: projectData.lastActivity,
      contacts: projectData.contacts
    }).select().single();
    
    if (data) {
      setProjects(prev => prev.map(p => p.id === tempId ? { ...p, id: data.id } : p));
    }
  };

  const updateProject = async (id: string, updates: Partial<Project>) => {
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) return;
    
    setProjects(prev => prev.map(p => p.id === id ? { ...p, ...updates } : p));
    
    const dbUpdates: any = {};
    if (updates.name !== undefined) dbUpdates.name = updates.name;
    if (updates.area !== undefined) dbUpdates.area = updates.area;
    if (updates.color !== undefined) dbUpdates.color = updates.color;
    if (updates.status !== undefined) dbUpdates.status = updates.status;
    
    if (Object.keys(dbUpdates).length > 0 && !id.includes("temp")) {
      await supabase.from("projects").update(dbUpdates).eq("id", id);
    }
  };

  const addTask = async (projectId: string, text: string) => {
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) return;
    const tempId = `task-temp-${Date.now()}`;
    setProjects(prev => prev.map(p => p.id === projectId ? { ...p, tasks: [...p.tasks, { id: tempId, text, completed: false }] } : p));
    
    const { data } = await supabase.from("tasks").insert({
      user_id: session.user.id,
      project_id: projectId,
      text,
      completed: false
    }).select().single();
    
    if (data) {
      setProjects(prev => prev.map(p => p.id === projectId ? { ...p, tasks: p.tasks.map(t => t.id === tempId ? { ...t, id: data.id } : t) } : p));
    }
  };

  const toggleTaskCompletion = async (projectId: string, taskId: string) => {
    let newStatus = false;
    setProjects(prev => prev.map(p => {
      if (p.id !== projectId) return p;
      return {
        ...p,
        tasks: p.tasks.map(t => {
          if (t.id === taskId) {
            newStatus = !t.completed;
            return { ...t, completed: newStatus };
          }
          return t;
        })
      };
    }));
    if (!taskId.includes("temp")) await supabase.from("tasks").update({ completed: newStatus }).eq("id", taskId);
  };

  const toggleProjectTaskPriority = async (projectId: string, taskId: string) => {
    let newPriority: string | undefined = undefined;
    setProjects(prev => prev.map(p => {
      if (p.id !== projectId) return p;
      return {
        ...p,
        tasks: p.tasks.map(t => {
          if (t.id === taskId) {
            newPriority = t.priority === "hoy" ? undefined : "hoy";
            return { ...t, priority: newPriority as "hoy" | undefined };
          }
          return t;
        })
      };
    }));
    if (!taskId.includes("temp")) await supabase.from("tasks").update({ priority: newPriority || null }).eq("id", taskId);
  };

  const setProjectTaskPriority = async (projectId: string, taskId: string, priority: "hoy" | undefined) => {
    setProjects(prev => prev.map(p => {
      if (p.id !== projectId) return p;
      return {
        ...p,
        tasks: p.tasks.map(t => t.id === taskId ? { ...t, priority } : t)
      };
    }));
    if (!taskId.includes("temp")) await supabase.from("tasks").update({ priority: priority || null }).eq("id", taskId);
  };

  const addNote = async (projectId: string, noteText: string) => {
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) return;
    const tempId = `note-temp-${Date.now()}`;
    setProjects(prev => prev.map(p => p.id === projectId ? { ...p, notes: [{ id: tempId, text: noteText, ago: "recién" }, ...p.notes] } : p));
    
    const { data } = await supabase.from("notes").insert({
      user_id: session.user.id,
      project_id: projectId,
      text: noteText,
      ago: "recién"
    }).select().single();
    
    if (data) {
      setProjects(prev => prev.map(p => p.id === projectId ? { ...p, notes: p.notes.map(n => n.id === tempId ? { ...n, id: data.id } : n) } : p));
    }
  };

  const addTaskToInbox = async (text: string) => {
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) return;
    const tempId = `inbox-temp-${Date.now()}`;
    setInboxTasks(prev => [...prev, { id: tempId, text }]);
    
    const { data } = await supabase.from("inbox_tasks").insert({
      user_id: session.user.id,
      text,
      completed: false
    }).select().single();
    
    if (data) {
      setInboxTasks(prev => prev.map(t => t.id === tempId ? { ...t, id: data.id } : t));
    }
  };

  const assignInboxTaskToProject = async (taskId: string, projectId: string) => {
    const task = inboxTasks.find(t => t.id === taskId);
    if (!task) return;
    
    // Add to project locally and remotely
    addTask(projectId, task.text);
    
    // Delete from inbox locally and remotely
    deleteInboxTask(taskId);
  };

  const deleteInboxTask = async (taskId: string) => {
    setInboxTasks(prev => prev.filter(t => t.id !== taskId));
    if (!taskId.includes("temp")) await supabase.from("inbox_tasks").delete().eq("id", taskId);
  };

  const toggleInboxTaskCompletion = async (taskId: string) => {
    let newStatus = false;
    setInboxTasks(prev => prev.map(t => {
      if (t.id === taskId) {
        newStatus = !t.completed;
        return { ...t, completed: newStatus };
      }
      return t;
    }));
    if (!taskId.includes("temp")) await supabase.from("inbox_tasks").update({ completed: newStatus }).eq("id", taskId);
  };

  const toggleInboxTaskPriority = async (taskId: string) => {
    let newPriority: string | undefined = undefined;
    setInboxTasks(prev => prev.map(t => {
      if (t.id === taskId) {
        newPriority = t.priority === "hoy" ? undefined : "hoy";
        return { ...t, priority: newPriority as "hoy" | undefined };
      }
      return t;
    }));
    if (!taskId.includes("temp")) await supabase.from("inbox_tasks").update({ priority: newPriority || null }).eq("id", taskId);
  };

  const setInboxTaskPriority = async (taskId: string, priority: "hoy" | undefined) => {
    setInboxTasks(prev => prev.map(t => t.id === taskId ? { ...t, priority } : t));
    if (!taskId.includes("temp")) await supabase.from("inbox_tasks").update({ priority: priority || null }).eq("id", taskId);
  };

  const createScript = () => {
    const newScript: Script = { id: `script-${Date.now()}`, title: "Sin título", content: "", lastEdited: "ahora" };
    setScripts(prev => [newScript, ...prev]);
    return newScript.id;
  };

  const updateScript = (id: string, updates: Partial<Script>) => {
    setScripts(prev => prev.map(s => s.id === id ? { ...s, ...updates, lastEdited: "ahora" } : s));
  };

  const deleteScript = (id: string) => {
    setScripts(prev => prev.filter(s => s.id !== id));
  };

  const addSocialAccount = async (name: string, icon: string, color: string) => {
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) return;
    
    const { data, error } = await supabase.from("social_accounts").insert({
      user_id: session.user.id,
      name,
      icon,
      color
    }).select().single();

    if (data) {
      const getLocalDateString = (d: Date) => {
        const year = d.getFullYear();
        const month = String(d.getMonth() + 1).padStart(2, '0');
        const day = String(d.getDate()).padStart(2, '0');
        return `${year}-${month}-${day}`;
      };
      
      const days: SocialDay[] = [];
      for (let i = 6; i >= 0; i--) {
        const dStr = getLocalDateString(new Date(Date.now() - i * 86400000));
        days.push({ date: dStr, videoCompleted: false, stories: 0 });
      }
      setSocialAccounts(prev => [...prev, { id: data.id, name, icon, color, days }]);
    }
  };

  const logStory = async (accountId: string, date: string) => {
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) return;
    
    let currentStories = 0;
    setSocialAccounts(prev => prev.map(acc => {
      if (acc.id !== accountId) return acc;
      return { 
        ...acc, 
        days: acc.days.map(d => {
          if (d.date === date) {
            currentStories = d.stories + 1;
            return { ...d, stories: currentStories };
          }
          return d;
        })
      };
    }));

    const { data: existing } = await supabase.from("social_days").select("id").eq("account_id", accountId).eq("date_key", date).single();
    if (existing) {
      await supabase.from("social_days").update({ stories: currentStories }).eq("id", existing.id);
    } else {
      await supabase.from("social_days").insert({ 
        user_id: session.user.id, 
        account_id: accountId, 
        date_key: date, 
        stories: currentStories,
        video_completed: false
      });
    }
  };

  const toggleVideo = async (accountId: string, date: string) => {
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) return;

    let newStatus = false;
    setSocialAccounts(prev => prev.map(acc => {
      if (acc.id !== accountId) return acc;
      return { 
        ...acc, 
        days: acc.days.map(d => {
          if (d.date === date) {
            newStatus = !d.videoCompleted;
            return { ...d, videoCompleted: newStatus };
          }
          return d;
        })
      };
    }));

    const { data: existing } = await supabase.from("social_days").select("id").eq("account_id", accountId).eq("date_key", date).single();
    if (existing) {
      await supabase.from("social_days").update({ video_completed: newStatus }).eq("id", existing.id);
    } else {
      await supabase.from("social_days").insert({ 
        user_id: session.user.id, 
        account_id: accountId, 
        date_key: date, 
        video_completed: newStatus,
        stories: 0
      });
    }
  };

  const addGoal = (goal: Omit<Goal, "id" | "history">) => {
    setGoals(prev => [...prev, { ...goal, id: `goal-${Date.now()}`, history: [] }]);
  };

  const updateGoalProgress = (id: string, current: number) => {
    setGoals(prev => prev.map(g => {
      if (g.id !== id) return g;
      const today = new Date().toISOString().split('T')[0];
      const newHistory = [...(g.history || [])];
      
      // Update today's entry or add a new one
      const todayIndex = newHistory.findIndex(h => h.date === today);
      if (todayIndex >= 0) {
        newHistory[todayIndex].value = current;
      } else {
        newHistory.push({ date: today, value: current });
      }
      
      return { ...g, current, history: newHistory };
    }));
  };

  const deleteGoal = (id: string) => {
    setGoals(prev => prev.filter(g => g.id !== id));
  };

  const updateTimeBlock = async (time: string, text: string) => {
    setTimeBlocks(prev => ({ ...prev, [time]: text }));
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) return;
    
    // Upsert equivalent in Supabase
    const { data: existing } = await supabase.from("time_blocks").select("id").eq("user_id", session.user.id).eq("hour_key", time).single();
    if (existing) {
      await supabase.from("time_blocks").update({ text }).eq("id", existing.id);
    } else {
      await supabase.from("time_blocks").insert({ user_id: session.user.id, hour_key: time, text });
    }
  };

  const startFlow = (hour: string, text: string, minutes: number) => {
    setActiveFlow({ hour, text, minutes, startedAt: Date.now() });
  };

  const endFlow = () => {
    setActiveFlow(null);
  };

  return (
    <StoreContext.Provider value={{ 
      user, logout, completeOnboarding,
      theme, toggleTheme,
      projects, inboxTasks, addProject, updateProject, addTask, toggleTaskCompletion, toggleProjectTaskPriority, setProjectTaskPriority, addNote, 
      addTaskToInbox, assignInboxTaskToProject, deleteInboxTask, toggleInboxTaskCompletion, toggleInboxTaskPriority, setInboxTaskPriority,
      scripts, socialAccounts, createScript, updateScript, deleteScript, addSocialAccount, logStory, toggleVideo,
        goals, addGoal, updateGoalProgress, deleteGoal,
      timeBlocks, updateTimeBlock, startHour,
      activeFlow, startFlow, endFlow
    }}>
      {children}
    </StoreContext.Provider>
  );
}

export function useStore() {
  const context = useContext(StoreContext);
  if (!context) {
    throw new Error("useStore must be used within a StoreProvider");
  }
  return context;
}
