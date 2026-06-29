import * as React from "react";
import { cn } from "@/lib/utils";

type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: "default" | "secondary" | "outline" | "ghost" | "danger";
  size?: "sm" | "md" | "lg";
};

export function Button({ className, variant = "default", size = "md", ...props }: ButtonProps) {
  return (
    <button
      className={cn(
        "inline-flex items-center justify-center gap-2 rounded-md font-semibold transition disabled:pointer-events-none disabled:opacity-50",
        {
          default: "bg-slate-950 text-white hover:bg-slate-800",
          secondary: "bg-emerald-600 text-white hover:bg-emerald-700",
          outline: "border border-slate-200 bg-white text-slate-900 hover:bg-slate-50",
          ghost: "text-slate-700 hover:bg-slate-100",
          danger: "bg-rose-600 text-white hover:bg-rose-700",
        }[variant],
        { sm: "h-9 px-3 text-sm", md: "h-10 px-4 text-sm", lg: "h-12 px-6 text-base" }[size],
        className,
      )}
      {...props}
    />
  );
}
