import * as React from "react";
import { cn } from "@/lib/utils";

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  error?: string;
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, error, ...props }, ref) => {
    // If 'value' is provided in props (even if undefined), ensure it doesn't 
    // transition to undefined to prevent the React controlled/uncontrolled warning.
    const isControlled = 'value' in props;
    const { value, ...rest } = props;
    const inputValue = isControlled ? (value ?? "") : undefined;

    return (
      <div className="w-full">
        <input
          type={type}
          className={cn(
            "flex h-10 w-full rounded-xl border border-black/5 dark:border-white/10 bg-slate-50/70 dark:bg-white/5 px-4 py-2 text-sm shadow-xs transition-all duration-200",
            "placeholder:text-slate-400 dark:placeholder:text-slate-500",
            "hover:bg-slate-100/50 dark:hover:bg-white/10",
            "focus-visible:outline-none focus-visible:border-violet-500/30 focus-visible:ring-4 focus-visible:ring-violet-500/10 focus-visible:bg-white dark:focus-visible:bg-slate-900",
            "disabled:cursor-not-allowed disabled:opacity-50",
            error && "border-destructive/50 focus-visible:ring-destructive/20 focus-visible:border-destructive/50",
            className
          )}
          ref={ref}
          {...rest}
          {...(isControlled ? { value: inputValue } : {})}
        />
        {error && <p className="mt-1 text-xs text-destructive">{error}</p>}
      </div>
    );
  }
);
Input.displayName = "Input";

export { Input };
