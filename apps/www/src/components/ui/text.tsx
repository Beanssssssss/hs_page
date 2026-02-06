import * as React from 'react';
import { cn } from '@/lib/utils';

interface TextProps extends React.HTMLAttributes<HTMLElement> {
  variant?: 'small' | 'medium' | 'large' | 'heading1' | 'heading2' | 'heading3' | 'heading4' | 'heading5' | 'heading6' | 'heading1Jumbo';
  as?: 'p' | 'span' | 'div' | 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6';
}

const textVariants = {
  small: 'text-xs sm:text-sm font-normal leading-[1.7em] tracking-[-0.02em]',
  medium: 'text-base sm:text-lg font-normal leading-[1.4em] tracking-[-0.02em]',
  large: 'text-base sm:text-lg lg:text-xl font-normal leading-[1.7em] tracking-[-0.02em]',
  heading1: 'text-4xl sm:text-5xl md:text-6xl lg:text-7xl xl:text-[80px] font-black leading-[1em] tracking-[0em]',
  heading2: 'text-2xl sm:text-3xl md:text-4xl font-extrabold leading-[1em] tracking-[0em]',
  heading3: 'text-2xl sm:text-3xl md:text-4xl font-semibold leading-[1.2em] tracking-[-0.04em]',
  heading4: 'text-xl sm:text-2xl md:text-3xl font-semibold leading-[1.5em] tracking-[-0.02em]',
  heading5: 'text-lg sm:text-xl md:text-2xl lg:text-[28px] font-normal leading-[1.1em] tracking-[-0.04em]',
  heading6: 'text-base sm:text-lg lg:text-[22px] font-normal leading-[1.1em] tracking-[-0.02em]',
  heading1Jumbo: 'text-4xl sm:text-5xl md:text-7xl lg:text-8xl xl:text-[110px] font-black leading-[1em] tracking-[0em]',
};

const fontFamilies = {
  small: 'font-inter',
  medium: 'font-inter',
  large: 'font-inter',
  heading1: 'font-pretendard',
  heading2: 'font-pretendard',
  heading3: 'font-inter display',
  heading4: 'font-inter display',
  heading5: 'font-inter display',
  heading6: 'font-inter display',
  heading1Jumbo: 'font-pretendard',
};

export const Text = React.forwardRef<HTMLElement, TextProps>(
  ({ className, variant = 'medium', as: Component = 'p', ...props }, ref) => {
    return React.createElement(Component, {
      className: cn(
        textVariants[variant],
        fontFamilies[variant],
        className
      ),
      ref,
      ...props,
    });
  }
);

Text.displayName = 'Text';

