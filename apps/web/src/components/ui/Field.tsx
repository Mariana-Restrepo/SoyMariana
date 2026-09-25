import { useId, type ComponentPropsWithoutRef, type ReactNode } from 'react';

import { cn } from '@/lib/utils';

type BaseProps = {
  label: string;
  optional?: boolean;
  error?: string;
  hint?: ReactNode;
};

const control =
  'min-h-12 w-full rounded-[14px] border-[1.5px] bg-white px-3.5 py-3 text-base font-normal text-ink transition focus:border-azul focus:outline-none focus:ring-4 focus:ring-azul/20';

function FieldShell({
  id,
  label,
  optional,
  error,
  children,
}: BaseProps & { id: string; children: ReactNode }) {
  return (
    <div className="mb-3.5">
      <label htmlFor={id} className="mb-1.5 block text-[0.85rem] font-medium">
        {label}
        {optional && <span className="font-light text-ink-soft"> (opcional)</span>}
      </label>
      {children}
      {error && (
        <p id={`${id}-error`} role="alert" className="mt-1 text-[0.82rem] text-cereza-ink">
          {error}
        </p>
      )}
    </div>
  );
}

const borderFor = (error?: string) => (error ? 'border-cereza' : 'border-ink/20');

export function InputField({
  label,
  optional,
  error,
  className,
  ...props
}: BaseProps & Omit<ComponentPropsWithoutRef<'input'>, 'id'>) {
  const id = useId();
  return (
    <FieldShell id={id} label={label} optional={optional} error={error}>
      <input
        id={id}
        aria-invalid={!!error}
        aria-describedby={error ? `${id}-error` : undefined}
        className={cn(control, borderFor(error), className)}
        {...props}
      />
    </FieldShell>
  );
}

export function TextareaField({
  label,
  optional,
  error,
  className,
  ...props
}: BaseProps & Omit<ComponentPropsWithoutRef<'textarea'>, 'id'>) {
  const id = useId();
  return (
    <FieldShell id={id} label={label} optional={optional} error={error}>
      <textarea
        id={id}
        aria-invalid={!!error}
        aria-describedby={error ? `${id}-error` : undefined}
        className={cn(control, 'min-h-28 resize-y', borderFor(error), className)}
        {...props}
      />
    </FieldShell>
  );
}

export function SelectField({
  label,
  optional,
  error,
  options,
  className,
  ...props
}: BaseProps & Omit<ComponentPropsWithoutRef<'select'>, 'id'> & { options: readonly string[] }) {
  const id = useId();
  return (
    <FieldShell id={id} label={label} optional={optional} error={error}>
      <select
        id={id}
        aria-invalid={!!error}
        className={cn(control, borderFor(error), className)}
        {...props}
      >
        {options.map((option) => (
          <option key={option} value={option}>
            {option}
          </option>
        ))}
      </select>
    </FieldShell>
  );
}
