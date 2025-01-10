import React, { useState } from "react";
import styles from "./Tabs.module.css";

export interface TabsProps {
  TabsData: any[];
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
  setSelectedField: React.Dispatch<
    React.SetStateAction<{ value: any; field: string }>
  >;
  setCurrInstruction: React.Dispatch<React.SetStateAction<string>>;
}

const Tabs: React.FC<TabsProps> = ({
  TabsData,
  setOpen,
  setSelectedField,
  setCurrInstruction,
}) => {
  const [activeTab, setActiveTab] = useState<string>(TabsData[0]?.label);

  const handleActiveTab = (tab: any) => {
    setActiveTab(tab?.label);
  };

  const handleTabClick = (tab: any) => {
    handleActiveTab(tab);
    if (tab.label === "PR Instructions") {
      setSelectedField({ value: tab.value, field: "PRchatInstruction" });
    } else if (tab.label === "ECS Instructions") {
      setSelectedField({ value: tab.value, field: "ECSchatInstruction" });
    } else if (tab.label === "QnA Instructions") {
      setSelectedField({ value: tab.value, field: "QnAchatInstruction" });
    } else {
      setSelectedField({ value: tab.value, field: "PRchatInstruction" });
    }
    setCurrInstruction(tab.label);
  };

  return (
    <div className=" w-full p-3 rounded-xl ">
      <div className=" flex justify-between">
        <div className="flex gap-4 md:gap-10 flex-wrap">
          {TabsData &&
            TabsData?.map((item: any, index: number) => {
              return (
                <div key={index}>
                  <button
                    key={index}
                    className={
                      item?.label === activeTab
                        ? `${styles.active}  border-b-2 border-[#1B2559] !font-Arimo !font-bold !text-xl font-PlusJakartaSans`
                        : "text-[#8B8B8B] !font-Arimo !font-normal !text-xl font-PlusJakartaSans"
                    }
                    onClick={() => handleTabClick(item)}
                  >
                    <span
                      className={
                        item?.label === activeTab
                          ? `${styles.gradientText}`
                          : ""
                      }
                    >
                      {item?.label}
                    </span>
                  </button>
                </div>
              );
            })}
        </div>
        <button
          onClick={() => {
            setOpen((prev) => !prev);
          }}
          className="text-gray-500 text-3xl"
        >
          &times;
        </button>
      </div>

      <div className="mt-4 p-2 rounded-xl">
        {TabsData &&
          TabsData?.map((item: any, index: number) => {
            return (
              <div key={index}>
                {item?.label === activeTab ? item?.content : null}
              </div>
            );
          })}
      </div>
    </div>
  );
};

export default Tabs;
