import { Button, Input } from "@components/common";
import Login_img from "@public/login_img.png";
import logo_img from "@public/hippoLogo.png";
import wc_img from "@public/wave_img.svg";
import google_img from "@public/Google_img.svg";
import facebook_img from "@public/Facebook_img.svg";
import { useNavigate } from "react-router-dom";
import { ROUTE_LOGIN } from "@routes/constants";

const Signup = () => {
  const navigate = useNavigate();

  return (
    <div className="w-full flex p-[20px] h-screen">
      <div className="w-1/2">
        <div>
          <img src={logo_img} alt="" />
        </div>
        <div className="w-full flex justify-center ">
          <div className="w-3/4 mt-10">
            <div className="flex items-center">
              <h1 className="text-[36px] font-bold font-PlusJakartaSans text-[#1B2559] mr-3">
                Create Account
              </h1>
              <img src={wc_img} alt="" width={30} />
            </div>
            <p className="text-[18px] text-[#475569] font-PlusJakartaSans my-2">
              Today is a new day. It's your day. You shape it. Sign in to start
            </p>
            <form>
              <Input labelText="Name" name="username" placeholder="John Doe" />
              <Input
                labelText="Email"
                name="username"
                placeholder="Example@email.com"
              />
              <Input
                labelText="Password"
                name="username"
                placeholder="Confirm"
              />

              <Button
                className={`bg-[#1B2559] hover:bg-[#1B2559] rounded-xl my-4 cursor-pointer w-full font-PlusJakartaSans text-[20px] `}
              >
                Create Account
              </Button>
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
                Already have an account?
              </p>
              <p
                className="text-[#1B2559] ml-1 cursor-pointer text-[18px] font-PlusJakartaSans "
                onClick={() => {
                  navigate(ROUTE_LOGIN);
                }}
              >
                Sign In
              </p>
            </div>
          </div>
        </div>
      </div>
      <div className="w-1/2 h-screen">
        <img src={Login_img} alt="Login image" className="h-screen  w-[100%]" />
      </div>
    </div>
  );
};

export default Signup;
