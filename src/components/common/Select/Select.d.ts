import React from "react";
import { FormikProps } from "formik";
export interface SelectOption {
  value: string;
  label: string;
}
export interface MetaType {
  touched?: boolean;
  value?: string;
  error?: string;
}
export interface SelectProps<FormValues>
  extends React.SelectHTMLAttributes<HTMLSelectElement> {
  labelText?: string;
  className?: string;
  placeholder?: string;
  value?: string;
  labelClass?: string;
  options: SelectOption[];
  optionClass?: string;
  onChange?: (e: React.ChangeEvent<HTMLSelectElement>) => void;
  touched?: boolean;
  formik?: FormikProps<FormValues>;
  enumType?: object;
  valueKey?: string;
  labelKey?: string;
  required?: boolean;
  error?: string;
  name?: string;
}
declare function Select<FormValues>({
  labelText,
  className,
  labelClass,
  options,
  placeholder,
  optionClass,
  onChange,
  touched,
  name,
  formik,
  value,
  required,
  error,
  enumType,
  ...rest
}: SelectProps<FormValues>): import("react/jsx-runtime").JSX.Element;
export default Select;
