import VaultApi from "@api/vault.api";
import { Button, Select } from "@components/common";
import { UploadFileDto } from "@dto/uploadFile.dto";
import { Box, Menu, MenuItem, Modal } from "@mui/material";
import DocFileIcon from "@public/DocFileIcon.svg";
import ExcelFileIcon from "@public/ExcelFileIcon.svg";
import PdfFileIcon from "@public/PdfFileIcon.svg";
import { selectUser } from "@redux/slices/userSlice";
import { useMutation } from "@tanstack/react-query";
import { downloadFile } from "@utils/helper";
import { useFormik } from "formik";
import React, { useEffect, useRef, useState } from "react";
import { useSelector } from "react-redux";
import { toast } from "react-toastify";
import {
  CancelIcon,
  DeleteIcon,
  DownloadIcon,
  ThreeVerticalDots,
  UploadFile,
} from "svg";
const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: "60%",
  height: "70%",
  bgcolor: "#FFFFFF",
  border: "none",
  boxShadow: 24,
  borderRadius: "20px",
};
const docType = ["Press Release", "Earning Script", "Other"];
const useFull = ["Press Release", "Earning Script", "Both"];
interface VaultPopupProps {
  onClose: () => void;
  handleFormSubmit?: () => void;
  open?: any;
  isview?: boolean;
}

