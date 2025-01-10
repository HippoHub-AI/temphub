import UserApi from "@api/user.api";
import { LoginDto } from "@dto/login.dto";
import { login } from "@redux/slices/userSlice";
import { ROUTE_ADMIN, ROUTE_HOME } from "@routes/constants";
import { useFormik } from "formik";
import { useState } from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import Login_img from "@public/empire-state-building-day.jpg";
import { toast } from "react-toastify";
import logo_img from "@public/hippoLogo.png";
import wc_img from "@public/wave_img.svg";
import { Button, Input } from "@components/common";
import { FaRegEyeSlash } from "react-icons/fa";
import { IoEyeOutline } from "react-icons/io5";
import { useMutation } from "@tanstack/react-query";
import google_img from "@public/Google_img.svg";
import facebook_img from "@public/Facebook_img.svg";

const Login = () => {
  const [isShowPassword, setIsShowPassword] = useState<boolean>(false);
  const [isImageLoaded, setImageLoaded] = useState<boolean>(false);

  const userData = new UserApi();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const loginUser = async (values: LoginDto) => {
    return await userData.login(values);
  };

  const { mutateAsync } = useMutation({
    mutationFn: loginUser,
    onSuccess: (res: any) => {
      console.log("The MM response is", res);

      toast.success("Login Successfull!");
      dispatch(login({ ...res?.data }));
      const user_type = res?.data?.user_info?.user_type;
      console.log("The MM user_type is", user_type);

      // ✅ Adding a short delay to ensure state update before navigating
      setTimeout(() => {
        if (user_type === "admin") {
          console.log("Navigatwe to ", ROUTE_ADMIN);

          navigate(ROUTE_ADMIN);
        } else if (user_type === "client") {
          console.log("Navigatwe to ", ROUTE_HOME);

          navigate(ROUTE_HOME);
        } else {
          console.error("❌ Invalid user type:", user_type);
          toast.error("Invalid user type detected!");
        }
      }, 100); // Delay added for proper state update
    },
    onError: (error: any) => {
      toast.error(error?.response?.data?.message || "Unable to Login!");
    },
  });

  const form = useFormik({
    initialValues: new LoginDto(),
    validationSchema: LoginDto.yupSchema(),
    onSubmit: async (values: LoginDto) => {
      mutateAsync(values);
    },
  });

  const handlePassword = () => {
    setIsShowPassword(!isShowPassword);
  };

  return (
    <div className="w-full flex p-[20px] h-screen">
      <div className="w-1/2 ">
        <div>
          <img src={logo_img} alt="" />
        </div>
        <div className=" flex justify-center mt-24 h-screen w-[60%] mx-auto ">
          <div className=" w-full">
            <div className="flex items-center mx-[80px]">
              <h1 className="text-[36px] font-bold font-PlusJakartaSans text-[#1B2559] mr-3">
                Welcome Back
              </h1>
              <img src={wc_img} alt="" width={30} />
            </div>
            <p className="text-[18px] text-[#475569] font-PlusJakartaSans my-2 mx-[80px] mb-8">
              Today is a new day. It's your day. You shape it.
              <br /> Sign in to start
            </p>
            <form onSubmit={form.handleSubmit} className="mx-[80px]">
              <Input
                labelText="Email"
                name="username"
                placeholder="Example@email.com"
                formik={form}
              />
              <Input
                labelText="Password"
                name="password"
                placeholder="At least 8 characters"
                type={isShowPassword ? "" : "password"}
                formik={form}
                icon={
                  isShowPassword ? (
                    <IoEyeOutline
                      color=""
                      className=" w-8 h-8  font-Arimo cursor-pointer"
                      onClick={handlePassword}
                    />
                  ) : (
                    <FaRegEyeSlash
                      color=""
                      className=" w-8 h-8  font-Arimo cursor-pointer"
                      onClick={handlePassword}
                    />
                  )
                }
              />

              <Button
                disabled={form?.isSubmitting}
                className={`bg-[#1B2559] hover:bg-[#1B2559] rounded-xl my-4 cursor-pointer w-full font-PlusJakartaSans text-[20px] ${form?.isSubmitting ? "cursor-not-allowed" : ""} `}
              >
                Sign In
              </Button>
              <p className="text-[16px] font-PlusJakartaSans text-center text-[#4C6B92]">
                Forgot Password?
              </p>
            </form>
            <p className="text-[#294957] text-[16px] font-PlusJakartaSans my-4 text-center">
              -------------------- or -------------------
            </p>
            <div>
              <Button
                className={`bg-[#F8FAFC] hover:bg-[#F8FAFC] rounded-xl my-2 cursor-pointer w-full font-PlusJakartaSans text-[16px] text-[#475569] flex items-center`}
              >
                <img src={google_img} alt="" />
                Sign in with Google
              </Button>
              <Button
                className={`bg-[#F8FAFC] hover:bg-[#F8FAFC] rounded-xl my-2 cursor-pointer w-full font-PlusJakartaSans text-[16px] text-[#475569] flex items-center`}
              >
                <img src={facebook_img} alt="" />
                Sign in with Facebook
              </Button>
            </div>

            <div className="flex justify-center mt-4">
              <p className="text-[18px] font-PlusJakartaSans text-[#475569]">
                Don’t have an account?
              </p>
              <p className="text-[#1B2559] ml-1 cursor-pointer text-[18px] font-PlusJakartaSans ">
                Sign up
              </p>
            </div>
          </div>
        </div>
      </div>
      {
        <div className="w-1/2 h-screen">
          <img
            src={Login_img}
            alt="Login image"
            className={`w-full h-full object-cover rounded-2xl transition-opacity duration-500 ease-in-out ${
              isImageLoaded ? "opacity-100" : "opacity-0"
            }`}
            loading="lazy"
            onLoad={() => setImageLoaded(true)}
          />
        </div>
      }
    </div>
  );
};

export default Login;
