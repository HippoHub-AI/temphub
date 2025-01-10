import { MenuOptions } from "@components/adminSideBar";
import { HistoryListing } from "@components/ClientSideBar";
import { selectUser } from "@redux/slices/userSlice";
import { useDispatch, useSelector } from "react-redux";
import { ArrowRight, DocumentIcon } from "svg";
import ChatApi from "@api/chat.api";
import VaultPopup from "@components/upload-vault/VaultPopup";
import ViewVaultPopup from "@components/viewVaultPopup/ViewVaultPopup";
import newLogo from "@public/HippoHub Logo new.png";
import { ispopUpOpen, updatePopup } from "@redux/slices/popup.slice";
import {
  ROUTE__UPDATE_VAULT,
  ROUTE_HOME,
  ROUTE_VAULT,
} from "@routes/constants";
import { useQuery } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Sidebar.css";

const Sidebar = () => {
  const [isOpen, setIsOpen] = useState<boolean>(
    useSelector(ispopUpOpen) as boolean,
  );
  const [isViewopen, setIsViewOpen] = useState<boolean>(false);

  const chatApi = new ChatApi();
  const dispatch = useDispatch();
  const ispopup = useSelector(ispopUpOpen);
  const loggedInuser = useSelector(selectUser);
  const navigate = useNavigate();

  const getAllChat = async () => {
    return await chatApi.getAllChat({ id: loggedInuser?.user_info?._id });
  };
  const { data }: any = useQuery({
    queryKey: ["GetAllchat"],
    queryFn: getAllChat,
  });

  const handleOpen = () => setIsOpen(true);
  const handleViewOpen = () => setIsViewOpen(true);
  const handleViewClose = () => {
    setIsViewOpen(false);
  };
  const handleClose = () => {
    setIsOpen(false);
    dispatch(updatePopup(false));
  };
  useEffect(() => {
    setIsOpen(ispopup);
  }, [ispopup]);
  return (
    <div className="flex flex-col rounded-[20px] shadow-custom h-full justify-between  overflow-hidden gap-4">
      <div className="flex flex-col w-full min-h-[80%] overflow-hidden  ">
        <div
          className="flex justify-center cursor-pointer  h-32 w-32 place-self-center"
          onClick={() => {
            loggedInuser?.user_info?.user_type &&
              loggedInuser?.user_info?.user_type !== "admin" &&
              navigate(ROUTE_HOME);
          }}
        >
          <img
            src={newLogo}
            alt="Hippo Logo"
            className="w-full h-full object-fill"
          />
        </div>

        <div className="min-h-[90%] ">
          {loggedInuser?.user_info?.user_type &&
          loggedInuser?.user_info?.user_type !== "admin" ? (
            <HistoryListing data={data?.data} />
          ) : (
            <MenuOptions />
          )}
        </div>
      </div>
      <div className="flex flex-col gap-2 min-h-1/4 max-h-1/4 ">
        {isOpen && <VaultPopup onClose={handleClose} open={handleOpen} />}
        {loggedInuser?.user_info?.user_type &&
          loggedInuser?.user_info?.user_type !== "admin" && (
            <div className="border-b-2 mx-4"></div>
          )}
        {isViewopen && (
          <ViewVaultPopup onClose={handleViewClose} open={handleViewOpen} />
        )}
        {loggedInuser?.user_info?.user_type &&
          loggedInuser?.user_info?.user_type !== "admin" && (
            <div
              className="bg-[#F8FAFC] flex rounded-lg py-3 px-[10px] gap-[10px] mx-4 justify-center items-center cursor-pointer"
              onClick={() => {
                navigate(ROUTE_VAULT);
              }}
            >
              <DocumentIcon />
              <p className="font-PlusJakartaSans font-normal text-sm">
                View Vault Files
              </p>
              <ArrowRight />
            </div>
          )}
        {loggedInuser?.user_info?.user_type &&
          loggedInuser?.user_info?.user_type !== "admin" && (
            <div
              className="bg-[#F8FAFC] flex rounded-lg py-3 px-[10px] gap-[10px] mx-4 justify-center items-center cursor-pointer mb-2"
              onClick={() => {
                navigate(ROUTE__UPDATE_VAULT);
              }}
            >
              <DocumentIcon />
              <p className="font-PlusJakartaSans font-normal text-sm">
                Add Files to Vault
              </p>
              <ArrowRight />
            </div>
          )}
      </div>
    </div>
  );
};

export default Sidebar;
