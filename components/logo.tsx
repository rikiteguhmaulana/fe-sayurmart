import Image from "next/image";
import React from "react";

interface LogoProps {
  className?: string;
  width?: number;
  height?: number;
}

export const Logo = ({ className = "", width = 50, height = 50 }: LogoProps) => {
  return (
    <div className={`relative ${className}`}>
      <Image
        src="/images/logo-sayurmart.png"
        alt="SayurMart Logo"
        width={width}
        height={height}
        className="object-contain"
      />
    </div>
  );
};
