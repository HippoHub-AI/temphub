import { Button, TextArea } from "@components/common";
import { CreateUserDto } from "@dto/createUser.dto";
import { updateLoader } from "@redux/slices/loaderSlice";
import { useEffect, useRef, useState } from "react";
import { useDispatch } from "react-redux";

interface CompanyInfoProps {
  userId?: string;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
  mutateAsync: (data: CreateUserDto) => Promise<any>;
  companyInfo?: string;
}

const CompanyInfo = ({
  userId,
  setOpen,
  mutateAsync,
  companyInfo,
}: CompanyInfoProps) => {
  const [selectedField, setSelectedField] = useState({
    field: "companyInfo",
    value: companyInfo,
  });

  const dispatch = useDispatch();
  const popupRef = useRef<HTMLDivElement | null>(null);

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
          <div className="flex justify-between items-center mb-2  pb-4">
            <h2 className="text-[#1B2559] font-semibold text-[24px] ">
              Company Info
            </h2>
            <button
              onClick={() => {
                setOpen((prev) => !prev);
              }}
              className="text-gray-500 text-3xl"
            >
              &times;
            </button>
          </div>

          <div className="overflow-y-auto h-3/4 my-2">
            <TextArea
              value={selectedField && selectedField?.value}
              placeholder="For any company information which is not part of document upload like, company about page, or wikipedia e.t.c"
              className="h-[350px]"
              onChange={(e) =>
                setSelectedField({
                  ...selectedField,
                  value: e?.target?.value,
                })
              }
            />
          </div>

          <div className="flex justify-end ">
            <Button
              onClick={handleUpdate}
              className={`bg-[#1B2559] hover:bg-[#1B2559] rounded-lg cursor-pointer  p-4  font-PlusJakartaSans text-[14px] font-normal`}
            >
              Update Company Info
            </Button>
          </div>
        </div>
      </div>
    </>
  );
};

export default CompanyInfo;
