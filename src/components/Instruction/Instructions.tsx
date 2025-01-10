import { Button, TextArea } from "@components/common";
import Tabs from "@components/common/Tabs/Tabs";
import { CreateUserDto } from "@dto/createUser.dto";
import { updateLoader } from "@redux/slices/loaderSlice";
import { selectUser } from "@redux/slices/userSlice";
import { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

interface CompanyInfoProps {
  userId?: string;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
  mutateAsync: (data: CreateUserDto) => Promise<any>;
}

const Instructions = ({ userId, setOpen, mutateAsync }: CompanyInfoProps) => {
  const user = useSelector(selectUser);
  const PRChatInstruction = user?.user_info?.PRchatInstruction;
  const ECSChatInstruction = user?.user_info?.ECSchatInstruction;
  const QnAChatInstruction = user?.user_info?.QnAchatInstruction;

  const [currInstruction, setCurrInstruction] = useState("PR Instructions");
  const [selectedField, setSelectedField] = useState({
    value: PRChatInstruction,
    field: "PRchatInstruction",
  });

  const dispatch = useDispatch();
  const popupRef = useRef<HTMLDivElement | null>(null);
  const tabsData = [
    {
      label: "PR Instructions",
      value: PRChatInstruction,
    },
    {
      label: "ECS Instructions",
      value: ECSChatInstruction,
    },
    {
      label: "QnA Instructions",
      value: QnAChatInstruction,
    },
  ];

  const handleClickOutside = (event: MouseEvent) => {
    if (popupRef.current && !popupRef.current.contains(event.target as Node)) {
      setOpen(false);
    }
  };
  const handleUpdate = async () => {
    dispatch(updateLoader(true));
    try {
      await mutateAsync({
        userId,
        [selectedField.field]: selectedField.value,
      });
      setOpen((prev) => !prev);
    } catch (error) {
      console.error("Error updating:", error);
    } finally {
      dispatch(updateLoader(false));
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
      <div className="fixed inset-0 flex items-center justify-center bg-gray-900 bg-opacity-50 z-50">
        <div className="bg-white rounded-lg shadow-lg w-3/4 p-4" ref={popupRef}>
          <Tabs
            TabsData={tabsData}
            setOpen={setOpen}
            setCurrInstruction={setCurrInstruction}
            setSelectedField={setSelectedField}
          />

          <div className="overflow-y-auto h-3/4 mb-2">
            <TextArea
              value={selectedField && selectedField.value}
              placeholder="Give clear instructions to customize your output as you like, add rules like Do's and Don'ts."
              className="h-[350px]"
              onChange={(e) =>
                setSelectedField({
                  ...selectedField,
                  value: e.target.value,
                })
              }
            />
          </div>

          <div className="flex justify-end ">
            <Button
              onClick={handleUpdate}
              className={`bg-[#1B2559] hover:bg-[#1B2559] rounded-lg cursor-pointer  p-4  font-PlusJakartaSans text-[14px] font-normal`}
            >
              Update {currInstruction}
            </Button>
          </div>
        </div>
      </div>
    </>
  );
};

export default Instructions;
