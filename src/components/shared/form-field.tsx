import * as React from "react";
import { cn } from "@/lib/utils";
import { Label } from "@/components/ui/label";

interface FormFieldProps {
  label: string;
  htmlFor?: string | undefined;
  error?: string | undefined;
  hint?: string | undefined;
  required?: boolean | undefined;
  children: React.ReactNode;
  className?: string | undefined;
}

export function FormField({
  label,
  htmlFor,
  error,
  hint,
  required,
  children,
  className,
}: FormFieldProps) {
  return (
    <div className={cn("space-y-1.5", className)}>
      <Label htmlFor={htmlFor}>
        {label}
        {required && <span className="ml-0.5 text-destructive">*</span>}
      </Label>
      {children}
      {hint && !error && <p className="text-xs text-muted-foreground">{hint}</p>}
      {error && <p className="text-xs text-destructive">{error}</p>}
    </div>
  );
}

// Convenience wrapper that auto-shows react-hook-form errors
interface ControlledFormFieldProps extends Omit<FormFieldProps, "error"> {
  error?: { message?: string | undefined } | undefined;
}

export function Field({ error, ...props }: ControlledFormFieldProps) {
  return <FormField {...props} error={error?.message} />;
}
