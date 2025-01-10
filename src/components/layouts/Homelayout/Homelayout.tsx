import Loader2 from "@components/Loader/Loader";
import Navbar from "@components/Navbar/Navbar";
import Sidebar from "@components/sideBar/Sidebar";
import { isLoader } from "@redux/slices/loaderSlice";
import { selectUser } from "@redux/slices/userSlice";
import { ROUTE_LOGIN } from "@routes/constants";
import React, { ReactNode, useEffect } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

interface HomeLayoutProps {
  children: ReactNode;
}
const HomeLayout: React.FC<HomeLayoutProps> = ({ children }) => {
  const currentUser = useSelector(selectUser);
  const loader = useSelector(isLoader);
  const navigate = useNavigate();

  useEffect(() => {
    console.log("Current currentUser is ", currentUser.user_info.email);

    if (!currentUser?.firebase_token) {
      navigate(ROUTE_LOGIN);
    }
  }, [currentUser, navigate]);

  if (!currentUser?.firebase_token) {
    return null;
  }

  return (
    <div className="flex min-w-screen ">
      <div className=" flex  w-full">
        <div className="h-screen  fixed w-[15%] px-4 py-6    ">
          <Sidebar />
        </div>

        <div className=" ml-[15%] min-h-screen w-full px-4 py-6  ">
          <Navbar />
          <div className="shadow-custom rounded-[20px] min-h-[90%] flex flex-col w-full  mt-4   ">
            <>
              {loader && <Loader2 />}
              {children}
            </>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HomeLayout;
