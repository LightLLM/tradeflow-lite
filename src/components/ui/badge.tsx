import * as React from "react";
import { cn } from "@/lib/utils";

export function Badge({
  className,
  tone = "slate",
  ...props
}: React.HTMLAttributes<HTMLSpanElement> & { tone?: "slate" | "green" | "amber" | "red" | "blue" }) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-semibold",
        {
          slate: "bg-slate-100 text-slate-700",
          green: "bg-emerald-100 text-emerald-800",
          amber: "bg-amber-100 text-amber-800",
          red: "bg-rose-100 text-rose-800",
          blue: "bg-blue-100 text-blue-800",
        }[tone],
        className,
      )}
      {...props}
    />
  );
}
