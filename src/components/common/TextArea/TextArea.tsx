import React from "react";
import { FormikProps } from "formik";
import { cn } from "@utils/tailwind-merge-classes";

export interface textAreaProps<FormValues>
  extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  labelText?: string;
  className?: string;
  labelClass?: string;
  formik?: FormikProps<FormValues>;
  name?: string;
  hideErrors?: boolean | (() => boolean);
  required?: boolean;
  touched?: boolean;
  error?: string;
  value?: any;
  onChange?: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
}

function TextArea<FormValues>({
  labelText,
  className,
  formik,
  touched,
  error,
  value,
  onChange,
  name,
  hideErrors,
  labelClass,
  ...rest
}: textAreaProps<FormValues>) {
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
  const textAreaBaseClasses = `border border-gray-300  w-full   resize-none h-48 rounded-xl focus:outline-none p-4`;
  const labelBaseClass = `text-[#1F1F1F] font-normal text-base leading-6  font-sans font-PlusJakartaSans `;

  const shouldDisplayError =
    (touched || (formik && formik.submitCount > 0)) &&
    error &&
    typeof error === "string" &&
    !hideErrors;
  return (
    <div className="mb-[20px] w-full ">
      <div className="flex flex-col justify-start align-middle w-full">
        {!!labelText && (
          <label className={cn(labelBaseClass, labelClass)}>{labelText}</label>
        )}

        <div className="relative w-full">
          <textarea
            value={value}
            className={cn(textAreaBaseClasses, className)}
            onChange={onChange}
            name={name}
            {...rest}
          />
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

export default TextArea;
