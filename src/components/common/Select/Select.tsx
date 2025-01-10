import React from "react";
import { FormikProps } from "formik";
import { cn } from "@utils/tailwind-merge-classes";
import styles from "./Select.module.css";
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
  value?: any;
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
  currentValue?: string;
}

function Select<FormValues>({
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
  currentValue,
  enumType,
  ...rest
}: SelectProps<FormValues>) {
  const selectBaseClasses = `d-block px-[16px] text-primaryBlue-200 bg-primaryBlue-500 py-[12px]  w-full font-lexend text-base  text-black-700  outline-0  border-primaryBlue-400	rounded-0  ${styles.CustomSelect} `;
  const labelBaseClass = `text-base text-white font-Arimo text-black-700 font-normal text-[16px] mb-[8px]`;
  const baseOptionClass = "font-Arimo font-normal text-sm bg-[#FFFFFF] ";

  if (formik && name) {
    /**
     * @type {import('formik').FieldMetaProps}
     */

    const meta: MetaType = formik.getFieldMeta(name);

    if (meta) {
      value = formik.values[name as keyof FormValues] || "";
      touched = meta.touched;
      error = meta.error;
    }

    onChange = onChange || formik.handleChange;
  }
  if (enumType && typeof enumType === "object") {
    options = Object.entries(enumType).map(([value]) => ({
      value: value,
      label: value,
    }));
  }
  if (currentValue) {
    value = currentValue;
  }

  //   else if (Array.isArray(options) && options.length > 0 && typeof options[0] === "string") {
  // 	options = options.map((v) => ({
  // 	  value: v,
  // 	  label: v,
  // 	}));
  //   }
  /**
   *
   * @param {React.ChangeEvent<HTMLSelectElement>} e
   */
  // function onChangeProxy(e: React.ChangeEvent<HTMLSelectElement>) {
  //   const { name, value } = e.target;

  //   if (!onChange) return;
  //   if (!value) {
  //     onChange({
  //       ...e,
  //       target: {
  //         ...e.target,
  //         name: name,
  //         value: "",
  //       },
  //     });
  //   } else onChange(e);
  // }

  const shouldDisplayError =
    (touched || (formik && formik.submitCount > 0)) &&
    error &&
    typeof error === "string";
  return (
    <div className=" w-full">
      <div className="flex flex-col justify-start align-middle w-full">
        {!!labelText && (
          <div>
            <label className={cn(labelBaseClass, labelClass)}>
              {labelText}
            </label>

            {required && <span className="text-red-500">*</span>}
          </div>
        )}
        <div className="relative w-full">
          <select
            value={value}
            onChange={onChange}
            name={name}
            className={cn(selectBaseClasses, className)}
            {...rest}
          >
            {placeholder && (
              <option
                value=""
                className="font-Arimo font-normal text-sm bg-[#FFFFFF] "
              >
                {placeholder}{" "}
              </option>
            )}
            {options?.map((option, index) => (
              <option
                key={index}
                value={option.value}
                className={cn(baseOptionClass, optionClass)}
              >
                {option.label}
              </option>
            ))}
          </select>
        </div>
      </div>
      {shouldDisplayError && (
        <p className="text-red-500 italic  mr-0 w-full text-sm  text-left  mx-2 mt-2">
          {error}
        </p>
      )}
    </div>
  );
}

export default Select;
