import UserApi from "@api/user.api";
import CompanyInfo from "@components/CompanyInfo/CompanyInfo";
import BaseDataTable from "@components/data-tables/BaseDataTable";
import { CreateUserDto } from "@dto/createUser.dto";
import ContentCopyIcon from "@mui/icons-material/ContentCopy";
import { Switch, Tooltip } from "@mui/material";
import noImage from "@public/image.png";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { formatDate } from "@utils/common";
import { useState } from "react";
import CopyToClipboard from "react-copy-to-clipboard";
import { toast } from "react-toastify";
import { CustomPagination } from "@components/CustomPagination";
import "./clientlisting.css";

const CompanyUsers = ({
  clientList,
  disable,
  setPaginatedPayload,

  clientListLength,
}: any) => {
  const [selectedRow, setSelectedRow] = useState<{
    id: string;
    CompanyInfo: string;
  } | null>(null);
  const [open, setOpen] = useState<boolean>(false);
  const [disableCLicked, setDisableClicked] = useState<boolean>(false);
  const [showTooltip, setShowTooltip] = useState<boolean>(false);
  const [resultsPerPage, setResultsPerPage] = useState<number>(10);
  const [currentPage, setCurrentPage] = useState<number>(1);

  const userApi = new UserApi();
  const queryClient = useQueryClient();

  const handleRowClick = (row: any) => {
    setSelectedRow({ id: row?._id, CompanyInfo: row?.companyInfo });
    setOpen(true);
  };

  const UpdateUser = async (values: CreateUserDto) => {
    return await userApi.updateUser(values);
  };

  const { mutateAsync } = useMutation({
    mutationFn: UpdateUser,
    onSuccess: () => {
      toast.success("Company Info Updated Successfully!");
      queryClient.invalidateQueries({ queryKey: ["fetchClients"] });
    },
    onError: (error: any) => {
      toast.error(
        error?.response?.data?.message || "Unable to save information",
      );
    },
  });

  const handleCopy = () => {
    setShowTooltip(true);
    setTimeout(() => setShowTooltip(false), 2000);
  };

  return (
    <>
      <BaseDataTable
        customStyles={{
          headRow: {
            style: {
              background: "linear-gradient(to bottom right, #f8fafc, #f8fafc)",
              color: "#1b2559",
            },
          },
          pagination: {
            style: {
              display: "flex",
              justifyContent: "space-between",
              width: "100%",
            },
          },
        }}
        columns={[
          {
            name: "Name",
            style: "display:flex;justify-content:flex-start !important",
            selector: (row: any) => (
              <Tooltip
                title={
                  showTooltip ? (
                    "Copied to Clipboard"
                  ) : (
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        gap: "8px",
                      }}
                    >
                      <span>{row.companyName}</span>
                      <CopyToClipboard
                        text={row.companyName}
                        onCopy={handleCopy}
                      >
                        <ContentCopyIcon
                          style={{ cursor: "pointer", fontSize: "16px" }}
                        />
                      </CopyToClipboard>
                    </div>
                  )
                }
                placement="top"
                arrow
              >
                <div className="flex !justify-start gap-4  items-center py-2">
                  <img
                    src={
                      row?.CompanyLogo && row?.CompanyLogo !== ""
                        ? `${import.meta.env.VITE_REACT_APP_SERVER_URL?.replace("/api", "")}${row?.CompanyLogo}`
                        : noImage
                    }
                    alt=""
                    onError={(e) => (e.currentTarget.src = noImage)}
                    className="w-12 h-12 object-cover rounded-full"
                  />

                  <span className="break-all">{row.companyName}</span>
                </div>
              </Tooltip>
            ),
            sortable: true,
          },

          {
            name: "Email",
            selector: (row: any) => (
              <Tooltip
                title={
                  showTooltip ? (
                    "Copied to Clipboard"
                  ) : (
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        gap: "8px",
                      }}
                    >
                      <span>{row.email}</span>
                      <CopyToClipboard text={row.email} onCopy={handleCopy}>
                        <ContentCopyIcon
                          style={{ cursor: "pointer", fontSize: "16px" }}
                        />
                      </CopyToClipboard>
                    </div>
                  )
                }
                placement="top"
                arrow
              >
                <div>
                  <span className="break-all">{row.email || "-"}</span>
                </div>
              </Tooltip>
            ),
            sortable: true,
          },

          {
            name: "Company Info",
            sortable: true,
            cell: (row: any) => (
              <span
                style={{ cursor: "pointer" }}
                onClick={() => handleRowClick(row)}
              >
                {"Company Info"}
              </span>
            ),
          },

          {
            name: "Phone",
            selector: (row: any) => (
              <div className="font-bold">{row?.phone || "__"}</div>
            ),
            sortable: true,
          },
          {
            name: "Created Date",
            selector: (row: any) => formatDate(row?.createdAt) || "-",
            sortable: true,
          },
          {
            name: "Plan",
            selector: (row: any) => (
              <div className="font-bold">{row?.plan || "__"}</div>
            ),
            sortable: true,
          },
          {
            name: "Active/Inactive",
            sortable: true,
            cell: (row: any) => (
              <Switch
                sx={{
                  "& .MuiSwitch-track": {
                    backgroundColor: "#E0E5F2",
                    opacity: 100,
                    cursor: disableCLicked ? "not-allowed" : "pointer",
                  },
                  "& .MuiSwitch-thumb": {
                    backgroundColor: "#FFFFFF",
                    boxShadow: "2px 0px 4px 0px #00000026",
                  },
                  "& .MuiSwitch-switchBase": {
                    "&.Mui-checked": {
                      "& + .MuiSwitch-track": {
                        backgroundColor: "#1B2559",
                        opacity: 100,
                      },
                    },
                  },
                }}
                checked={!row?.is_disabled}
                onClick={() => setDisableClicked(true)}
                disabled={disableCLicked}
                onChange={async (e) => {
                  let obj = {
                    id: row?._id,
                    disable: e.target.checked,
                    keycloak_id: row?.keycloak_id,
                  };
                  setDisableClicked(false);
                  await disable(obj);
                }}
                inputProps={{ "aria-label": "controlled" }}
              />
            ),
          },
          {
            name: "Status",
            selector: (row: any) => (
              <div className="font-bold">
                {row?.is_verified ? "Verified" : "Unverified"}
              </div>
            ),
            sortable: true,
          },
        ]}
        data={clientList}
      />

      <CustomPagination
        resultsPerPage={resultsPerPage}
        setResultsPerPage={setResultsPerPage}
        currentPage={currentPage}
        setCurrentPage={setCurrentPage}
        totalRecords={clientListLength}
        fetchData={setPaginatedPayload}
      />

      {open && (
        <CompanyInfo
          userId={selectedRow?.id}
          companyInfo={selectedRow?.CompanyInfo}
          setOpen={setOpen}
          mutateAsync={mutateAsync}
        />
      )}
    </>
  );
};

export default CompanyUsers;
