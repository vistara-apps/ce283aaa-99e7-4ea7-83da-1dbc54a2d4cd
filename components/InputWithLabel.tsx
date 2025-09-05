'use client';

import { forwardRef } from 'react';
import { US_STATES } from '@/lib/constants';

interface InputWithLabelProps {
  label: string;
  variant: 'text' | 'tel' | 'select';
  placeholder?: string;
  value?: string;
  onChange?: (value: string) => void;
  options?: { value: string; label: string }[];
  required?: boolean;
  error?: string;
}

export const InputWithLabel = forwardRef<
  HTMLInputElement | HTMLSelectElement,
  InputWithLabelProps
>(({ label, variant, placeholder, value, onChange, options, required, error }, ref) => {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    onChange?.(e.target.value);
  };

  return (
    <div className="space-y-2">
      <label className="block text-sm font-medium text-text-primary">
        {label}
        {required && <span className="text-red-400 ml-1">*</span>}
      </label>
      
      {variant === 'select' ? (
        <select
          ref={ref as React.Ref<HTMLSelectElement>}
          value={value}
          onChange={handleChange}
          className="input-field w-full"
          required={required}
        >
          <option value="">{placeholder || 'Select an option'}</option>
          {options?.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      ) : (
        <input
          ref={ref as React.Ref<HTMLInputElement>}
          type={variant}
          value={value}
          onChange={handleChange}
          placeholder={placeholder}
          className="input-field w-full"
          required={required}
        />
      )}
      
      {error && (
        <p className="text-sm text-red-400">{error}</p>
      )}
    </div>
  );
});

InputWithLabel.displayName = 'InputWithLabel';

// Pre-configured state selector
export function StateSelector({ value, onChange, required }: {
  value?: string;
  onChange?: (value: string) => void;
  required?: boolean;
}) {
  return (
    <InputWithLabel
      label="Select Your State"
      variant="select"
      placeholder="Choose your state"
      value={value}
      onChange={onChange}
      required={required}
      options={US_STATES.map(state => ({
        value: state.code,
        label: state.name
      }))}
    />
  );
}
