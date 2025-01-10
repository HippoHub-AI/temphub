import { toast } from "react-toastify";
import { useFormik } from "formik";
import { FaEdit } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Alert, Menu, MenuItem } from "@mui/material";

import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Button } from "@components/common";
import DocFileIcon from "@public/DocFileIcon.svg";
import ExcelFileIcon from "@public/ExcelFileIcon.svg";
import PdfFileIcon from "@public/PdfFileIcon.svg";
import { selectUser } from "@redux/slices/userSlice";
import CustomPagination from "@components/CustomPagination/CustomPagination";
import VaultApi from "@api/vault.api";
import { UpdateFileDto } from "@dto/updateFile.dto";
import { UploadFileDto } from "@dto/uploadFile.dto";
import { updateLoader } from "@redux/slices/loaderSlice";
import { ROUTE__UPDATE_VAULT, ROUTE_CREATE_FILE } from "@routes/constants";

import {
  DeleteIcon,
  ThreeVerticalDots,
  CancelCircle,
  CheckmarkCircle,
} from "svg";

const MyVault = () => {
  const [openIndex, setOpenIndex] = useState<number>(-1);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [resultsPerPage, setResultsPerPage] = useState<number>(10);
  const [edit, isEdit] = useState<string | null>(null);
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [editID, setEditID] = useState<string | null>(null);
  const [bulkDelete, setBulkDelete] = useState<string[]>([]);
  const [checked, setChecked] = useState<boolean>(false);
  const [name, setName] = useState<string>("");

  const Vault = new VaultApi();
  const navigate = useNavigate();
  const loggedInUser = useSelector(selectUser);
  const queryClient = useQueryClient();
  const dispatch = useDispatch();

  const deleteFile = async (id: { fileId: string }) => {
    const response = await Vault?.deleteFile(id);
    return response;
  };

  const { mutateAsync } = useMutation({
    mutationFn: deleteFile,
    onSuccess: async () => {
      handleClose();
      toast.success("Document Deleted!");
      await PaginatedData({
        paginationNumber: Number(resultsPerPage),
        pageNo: currentPage,
      });
    },
    onError: (error: any) => {
      handleClose();
      toast.error(
        error?.response?.data?.message || "Unable to delete the file!",
      );
    },
  });

  const paginatedDataa = async ({
    paginationNumber,
    pageNo,
  }: {
    paginationNumber: number;
    pageNo: number;
  }) => {
    dispatch(updateLoader(true));

    const user_id = loggedInUser?.user_info?._id;
    const newData = await Vault.getPaginatedData(
      user_id,
      paginationNumber,
      pageNo,
    );

    checkAllSelected(newData);

    return newData;
  };

  const { mutateAsync: PaginatedData, data: paginationData } = useMutation({
    mutationFn: paginatedDataa,
    onSuccess: async () => {
      dispatch(updateLoader(false));
    },
    onError: (error: any) => {
      toast.error(
        error?.response?.data?.message || "Unable to get paginated file data!",
      );
      dispatch(updateLoader(false));
    },
  });

  const myPaginatedData = async () => {
    await PaginatedData({
      paginationNumber: 10,
      pageNo: currentPage,
    });
  };

  const updateFiles = async (fileData: UpdateFileDto[]) => {
    return await Vault.updateFiles(fileData);
  };

  const { mutateAsync: updateDoc } = useMutation({
    mutationFn: updateFiles,
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["GetFiles"] });
      await PaginatedData({
        paginationNumber: Number(resultsPerPage),
        pageNo: currentPage,
      });
      toast.success("File Updated!");
    },
    onError: (error: any) => {
      toast.error(
        error?.response?.data?.message || "Unable to updated the files!",
      );
    },
  });

  const form = useFormik({
    initialValues: new UploadFileDto(),
    validationSchema: UploadFileDto.yupSchema(),
    onSubmit: async (values: any) => {
      dispatch(updateLoader(true));
      await updateDoc(values?.UploadFile);
      dispatch(updateLoader(false));
    },
  });

  const deleteBulk = async (ids: string[]) => {
    await Vault.bulkDelete(ids);
    setCurrentPage(1);
    await PaginatedData({
      paginationNumber: Number(resultsPerPage),
      pageNo: 1,
    });
  };

  const { mutateAsync: bulkDeletee } = useMutation({
    mutationFn: deleteBulk,
    onSuccess: async () => {
      toast.success("Files Deleted Successfully!");
      setBulkDelete([]);
      setChecked(false);
    },
    onError: (error: any) => {
      toast.error(
        error?.response?.data?.message || "Unable to delete the files!",
      );
      setChecked(true);
    },
  });

  const checkAllSelected = (newData: any) => {
    const newDataIds = newData?.data[0]?.data?.map((item: any) => item._id);

    const isAllSelected = newDataIds?.every((id: string) =>
      bulkDelete?.includes(id),
    );

    setChecked(bulkDelete.length === 0 ? false : isAllSelected);
  };
  const cancelRequest = () => {
    form?.setValues({ UploadFile: paginationData?.data[0]?.data });
  };

  const handleCheckboxChange = (
    event: React.ChangeEvent<HTMLInputElement>,
    id: string,
  ) => {
    if (event?.target?.checked) {
      setBulkDelete((prev) => prev?.filter((item) => item !== id));
      setBulkDelete((prev) => [...prev, id]);
      checkAllSelected(paginationData);
    } else {
      setBulkDelete((prev) => prev?.filter((item) => item !== id));
      checkAllSelected(paginationData);
    }
  };

  const handleAllCheckboxChange = (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const allIds = paginationData?.data[0]?.data.map((item: any) => item._id);
    if (event?.target?.checked) {
      setBulkDelete((prev) => Array.from(new Set([...prev, ...allIds])));
      allIds?.forEach((id: string) => checkDelete(id));
    } else {
      setBulkDelete((prev) => prev?.filter((id) => !allIds?.includes(id)));
    }
    setChecked(event?.target?.checked);
  };

  const checkDelete = (id: string) => {
    return bulkDelete?.some((ids) => ids === id);
  };

  const handleNameChange = (newName: string) => {
    setName(newName);
  };

  const handleMenuClick = (
    event: React.MouseEvent<HTMLButtonElement>,
    index: number,
  ) => {
    setAnchorEl(event?.currentTarget);
    setOpenIndex(index);
  };

  const handleClose = () => {
    setAnchorEl(null);
    setOpenIndex(-1);
  };

  useEffect(() => {
    form?.setValues({ UploadFile: paginationData?.data[0]?.data });
  }, [paginationData?.data[0]?.data]);

  useEffect(() => {
    myPaginatedData();
  }, []);

  useEffect(() => {
    if (
      paginationData &&
      paginationData?.data[0] &&
      paginationData?.data[0]?.data
    ) {
      checkAllSelected(paginationData);
    }
  }, [bulkDelete, paginationData]);

  useEffect(() => {
    form?.setValues({ UploadFile: paginationData?.data[0]?.data });
  }, [paginationData?.data[0]?.data]);

  useEffect(() => {
    myPaginatedData();
  }, []);

  return (
    <>
      <Alert severity="info" className="text-lg font-semibold md:mx-20 my-4">
        {`Add relevant company documents like past Press Releases and Earning Call Scripts for the System to learn from. `}
      </Alert>
      <form onSubmit={form?.handleSubmit} className="w-full">
        <div className="flex items-center justify-between">
          {bulkDelete?.length > 0 ? (
            <span className="text-[#1B2559] font-PlusJakartaSans text-2xl font-bold flex items-center mb-6 pt-4 pl-4">
              Selected Records: {bulkDelete?.length}
            </span>
          ) : (
            <span></span>
          )}
          <div className="flex items-center gap-4 justify-end mb-6 pt-4 ">
            {bulkDelete?.length > 0 && (
              <Button
                type="button"
                className={`flex justify-end py-2 px-4 ${bulkDelete.length !== 0 ? "cursor-pointer bg-red-500 hover:bg-red-400" : ""}`}
                onClick={() => bulkDeletee(bulkDelete)}
                disabled={bulkDelete?.length === 0}
              >
                Delete
              </Button>
            )}

            <Button
              className="py-2 px-4"
              onClick={() => navigate(ROUTE__UPDATE_VAULT)}
              type="button"
            >
              Upload
            </Button>
            <Button
              className={`bg-[#1B2559] hover:bg-[#1B2559]  py-2 px-4 `}
              onClick={() => navigate(ROUTE_CREATE_FILE)}
              type="button"
            >
              Create
            </Button>
          </div>
        </div>
        <table className="table-fixed w-full">
          <div className=" bg-[#E0E5F2] border-[#E0E5F2] border-r border-b border-solid w-full rounded-t-lg">
            <tr className="table-row-group text-[#1B2559] font-PlusJakartaSans text-sm">
              <td className="w-4 pl-6 p-4 font-PlusJakartaSans flex items-center justify-center">
                <input
                  type="checkbox"
                  checked={checked}
                  onChange={(e) => handleAllCheckboxChange(e)}
                />
              </td>
              <td className="w-1/12 pl-6 p-4 font-PlusJakartaSans">ID</td>
              <td className="w-full font-PlusJakartaSans">File Name</td>

              <td className="w-1/12 p-4 font-PlusJakartaSans">Action</td>
            </tr>
          </div>

          <div className=" ">
            <form>
              {paginationData &&
                paginationData?.data[0]?.data &&
                paginationData?.data[0]?.data?.length !== 0 && (
                  <div className="">
                    {paginationData?.data[0]?.data &&
                      paginationData?.data[0]?.data?.map(
                        (item: any, index: number) => {
                          const paddedIndex = (
                            (currentPage - 1) * resultsPerPage +
                            index +
                            1
                          )
                            ?.toString()
                            ?.padStart(5, "0");

                          return (
                            <div
                              key={paddedIndex}
                              className="flex items-center justify-start border-b border-[#E0E5F2]"
                            >
                              <td className="w-8 flex items-center justify-center font-PlusJakartaSans text-[#1e1e1e] p-5 border-r border-[#E0E5F2] text-sm  ">
                                <input
                                  type="checkbox"
                                  checked={bulkDelete?.includes(item?._id)}
                                  onChange={(e) => {
                                    handleCheckboxChange(e, item?._id);
                                    checkAllSelected(paginationData);
                                  }}
                                />
                              </td>

                              <td className="w-1/12 items-center font-PlusJakartaSans text-[#1e1e1e] p-3.5 border-r border-[#E0E5F2] text-sm flex gap-1">
                                <p>{paddedIndex}</p>
                              </td>

                              <td
                                className="w-full font-PlusJakartaSans flex items-center justify-between p-3.5 border-r border-[#E0E5F2]"
                                onMouseEnter={() => {
                                  isEdit(item?._id);
                                }}
                              >
                                <div className="flex gap-2 items-center w-full">
                                  <img
                                    src={
                                      item?.mimetype?.includes("pdf")
                                        ? PdfFileIcon
                                        : item?.mimetype?.includes(
                                              "vnd.ms-excel",
                                            ) ||
                                            item?.mimetype?.includes(
                                              "vnd.openxmlformats-officedocument.spreadsheetml.sheet",
                                            )
                                          ? ExcelFileIcon
                                          : DocFileIcon
                                    }
                                    alt=""
                                  />

                                  {isEditing && editID === item._id ? (
                                    <div className="flex items-center justify-between gap-2">
                                      <input
                                        className="w-full font-PlusJakartaSans font-normal text-sm text-[#475569] p-1 border border-[#8b8b8b] outline-none rounded-lg"
                                        value={name}
                                        onKeyDown={(event: any) => {
                                          if (event?.key === "Enter") {
                                            event?.preventDefault(); // Prevent default form submission
                                            const inputValue =
                                              event?.target?.value?.trim();
                                            if (inputValue) {
                                              form?.setFieldValue(
                                                `UploadFile[${index}].originalName`,
                                                name,
                                              );
                                              form?.handleSubmit();
                                              // setCancel(true);
                                              // setIsChange(true);
                                              setIsEditing(false);
                                              event.target.value = "";
                                            }
                                          }
                                        }}
                                        onChange={(
                                          e: React.ChangeEvent<HTMLInputElement>,
                                        ) => handleNameChange(e?.target?.value)}
                                      />

                                      <div className="flex w-full ">
                                        <span
                                          className="cursor-pointer"
                                          onClick={() => {
                                            form?.setFieldValue(
                                              `UploadFile[${index}]?.originalName`,
                                              name,
                                            );
                                            form?.handleSubmit();
                                            setIsEditing(false);
                                          }}
                                        >
                                          <CheckmarkCircle />
                                        </span>
                                        <span
                                          className="cursor-pointer"
                                          onClick={() => {
                                            isEdit(null);
                                            setEditID(null);
                                            setIsEditing(false);
                                            cancelRequest();
                                          }}
                                        >
                                          <CancelCircle />
                                        </span>
                                      </div>
                                    </div>
                                  ) : (
                                    <p className="font-PlusJakartaSans font-normal text-sm text-[#475569] break-all ">
                                      {item?.originalName}
                                    </p>
                                  )}
                                </div>

                                <div
                                  className="cursor-pointer"
                                  onClick={() => {
                                    setIsEditing(true);
                                    setEditID(item?._id);
                                    setName(item?.originalName);
                                  }}
                                >
                                  {edit === item?._id && !isEditing && (
                                    <FaEdit />
                                  )}
                                </div>
                              </td>

                              <div
                                className="flex justify-center items-center w-1/12 p-3.5 border-r border-[#E0E5F2]"
                                key={index}
                              >
                                <ThreeVerticalDots
                                  onClick={(event: any) =>
                                    handleMenuClick(event, index)
                                  }
                                />
                                <Menu
                                  className="p-3 "
                                  sx={{
                                    "& .MuiPaper-root": {
                                      backgroundColor: "#FFFFFF",
                                      borderRadius: "8px",
                                      padding: "12px",
                                      boxShadow:
                                        "box-shadow: 6px 6px 54px 0px #00000014;",
                                    },
                                  }}
                                  id="basic-menu"
                                  anchorEl={anchorEl}
                                  open={openIndex === index}
                                  onClose={handleClose}
                                  anchorOrigin={{
                                    vertical: "bottom",
                                    horizontal: "right",
                                  }}
                                  transformOrigin={{
                                    vertical: "top",
                                    horizontal: "right",
                                  }}
                                  MenuListProps={{
                                    "aria-labelledby": "basic-button",
                                  }}
                                >
                                  <MenuItem
                                    sx={{
                                      color: "red",
                                      fontWeight: "400",
                                      fontSize: "12px",
                                      display: "flex",
                                      gap: "5px",
                                    }}
                                    onClick={async () => {
                                      await mutateAsync({ fileId: item?._id });
                                    }}
                                  >
                                    <DeleteIcon />
                                    Delete
                                  </MenuItem>
                                </Menu>
                              </div>
                            </div>
                          );
                        },
                      )}
                  </div>
                )}
            </form>
          </div>
        </table>

        <CustomPagination
          resultsPerPage={resultsPerPage}
          setResultsPerPage={setResultsPerPage}
          currentPage={currentPage}
          setCurrentPage={setCurrentPage}
          totalRecords={paginationData?.data[0]?.totalCount[0]?.total || 0}
          fetchData={PaginatedData}
        />
      </form>
    </>
  );
};
export default MyVault;
