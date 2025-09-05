import * as React from "react";

import { cn } from "@/lib/utils";

type TInitTextareaProps = React.ComponentProps<"textarea">;
type TTextareaProps = Omit<TInitTextareaProps, "onInput"> & { onInput: (x: string) => void };
const Textarea = React.forwardRef<HTMLTextAreaElement, TTextareaProps>(
  ({ className, onInput, ...props }, ref) => {
    return (
      <textarea
        className={cn(
          "flex min-h-[60px] w-full rounded-md border border-input bg-transparent px-3 py-2 text-base shadow-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 md:text-sm",
          className,
        )}
        ref={ref}
        onInput={(e) => {
          const value = (e.target as unknown as { value: string }).value;
          onInput(value);
        }}
        {...props}
      />
    );
  },
);
Textarea.displayName = "Textarea";

export { Textarea };
