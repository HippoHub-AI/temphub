import VaultApi from "@api/vault.api";
import { Button, Input } from "@components/common";
import { CreateFileDto } from "@dto/createFile.dto";
import { useFormik } from "formik";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import "./createFile.css";
import { useMutation } from "@tanstack/react-query";
import { toast } from "react-toastify";
import { useDispatch, useSelector } from "react-redux";
import { selectUser } from "@redux/slices/userSlice";
import { useNavigate } from "react-router-dom";
import { ROUTE_VAULT } from "@routes/constants";
import { useEffect } from "react";
import { updateLoader } from "@redux/slices/loaderSlice";
const CreateFile = () => {
  const vaultApi = new VaultApi();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const loggedInUser = useSelector(selectUser);

  const createFile = async (file: CreateFileDto) => {
    return await vaultApi.createFile(file);
  };
  const { mutateAsync } = useMutation({
    mutationFn: createFile,
    onSuccess: () => {
      toast?.success("File Created!");
      navigate(ROUTE_VAULT);
    },
    onError: (error: any) => {
      toast.error(error?.response?.data?.message || "Unable to Create File!");
    },
  });
  const form = useFormik({
    initialValues: new CreateFileDto(),
    validationSchema: CreateFileDto.yupSchema(),
    onSubmit: async (values) => {
      await mutateAsync({ ...values, user_id: loggedInUser?.user_info?._id });
    },
  });
  useEffect(() => {
    if (form?.isSubmitting) {
      dispatch(updateLoader(true));
    } else {
      dispatch(updateLoader(false));
    }
  }, [form?.isSubmitting]);

  return (
    <>
      <form onSubmit={form.handleSubmit} className="w-full flex flex-grow">
        <div className="flex flex-grow flex-col items-center gap-4 justify-between mb-6 p-5 w-full ">
          <div className="w-3/4  flex flex-col ">
            <Input labelText="File Name" name="fileName" formik={form} />
            <div className="flex flex-col w-full mt-4">
              <p className="text-[#1F1F1F] font-normal text-base leading-6 mb-2  font-PlusJakartaSans">
                File Content
              </p>
              <ReactQuill
                theme="snow"
                value={form?.values?.fileContent}
                onChange={(e) => {
                  form.setFieldValue("fileContent", e);
                }}
                placeholder="File Content Here..."
              />
              {form?.errors?.fileContent && form?.touched?.fileContent && (
                <p className="text-red-500 italic  mr-0 w-full text-sm  text-left mt-2 mx-2">
                  {form?.errors?.fileContent}
                </p>
              )}
            </div>
          </div>
          <div className="flex justify-end px-6 w-full">
            <div className="flex items-center gap-5">
              <Button
                onClick={() => {
                  form?.resetForm();
                }}
                disabled={form?.isSubmitting}
                className={`bg-red-500 hover:bg-red-400 rounded-xl mt-6 cursor-pointer font-PlusJakartaSans text-[14px] ${form?.isSubmitting ? "cursor-not-allowed" : ""}  `}
                type="button"
              >
                Cancel
              </Button>
              <Button
                disabled={form?.isSubmitting}
                className={`bg-[#1B2559] hover:bg-[#1B2559] rounded-xl mt-6 cursor-pointer font-PlusJakartaSans text-[14px] ${form?.isSubmitting ? "cursor-not-allowed" : ""}  `}
                type="submit"
              >
                Create File
              </Button>
            </div>
          </div>
        </div>
      </form>
    </>
  );
};

export default CreateFile;
