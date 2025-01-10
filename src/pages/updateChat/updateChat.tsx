import ChatApi from "@api/chat.api";
import OpenAiApi from "@api/openApi.api";
import VaultApi from "@api/vault.api";
import {
  Avatar,
  ChatContainer,
  MainContainer,
  Message,
  MessageList,
} from "@chatscope/chat-ui-kit-react";
import "@chatscope/chat-ui-kit-styles/dist/default/styles.min.css";
import { Input } from "@components/common";
import Loader from "@components/ThingLoader/loader";
import { UpdateChaDto } from "@dto/chat.dto";
import hippoLogo from "@public/hippoLogo1.png";
import { useMutation, useQuery } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import ReactMarkdown from "react-markdown";
import { useLocation, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import { DownloadIcon, PaperClip, SendArrow } from "svg";
import "./updateChat.css";
import { useEffectAsync } from "@utils/react";
import { useDispatch, useSelector } from "react-redux";
import { selectUser } from "@redux/slices/userSlice";
import UserApi from "@api/user.api";
import { ChatType, updateLoader } from "@redux/slices/loaderSlice";
import { FileCreationDto } from "@dto/docFileCreation.dto";
import { marked } from "marked";
const instructions = {
  PR: "You are Public Relations expert at a small public company, your job is to generate Press Releases for this company.You will be given the past Press Releases, Company information and relevant documents.You should use similar language and style for new press releases as in provided example press releases.",
  ES: "You are Public Relations expert at a small public company, your job is to generate Earning Call Scripts including QnA section for this company.You will be given the past Earning Call Scripts along with Company information and press releases.You should use similar language and style for new Earning Call Scripts as in provided example(s).",
  qna: "You are the knowledge expert at a small public company, your will be interacting with user who want to research on Company related topics.For example user may want to write a new press release or create an earning call script. Your job is to answer all its queries using the information provided.You will be provided the past Press Releases,  Earning Call Scripts and Company information.You should prefer to use the company knowledge provided by user but you can use your own knowledge if needed.",
};
const UpdatedChat = () => {
  const [currentMessage, setCurrentMessage] = useState<string>("");
  const [Usergenerate, setUserGenerate] = useState<string>("");
  const [adminGenerate, setAdminGenerate] = useState<string>("");
  const [messages, setMessages] = useState<any[]>([]);
  const [isThinking, setisThinking] = useState<boolean>(false);
  const [FileText, setFileText] = useState<string | undefined>(undefined);

  const { id } = useParams();
  const dispatch = useDispatch();
  const chatgtpApi = new OpenAiApi();
  const vaultApi = new VaultApi();
  const chatApi = new ChatApi();
  const userApi = new UserApi();
  const location = useLocation();
  const loggedInUser = useSelector(selectUser);
  const currentUser = useSelector(selectUser);
  const chatType = useSelector(ChatType);

  const convertTextToWord = async (text: FileCreationDto) => {
    return await vaultApi.textToWord(text);
  };

  const updateChat = async (chat: UpdateChaDto) => {
    return await chatApi.updateChat(chat);
  };
  const getChatByid = async () => {
    if (id) return await chatApi.getChatById({ id: id });
    else return new Error("Unable to get chat");
  };
  const getFileData = async (files: { user_id: string; docType: string }) => {
    return await vaultApi.getFileData(files);
  };
  const getAdminInstruction = async () => {
    return await userApi.getAdminInstruction();
  };
  const { data }: any = useQuery({
    queryKey: ["Getchat", id],
    queryFn: getChatByid,
  });

  const { data: adminData }: any = useQuery({
    queryKey: ["adminData", id],
    queryFn: getAdminInstruction,
  });

  const { mutateAsync } = useMutation({
    mutationFn: convertTextToWord,
    onSuccess: (res: any) => {
      if (res?.data) {
        const uint8Array = new Uint8Array(res?.data.data);

        // Create a Blob object from the Uint8Array with a `.docx` MIME type
        const blob = new Blob([uint8Array], {
          type: "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
        });

        // Create a Blob URL from the Blob object
        const url = URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.href = url;
        link.setAttribute("target", "_blank");
        link.setAttribute(
          "download",
          `${location?.pathname?.includes("pressRelease") ? "Press Relase" : "Earning Script"}.docx`,
        ); // Set the file name with `.docx`
        document.body.appendChild(link);
        link.click();

        // Clean up the Blob URL to release memory
        URL.revokeObjectURL(url);
        document.body.removeChild(link);
      }
    },
    onError: (error: any) => {
      toast.error(error?.response?.data?.message || "Unable to generate!");
    },
  });
  const { mutateAsync: update } = useMutation({
    mutationFn: updateChat,

    onError: (error: any) => {
      toast.error(error?.response?.data?.message || "Unable to Update Chat");
    },
  });
  const { mutateAsync: fileData } = useMutation({
    mutationFn: getFileData,
  });

  const handleSend = async (message: string) => {
    const newMessage = {
      message: message,
      direction: "outgoing",
      sender: "user",
    };

    const newMessages = [...messages, newMessage];
    if (id) {
      setMessages(newMessages);
      await proceesMessage(newMessages);
    }
  };
  const handleKeyDown = async (event: any) => {
    if (event.key === "Enter" && !isThinking) {
      event.preventDefault(); // Prevent default form submission
      const inputValue = event.target.value.trim();
      if (inputValue) {
        handleSend(inputValue);
        setCurrentMessage("");

        event.target.value = ""; // Clear the input after sending
      }
    }
  };

  async function proceesMessage(chatMessage: any) {
    setisThinking(true);
    dispatch(updateLoader(false));
    let apiMessages = chatMessage?.map((singleMessage: any) => {
      let role = "";
      if (singleMessage?.sender == "chatgpt") {
        role = "assistant";
      } else {
        role = "user";
      }
      return { role: role, content: singleMessage?.message };
    });
    const newMessage = {
      role: "user",
      content:
        "This is the content of the company related document:" +
        FileText +
        "This is company Info:" +
        loggedInUser?.user_info?.companyInfo,
    };

    const res = await chatgtpApi?.completion(
      [newMessage, ...apiMessages],
      `${location?.pathname?.includes("pressRelease") ? instructions?.PR : location?.pathname?.includes("earningScript") ? instructions?.ES : instructions?.qna}\n${adminGenerate + Usergenerate}`,
    );

    if (id)
      await update({
        _id: id,
        messages: res
          ? [
              ...chatMessage,
              {
                message: res?.data?.choices[0]?.message?.content,
                direction: "incoming",
                sender: "chatgpt",
                token: res?.data.usage?.total_tokens,
              },
            ]
          : [...chatMessage],
      });
    if (!res) {
      toast.error("Unable to get Response");
      setisThinking(false);
      return;
    }
    setisThinking(false);
    if (id) {
      setMessages([
        ...chatMessage,
        {
          message: res?.data?.choices[0]?.message?.content,
          direction: "incoming",
          sender: "chatgpt",
          token: res?.data.usage?.total_tokens,
        },
      ]);
    }
  }

  const setFilesData = async () => {
    const files = await fileData({
      user_id: currentUser?.user_info?._id,
      docType: location?.pathname?.includes("pressRelease")
        ? "Press Relase"
        : "Earning Script",
    });

    setFileText(files?.data);
  };
  const handlePath = () => {
    if (location?.pathname?.includes("pressRelease")) {
      setUserGenerate(loggedInUser?.user_info?.PRchatInstruction || "");
      setAdminGenerate(adminData?.data[0]?.PRchatInstruction || "");
    } else if (location?.pathname?.includes("earningScript")) {
      setUserGenerate(loggedInUser?.user_info?.ECSchatInstruction || "");
      setAdminGenerate(adminData?.data[0]?.ECSchatInstruction || "");
    } else if (location?.pathname?.includes("qna")) {
      setUserGenerate(loggedInUser?.user_info?.QnAchatInstruction || "");
      setAdminGenerate(adminData?.data[0]?.QnAchatInstruction || "");
    }
  };
  const handleDownloadFile = async (item: any) => {
    const mark = marked(item?.message.replace(/"/g, "&quot;"), {
      breaks: true, // Converts newlines to <br />
    });
    await mutateAsync({
      text: mark,
      companyName: loggedInUser?.user_info?.companyName,
      docType: `${location?.pathname?.includes("pressRelease") ? "Press Relase" : "Earning Script"}`,
      user_id: loggedInUser?.user_info?._id,
    });
  };
  const handleSendMsg = () => {
    if (currentMessage !== "" && !isThinking) {
      handleSend(currentMessage);
      setCurrentMessage("");
    }
  };
  useEffect(() => {
    handlePath();
  }, [location, loggedInUser, adminData]);
  useEffectAsync(async () => {
    setMessages(data?.data?.messages);

    if (
      data?.data?.messages?.length === 1 &&
      chatType === "chatbox" &&
      FileText
    ) {
      await proceesMessage(data?.data?.messages);
    }
  }, [FileText, location]);
  useEffectAsync(async () => {
    await setFilesData();
  }, []);

  return (
    <div className="flex flex-col  flex-grow min-h-full p-10">
      <MainContainer>
        <ChatContainer>
          <MessageList
            className="h-[calc(100vh-365px)] overflow-visible  "
            scrollBehavior="smooth"
          >
            {messages?.map((item: any, i: number) => {
              return (
                <div
                  className={`${item?.sender == "chatgpt" ? "flex gap-4" : ""}`}
                >
                  {item?.sender == "chatgpt" && item?.message && (
                    <Avatar
                      name="Zoe"
                      size="md"
                      src={hippoLogo}
                      className="bg-[#FDEAE9] p-2"
                    />
                  )}
                  {item?.sender == "chatgpt" && item?.message && (
                    <div className="flex flex-col w-full ">
                      <p className="text-[#1B2559] font-bold font-PlusJakartaSans text-base">
                        Bot
                      </p>
                      <Message
                        key={i}
                        model={{ ...item, type: "custom" }}
                        className="w-2/3"
                      >
                        <Message.CustomContent>
                          <ReactMarkdown>{item?.message}</ReactMarkdown>
                        </Message.CustomContent>
                      </Message>
                      <div></div>
                      {
                        <div
                          className={` border-2 rounded-full hover:bg-[#F8FAFC]  w-8 h-8  flex justify-center items-center mt-4`}
                        >
                          <DownloadIcon
                            onClick={() => handleDownloadFile(item)}
                          />
                        </div>
                      }
                    </div>
                  )}
                  {item?.sender !== "chatgpt" && (
                    <div>
                      <Message
                        key={i}
                        model={{ ...item, type: "custom" }}
                        className="w-2/5"
                      >
                        <Message.CustomContent>
                          <ReactMarkdown>{item?.message}</ReactMarkdown>
                        </Message.CustomContent>
                      </Message>
                    </div>
                  )}
                </div>
              );
            })}
          </MessageList>
        </ChatContainer>
      </MainContainer>

      <div className="mt-8 flex justify-center flex-col items-center z-[10] ">
        <div className=" !p-0 w-full min-h-8 ">
          {isThinking ? <Loader /> : null}
        </div>

        <div className=" w-4/5 flex items-center border-2 border-[#CBD5E1] rounded-full p-3  ">
          <PaperClip />
          <Input
            value={currentMessage}
            placeholder="Message Bot..."
            wrapperClass="!border-none"
            onChange={(e: any) => setCurrentMessage(e.target.value)}
            onKeyDown={handleKeyDown}
            topMostWrapper="!h-[40px] overflow-hidden !mb-0 flex items-center "
          />
          <SendArrow isThinking={isThinking} onClick={handleSendMsg} />
        </div>
        <p className="text-center text-[#475569] text-[14px] font-semibold font-PlusJakartaSans select-none mt-4  ">
          Bot can make mistakes. Check our Terms & Conditions.
        </p>
      </div>
    </div>
  );
};

export default UpdatedChat;
