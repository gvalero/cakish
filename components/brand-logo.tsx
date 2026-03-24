import Image from "next/image";
import { assetPath } from "@/lib/asset-path";

type BrandLogoProps = {
  className?: string;
  priority?: boolean;
};

export function BrandLogo({ className, priority = false }: BrandLogoProps) {
  return (
    <Image
      src={assetPath("/images/cakish-logo.png")}
      alt="Cakish logo"
      width={220}
      height={220}
      priority={priority}
      className={className}
    />
  );
}
