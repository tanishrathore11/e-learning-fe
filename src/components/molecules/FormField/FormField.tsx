import React from 'react';
import Input from '../../atoms/Input/Input';

interface FormFieldProps {
  label: string;
  id: string;
  error?: string;
  children?: React.ReactNode;
}

interface InputFormFieldProps extends FormFieldProps {
  inputProps: React.InputHTMLAttributes<HTMLInputElement>;
  children?: never;
}

interface SelectFormFieldProps extends FormFieldProps {
  children: React.ReactNode;
  inputProps?: never;
}

type Props = InputFormFieldProps | SelectFormFieldProps;

const FormField: React.FC<Props> = ({ label, id, error, inputProps, children }) => {
  return (
    <div className="flex flex-col gap-1">
      <label htmlFor={id} className="text-sm font-medium text-gray-700">
        {label}
      </label>
      {children ? (
        <select
          id={id}
          className={`w-full px-3 py-2 border rounded-lg text-sm bg-white text-gray-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-colors ${
            error ? 'border-red-400' : 'border-gray-300'
          }`}
        >
          {children}
        </select>
      ) : (
        <Input id={id} error={error} {...inputProps} />
      )}
      {error && <p className="text-xs text-red-500">{error}</p>}
    </div>
  );
};

export default FormField;
