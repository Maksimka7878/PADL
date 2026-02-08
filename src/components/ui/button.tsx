import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center whitespace-nowrap rounded-2xl text-sm font-bold ring-offset-background transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-lime/50 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-40 active:scale-[0.97]",
  {
    variants: {
      variant: {
        default: "bg-lime text-black hover:bg-lime-dark hover:shadow-[0_0_30px_#BFFF0030] hover:scale-[1.02]",
        destructive: "bg-hot-pink text-white hover:bg-hot-pink/80 hover:shadow-[0_0_30px_#FF2D7B30]",
        outline: "border border-white/10 bg-transparent hover:bg-white/5 hover:border-white/20 text-white/70 hover:text-white",
        secondary: "bg-surface-2 text-white/50 hover:bg-surface-3 hover:text-white/70",
        ghost: "hover:bg-white/5 text-white/60 hover:text-white",
        link: "text-lime underline-offset-4 hover:underline",
        violet: "bg-violet text-white hover:bg-violet-dark hover:shadow-[0_0_30px_#8B5CF630]",
      },
      size: {
        default: "h-11 px-6 py-2",
        sm: "h-9 rounded-xl px-4 text-xs",
        lg: "h-13 rounded-2xl px-10 text-base",
        icon: "h-10 w-10 rounded-xl",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
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
  }
);
Button.displayName = "Button";

export { Button, buttonVariants };
