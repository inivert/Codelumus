import { cn } from "@/lib/utils";

interface ShellProps extends React.HTMLAttributes<HTMLDivElement> {}

export function Shell({ children, className, ...props }: ShellProps) {
  return (
    <div
      className={cn(
        "container flex h-screen w-screen flex-col items-center justify-center",
        className
      )}
      {...props}
    >
      <div className="mx-auto flex w-full flex-col justify-center space-y-6">
        {children}
      </div>
    </div>
  );
} 