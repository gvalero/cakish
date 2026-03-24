import Image from "next/image";

type BrandLogoProps = {
  className?: string;
  priority?: boolean;
};

export function BrandLogo({ className, priority = false }: BrandLogoProps) {
  return (
    <Image
      src="/images/cakish-logo.png"
      alt="Cakish logo"
      width={220}
      height={220}
      priority={priority}
      className={className}
    />
  );
}
