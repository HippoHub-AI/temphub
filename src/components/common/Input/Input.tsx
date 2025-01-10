import React from "react";
import { FormikProps } from "formik";
import { cn } from "../../../shared/utils/tailwind-merge-classes";

export interface inputProps<FormValues>
  extends React.InputHTMLAttributes<HTMLInputElement> {
  labelText?: string;
  icon?: React.ReactNode;
  className?: string;
  labelClass?: string;
  wrapperClass?: string;
  required?: boolean;
  touched?: boolean;
  type?: string;
  topMostWrapper?: string;
  formik?: FormikProps<FormValues>;
  value?: any;
  // handleBlur?: (e: React.FocusEvent<HTMLInputElement>) => void;
  error?: string;
  name?: string;
  hideErrors?: boolean | (() => boolean);
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

function Input<FormValues>({
  labelText,
  icon,
  className,
  labelClass,
  wrapperClass,
  touched,
  error,
  name,
  value,
  hideErrors,
  type,
  required,
  formik,
  topMostWrapper,

  onChange,
  ...rest
}: inputProps<FormValues>) {
  if (formik) {
    /**
     * @type {import('formik').FieldMetaProps}
     */
    let meta;
    if (name) {
      meta = formik.getFieldMeta(name);
    }

    /* The code block `if (!!meta) { touched = meta.touched; error = meta.error; }` is checking if the
		`meta` object exists and then assigning the values of `meta.touched` and `meta.error` to the
		variables `touched` and `error` respectively. */
    if (meta) {
      value = formik.values[name as keyof FormValues] || "";
      touched = meta.touched;
      error = meta.error;
    }
    onChange = onChange || formik.handleChange;
    // handleBlur = handleBlur || formik.handleBlur;
  }

  const inputBaseClasses = `d-block  text-primaryBlue-200 bg-primaryBlue-500 py-[12px] w-full font-lexend text-base  text-black-700  outline-0 	font-PlusJakartaSans focus-visible:outline-none`;
  const labelBaseClass = `text-[#1F1F1F] font-normal text-base leading-6 mb-2 font-sans font-PlusJakartaSans`;
  const baseWrapperClass = `flex items-center w-full px-4  text-[#8B8B8B] font-normal text-base leading-6 border border-gray-300 rounded-xl focus:outline-none bg-white font-PlusJakartaSans `;

  const shouldDisplayError =
    (touched || (formik && formik.submitCount > 0)) &&
    error &&
    typeof error === "string" &&
    !hideErrors;
  return (
    <div className={`mb-[20px] w-full ${topMostWrapper} `}>
      <div className="flex flex-col justify-start align-middle w-full">
        {!!labelText && (
          <div>
            <label className={cn(labelBaseClass, labelClass)}>
              {labelText}
            </label>

            {required && <span className="text-red-500">*</span>}
          </div>
        )}
        <div className={cn(baseWrapperClass, wrapperClass)}>
          <input
            className={cn(inputBaseClasses, className)}
            type={type}
            name={name}
            value={value}
            onChange={onChange}
            {...rest}
          />
          {icon && <div>{icon}</div>}
        </div>
      </div>
      {shouldDisplayError && (
        <p className="text-red-500 italic  mr-0 w-full text-sm  text-left mt-2 mx-2">
          {error}
        </p>
      )}
    </div>
  );
}

export default Input;
