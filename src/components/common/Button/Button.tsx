import React, { ReactNode } from "react";
import { cn } from "../../../shared/utils/tailwind-merge-classes";

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: ReactNode;
  variant?:
    | "primary"
    | "secondary"
    | "success"
    | "danger"
    | "outline"
    | undefined;
  fullWidth?: boolean;
  parentClass?: string;
  // type?: "submit" | "reset" | "button" | undefined;
  className?: string;
  disabled?: boolean;
}

const Button: React.FC<ButtonProps> = ({
  variant,
  children,
  fullWidth,
  className,
  type,
  disabled,
  ...rest
}) => {
  let variantClasses = "";

  switch (variant) {
    case "primary":
      variantClasses = `bg-primaryOrange-500 hover:bg-primaryOrange-600 transition text-white`;
      break;
    case "secondary":
      variantClasses =
        "bg-gray-100 !text-[#9C9CAB] border border-[#E3E3E8] hover:bg-gray-200";
      break;
    case "success":
      variantClasses = "bg-[#11CF8B] hover:bg-green-500";
      break;
    case "danger":
      variantClasses = "bg-[#FB3766] hover:bg-red-500";
      break;
    case "outline":
      variantClasses = "bg-white  border border-purple-200 text-gray-600";
      break;
    default:
      variantClasses = "bg-blue-500 hover:bg-blue-700 ";
  }

  const buttonBaseClasses = `py-[14px] px-6 rounded-lg font-medium font-lexend gap-2 flex items-center justify-center text-white ${disabled ? "bg-gray-300 cursor-not-allowed" : variantClasses} ${fullWidth && "w-full"}`;
  return (
    <button
      disabled={disabled}
      type={type}
      className={cn(buttonBaseClasses, className)}
      {...rest}
    >
      {children}
    </button>
  );
};

export default Button;
