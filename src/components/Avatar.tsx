import { cn } from "@/lib/utils";

interface AvatarProps {
  src?: string;
  name: string;
  size?: "sm" | "md" | "lg" | "xl";
  online?: boolean;
  className?: string;
}

const sizeMap = {
  sm: "w-6 h-6 text-[10px]",
  md: "w-8 h-8 text-xs",
  lg: "w-10 h-10 text-sm",
  xl: "w-14 h-14 text-base",
};

export function Avatar({ src, name, size = "md", online, className }: AvatarProps) {
  const initials = name?.slice(0, 2).toUpperCase() || "?";
  return (
    <div className={cn("relative inline-flex shrink-0", className)}>
      {src ? (
        <img
          src={src}
          alt={name}
          className={cn(
            "rounded-lg object-cover border border-black/5 dark:border-white/10 shadow-sm",
            sizeMap[size]
          )}
        />
      ) : (
        <div
          className={cn(
            "rounded-lg flex items-center justify-center font-bold bg-[#FF4D02] text-white border border-black/5 dark:border-white/10 shadow-sm",
            sizeMap[size]
          )}
        >
          {initials}
        </div>
      )}
      {online !== undefined && (
        <span
          className={cn(
            "absolute -bottom-0.5 -right-0.5 rounded-full border-2",
            online ? "bg-emerald-500 border-white dark:border-[#15171C]" : "bg-zinc-400 border-white dark:border-[#15171C]"
          )}
          style={{ width: "30%", height: "30%" }}
        />
      )}
    </div>
  );
}
