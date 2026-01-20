import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center whitespace-nowrap font-medium transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50",
  {
    variants: {
      variant: {
        default: "bg-primary text-primary-foreground hover:bg-primary/90 rounded-full",
        cta: "bg-black text-white hover:bg-gray-800 rounded-full",
        purple: "bg-purple-600 text-white hover:bg-purple-700 rounded-full shadow-lg",
        dark: "text-white rounded-[30px] shadow-[0_3px_14px_0px_rgba(16,16,17,0.6)] border border-[#101011]",
        primary: "text-white rounded-[30px] shadow-[0_6px_20px_0px_rgba(82,53,239,0.6)] border border-[#5235ef]",
      },
      size: {
        default: "h-10 px-6 py-2 text-sm",
        sm: "h-9 px-4 text-sm",
        lg: "h-11 px-8 text-sm",
        icon: "h-10 w-10",
        darkSmall: "py-[10px] px-5 gap-[10px] text-[14px] tracking-[-0.02em]",
        primary: "pt-3 pr-[10px] pb-3 pl-7 gap-[10px]",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  },
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button";
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    );
  },
);
Button.displayName = "Button";

export { Button, buttonVariants };
