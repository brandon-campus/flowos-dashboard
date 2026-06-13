import { useState } from "react";
import { MoreHorizontal } from "lucide-react";

export function TaskRow({ text, initialDone = false }: { text: string; initialDone?: boolean }) {
  const [done, setDone] = useState(initialDone);
  return (
    <div className="group flex items-center gap-3 py-1.5">
      <button
        onClick={() => setDone((d) => !d)}
        className={`w-4 h-4 rounded border flex items-center justify-center transition ${
          done ? "bg-[#10B981] border-[#10B981]" : "border-[#D1D5DB] hover:border-[#6366F1]"
        }`}
        aria-label="Toggle task"
      >
        {done && (
          <svg viewBox="0 0 16 16" className="w-3 h-3 text-white" fill="none" stroke="currentColor" strokeWidth="2.5">
            <path d="M3 8l3 3 7-7" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        )}
      </button>
      <span className={`flex-1 text-sm ${done ? "line-through text-[#9CA3AF]" : "text-[#111827]"}`}>
        {text}
      </span>
      <button className="opacity-0 group-hover:opacity-100 text-[#9CA3AF] hover:text-[#111827] transition">
        <MoreHorizontal className="w-4 h-4" />
      </button>
    </div>
  );
}
