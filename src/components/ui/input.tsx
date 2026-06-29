import * as React from "react";
import { cn } from "@/lib/utils";

export function Input({ className, ...props }: React.InputHTMLAttributes<HTMLInputElement>) {
  return (
    <input
      className={cn(
        "h-10 w-full rounded-md border border-slate-200 bg-white px-3 text-sm text-slate-950 outline-none ring-emerald-500 transition placeholder:text-slate-400 focus:ring-2",
        className,
      )}
      {...props}
    />
  );
}
