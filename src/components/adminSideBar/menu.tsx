import { ROUTE_ADMIN } from "@routes/constants";
import { useNavigate } from "react-router-dom";
import { BuildingIcon } from "svg";
const options = [
  {
    tittle: "Companies List",
    icon: <BuildingIcon />,
    naviagteTo: ROUTE_ADMIN,
  },
];
export default function MenuOptions() {
  const navigate = useNavigate();

  return (
    <div className="w-full  p-6 flex flex-col gap-2 ">
      {options &&
        options?.map((item, index: number) => {
          return (
            <div
              key={index}
              className="bg-[#1B2559] flex p-4 justify-center items-center rounded-lg gap-3 cursor-pointer"
              onClick={() => navigate(item?.naviagteTo)}
            >
              {item?.icon}
              <p className="font-PlusJakartaSans text-[#FFFFFF] font-semibold text-sm select-none">
                {item?.tittle}
              </p>
            </div>
          );
        })}
    </div>
  );
}
