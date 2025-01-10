import { Button, Input } from "@components/common";
import { forwardRef } from "react";
import { FormikProps } from "formik";
import { NavLink, useNavigate } from "react-router-dom";
import { LogoutIcon, MyProfileIcon, PasswordIcon } from "svg";
import { logout } from "@redux/slices/userSlice";
import { ROUTE_LOGIN } from "@routes/constants";
import { toast } from "react-toastify";
import { useDispatch } from "react-redux";

import { VerifyUserDto } from "@dto/verifyUser.dto";

interface CreateProps {
  onClose: () => void;
  onOpen: () => void;
  onPasswordOpen: () => void;
  onInstruction: () => void;
  isPopupOpen: Boolean;
  isPasswordPopupOpen: Boolean;
  form: FormikProps<VerifyUserDto>;
  isInstruction?: Boolean;
}

const UpdatePassword = forwardRef<HTMLDivElement, CreateProps>(
  ({
    onClose,
    form,
    onPasswordOpen,
    onOpen,
    isInstruction,
    isPopupOpen,
    isPasswordPopupOpen,
    onInstruction,
  }) => {
    const navigate = useNavigate();
    const dispatch = useDispatch();

    return (
      <div className="fixed inset-0 flex items-center justify-center bg-gray-900 bg-opacity-50 z-[999999999]">
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
                    className={`flex px-3 py-2 my-1  hover:bg-slate-200  items-center rounded-md text-[#1B2559] ${isPasswordPopupOpen ? "bg-[#F8FAFC]" : ""}`}
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

              <div className="w-[80%] p-4">
                <div className="flex flex-col w-1/2">
                  <p className="text-base font-normal font-PlusJakartaSans text-[#1B2559] mb-8">
                    Make sure your yours new password is different from the
                    previous password.
                  </p>
                  <div className="mr-2 w-full  h-28">
                    <Input
                      labelText="New Password"
                      name="password"
                      formik={form}
                      placeholder="Password"
                      labelClass="text-[#475569]"
                    />
                  </div>
                  <div className="w-full h-28">
                    <Input
                      labelText="Confirm Password"
                      name="confirm_password"
                      formik={form}
                      placeholder="Confirm Password"
                      labelClass="text-[#475569]"
                    />
                  </div>
                </div>

                <div className="flex justify-end border-t-2">
                  <Button
                    disabled={form?.isSubmitting}
                    className={`bg-[#1B2559] hover:bg-[#1B2559] rounded-xl mt-6 cursor-pointer font-PlusJakartaSans text-[14px] ${form?.isSubmitting ? "cursor-not-allowed" : ""}  `}
                    type="submit"
                  >
                    Update Password
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

export default UpdatePassword;
