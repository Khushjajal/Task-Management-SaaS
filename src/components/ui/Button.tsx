import { cn } from "@/lib/utils";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "ghost" | "danger";
  size?: "sm" | "md" | "lg";
  isLoading?: boolean;
}

export function Button({
  children,
  variant = "primary",
  size = "md",
  isLoading,
  className,
  ...props
}: ButtonProps) {
  return (
    <button
      className={cn(
        "inline-flex items-center justify-center rounded-xl font-medium transition-all duration-200",
        "focus:outline-none focus:ring-2 focus:ring-[#FF4D02]/40",
        "disabled:opacity-50 disabled:cursor-not-allowed",
        size === "sm" && "px-3 py-1.5 text-sm",
        size === "md" && "px-4 py-2.5 text-sm",
        size === "lg" && "px-6 py-3 text-base",
        variant === "primary" &&
          "bg-[#FF4D02] text-white shadow-lg shadow-[#FF4D02]/25 hover:-translate-y-0.5 hover:shadow-xl hover:shadow-[#FF4D02]/30",
        variant === "secondary" &&
          "bg-zinc-900 text-white dark:bg-white dark:text-zinc-900 hover:-translate-y-0.5",
        variant === "ghost" &&
          "bg-transparent text-zinc-600 dark:text-zinc-300 hover:bg-black/5 dark:hover:bg-white/10",
        variant === "danger" &&
          "bg-red-500 text-white shadow-lg shadow-red-500/20 hover:-translate-y-0.5",
        className
      )}
      {...props}
    >
      {isLoading ? (
        <span className="mr-2 inline-block h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
      ) : null}
      {children}
    </button>
  );
}
