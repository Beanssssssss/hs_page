import * as React from 'react';
import { cn } from '@/lib/utils';

interface TextProps extends React.HTMLAttributes<HTMLElement> {
  variant?: 'small' | 'medium' | 'large' | 'heading1' | 'heading3' | 'heading4' | 'heading5' | 'heading6' | 'heading1Jumbo';
  as?: 'p' | 'span' | 'div' | 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6';
}

const textVariants = {
  small: 'text-[14px] font-normal leading-[1.4em] tracking-[-0.02em]',
  medium: 'text-[18px] font-normal leading-[1.4em] tracking-[-0.02em]',
  large: 'text-[20px] font-normal leading-[1.7em] tracking-[-0.02em]',
  heading1: 'text-[80px] font-black leading-[1em] tracking-[0em]',
  heading3: 'text-[40px] font-semibold leading-[1.2em] tracking-[-0.04em]',
  heading4: 'text-[32px] font-semibold leading-[1.5em] tracking-[-0.02em]',
  heading5: 'text-[28px] font-normal leading-[1.1em] tracking-[-0.04em]',
  heading6: 'text-[22px] font-normal leading-[1.1em] tracking-[-0.02em]',
  heading1Jumbo: 'text-[110px] font-black leading-[1em] tracking-[0em]',
};

const fontFamilies = {
  small: 'font-inter',
  medium: 'font-pretendard',
  large: 'font-pretendard',
  heading1: 'font-pretendard',
  heading3: 'font-pretendard',
  heading4: 'font-pretendard',
  heading5: 'font-pretendard',
  heading6: 'font-pretendard',
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

