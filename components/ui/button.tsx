import * as React from 'react';
import { Slot } from '@radix-ui/react-slot';
import { cva, type VariantProps } from 'class-variance-authority';

import { cn } from '@/lib/utils';

const buttonVariants = cva(
  'inline-flex items-center justify-center whitespace-nowrap rounded-xl text-sm font-medium transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-pink-500 disabled:pointer-events-none disabled:opacity-50 hover:scale-[1.02] active:scale-[0.98]',
  {
    variants: {
      variant: {
        default: 'bg-pink-500 text-white hover:bg-pink-600 shadow-lg hover:shadow-xl',
        outline: 'border border-zinc-800 text-zinc-100 hover:bg-zinc-900/50 hover:border-zinc-700',
        ghost: 'text-zinc-100 hover:bg-zinc-900/50',
        link: 'text-pink-500 underline-offset-4 hover:underline',
        glass: 'bg-zinc-900/50 backdrop-blur-sm border border-zinc-800/50 text-zinc-100 hover:bg-zinc-900/70',
      },
      size: {
        default: 'h-10 px-4 py-2',
        sm: 'h-8 rounded-lg px-3 text-xs',
        lg: 'h-12 rounded-xl px-8 text-base',
        icon: 'h-10 w-10',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'default',
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
    const Comp = asChild ? Slot : 'button';
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    );
  },
);
Button.displayName = 'Button';

export { Button, buttonVariants };
