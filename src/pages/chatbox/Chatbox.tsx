import UserApi from "@api/user.api";
import Cards from "@components/cards/Cards";
import { updateChatType } from "@redux/slices/loaderSlice";
// import img from "@public/chatboxi_mg.png";
// import { updatePopup } from "@redux/slices/popup.slice";
import { selectUser } from "@redux/slices/userSlice";
import { ROUTE_CHAT } from "@routes/constants";
import { useQuery } from "@tanstack/react-query";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { ECSIcon, PRIcon, QnAIcon } from "svg";

const Chatbox = () => {
  const userApi = new UserApi();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const user = useSelector(selectUser);

  const fetchAllClient = async () => {
    return await userApi.getClientByEmail(user?.user_info?.email);
  };
  const { data } = useQuery({
    queryKey: ["fetchSingle"],
    queryFn: fetchAllClient,
    retry: false,
  });

  console.log("", data);

  return (
    <>
      <div className=" px-10 w-full h-full py-3">
        <div className="">
          <h3 className="text-[#1B2559] text-[24px] font-bold font-PlusJakartaSans text-center">
            Welcome!
          </h3>
          <div className="flex justify-center my-7 min-w-64 min-h-16">
            {user?.user_info?.CompanyLogo && (
              <img
                className="w-64 h-16 object-contain"
                src={
                  Boolean(
                    user?.user_info?.CompanyLogo !== "" &&
                      user?.user_info?.CompanyLogo,
                  )
                    ? `${import.meta.env.VITE_REACT_APP_SERVER_URL?.replace("/api", "")}${user?.user_info?.CompanyLogo}`
                    : ""
                }
                alt=""
              />
            )}
          </div>
        </div>
        <div className="flex justify-center ">
          <div className="flex  my-8 w-3/4  justify-center gap-4">
            <Cards
              icon={<PRIcon />}
              heading="Generate Press Release"
              text="Craft a Professional Announcement Instantly"
              onClick={() => {
                navigate(ROUTE_CHAT?.replace(":type", "pressRelease"));
                dispatch(updateChatType("chatbox"));
              }}
            />
            <Cards
              icon={<ECSIcon />}
              heading="Generate Earnings Call Script"
              text="Prepare Clear Communication for Investors"
              onClick={() => {
                navigate(ROUTE_CHAT?.replace(":type", "earningScript"));
                dispatch(updateChatType("chatbox"));
              }}
            />
            <Cards
              icon={<QnAIcon />}
              heading="General Chat"
              text="Ask Questions from your Bot"
              onClick={() => {
                navigate(ROUTE_CHAT?.replace(":type", "qna"));
                dispatch(updateChatType("chatbox"));
              }}
            />
          </div>
        </div>
      </div>
    </>
  );
};

export default Chatbox;
