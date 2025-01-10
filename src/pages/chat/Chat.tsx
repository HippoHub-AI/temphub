import ChatApi from "@api/chat.api";
import "@chatscope/chat-ui-kit-styles/dist/default/styles.min.css";
import { Input } from "@components/common";
import { NewChaDto } from "@dto/chat.dto";
import { selectUser } from "@redux/slices/userSlice";
import {
  ROUTE_EARNING,
  ROUTE_HOME,
  ROUTE_PRESS,
  ROUTE_QNA,
} from "@routes/constants";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useEffectAsync } from "@utils/react";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import { PaperClip, SendArrow } from "svg";
import "./Chat.css";
import { updateLoader } from "@redux/slices/loaderSlice";
const Chat = () => {
  const [currentMessage, setCurrentMessage] = useState<string>("");
  const [currentDocType, setCurrentDocType] = useState<string | null>(null);
  const [messages, setMessages] = useState<any[]>([]);

  const dispatch = useDispatch();
  const loggedInUser = useSelector(selectUser);
  const queryClient = useQueryClient();
  const { type } = useParams();
  const navigate = useNavigate();
  const chatApi = new ChatApi();

  const createNewChat = async (newChat: NewChaDto) => {
    return await chatApi.newChat(newChat);
  };

  const { mutateAsync: chat } = useMutation({
    mutationFn: createNewChat,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["GetAllchat"] });
    },
    onError: (error: any) => {
      toast.error(error?.response?.data?.message || "Unable to Save Chat");
    },
  });
  const handleSend = async (message: string) => {
    const newMessage = {
      message: message,
      direction: "outgoing",
      sender: "user",
    };
    const newMessages = [...messages, newMessage];
    setMessages(newMessages);

    dispatch(updateLoader(true));
  };
  const handleKeyDown = async (event: any) => {
    if (event.key === "Enter") {
      event.preventDefault(); // Prevent default form submission
      const inputValue = event.target.value.trim();
      if (inputValue) {
        handleSend(inputValue);
        setCurrentMessage("");

        event.target.value = ""; // Clear the input after sending
      }
    }
  };

  useEffect(() => {
    if (type == "pressRelease") {
      setCurrentDocType("Press Release");
    } else if (type == "earningScript") {
      setCurrentDocType("Earning Script");
    } else if (type == "qna") {
      setCurrentDocType("QnA");
    } else {
      navigate(ROUTE_HOME);
    }
  }, [type]);

  useEffectAsync(async () => {
    if (messages?.length == 1) {
      if (currentDocType) {
        let chatId = await chat({
          userid: loggedInUser?.user_info?._id,
          messages: messages,
          chat_type: currentDocType,
        });
        if (currentDocType == "Earning Script") {
          navigate(ROUTE_EARNING?.replace(":id", chatId?.data?._id));
        } else if (currentDocType == "Press Release") {
          navigate(ROUTE_PRESS?.replace(":id", chatId?.data?._id));
        } else if (currentDocType == "QnA") {
          navigate(ROUTE_QNA?.replace(":id", chatId?.data?._id));
        } else {
          navigate(ROUTE_PRESS?.replace(":id", chatId?.data?._id));
        }
      }
    }
  }, [messages]);

  return (
    <>
      <div className="flex flex-col flex-grow min-h-full p-10 justify-center">
        <div className="w-full max-w-[90%] flex justify-center items-center place-self-center">
          <p
            className="font-PlusJakartaSans text-4xl font-semibold animate-typewriter 
        whitespace-nowrap overflow-hidden inline-block text-center"
            style={{ maxWidth: "calc(100% - 40px)" }} // Adds padding for the sidebar
          >
            {currentDocType == "Earning Script"
              ? "What should be the Earning Calls Script about?"
              : currentDocType == "Press Release"
                ? "What should be the Press Release about?"
                : "What can I help with?"}
          </p>
        </div>

        <div className="mt-8 flex justify-center flex-col items-center z-[10]">
          <div className="w-4/5 flex items-center border-2 border-[#CBD5E1] rounded-full p-3">
            <PaperClip />
            <Input
              value={currentMessage}
              placeholder="Message Bot..."
              wrapperClass="!border-none"
              onChange={(e: any) => setCurrentMessage(e.target.value)}
              onKeyDown={handleKeyDown}
              topMostWrapper="!h-[40px] overflow-hidden !mb-0 flex items-center"
            />
            <SendArrow
              onClick={() => {
                if (currentMessage !== "") {
                  handleSend(currentMessage);
                  setCurrentMessage("");
                }
              }}
            />
          </div>
          <p className="text-center text-[#475569] text-[14px] font-semibold font-PlusJakartaSans select-none mt-4">
            Bot can make mistakes. Check our Terms & Conditions.
          </p>
        </div>
      </div>
    </>
  );
};

export default Chat;