const VaultPopup: React.FC<VaultPopupProps> = ({
  onClose,
  open,
  isview = false,
  handleFormSubmit,
}) => {
  const [UploadFiles, setUploadedFiles] = useState<File[]>([]);
  const [openIndex, setOpenIndex] = useState<number>(-1);
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const Vault = new VaultApi();
  const fileInputRef: any = useRef(null);
  const loggedInUser = useSelector(selectUser);

  const uploadFile = async (values: FormData) => {
    return await Vault.uploadDocuments(values);
  };
  const { mutateAsync } = useMutation({
    mutationFn: uploadFile,
    onSuccess: () => {
      toast.success("Document Saved To Vault!");
      if (handleFormSubmit) {
        handleFormSubmit();
      }
      onClose();
    },
    onError: (error: any) => {
      toast.error(error?.response?.data?.message || "Unable to Upload!");
    },
  });
  const form = useFormik({
    initialValues: new UploadFileDto(),
    validationSchema: UploadFileDto.yupSchema(),
    onSubmit: async (values: any) => {
      const formData: any = new FormData();

      values?.UploadFile.forEach((item: any) => {
        if (item?.file) {
          formData.append("files", item.file); // Append each file individually
        }
      });
      let filesTag: any = [];
      values?.UploadFile.forEach((item: any) => {
        let tempObj = {
          [item?.file?.name]: {
            docType: item?.docType,
            useFull: item?.useFull,
          }, // Use bracket notation to define the key dynamically
        };
        filesTag?.push(tempObj);
      });

      formData.append("tags", JSON.stringify(filesTag));
      formData.append("user_id", loggedInUser?.user_info?._id);

      await mutateAsync(formData);
    },
  });
  const handleClick = () => {
    fileInputRef.current?.click(); // Trigger the input click
  };

  const deleteDoc = (index: any) => {
    const newItems = UploadFiles?.filter((_, i) => i !== index);
    let formikValues = form?.values.UploadFile?.filter(
      (_: any, i: any) => i !== index,
    );
    form?.setValues({ UploadFile: formikValues });
    setUploadedFiles(newItems);
  };
  const handleUplaodFile = () => {
    let temp: any = [];
    if (!form?.values?.UploadFile || form?.values?.UploadFile?.length == 0) {
      for (let _ of UploadFiles) {
        temp?.push({ docType: "", useFull: "" });
      }
      form?.setValues({ UploadFile: temp });
    }
  };
  const handleMenuClick = (
    event: React.MouseEvent<HTMLButtonElement>,
    index: number,
  ) => {
    setAnchorEl(event.currentTarget);
    setOpenIndex(index);
  };

  const handleClose = () => {
    setAnchorEl(null);
    setOpenIndex(-1);
  };
  const handleFormValue = (e: any, item: any, index: any) => {
    if (form?.values?.UploadFile) {
      let singleFormValue = {
        ...form?.values?.UploadFile[index],
        file: item,
        useFull:
          e?.target?.value === "Press Release" || e?.target?.value === "Other"
            ? "Both"
            : e?.target?.value === "Earning Script"
              ? "Earning Script"
              : "",
        docType: e.target.value,
      };

      form?.setFieldValue(`UploadFile[${index}]`, singleFormValue);
    }
  };
  const handleUploadedFiles = (e: any, item: any, index: number) => {
    if (form?.values?.UploadFile) {
      let singleFormValue = {
        ...form?.values?.UploadFile[index],
        useFull: e.target.value,
        ...item,
      };
      form?.setFieldValue(`UploadFile[${index}]`, singleFormValue);
    }
  };
  const handleUploadFile = (e: any) => {
    if (e?.target?.files && e?.target?.files.length > 0) {
      const array: File[] = Object.values(e?.target?.files);

      setUploadedFiles(array);
    }
  };
  useEffect(() => {
    handleUplaodFile();
  }, [UploadFiles]);

  return (
    <div>
      <Modal
        open={open}
        onClose={onClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <form onSubmit={form.handleSubmit}>
          <Box sx={style}>
            <div className="w-full border-b-[1px] border-[#CBD5E1] p-2 flex justify-between items-center pr-8">
              <p className="font-PlusJakartaSans font-bold text-2xl p-4 text-[#1B2559] ">
                Vault
              </p>
              <CancelIcon onClick={onClose} />
            </div>
            <div
              className={`w-full   h-[75%]  ${UploadFiles && UploadFiles?.length == 0 ? "flex items-center justify-center" : ""} `}
            >
              {UploadFiles && UploadFiles?.length == 0 && (
                <div className="flex flex-col items-center my-6  w-3/4 p-16 mx-auto justify-center border-2 border-[#22244652] rounded-2xl bg-[#F8FAFC] border-dashed">
                  <div
                    className="w-14 h-14 rounded-full bg-gray-100 flex flex-col items-center justify-center shadow-md cursor-pointer "
                    onClick={handleClick}
                  >
                    <UploadFile />
                    <input
                      ref={fileInputRef}
                      id="fileInput"
                      type="file"
                      accept=".pdf, .doc, .docx, .xls, .xlsx, application/pdf, application/msword, application/vnd.openxmlformats-officedocument.wordprocessingml.document, application/vnd.ms-excel, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
                      multiple
                      className="hidden"
                      onChange={handleUploadFile}
                    />
                  </div>
                  <p className="text-gray-700 text-center mt-4">
                    Upload from your Computer
                  </p>
                </div>
              )}

              {UploadFiles && UploadFiles?.length !== 0 && (
                <div className=" flex border-b-[1px] border-[#CBD5E1] p-5 gap-4 ">
                  <p className="font-PlusJakartaSans font-normal text-base text-[#475569]  w-1/2 ">
                    File Name
                  </p>
                  <p className="font-PlusJakartaSans font-normal text-base text-[#475569]  w-1/5">
                    Document Type
                  </p>
                  <p className="font-PlusJakartaSans font-normal text-base text-[#475569]  w-1/5">
                    Relevance
                  </p>
                </div>
              )}
              {UploadFiles && UploadFiles?.length !== 0 && (
                <div className="min-h-[10%] max-h-[80%] overflow-y-scroll">
                  {UploadFiles?.map((item: File, index: number) => {
                    return (
                      <div
                        key={index}
                        className="flex border-b-[1px] border-[#CBD5E1] p-5 gap-4 "
                      >
                        <div className="w-1/2 flex gap-2 items-center  ">
                          <img
                            src={
                              item?.type?.includes("pdf")
                                ? PdfFileIcon
                                : item?.type?.includes("vnd.ms-excel") ||
                                    item?.type?.includes(
                                      "vnd.openxmlformats-officedocument.spreadsheetml.sheet",
                                    )
                                  ? ExcelFileIcon
                                  : DocFileIcon
                            }
                            alt=""
                          />

                          <p className="font-PlusJakartaSans font-normal text-sm text-[#475569]  ">
                            {item?.name}
                          </p>
                        </div>
                        <div className="w-1/5  flex items-center justify-center">
                          <Select
                            formik={form}
                            name={`UploadFile[${index}].docType`}
                            currentValue={
                              form?.values?.UploadFile &&
                              form?.values?.UploadFile[index]?.docType
                            }
                            onChange={(e: any) =>
                              handleFormValue(e, item, index)
                            }
                            placeholder="Select Type"
                            className={
                              " border-t-2 border-b-2 border-l-2 border-r-2 rounded-xl focus:border-[#1B2559]  text-[#8b8b8b] "
                            }
                            options={docType?.map((item: string) => {
                              return {
                                label: item,
                                value: item,
                              };
                            })}
                          />
                        </div>
                        <div className="w-1/5  flex items-center justify-center">
                          <Select
                            name={`UploadFile[${index}].useFull`}
                            currentValue={
                              form?.values?.UploadFile[index]?.docType ===
                              "Press Release"
                                ? "Both"
                                : form?.values?.UploadFile &&
                                  form?.values?.UploadFile[index]?.useFull
                            }
                            disabled={
                              !form?.values?.UploadFile[index]?.docType ||
                              form?.values?.UploadFile[index]?.docType ===
                                "Press Release" ||
                              form?.values?.UploadFile[index]?.docType ===
                                "Earning Script"
                            }
                            formik={form}
                            onChange={(e: any) =>
                              handleUploadedFiles(e, item, index)
                            }
                            placeholder="Select Relevance"
                            className={
                              " border-t-2 border-b-2 border-l-2 border-r-2 rounded-xl focus:border-[#1B2559]  text-[#8b8b8b] "
                            }
                            options={useFull?.map((item: string) => {
                              return {
                                label: item,
                                value: item,
                              };
                            })}
                          />
                        </div>
                        <div
                          className="flex justify-center items-center w-[7%]"
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
                                backgroundColor: "#FFFFFF", // Customize background
                                borderRadius: "8px",
                                padding: "12px", // Rounded corners
                                boxShadow:
                                  "box-shadow: 6px 6px 54px 0px #00000014;", // Custom shadow
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
                            {isview && (
                              <MenuItem
                                sx={{
                                  color: "#1F1F1FF1",
                                  fontWeight: "400",
                                  fontSize: "12px",
                                  display: "flex",
                                  gap: "5px",
                                }}
                                onClick={() => {
                                  handleClose();
                                  downloadFile(item);
                                }}
                              >
                                <DownloadIcon />
                                Download
                              </MenuItem>
                            )}
                            <MenuItem
                              sx={{
                                color: "red",
                                fontWeight: "400",
                                fontSize: "12px",
                                display: "flex",
                                gap: "5px",
                              }}
                              onClick={() => {
                                handleClose();
                                deleteDoc(index);
                              }}
                            >
                              <DeleteIcon />
                              Delete
                            </MenuItem>
                          </Menu>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
            {UploadFiles && UploadFiles?.length !== 0 && (
              <div className="w-full flex justify-end px-8 mt-2">
                <Button
                  type="submit"
                  className="flex justify-end"
                  disabled={form?.isSubmitting}
                >
                  Upload
                </Button>
              </div>
            )}
          </Box>
        </form>
      </Modal>
    </div>
  );
};

export default VaultPopup;
