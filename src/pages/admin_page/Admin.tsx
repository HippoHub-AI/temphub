import CompanyUsers from "@components/client-listing/clientListing";
import { Button } from "@components/common";
import Create, {
  CreateCompanyFormValues,
  InstructionFormValues,
} from "@components/create-company/Create";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useFormik } from "formik";
import { useEffect, useRef, useState } from "react";
import { toast } from "react-toastify";
import UserApi from "@api/user.api";
import { CreateUserDto } from "@dto/createUser.dto";
import { useDispatch, useSelector } from "react-redux";
import {
  changeInstruction,
  isInstructionOpen,
} from "@redux/slices/popup.slice";
import { UpdateInstructionDto } from "@dto/instruction.dto";
import { selectUser, update } from "@redux/slices/userSlice";
import Loader2 from "@components/Loader/Loader";
import { updateLoader } from "@redux/slices/loaderSlice";

const initialValues: CreateCompanyFormValues = {
  companyName: "",
  email: "",
};

const Admin = () => {
  const [isPopupOpen, setIsPopupOpen] = useState<boolean>(false);
  const [image, setImage] = useState<File>();
  const [isDisabled, setIsDisabled] = useState<boolean>(false);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [rowsPerPage, setRowsPerPage] = useState<number>(10);
  const [paginatedPayload, setPaginatedPayload] = useState<{
    paginationNumber: number;
    pageNo: number;
  }>({ paginationNumber: 10, pageNo: 1 });

  const userApi = new UserApi();
  const dispatch = useDispatch();
  const queryClient = useQueryClient();
  const instructionPop = useSelector(isInstructionOpen);
  const loggedInUser = useSelector(selectUser);
  const popupRef = useRef<HTMLDivElement | null>(null);

  const instruction: InstructionFormValues = {
    PRchatInstruction: loggedInUser?.user_info?.PRchatInstruction,
    ECSchatInstruction: loggedInUser?.user_info?.ECSchatInstruction,
    QnAchatInstruction: loggedInUser?.user_info?.QnAchatInstruction,
  };

  const fetchAllClients = async () => {
    dispatch(updateLoader(true));
    const res = await userApi.getPaginatedData(paginatedPayload);
    dispatch(updateLoader(false));
    return res;
  };

  const { data } = useQuery({
    queryKey: ["fetchClients", paginatedPayload],
    queryFn: fetchAllClients,
    refetchOnWindowFocus: false,
  });

  const getCompaniesData = async () => {
    return await userApi.getAllCompanies();
  };

  const { data: companiesData } = useQuery({
    queryKey: ["companiesData"],
    queryFn: getCompaniesData,
  });

  const form = useFormik({
    initialValues,
    validationSchema: CreateUserDto.yupSchema(),
    onSubmit: async (values) => {
      await mutateAsync({ ...values, img: image });
    },
  });

  const instructionForm = useFormik({
    initialValues: instruction,
    validationSchema: UpdateInstructionDto.yupSchema(),
    onSubmit: async (values) => {
      await updateInstruction({
        ...values,
        user_id: loggedInUser?.user_info?._id,
      });
    },
  });

  const CreateUser = async (values: CreateUserDto) => {
    return await userApi.createUser(values);
  };
  const updateAdminInstruction = async (values: {
    user_id: string;
    PRchatInstruction: string;
    ECSchatInstruction: string;
    QnAchatInstruction: string;
  }) => {
    return await userApi.updateAdminInstruction(values);
  };
  const disableUser = async (value: any) => {
    const obj: any = {
      _id: value?.id,
      is_disabled: !value?.disable,
      keyCloack_id: value?.keycloak_id,
    };
    return await userApi.disableUser(obj);
  };

  const { mutateAsync } = useMutation({
    mutationFn: CreateUser,
    onSuccess: () => {
      toast.success("User Invitation Sent!");
      dispatch(updateLoader(false));
      queryClient.invalidateQueries({ queryKey: ["fetchClients"] });
      form.resetForm();
      closeCreatePopup();
    },
    onError: (error: any) => {
      toast.error(
        error?.response?.data?.message || "Unable to sent the invitation",
      );
      dispatch(updateLoader(false));
      OpenCreatePopup();
    },
  });
  const { mutateAsync: disable } = useMutation({
    mutationFn: disableUser,
    onMutate: () => setIsDisabled(true),
    onSuccess: (res: any) => {
      queryClient.invalidateQueries({ queryKey: ["fetchClients"] });

      toast.success(
        res?.data?.is_disabled
          ? "User has been disabled!"
          : "User has been enabled!",
      );
      setIsDisabled(false);
    },
    onError: (error: any) => {
      toast.error(
        error?.response?.data?.message || "Unable to change user status",
      );
      setIsDisabled(false);
    },
  });
  const { mutateAsync: updateInstruction } = useMutation({
    mutationFn: updateAdminInstruction,
    onSuccess: (res: any) => {
      toast.success("Admin Instruction Updated");
      dispatch(update(res?.data));
      closeCreatePopup();
    },
    onError: (error: any) => {
      toast.error(
        error?.response?.data?.message || "Unable to Update Instruction",
      );
    },
  });

  const handleOutsideClick = () => {
    const clickOutside = (event: MouseEvent) => {
      if (
        popupRef.current &&
        !popupRef.current.contains(event.target as Node)
      ) {
        setIsPopupOpen(false);
        dispatch(changeInstruction(false));
        form?.resetForm();
      }
    };

    document.addEventListener("mousedown", clickOutside);

    return () => {
      document.removeEventListener("mousedown", clickOutside);
    };
  };
  const closeCreatePopup = () => {
    setIsPopupOpen(false);
    dispatch(changeInstruction(false));
  };
  const OpenCreatePopup = () => {
    setIsPopupOpen(true);
  };
  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const handleRowsPerPageChange = (rowsPerPage: number) => {
    setRowsPerPage(rowsPerPage);
  };
  useEffect(() => {
    setPaginatedPayload({ paginationNumber: rowsPerPage, pageNo: currentPage });
  }, [currentPage, rowsPerPage]);

  useEffect(() => {
    fetchAllClients();
  }, [paginatedPayload]);
  useEffect(() => {
    handleOutsideClick();
  }, [popupRef]);

  return (
    <>
      {isDisabled && <Loader2 />}
      <div className=" rounded-lg p-6 flex justify-between items-center  ">
        <div className="flex w-2/3 justify-between items-center">
          <div className="flex flex-col  ">
            <h3 className="text-[#1B2559] text-[16px] font-medium">
              Total Companies
            </h3>
            <p className="text-[#1B2559] font-bold text-[24px] font-PlusJakartaSans">
              {(companiesData && companiesData?.data?.totalCompanies) || 0}
            </p>
          </div>
          <div className="flex flex-col  ">
            <h3 className="text-[#1B2559] text-[16px] font-medium">
              Active Companies
            </h3>
            <p className="text-[#1B2559] font-bold text-[24px] font-PlusJakartaSans">
              {(companiesData && companiesData?.data?.activeCount) || 0}
            </p>
          </div>
          <div className="flex flex-col  ">
            <h3 className="text-[#1B2559] text-[16px] font-medium">
              Inactive Companies
            </h3>
            <p className="text-[#1B2559] font-bold text-[24px] font-PlusJakartaSans">
              {(companiesData && companiesData?.data?.inactiveCount) || 0}
            </p>
          </div>
          <div className="flex flex-col   ">
            <h3 className="text-[#1B2559] text-[16px] font-medium">
              Unverified Companies
            </h3>
            <p className="text-[#1B2559] font-bold text-[24px] font-PlusJakartaSans">
              {(companiesData && companiesData?.data?.unVerifiedCount) || 0}
            </p>
          </div>
        </div>

        <Button
          onClick={OpenCreatePopup}
          className={`bg-[#1B2559] hover:bg-[#1B2559] rounded-lg cursor-pointer  py-4 px-14  font-PlusJakartaSans text-[18px] font-normal `}
        >
          Add New Company
        </Button>
      </div>
      {(instructionPop || isPopupOpen) && (
        <Create
          instructionForm={instructionForm}
          ref={popupRef}
          image={image}
          instruction={instructionPop}
          setImage={setImage}
          onClose={closeCreatePopup}
          form={form}
        />
      )}

      <div className=" rounded-lg  p-6">
        <CompanyUsers
          clientList={data && data?.data?.result}
          clientListLength={
            companiesData && companiesData?.data?.totalCompanies
          }
          disable={disable}
          setPaginatedPayload={setPaginatedPayload}
          handlePageChange={handlePageChange}
          handleRowsPerPageChange={handleRowsPerPageChange}
        />
      </div>
    </>
  );
};

export default Admin;
