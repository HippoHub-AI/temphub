import { Button, Input, TextArea } from "@components/common";
import icontwo from "@public/file-upload.svg";
import { forwardRef, useEffect, useState } from "react";
import { FormikProps } from "formik";
import { useEffectAsync } from "@utils/react";
import base64 from "@utils/helper";
import { useDispatch } from "react-redux";
import { updateLoader } from "@redux/slices/loaderSlice";

export interface CreateCompanyFormValues {
  companyName: string;
  email: string;
}
export interface InstructionFormValues {
  PRchatInstruction: string;
  ECSchatInstruction: string;
  QnAchatInstruction: string;
}
interface CreateProps {
  onClose: () => void;
  form: FormikProps<CreateCompanyFormValues>;
  instructionForm: FormikProps<InstructionFormValues>;
  setImage?: any;
  image?: any;
  instruction?: boolean;
}

const Create = forwardRef<HTMLDivElement, CreateProps>(
  ({ onClose, form, setImage, instruction = false, instructionForm }, ref) => {
    const [uploadedImages, setUploadedImages] = useState<any>();

    const dispatch = useDispatch();

    const handleImageClick = () => {
      document.getElementById("fileInput")?.click();
    };

    const handleDeleteImage = () => {
      setUploadedImages(null);
      setImage(null);
    };
    useEffectAsync(async () => {
      if (uploadedImages) {
        let base64String = await base64(uploadedImages);
        setImage({ file_base64: base64String, name: uploadedImages?.name });
      }
    }, [uploadedImages]);
    useEffect(() => {
      if (form?.isSubmitting) {
        dispatch(updateLoader(true));
      } else {
        dispatch(updateLoader(false));
      }
    }, [form?.isSubmitting]);

    return (
      <>
        <div className="fixed inset-0 flex items-center justify-center bg-gray-900 bg-opacity-50 z-50">
          <div className="bg-white rounded-lg shadow-lg w-1/2 p-4 " ref={ref}>
            <div className="flex justify-between items-center mb-2 border-b-2 pb-4">
              <h2 className="text-[#1B2559] font-semibold text-[24px] ">
                {instruction ? "Change Instruction" : "Create New Company"}
              </h2>
              <button
                onClick={() => {
                  onClose();
                  form?.resetForm();
                }}
                className="text-gray-500 text-3xl"
              >
                &times;
              </button>
            </div>
            {instruction ? (
              <div className="w-full p-4">
                <form onSubmit={instructionForm.handleSubmit}>
                  <div className="flex gap-3 w-full">
                    <TextArea
                      labelText="PR Instructions"
                      formik={instructionForm}
                      name="PRchatInstruction"
                    />
                    <TextArea
                      labelText="ECS Instructions"
                      formik={instructionForm}
                      name="ECSchatInstruction"
                    />
                    <TextArea
                      labelText="QnA Instructions"
                      formik={instructionForm}
                      name="QnAchatInstruction"
                    />
                  </div>
                  <div className="flex justify-end border-t-2">
                    <Button
                      disabled={instructionForm?.isSubmitting}
                      className={`bg-[#1B2559] hover:bg-[#1B2559] rounded-xl mt-6 cursor-pointer font-PlusJakartaSans text-[14px] ${form?.isSubmitting ? "cursor-not-allowed" : ""}  `}
                      type="submit"
                    >
                      Update Instruction
                    </Button>
                  </div>
                </form>
              </div>
            ) : (
              <form onSubmit={form.handleSubmit}>
                <div className="flex">
                  <div className="w-full p-4">
                    <div className="flex h-32 ">
                      <div className="mr-2 w-full">
                        <Input
                          labelText="Company Name"
                          name="companyName"
                          formik={form}
                          placeholder="Company Name"
                        />
                      </div>
                      <div className="w-full">
                        <Input
                          labelText="Email"
                          name="email"
                          formik={form}
                          placeholder="Example@email.com"
                        />
                      </div>
                    </div>
                    <div className="w-full flex gap-4">
                      <div className="w-full">
                        <TextArea
                          labelText="Company Info"
                          formik={form}
                          name="companyInfo"
                        />
                      </div>
                    </div>

                    <div
                      className={`border-dashed border-2 border-gray-300 p-6 w-full h-[131px] flex items-center ${uploadedImages === null || uploadedImages === undefined ? "justify-center" : "justify-between"} rounded-lg shadow-lg hover:shadow-xl transition-shadow `}
                    >
                      {uploadedImages && (
                        <div className="w-full ">
                          <img
                            src={URL.createObjectURL(uploadedImages as Blob)}
                            alt="Selected"
                            className="w-24 h-14 object-cover "
                          />
                        </div>
                      )}

                      {!uploadedImages && (
                        <div className="flex items-center justify-between mb-2 ">
                          <div className="flex flex-col items-center my-6">
                            <div className="w-14 h-14 rounded-full bg-gray-100 flex flex-col items-center justify-center shadow-md">
                              <img
                                src={icontwo}
                                alt="upload photo"
                                onClick={handleImageClick}
                                className="cursor-pointer"
                              />
                              <input
                                id="fileInput"
                                type="file"
                                accept="image/*"
                                className="hidden"
                                onChange={(e) => {
                                  if (
                                    e?.target?.files &&
                                    e?.target?.files.length > 0
                                  ) {
                                    setUploadedImages(e?.target?.files[0]);
                                  }
                                }}
                              />
                            </div>
                            <p className="text-gray-700 text-center">
                              Upload from your Computer
                            </p>
                          </div>
                        </div>
                      )}
                      {/* Delete button */}
                      {uploadedImages && (
                        <button
                          type="button"
                          onClick={handleDeleteImage}
                          className="px-6 py-3 font-medium text-white bg-[#1B2559] rounded-xl cursor-pointer font-PlusJakartaSans text-[14px]  "
                        >
                          Delete
                        </button>
                      )}
                    </div>
                    <div className="flex justify-end border-t-2">
                      <Button
                        disabled={form?.isSubmitting}
                        className={`bg-[#1B2559] hover:bg-[#1B2559] rounded-xl mt-6 cursor-pointer font-PlusJakartaSans text-[14px] ${form?.isSubmitting ? "cursor-not-allowed" : ""}  `}
                        type="submit"
                      >
                        Create Company
                      </Button>
                    </div>
                  </div>
                </div>
              </form>
            )}
          </div>
        </div>
      </>
    );
  },
);

export default Create;
