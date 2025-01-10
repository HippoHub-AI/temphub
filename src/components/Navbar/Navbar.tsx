import UserApi from "@api/user.api";
import CompanyInfo from "@components/CompanyInfo/CompanyInfo";
import UpdateProfile, {
  CreateCompanyFormValues,
} from "@components/UpdateProfile/UpdateProfile";
import { CreateUserDto } from "@dto/createUser.dto";
import { VerifyUserDto } from "@dto/verifyUser.dto";
import arrow from "@public/arrow_icon.svg";
import dummy from "@public/login_img.png";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useFormik } from "formik";
import { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useLocation, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { logout, selectUser, update } from "@redux/slices/userSlice";
import {
  ROUTE__UPDATE_VAULT,
  ROUTE_LOGIN,
  ROUTE_VAULT,
} from "@routes/constants";
import {
  BuildingIcon,
  CompanyInfoIcon,
  DocumentIcon,
  LogoutIcon,
  MyProfileIcon,
  PRInstructionIcon,
} from "svg";
import { updateLoader } from "@redux/slices/loaderSlice";
import Instructions from "@components/Instruction/Instructions";
const headings: any = {
  "/companies": {
    tittle: "Companies",
    icon: (
      <BuildingIcon
        fillColor="#CBD5E1"
        strokeColor="#1B2559"
        size="40"
        viewBox="0 0 30 30 "
      />
    ),
  },
  "/chatbox": {
    tittle: "Chatbot",
  },
  "/vault": {
    tittle: "My Vault",
  },
  "/update-vault": {
    tittle: "Update Vault",
  },
  "/vault/create": {
    tittle: "Create File",
  },
};

const Navbar = () => {
  const user = useSelector(selectUser);

  const [open, setOpen] = useState(true);
  const [companyOpen, setCompanyOpen] = useState<boolean>(false);
  const [isPopupOpen, setPopupOpen] = useState<string>("");
  const [isRotated, setIsRotated] = useState<boolean>(false);
  const [instructionOpen, setInstructionOpen] = useState<boolean>(false);
  const [uploadedImages, setUploadedImages] = useState<string | null>(
    user?.user_info?.CompanyLogo as string,
  );
  const [image, setImage] = useState<File>();

  const userApi = new UserApi();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const queryClient = useQueryClient();

  const popupRef = useRef<HTMLDivElement | null>(null);
  const popupRef2 = useRef<HTMLDivElement | null>(null);

  const user_type = user?.user_info?.user_type;
  const name = user?.user_info?.companyName;
  const email = user?.user_info?.email;

  const initialValues: CreateCompanyFormValues = {
    companyName: name,
    email: email,
    PRchatInstruction: user?.user_info?.PRchatInstruction,
    ECSchatInstruction: user?.user_info?.ECSchatInstruction,
    QnAchatInstruction: user?.user_info?.QnAchatInstruction,
    companyInfo: user?.user_info?.companyInfo,
  };

  const UpdateUser = async (values: CreateUserDto) => {
    return await userApi.updateUser(values);
  };
  const resetPassword = async (values: VerifyUserDto) => {
    return await userApi.resetPassword(values);
  };

  const { mutateAsync } = useMutation({
    mutationFn: UpdateUser,
    onMutate: () => {
      dispatch(updateLoader(true));
    },
    onSuccess: (res: any) => {
      setUploadedImages(res?.data?.CompanyLogo);
      dispatch(update(res?.data));
      toast.success("Information Updated Successfully!");
      dispatch(updateLoader(false));
      closePopups();
    },
    onError: (error: any) => {
      toast.error(
        error?.response?.data?.message || "Unable to save information",
      );
      dispatch(updateLoader(false));
    },
  });

  const { mutateAsync: resetPass } = useMutation({
    mutationFn: resetPassword,
    onMutate: () => {
      dispatch(updateLoader(true));
    },
    onSuccess: (res: any) => {
      dispatch(update(res?.data));
      toast.success("Password Updated Successfully!");
      dispatch(updateLoader(false));
      Passwordform.resetForm();
      closePopups();
    },
    onError: (error: any) => {
      toast.error(
        error?.response?.data?.message || "Unable to update password",
      );
      dispatch(updateLoader(false));
    },
  });
  const form = useFormik({
    initialValues,
    validationSchema: CreateUserDto.yupSchema(),
    onSubmit: async (values) => {
      try {
        await mutateAsync({
          ...values,
          userId: user?.user_info?._id,
          img: image,
        });
      } catch (error) {
        console.error("Error:", error);
      }
    },
  });

  const Passwordform = useFormik({
    initialValues: new VerifyUserDto(),
    validationSchema: VerifyUserDto.yupSchema(),
    onSubmit: async (values) => {
      await resetPass({
        ...values,
        keycloak_id: user?.user_info?.keycloak_id,
        username: user?.user_info?.email,
      });
      closePopups();
    },
  });

  const settings = [
    user_type === "client" && (
      <div
        onClick={() => {
          setPopupOpen("profile");
          handleOpen();
        }}
        className=" flex justify-start items-center  w-[160px] px-4 gap-2 hover:bg-[#F4F5F9] h-[42px] font-Arimo font-normal text-base text-[#1B2559] rounded-lg cursor-pointer "
      >
        <MyProfileIcon />
        My Profile
      </div>
    ),

    user_type === "client" && (
      <div
        onClick={() => {
          handleOpen();
          setCompanyOpen(true);
        }}
        className=" flex justify-start items-center  w-[160px] px-4 gap-2 hover:bg-[#F4F5F9] h-[42px] font-Arimo font-normal text-base text-[#1B2559] rounded-lg cursor-pointer "
      >
        <CompanyInfoIcon />
        Company Info
      </div>
    ),
    <div
      onClick={() => {
        handleOpen();
        setInstructionOpen(true);
      }}
      className=" flex justify-start items-center  w-full px-4 gap-2 hover:bg-[#F4F5F9] h-[42px] font-Arimo font-normal text-base text-[#1B2559] rounded-lg cursor-pointer "
    >
      <PRInstructionIcon />
      Instructions
    </div>,

    user_type === "client" && (
      <div
        onClick={() => {
          handleOpen();
          navigate(ROUTE_VAULT);
        }}
        className=" flex justify-start items-center  w-[160px] px-4 gap-2 hover:bg-[#F4F5F9] h-[42px] font-Arimo font-normal text-base text-[#1B2559] rounded-lg cursor-pointer "
      >
        <DocumentIcon />
        View Files
      </div>
    ),
    user_type === "client" && (
      <div
        onClick={() => {
          handleOpen();
          navigate(ROUTE__UPDATE_VAULT);
        }}
        className=" flex justify-start items-center  w-[160px] px-4 gap-2 hover:bg-[#F4F5F9] h-[42px] font-Arimo font-normal text-base text-[#1B2559] rounded-lg cursor-pointer "
      >
        <DocumentIcon />
        Add Files
      </div>
    ),
    <div
      onClick={() => {
        dispatch(logout());
        toast?.success("Logout Successfull!");
        navigate(ROUTE_LOGIN);
      }}
      className=" flex justify-start items-center  w-[160px] px-4 gap-2 hover:bg-red-50 h-[42px] font-Arimo font-normal text-base text-red-500 rounded-lg cursor-pointer "
    >
      <LogoutIcon />
      Log Out
    </div>,
  ];

  const closePopups = () => {
    setPopupOpen("");
  };
  const toggleRotation = () => {
    setIsRotated((prev) => !prev);
  };

  const handleOpen = () => {
    setOpen((prevOpen) => !prevOpen);
    toggleRotation();
  };

  const UpdateUserInfo = async (values: CreateUserDto) => {
    return await userApi.updateUser(values);
  };

  const { mutateAsync: updateuserinfo } = useMutation({
    mutationFn: UpdateUserInfo,

    onSuccess: (res: any) => {
      toast.success("Information Updated Successfully!");
      dispatch(update(res?.data));
      queryClient.invalidateQueries({ queryKey: ["fetchSingle"] });
    },
    onError: (error: any) => {
      toast.error(
        error?.response?.data?.message || "Unable to save information",
      );
    },
  });
  const handleClickOutside = (event: MouseEvent) => {
    const isOutsidePopup =
      popupRef.current && !popupRef.current.contains(event.target as Node);
    const isOutsidePopup2 =
      popupRef2.current && !popupRef2.current.contains(event.target as Node);

    if (isOutsidePopup && isOutsidePopup2) {
      handleOpen();
    }
  };
  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [popupRef]);
  return (
    <>
      <div className="flex justify-between items-center pr-5  ">
        <div className="flex items-center gap-2">
          {headings[`${location?.pathname}`]?.icon}

          <p className="text-[#1B2559] text-[24px] font-semibold font-PlusJakartaSans select-none">
            {headings[`${location?.pathname}`]?.tittle}
          </p>
        </div>

        <div
          className="flex items-center cursor-pointer w-[100px]   justify-between  border-[1px] border-[#CBD5E1] rounded-3xl shadow-custom "
          onClick={handleOpen}
          ref={popupRef2}
        >
          <img
            src={
              Boolean(
                user?.user_info?.CompanyLogo !== "" &&
                  user?.user_info?.CompanyLogo,
              )
                ? `${import.meta.env.VITE_REACT_APP_SERVER_URL?.replace("/api", "")}${user?.user_info?.CompanyLogo}`
                : dummy
            }
            alt=""
            width={40}
            className={`rounded-full h-[48px] w-[48px] `}
          />

          <img
            src={arrow}
            alt=""
            width={12}
            className={`rounded-full transition-transform duration-200 ${isRotated ? "rotate-180" : "rotate-0"} `}
          />

          <div></div>
        </div>
      </div>
      {!open && (
        <div
          ref={popupRef}
          className="absolute right-5 top-[100px]  shadow-md rounded-md z-[9] bg-white"
        >
          {settings}
        </div>
      )}

      <div className="popup">
        {isPopupOpen !== "" && (
          <UpdateProfile
            onClose={closePopups}
            setPopupOpen={setPopupOpen}
            isPopupOpen={isPopupOpen}
            form={form}
            passwordform={Passwordform}
            uploadedImages={uploadedImages}
            setUploadedImages={setUploadedImages}
            image={image}
            setImage={setImage}
          />
        )}
      </div>

      {companyOpen && (
        <CompanyInfo
          userId={user?.user_info?._id}
          setOpen={setCompanyOpen}
          mutateAsync={updateuserinfo}
          companyInfo={user?.user_info?.companyInfo}
        />
      )}

      {instructionOpen && (
        <Instructions
          userId={user?.user_info?._id}
          setOpen={setInstructionOpen}
          mutateAsync={updateuserinfo}
        />
      )}
    </>
  );
};

export default Navbar;
