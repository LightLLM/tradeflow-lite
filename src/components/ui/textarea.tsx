import * as React from "react";
import { cn } from "@/lib/utils";

export function Textarea({ className, ...props }: React.TextareaHTMLAttributes<HTMLTextAreaElement>) {
  return (
    <textarea
      className={cn(
        "min-h-24 w-full rounded-md border border-slate-200 bg-white px-3 py-2 text-sm text-slate-950 outline-none ring-emerald-500 transition placeholder:text-slate-400 focus:ring-2",
        className,
      )}
      {...props}
    />
  );
}
