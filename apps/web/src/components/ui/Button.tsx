import type { ComponentPropsWithoutRef } from 'react';

import { cn } from '@/lib/utils';

export type ButtonVariant = 'rosa' | 'cereza' | 'paper' | 'quiet' | 'azul';

const base =
  'inline-flex min-h-[46px] items-center justify-center gap-2 rounded-pill px-6 text-[0.95rem] font-medium no-underline transition duration-300 ease-out-soft hover:-translate-y-0.5 hover:scale-[1.02] active:scale-[0.98]';

const variants: Record<ButtonVariant, string> = {
  rosa: 'bg-rosa text-ink shadow-lift',
  cereza: 'bg-cereza text-white',
  paper: 'bg-paper text-ink',
  quiet: 'text-ink shadow-[inset_0_0_0_1.5px_var(--color-ink)]',
  azul: 'bg-azul text-white',
};

export const buttonClass = (variant: ButtonVariant = 'rosa', className?: string) =>
  cn(base, variants[variant], className);

type ButtonProps = ComponentPropsWithoutRef<'button'> & { variant?: ButtonVariant };

export function Button({ variant = 'rosa', className, type = 'button', ...props }: ButtonProps) {
  return <button type={type} className={buttonClass(variant, className)} {...props} />;
}

type ButtonLinkProps = ComponentPropsWithoutRef<'a'> & { variant?: ButtonVariant };

export function ButtonLink({ variant = 'rosa', className, ...props }: ButtonLinkProps) {
  // eslint-disable-next-line jsx-a11y/anchor-has-content -- el contenido llega por `children`
  return <a className={buttonClass(variant, className)} {...props} />;
}
