import { Button, Input } from "@components/common";
import { ROUTE_LOGIN } from "@routes/constants";
import base64 from "@utils/helper";
import { useEffectAsync } from "@utils/react";
import { FormikProps } from "formik";
import { forwardRef, useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { NavLink, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { LogoutIcon, MyProfileIcon, PasswordIcon } from "svg";
import icontwo from "@public/file-upload.svg";
import { logout, selectUser } from "@redux/slices/userSlice";

export interface CreateCompanyFormValues {
  companyName: string;
  email: string;
  PRchatInstruction?: string;
  ECSchatInstruction?: string;
  QnAchatInstruction?: string;
  companyInfo?: string;
}

export interface PasswordFormValues {
  password?: string;
  confirm_password?: string;
  keycloak_id?: string;
  username?: string;
}

interface CreateProps {
  onClose: () => void;
  isPopupOpen: String;
  setPopupOpen: React.Dispatch<React.SetStateAction<string>>;
  form: FormikProps<CreateCompanyFormValues>;
  uploadedImages?: any;
  setUploadedImages?: any;
  image?: any;
  setImage?: any;
  passwordform?: FormikProps<PasswordFormValues>;
}

const UpdateProfile = forwardRef<HTMLDivElement, CreateProps>(
  ({
    onClose,
    form,
    passwordform,
    setPopupOpen,
    isPopupOpen,
    uploadedImages,
    setUploadedImages,
    setImage,
  }) => {
    const dispatch = useDispatch();
    const user = useSelector(selectUser);
    const navigate = useNavigate();
    const popupRef2 = useRef<HTMLDivElement | null>(null);

    const handleImageClick = () => {
      document.getElementById("fileInput")?.click();
    };

    const handleDeleteImage = () => {
      setUploadedImages(null);
      setImage(null);
    };
    const handleClickOutside = (event: MouseEvent) => {
      const isOutsidePopup2 =
        popupRef2.current && !popupRef2.current.contains(event.target as Node);

      if (isOutsidePopup2) {
        setPopupOpen("");
      }
    };
    useEffectAsync(async () => {
      if (uploadedImages && typeof uploadedImages == "object") {
        let base64String = await base64(uploadedImages);
        setImage({ file_base64: base64String, name: uploadedImages?.name });
      } else if (uploadedImages && typeof uploadedImages == "string") {
        setImage(uploadedImages);
      }
    }, [uploadedImages]);
    useEffect(() => {
      document.addEventListener("mousedown", handleClickOutside);
      return () => {
        document.removeEventListener("mousedown", handleClickOutside);
      };
    }, [popupRef2]);

    return (
      <>
        <div className="fixed inset-0 flex items-center justify-center bg-gray-900 bg-opacity-50 z-[99999999999999999999] ">
          <div
            className="  rounded-lg shadow-lg w-[60%] p-4 bg-white"
            ref={popupRef2}
          >
            <div className="flex justify-between items-center mb-2 border-b-2 pb-4">
              <h2 className="text-[#1B2559] font-semibold text-[24px] ">
                Settings
              </h2>
              <button onClick={onClose} className="text-gray-500 text-3xl">
                &times;
              </button>
            </div>
            <form
              onSubmit={
                isPopupOpen === "password"
                  ? passwordform?.handleSubmit
                  : form.handleSubmit
              }
              className="h-[92%]"
            >
              <div className="flex h-full">
                <div className="w-[20%] p-3 flex flex-col justify-between">
                  <div>
                    <NavLink
                      onClick={() => {
                        setPopupOpen("profile");
                      }}
                      className={`flex px-3 py-2 my-1  hover:bg-slate-200  items-center rounded-md text-[#1B2559] ${isPopupOpen === "profile" ? "bg-[#F8FAFC]" : ""}`}
                      to={""}
                    >
                      <div className="w-8">
                        <MyProfileIcon />
                      </div>
                      <p className="text-[14px] font-medium">My Profile</p>
                    </NavLink>
                    <NavLink
                      onClick={() => {
                        setPopupOpen("password");
                      }}
                      className={`flex px-3 py-2 my-1  hover:bg-slate-200  items-center rounded-md text-[#1B2559]  ${isPopupOpen === "password" ? "bg-[#F8FAFC]" : ""}`}
                      to={""}
                    >
                      <div className="w-8">
                        <PasswordIcon />
                      </div>
                      <p className="text-[14px] font-medium">Password</p>
                    </NavLink>
                  </div>
                  <div className="">
                    <div
                      onClick={() => {
                        dispatch(logout());
                        toast?.success("Logout Successfull!");
                        navigate(ROUTE_LOGIN);
                      }}
                      className=" flex justify-start items-center text-[14px] px-4 gap-2 hover:bg-red-50 h-[42px] font-Arimo font-normal text-base text-red-500 rounded-lg cursor-pointer "
                    >
                      <LogoutIcon />
                      Log Out
                    </div>
                  </div>
                </div>

                {isPopupOpen === "profile" && (
                  <div className="w-[80%] p-4 flex flex-col justify-between">
                    <div>
                      <div className="flex ">
                        <div className="mr-2 w-full">
                          <Input
                            labelText="Name"
                            name="companyName"
                            formik={form}
                            placeholder="Company Name"
                          />
                        </div>
                        <div className="w-full">
                          <Input
                            labelText="Email"
                            name="email"
                            disabled
                            formik={form}
                            className="bg-white"
                            placeholder="Example@email.com"
                          />
                        </div>
                      </div>

                      <div
                        className={`border-dashed border-2  border-gray-300 p-6 w-full h-auto flex items-center ${uploadedImages === null || uploadedImages === undefined || uploadedImages === "" ? "justify-center" : "justify-between"} rounded-lg shadow-lg hover:shadow-xl transition-shadow `}
                      >
                        {uploadedImages && (
                          <div className="w-full ">
                            <img
                              src={
                                typeof uploadedImages === "string"
                                  ? `${import.meta.env.VITE_REACT_APP_SERVER_URL?.replace("/api", "")}${uploadedImages}`
                                  : URL.createObjectURL(uploadedImages as Blob)
                              }
                              alt="Selected"
                              className="w-24 h-14 object-cover "
                            />
                          </div>
                        )}

                        {!uploadedImages && (
                          <div className="flex items-center justify-between mb-2 ">
                            <div className="flex flex-col items-center my-6">
                              <div className="w-14 h-14 rounded-full bg-gray-100 flex flex-col items-center justify-center shadow-md">
                                <img
                                  src={icontwo}
                                  alt="upload photo"
                                  onClick={handleImageClick}
                                  className="cursor-pointer"
                                />
                                <input
                                  id="fileInput"
                                  type="file"
                                  accept="image/*"
                                  className="hidden"
                                  onChange={(e) => {
                                    if (
                                      e?.target?.files &&
                                      e?.target?.files.length > 0
                                    ) {
                                      setUploadedImages(e?.target?.files[0]);
                                    }
                                  }}
                                />
                              </div>
                              <p className="text-gray-700 text-center">
                                Upload from your Computer
                              </p>
                            </div>
                          </div>
                        )}
                        {uploadedImages && (
                          <button
                            type="button"
                            onClick={handleDeleteImage}
                            className="px-6 py-3 font-medium text-white bg-[#1B2559] rounded-xl cursor-pointer font-PlusJakartaSans text-[14px]  "
                          >
                            Delete
                          </button>
                        )}
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
                        Update Profile
                      </Button>
                    </div>
                  </div>
                )}

                {isPopupOpen === "password" && (
                  <div className="w-[80%] p-4  flex flex-col justify-between">
                    <div className="flex flex-col w-1/2">
                      <p className="text-base font-normal font-PlusJakartaSans text-[#1B2559] mb-8">
                        Make sure your new password is different from the
                        previous password.
                      </p>
                      <div className="mr-2 w-full  h-28">
                        <Input
                          labelText="New Password"
                          name="password"
                          formik={passwordform}
                          placeholder="Password"
                          labelClass="text-[#475569]"
                        />
                      </div>
                      <div className="w-full h-28">
                        <Input
                          labelText="Confirm Password"
                          name="confirm_password"
                          formik={passwordform}
                          placeholder="Confirm Password"
                          labelClass="text-[#475569]"
                        />
                      </div>
                    </div>

                    <div className="flex justify-end border-t-2">
                      <Button
                        disabled={passwordform?.isSubmitting}
                        className={`bg-[#1B2559] hover:bg-[#1B2559] rounded-xl mt-6 cursor-pointer font-PlusJakartaSans text-[14px] ${passwordform?.isSubmitting ? "cursor-not-allowed" : ""}  `}
                        type="submit"
                      >
                        Update Password
                      </Button>
                    </div>
                  </div>
                )}
              </div>
            </form>
          </div>
        </div>
      </>
    );
  },
);

export default UpdateProfile;
