import { useId, type ComponentPropsWithoutRef, type ReactNode } from 'react';

import { cn } from '@/lib/utils';

type BaseProps = {
  label: string;
  optional?: boolean;
  /** Campo obligatorio: agrega el asterisco visible y aria-required. */
  required?: boolean;
  error?: string;
  hint?: ReactNode;
};

const control =
  'min-h-12 w-full rounded-[14px] border-[1.5px] bg-white px-3.5 py-3 text-base font-normal text-ink transition focus:border-azul focus:outline-none focus:ring-4 focus:ring-azul/20';

/** Asterisco de obligatorio. Decorativo: el lector de pantalla lo oye por aria-required. */
export function RequiredMark() {
  return (
    <span aria-hidden="true" className="ml-0.5 text-cereza-ink">
      *
    </span>
  );
}

function FieldShell({
  id,
  label,
  optional,
  required,
  error,
  children,
}: BaseProps & { id: string; children: ReactNode }) {
  return (
    <div className="mb-3.5">
      <label htmlFor={id} className="mb-1.5 block text-[0.85rem] font-medium">
        {label}
        {required && <RequiredMark />}
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
  required,
  error,
  className,
  ...props
}: BaseProps & Omit<ComponentPropsWithoutRef<'input'>, 'id' | 'required'>) {
  const id = useId();
  return (
    <FieldShell id={id} label={label} optional={optional} required={required} error={error}>
      <input
        id={id}
        aria-required={required || undefined}
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
  required,
  error,
  className,
  ...props
}: BaseProps & Omit<ComponentPropsWithoutRef<'textarea'>, 'id' | 'required'>) {
  const id = useId();
  return (
    <FieldShell id={id} label={label} optional={optional} required={required} error={error}>
      <textarea
        id={id}
        aria-required={required || undefined}
        aria-invalid={!!error}
        aria-describedby={error ? `${id}-error` : undefined}
        className={cn(control, 'min-h-28 resize-y', borderFor(error), className)}
        {...props}
      />
    </FieldShell>
  );
}

type ChoiceGroupProps = {
  label: string;
  options: readonly string[];
  value: string;
  onChange: (value: string) => void;
};

/**
 * Elegir una opción entre varias, como pastillas (mismo lenguaje visual que los filtros de
 * la colección). Son radios reales: se navega con las flechas y el lector de pantalla
 * anuncia el grupo y la opción elegida. Sustituye al desplegable nativo.
 */
export function ChoiceGroup({ label, options, value, onChange }: ChoiceGroupProps) {
  const name = useId();
  return (
    <fieldset className="mb-4 min-w-0">
      <legend className="mb-2 block text-[0.85rem] font-medium">{label}</legend>
      <div className="flex flex-wrap gap-2">
        {options.map((option) => {
          const checked = option === value;
          return (
            <label key={option} className="relative cursor-pointer">
              <input
                type="radio"
                name={name}
                value={option}
                checked={checked}
                onChange={() => onChange(option)}
                className="peer sr-only"
              />
              <span
                className={cn(
                  'inline-flex min-h-11 items-center rounded-pill px-4 text-[0.9rem] font-normal transition duration-300 ease-out-soft',
                  'peer-focus-visible:outline peer-focus-visible:outline-[3px] peer-focus-visible:outline-offset-2 peer-focus-visible:outline-azul',
                  checked
                    ? 'bg-ink text-paper'
                    : 'shadow-[inset_0_0_0_1.5px_rgb(43_31_38_/_0.25)] hover:shadow-[inset_0_0_0_1.5px_var(--color-ink)]',
                )}
              >
                {option}
              </span>
            </label>
          );
        })}
      </div>
    </fieldset>
  );
}
