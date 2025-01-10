import { Collapse, List, ListItemButton, ListItemText } from "@mui/material";
import { updateChatType } from "@redux/slices/loaderSlice";
import { ROUTE_EARNING, ROUTE_PRESS, ROUTE_QNA } from "@routes/constants";
import { useState } from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import "./history.css";

export default function HistoryListing({ data }: any) {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [isErOpen, setIsErOpen] = useState<boolean>(false);
  const [isQnaOpen, setIsQnaOpen] = useState<boolean>(false);

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleClick = () => {
    setIsOpen(!isOpen);
    setIsErOpen(false);
    setIsQnaOpen(false);
  };
  const handleERClick = () => {
    setIsOpen(false);
    setIsErOpen(!isErOpen);
    setIsQnaOpen(false);
  };
  const handleQNAClick = () => {
    setIsOpen(false);
    setIsErOpen(false);
    setIsQnaOpen(!isQnaOpen);
  };
  return (
    <div className=" h-full px-4 max-h-[90%] overflow-y-auto scroll">
      <div
        className={`flex-1 overflow-hidden !max-h-[70%]  ${!isOpen ? "selected" : "notselected"}`}
      >
        <List
          className="!font-PlusJakartaSans  "
          component="nav"
          style={{ height: "100% !important" }}
          aria-labelledby="nested-list-subheader "
        >
          <ListItemButton onClick={handleClick}>
            <ListItemText primary="Draft Press Release" />
          </ListItemButton>
          <Collapse
            in={isOpen}
            timeout="auto"
            unmountOnExit
            style={{ height: "100% !important" }}
          >
            <List
              component="div"
              disablePadding
              className="max-h-80 overflow-y-auto scroll "
            >
              {Array?.isArray(data) &&
                data &&
                data
                  ?.filter((item: any) => {
                    return item.chat_type === "Press Release";
                  })
                  .map((chat: any, index: any) => {
                    return (
                      <div className="flex mt-4 p-3 rounded-lg hover:bg-[#F8FAFC] cursor-pointer w-full">
                        <p
                          onClick={() => {
                            navigate(ROUTE_PRESS?.replace(":id", chat?._id));
                            dispatch(updateChatType("sidebar"));
                          }}
                          key={index}
                          className=" flex justify-start items-center font-normal text-sm text-[#475569] truncate min-w-[90%] max-w-[90%]  "
                        >
                          {Array?.isArray(chat?.messages) &&
                            chat?.messages[0]?.message}
                        </p>
                      </div>
                    );
                  })}
            </List>
          </Collapse>
        </List>
      </div>
      <div
        className={`flex-1 overflow-hidden !max-h-[70%] ${!isErOpen ? "selected" : "notselected"}`}
      >
        <List
          className="!font-PlusJakartaSans  "
          component="nav"
          style={{ height: "100% !important" }}
          aria-labelledby="nested-list-subheader"
        >
          <ListItemButton onClick={handleERClick}>
            <ListItemText primary="Draft Earnings Script" />
          </ListItemButton>
          <Collapse in={isErOpen} timeout="auto" unmountOnExit>
            <List
              component="div"
              disablePadding
              className="max-h-80 overflow-y-auto scroll"
            >
              {Array?.isArray(data) &&
                data
                  ?.filter((item: any) => {
                    return item.chat_type === "Earning Script";
                  })
                  .map((chat: any, index: any) => {
                    return (
                      <div className="flex mt-4 p-3 rounded-lg hover:bg-[#F8FAFC] cursor-pointer w-full">
                        <p
                          onClick={() => {
                            navigate(ROUTE_EARNING?.replace(":id", chat?._id));
                            dispatch(updateChatType("sidebar"));
                          }}
                          key={index}
                          className=" flex justify-start items-center font-normal text-sm text-[#475569] truncate min-w-[90%] max-w-[90%]  "
                        >
                          {Array?.isArray(chat?.messages) &&
                            chat?.messages[0]?.message}
                        </p>
                      </div>
                    );
                  })}
            </List>
          </Collapse>
        </List>
      </div>
      <div
        className={`flex-1 overflow-hidden max-h-[70%] ${!isQnaOpen ? "selected" : "notselected"}`}
      >
        <List
          className="!font-PlusJakartaSans  "
          component="nav"
          style={{ height: "100% !important" }}
          aria-labelledby="nested-list-subheader"
        >
          <ListItemButton onClick={handleQNAClick} className="">
            <ListItemText primary="General Chat" className="!flex" />
          </ListItemButton>
          <Collapse in={isQnaOpen} timeout="auto" unmountOnExit>
            <List
              component="div"
              disablePadding
              className="max-h-80 overflow-y-auto scroll"
            >
              {Array?.isArray(data) &&
                data &&
                data
                  ?.filter((item: any) => {
                    return item.chat_type === "QnA";
                  })
                  .map((chat: any, index: any) => {
                    return (
                      <div className="flex mt-4 p-3 rounded-lg hover:bg-[#F8FAFC] cursor-pointer w-full">
                        <p
                          onClick={() => {
                            navigate(ROUTE_QNA?.replace(":id", chat?._id));
                            dispatch(updateChatType("sidebar"));
                          }}
                          key={index}
                          className=" flex justify-start items-center font-normal text-sm text-[#475569] truncate min-w-[90%] max-w-[90%]  "
                        >
                          {Array?.isArray(chat?.messages) &&
                            chat?.messages[0]?.message}
                        </p>
                      </div>
                    );
                  })}
            </List>
          </Collapse>
        </List>
      </div>
    </div>
  );
}
