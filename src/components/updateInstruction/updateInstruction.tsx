import { Button, TextArea } from "@components/common";
import { CreateCompanyFormValues } from "@components/UpdateProfile/UpdateProfile";
import { ROUTE_LOGIN } from "@routes/constants";
import base64 from "@utils/helper";
import { useEffectAsync } from "@utils/react";
import { FormikProps } from "formik";
import { forwardRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { NavLink, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { LogoutIcon, MyProfileIcon, PasswordIcon } from "svg";
import { logout, selectUser } from "@redux/slices/userSlice";

interface InstructionProps {
  onClose: () => void;
  onOpen: () => void;
  onPasswordOpen: () => void;
  isPopupOpen: Boolean;
  isPasswordPopupOpen: Boolean;
  form: FormikProps<CreateCompanyFormValues>;
  onInstruction: () => void;
  uploadedImages?: any;
  setUploadedImages?: any;
  image?: any;
  setImage?: any;
  isInstruction?: Boolean;
}

const UpdateInstruction = forwardRef<HTMLDivElement, InstructionProps>(
  ({
    onClose,
    form,
    onOpen,
    onInstruction,
    onPasswordOpen,
    isPopupOpen,
    isPasswordPopupOpen,
    uploadedImages,
    isInstruction,
    setImage,
  }) => {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const user = useSelector(selectUser);

    useEffectAsync(async () => {
      if (uploadedImages && typeof uploadedImages == "object") {
        let base64String = await base64(uploadedImages);
        setImage({ file_base64: base64String, name: uploadedImages?.name });
      } else if (uploadedImages && typeof uploadedImages == "string") {
        setImage(uploadedImages);
      }
    }, [uploadedImages]);

    return (
      <div className="fixed inset-0 flex items-center justify-center bg-gray-900 bg-opacity-50 z-[99999999999999999999] ">
        <div className="bg-white rounded-lg shadow-lg w-[60%] p-4 ">
          <div className="flex justify-between items-center mb-2 border-b-2 pb-4">
            <h2 className="text-[#1B2559] font-semibold text-[24px] ">
              Settings
            </h2>
            <button onClick={onClose} className="text-gray-500 text-3xl">
              &times;
            </button>
          </div>
          <form onSubmit={form.handleSubmit}>
            <div className="flex">
              <div className="w-[20%] p-3 flex flex-col justify-between">
                <div>
                  <NavLink
                    onClick={onOpen}
                    className={`flex px-3 py-2 my-1  hover:bg-slate-200  items-center rounded-md text-[#1B2559] ${isPopupOpen ? "bg-[#F8FAFC]" : ""}`}
                    to={""}
                  >
                    <div className="w-8">
                      <MyProfileIcon />
                    </div>
                    <p className="text-[14px] font-medium">My Profile</p>
                  </NavLink>
                  <NavLink
                    onClick={onPasswordOpen}
                    className={`flex px-3 py-2 my-1  hover:bg-slate-200  items-center rounded-md text-[#1B2559]  ${isPasswordPopupOpen ? "bg-[#F8FAFC]" : ""}`}
                    to={""}
                  >
                    <div className="w-8">
                      <PasswordIcon />
                    </div>
                    <p className="text-[14px] font-medium">Password</p>
                  </NavLink>
                  <NavLink
                    onClick={onInstruction}
                    className={`flex px-3 py-2 my-1  hover:bg-slate-200  items-center rounded-md text-[#1B2559]  ${isInstruction ? "bg-[#F8FAFC]" : ""}`}
                    to={""}
                  >
                    <div className="w-8">
                      <PasswordIcon />
                    </div>
                    <p className="text-[14px] font-medium">Chat</p>
                  </NavLink>
                </div>
                <div className="">
                  <div
                    onClick={() => {
                      dispatch(logout());
                      toast?.success("Logout Successfull!");
                      navigate(ROUTE_LOGIN);
                    }}
                    className=" flex justify-start items-center text-[14px] px-4 gap-2 hover:bg-[#F4F5F9] h-[42px] font-Arimo font-normal text-base text-[#1B2559] rounded-lg cursor-pointer "
                  >
                    <LogoutIcon />
                    Log Out
                  </div>
                </div>
              </div>

              <div className="w-[80%] p-4 ">
                <div className="w-full flex gap-4">
                  <div className="w-1/2">
                    <TextArea
                      labelText="Company Info"
                      formik={form}
                      name="companyInfo"
                    />
                  </div>
                  <div className="w-1/2">
                    <TextArea
                      labelText="Chat PR Instruction"
                      formik={form}
                      name="PRchatInstruction"
                    />
                  </div>
                </div>
                <div className="w-full flex gap-4">
                  <div className="w-1/2">
                    <TextArea
                      labelText="Chat ECS Instruction"
                      formik={form}
                      name="ECSchatInstruction"
                    />
                  </div>
                  <div className="w-1/2">
                    <TextArea
                      labelText="Chat QnA Instruction"
                      formik={form}
                      name="QnAchatInstruction"
                    />
                  </div>
                </div>

                <div className="flex justify-end border-t-2">
                  <Button
                    disabled={
                      form?.isSubmitting ||
                      Boolean(
                        !form.dirty &&
                          user?.user_info?.CompanyLogo == uploadedImages,
                      )
                    }
                    className={`bg-[#1B2559] hover:bg-[#1B2559] rounded-xl mt-6 cursor-pointer font-PlusJakartaSans text-[14px] ${form?.isSubmitting || Boolean(!form.dirty && user?.user_info?.CompanyLogo == uploadedImages) ? "cursor-not-allowed" : ""}  `}
                    type="submit"
                  >
                    Update Instructions
                  </Button>
                </div>
              </div>
            </div>
          </form>
        </div>
      </div>
    );
  },
);

export default UpdateInstruction;
