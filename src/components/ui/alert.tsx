import * as React from "react";
import { cn } from "@/lib/utils";

export function Alert({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn("rounded-lg border border-amber-200 bg-amber-50 p-3 text-sm text-amber-900", className)}
      {...props}
    />
  );
}
