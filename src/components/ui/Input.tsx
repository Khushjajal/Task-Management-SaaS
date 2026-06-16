import { cn } from "@/lib/utils";

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {}

export function Input({ className, ...props }: InputProps) {
  return (
    <input
      className={cn(
        "w-full rounded-xl border bg-transparent px-4 py-2.5 text-sm transition-colors",
        "placeholder:text-zinc-400 dark:placeholder:text-zinc-500",
        "border-zinc-200 dark:border-white/10",
        "focus:border-[#FF4D02] focus:outline-none focus:ring-2 focus:ring-[#FF4D02]/20",
        "text-zinc-900 dark:text-zinc-100",
        className
      )}
      {...props}
    />
  );
}

interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {}

export function Select({ className, children, ...props }: SelectProps) {
  return (
    <select
      className={cn(
        "w-full rounded-xl border bg-transparent px-4 py-2.5 text-sm transition-colors",
        "border-zinc-200 dark:border-white/10",
        "focus:border-[#FF4D02] focus:outline-none focus:ring-2 focus:ring-[#FF4D02]/20",
        "text-zinc-900 dark:text-zinc-100",
        "[&:not(:focus)]:bg-transparent dark:[&:not(:focus)]:bg-transparent",
        className
      )}
      {...props}
    >
      {children}
    </select>
  );
}

interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {}

export function Textarea({ className, ...props }: TextareaProps) {
  return (
    <textarea
      className={cn(
        "w-full rounded-xl border bg-transparent px-4 py-2.5 text-sm transition-colors resize-none",
        "placeholder:text-zinc-400 dark:placeholder:text-zinc-500",
        "border-zinc-200 dark:border-white/10",
        "focus:border-[#FF4D02] focus:outline-none focus:ring-2 focus:ring-[#FF4D02]/20",
        "text-zinc-900 dark:text-zinc-100",
        className
      )}
      {...props}
    />
  );
}
