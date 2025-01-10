import VaultApi from "@api/vault.api";
import { Button } from "@components/common";
import { updateLoader } from "@redux/slices/loaderSlice";
import { selectUser } from "@redux/slices/userSlice";
import { ROUTE_VAULT } from "@routes/constants";
import { useMutation } from "@tanstack/react-query";
import "index.css";
import { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

const UpdateVault = () => {
  const [isLoading, setIsloading] = useState(false);

  const fileInputRef: any = useRef(null);

  const navigate = useNavigate();

  const Vault = new VaultApi();

  const loggedInUser = useSelector(selectUser);

  const dispatch = useDispatch();

  const handleClick = () => {
    fileInputRef.current?.click();
  };

  useEffect(() => {
    handleClick();
  }, []);

  const uploadFiles = async (values: FormData) => {
    return await Vault.uploadDocuments(values);
  };

  const { mutateAsync } = useMutation({
    mutationFn: uploadFiles,
    onSuccess: () => {
      toast.success("Files are uploaded in Vault Successfully");
      navigate(ROUTE_VAULT);
    },
    onError: () => {
      toast.error("Unable to upload files in Vault");
    },
  });

  const mutateUpload = async (uploadFiles: any) => {
    const formData: any = new FormData();

    uploadFiles.forEach((item: any) => {
      if (item) {
        formData.append("files", item);
      }
    });

    let filesTag: any = [];
    uploadFiles.forEach((item: any) => {
      let tempObj = {
        [item?.name]: {
          docType: "Other",
          useFull: "Both",
        },
      };
      filesTag?.push(tempObj);
    });

    formData.append("tags", JSON.stringify(filesTag));
    formData.append("user_id", loggedInUser?.user_info?._id);
    setIsloading(true);
    dispatch(updateLoader(true));
    await mutateAsync(formData);
    setIsloading(false);
    dispatch(updateLoader(false));
  };

  return (
    <>
      {" "}
      <div className="flex items-center gap-4 justify-end mb-6">
        <Button
          className="py-2 px-4"
          onClick={handleClick}
          type="button"
          disabled={isLoading}
        >
          Upload
        </Button>
        <input
          ref={fileInputRef}
          id="fileInput"
          type="file"
          accept=".pdf, .doc, .docx, .xls, .xlsx, application/pdf, application/msword, application/vnd.openxmlformats-officedocument.wordprocessingml.document, application/vnd.ms-excel, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
          multiple
          className="hidden"
          onChange={async (e) => {
            if (e?.target?.files && e?.target?.files.length > 0) {
              await mutateUpload(Object.values(e?.target?.files));
            }
          }}
        />
      </div>
    </>
  );
};

export default UpdateVault;
