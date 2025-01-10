import VaultApi from "@api/vault.api";
import { Button } from "@components/common";
import { UpdateFileDto } from "@dto/updateFile.dto";
import { UploadFileDto } from "@dto/uploadFile.dto";
import { Box, Menu, MenuItem, Modal } from "@mui/material";
import DocFileIcon from "@public/DocFileIcon.svg";
import ExcelFileIcon from "@public/ExcelFileIcon.svg";
import PdfFileIcon from "@public/PdfFileIcon.svg";
import { selectUser } from "@redux/slices/userSlice";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { downloadFile } from "@utils/helper";
import { useFormik } from "formik";
import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { toast } from "react-toastify";
import { CancelIcon, DeleteIcon, DownloadIcon, ThreeVerticalDots } from "svg";
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
interface VaultPopupProps {
  onClose: () => void;
  open: any;
  isview?: boolean;
}

const ViewVaultPopup: React.FC<VaultPopupProps> = ({
  onClose,
  open,
  isview = true,
}) => {
  const [openIndex, setOpenIndex] = useState<number>(-1);
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);

  const Vault = new VaultApi();
  const loggedInUser = useSelector(selectUser);
  const queryClient = useQueryClient();

  const handleClose = () => {
    setAnchorEl(null);
    setOpenIndex(-1);
  };
  const getSpecificFiles = async () => {
    return await Vault.getSpecificFiles({
      user_id: loggedInUser?.user_info?._id,
    });
  };
  const updateFiles = async (fileData: UpdateFileDto[]) => {
    return await Vault.updateFiles(fileData);
  };
  const deleteFile = async (id: { fileId: string }) => {
    return await Vault?.deleteFile(id);
  };
  const { data }: any = useQuery({
    queryKey: ["GetFiles"],
    queryFn: getSpecificFiles,
  });
  const { mutateAsync } = useMutation({
    mutationFn: deleteFile,
    onSuccess: () => {
      handleClose();
      queryClient.invalidateQueries({ queryKey: ["GetFiles"] });

      toast.success("Document Deleted!");
    },
    onError: (error: any) => {
      handleClose();

      toast.error(
        error?.response?.data?.message || "Unable to delete the file!",
      );
    },
  });
  const { mutateAsync: updateDoc } = useMutation({
    mutationFn: updateFiles,
    onSuccess: () => {
      handleClose();
      queryClient.invalidateQueries({ queryKey: ["GetFiles"] });

      toast.success("File Updated!");
    },
    onError: (error: any) => {
      handleClose();

      toast.error(
        error?.response?.data?.message || "Unable to updated the files!",
      );
    },
  });
  const form = useFormik({
    initialValues: new UploadFileDto(),
    validationSchema: UploadFileDto.yupSchema(),
    onSubmit: async (values: any) => {
      await updateDoc(values?.UploadFile);
    },
  });

  const handleMenuClick = (
    event: React.MouseEvent<HTMLButtonElement>,
    index: number,
  ) => {
    setAnchorEl(event.currentTarget);
    setOpenIndex(index);
  };
  const handleUploadFormValues = () => {
    let temp: any = [];
    if (data || data?.data?.length == 0) {
      for (let file of data?.data) {
        temp?.push({ ...file, docType: file?.docType, useFull: file?.useFull });
      }
      form?.setValues({ UploadFile: temp });
    }
  };
  useEffect(() => {
    handleUploadFormValues();
  }, [data]);

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
            {/* header */}
            <div className="w-full border-b-[1px] border-[#CBD5E1] p-2 flex justify-between items-center pr-8">
              <p className="font-PlusJakartaSans font-bold text-2xl p-4 text-[#1B2559] ">
                Vault
              </p>
              <CancelIcon onClick={onClose} />
            </div>
            {/* body */}
            <div
              className={`w-full   h-[75%]  ${data?.data && data?.data?.length == 0 ? "flex items-center justify-center" : ""} `}
            >
              {data?.data && data?.data?.length !== 0 && (
                <div className=" flex border-b-[1px] border-[#CBD5E1] p-5 gap-4 ">
                  <p className="font-PlusJakartaSans font-normal text-base text-[#475569]  w-1/2 ">
                    File Name
                  </p>
                </div>
              )}
              {data?.data && data?.data?.length !== 0 && (
                <div className="min-h-[10%] max-h-[80%] overflow-y-scroll">
                  {/* header */}

                  {/* Rows */}

                  {form?.values?.UploadFile &&
                    form?.values?.UploadFile?.length !== 0 &&
                    data?.data &&
                    data?.data?.map((item: any, index: number) => {
                      return (
                        <div
                          key={index}
                          className="flex border-b-[1px] border-[#CBD5E1] p-5 gap-4 "
                        >
                          <div className="w-full flex gap-2 items-center  ">
                            <img
                              src={
                                item?.mimetype?.includes("pdf")
                                  ? PdfFileIcon
                                  : item?.mimetype?.includes("vnd.ms-excel") ||
                                      item?.mimetype?.includes(
                                        "vnd.openxmlformats-officedocument.spreadsheetml.sheet",
                                      )
                                    ? ExcelFileIcon
                                    : DocFileIcon
                              }
                              alt=""
                            />

                            <p className="font-PlusJakartaSans font-normal text-sm text-[#475569] w-full ">
                              {item?.originalName}
                            </p>
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
                    })}
                </div>
              )}
            </div>

            <div className="w-full flex justify-end px-8 mt-2 gap-8 ">
              <Button
                type="button"
                className="flex justify-end bg-red-500 hover:bg-red-500"
                onClick={onClose}
              >
                Cancel
              </Button>
              <Button type="submit" className="flex justify-end">
                Update
              </Button>
            </div>
          </Box>
        </form>
      </Modal>
    </div>
  );
};

export default ViewVaultPopup;
