import type { HTMLAttributes } from "react";
import { cn } from "@repo/ui/lib/utils";

type ThreadProps = HTMLAttributes<HTMLDivElement>;

export const Thread = ({ children, className, ...props }: ThreadProps) => (
  <div
    className={cn(
      "flex flex-1 flex-col items-start gap-4 overflow-y-auto p-8 pb-0",
      className
    )}
    {...props}
  >
    {children}
  </div>
);
