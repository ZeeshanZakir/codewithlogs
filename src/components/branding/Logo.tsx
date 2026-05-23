import Image from "next/image";
import Link from "next/link";

import { cn } from "@/lib/utils";

type LogoProps = {
  className?: string;
  imageClassName?: string;
  href?: string;
  priority?: boolean;
};

export function Logo({
  className,
  imageClassName,
  href = "/",
  priority = false,
}: LogoProps) {
  const image = (
    <Image
      src="/images/codewithlogs-logo.png"
      alt="CodeWithLogs"
      width={1024}
      height={224}
      priority={priority}
      className={cn("h-auto w-full", imageClassName)}
    />
  );

  if (!href) {
    return <div className={className}>{image}</div>;
  }

  return (
    <Link href={href} className={className} aria-label="CodeWithLogs home">
      {image}
    </Link>
  );
}
