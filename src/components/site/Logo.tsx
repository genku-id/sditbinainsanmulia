import { cn } from "@/lib/utils";

export function Logo({
  className,
  size = 48,
}: {
  className?: string;
  size?: number;
}) {
  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src="/logo.jpg"
      alt="Logo SDIT Bina Insan Mulia"
      width={size}
      height={size}
      className={cn("rounded-xl object-cover shadow-sm", className)}
    />
  );
}
