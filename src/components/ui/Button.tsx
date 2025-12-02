"use client";

import { forwardRef, type ButtonHTMLAttributes } from "react";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "ghost";
  size?: "sm" | "md" | "lg";
}

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    { children, variant = "primary", size = "md", className = "", ...props },
    ref
  ) => {
    const baseStyles =
      "inline-flex items-center justify-center font-semibold rounded-full transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-[#0B1014] focus:ring-[#00E5E0] disabled:opacity-50 disabled:cursor-not-allowed hover:scale-[1.02] active:scale-[0.98]";

    const variants = {
      primary:
        "bg-[#00E5E0] text-[#0B1014] hover:bg-[#C3FDFC] active:bg-[#00CCC8] shadow-[0_0_20px_#00E5E080]",
      secondary:
        "bg-[#0B1014]/80 backdrop-blur-sm text-white border border-[#00E5E0]/30 hover:border-[#00E5E0] hover:shadow-[0_0_15px_#00E5E040]",
      ghost: "text-[#00E5E0] hover:bg-[#00E5E0]/10 hover:shadow-[0_0_10px_#00E5E020]",
    };

    const sizes = {
      sm: "px-4 py-1.5 text-sm",
      md: "px-6 py-2.5 text-base",
      lg: "px-8 py-3.5 text-lg",
    };

    return (
      <button
        ref={ref}
        className={`${baseStyles} ${variants[variant]} ${sizes[size]} ${className}`}
        {...props}
      >
        {children}
      </button>
    );
  }
);

Button.displayName = "Button";

export default Button;
