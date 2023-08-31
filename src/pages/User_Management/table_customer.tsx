import React, { useMemo } from "react";
import {
  UseMutationResult,
  UseQueryResult,
  useMutation,
  useQuery,
} from "react-query";
import {
  addUserLog,
  deleteUser,
  getCustomer,
  getUserSession,
} from "../../utils/service";
import i18n, { changeLanguage } from "i18next";

import { Add } from "@mui/icons-material";
import { Button } from "@mui/material";
import Chip from "@mui/material/Chip";
import { DatePicker } from "@mui/x-date-pickers";
import { ReactComponent as DeleteIcon } from "../../assets/icons/delete.svg";
import DeletedIcon from "@mui/icons-material/Delete";
import { ReactComponent as EditIcon } from "../../assets/icons/edit.svg";
import IconButton from "@mui/material/IconButton";
import { MRT_ColumnDef } from "material-react-table"; // If using TypeScript (optional, but recommended)
import { MRT_Localization_FR } from "material-react-table/locales/fr";
import { MaterialReactTable } from "material-react-table";
import Swal from "sweetalert2";
import VisibilityIcon from "@mui/icons-material/Visibility";
import { callToast } from "../../utils/common";
import dayjs from "dayjs";
import { useLoading } from "../../store";
import { useTheme } from "@mui/material/styles";
import { useTranslation } from "react-i18next";
import { userData } from "../../utils/type";

//If using TypeScript, define the shape of your data (optional, but recommended)

//mock data - strongly typed if you are using TypeScript (optional, but recommended)

export default function App({
  onOpenDialog,
  onChangeSearch,
  userData,
  deleteUser,
  paginationState,
  setPaginationState,
  onDelete,
  user,
}: {
  onOpenDialog: (data: any, type: string | null) => void;

  onChangeSearch: (text: string) => void;
  userData: UseQueryResult<any>;
  deleteUser: UseMutationResult<any, unknown, string, void>;
  paginationState: { pageIndex: number; pageSize: number };
  setPaginationState: (props: any) => void;
  onDelete: (docId: string) => void;
  user: userData;
}) {
  const theme = useTheme();

  const { t } = useTranslation();

  const columns = useMemo<MRT_ColumnDef<userData>[]>(() => {
    const columns = [
      // {
      //   accessorFn: (originalRow) => originalRow.no, //alternate way
      //   id: "no", //id required if you use accessorFn instead of accessorKey
      //   header: "no",
      //   Header: (
      //     <i style={{ fontFamily: "BoonBaanRegular" }}>{t("user_management.no")}</i>
      //   ), //optional custom markup
      // },
      {
        accessorFn: (originalRow) => {
          return `${originalRow.firstname} ${originalRow.lastname}`;
          return `${originalRow.firstname} ${originalRow.lastname}`;
        }, //alternate way
        id: "promotion_name", //id required if you use accessorFn instead of accessorKey
        header: "promotion_name",
        Header: (
          <i style={{ fontFamily: "BoonBaanRegular" }}>
            {t("user_management.name")}
          </i>
        ), //optional custom markup
      },
      {
        accessorFn: (originalRow) => originalRow.email, //alternate way
        id: "bonus", //id required if you use accessorFn instead of accessorKey
        header: "bonus",
        Header: (
          <i style={{ fontFamily: "BoonBaanRegular" }}>
            {t("user_management.email")}
          </i>
        ), //optional custom markup
      },
      {
        accessorFn: (originalRow) => originalRow.address, //alternate way
        id: "start_date", //id required if you use accessorFn instead of accessorKey
        header: "start_date",
        Header: (
          <i style={{ fontFamily: "BoonBaanRegular" }}>
            {t("user_management.address")}
          </i>
        ), //optional custom markup
      },
      {
        accessorFn: (originalRow) => originalRow.tel, //alternate way
        id: "tel", //id required if you use accessorFn instead of accessorKey
        header: "tel",
        Header: (
          <i style={{ fontFamily: "BoonBaanRegular" }}>
            {t("user_management.tel")}
          </i>
        ), //optional custom markup
      },
      {
        accessorFn: (originalRow) =>
          dayjs(originalRow.$createdAt).format("DD-MM-YYYY"), //alternate way
        id: "expire_date", //id required if you use accessorFn instead of accessorKey
        header: "expire_date",
        Header: (
          <div style={{ textAlign: "center", fontFamily: "BoonBaanRegular" }}>
            {t("user_management.registerDate")}
          </div>
        ), //optional custom markup
      },

      {
        accessorFn: (originalRow) => null, //alternate way
        id: "status", //id required if you use accessorFn instead of accessorKey
        header: "status",
        Header: (
          <div style={{ textAlign: "center", fontFamily: "BoonBaanRegular" }}>
            {t("user_management.status")}
          </div>
        ), //optional custom markup
        Cell: ({ cell }) => {
          const data = cell.row.original;

          return (
            <div className="text-center">
              <div
                className="w-fit mx-auto   hover:opacity-80 cursor-pointer"
                // <div className="w-fit mx-auto rounded-md border-4 border-indigo-500 text-white"
                // style={{
                //   backgroundColor: !isSell ? "#299914" : "#FF5555",
                //   // FF5555 : red
                // }}
              >
                <Chip
                  sx={{
                    fontFamily: "BoonBaanRegular",
                    backgroundColor:
                      data.status === "active"
                        ? "#94D18A"
                        : data.status === "active"
                        ? "#FF5555"
                        : "#40CFFF",
                    color: "white",
                  }}
                  label={data.status}
                />
                {/* <IconButton size="small" aria-label="delete" sx={{color : '#40CFFF'}}>
                  <VisibilityIcon />
                </IconButton> */}
              </div>
            </div>
          );
        }, //render Date as a string
      },
    ];
    if (user.role !== "external") {
      columns.push(
        {
          accessorFn: (originalRow) => null, //alternate way
          id: "edit", //id required if you use accessorFn instead of accessorKey
          header: "edit",
          Header: (
            <div style={{ textAlign: "center", fontFamily: "BoonBaanRegular" }}>
              {t("user_management.edit")}
            </div>
          ),
          Cell: ({ cell }) => {
            const data = cell.row.original;

            return (
              <div className="text-center">
                <div
                  className="w-fit mx-auto   hover:opacity-80 cursor-pointer"
                  // <div className="w-fit mx-auto rounded-md border-4 border-indigo-500 text-white"
                  // style={{
                  //   backgroundColor: !isSell ? "#299914" : "#FF5555",
                  //   // FF5555 : red
                  // }}
                >
                  <IconButton
                    size="small"
                    aria-label="edit"
                    sx={{ color: "#FF0000" }}
                    onClick={() => {
                      onOpenDialog(data, "customer");
                    }}
                  >
                    <EditIcon style={{ fill: theme.palette.primary.main }} />
                  </IconButton>
                </div>
              </div>
            );
          }, //render Date as a string
        },
        {
          accessorFn: (originalRow) => null, //alternate way
          id: "delete", //id required if you use accessorFn instead of accessorKey
          header: "delete",
          Header: (
            <div style={{ textAlign: "center", fontFamily: "BoonBaanRegular" }}>
              {t("user_management.delete")}
            </div>
          ),
          Cell: ({ cell }) => {
            const data = cell.row.original;

            return (
              <div className="text-center">
                <div
                  className="w-fit mx-auto  hover:opacity-80 cursor-pointer"
                  // <div className="w-fit mx-auto rounded-md border-4 border-indigo-500 text-white"
                  // style={{
                  //   backgroundColor: !isSell ? "#299914" : "#FF5555",
                  //   // FF5555 : red
                  // }}
                >
                  <IconButton
                    size="small"
                    aria-label="delete"
                    sx={{ color: "#FF0000" }}
                    onClick={async () => {
                      if (data.$id !== undefined) {
                        await onDelete(data.$id);
                      }
                    }}
                  >
                    <DeleteIcon style={{ fill: "red" }} />
                  </IconButton>
                </div>
              </div>
            );
          }, //render Date as a string
        }
      );
    }
    return columns
  }, [i18n.language]);

  return (
    <div className="mt-2 ">
      <MaterialReactTable
        columns={columns}
        data={
          userData.data?.documents !== undefined ? userData.data.documents : []
        }
        //   enableRowSelection //enable some features
        enableHiding={false}
        enableGlobalFilter={false} //turn off a feature
        enableColumnActions={false}
        enableColumnFilters={false}
        // enablePagination={false}
        enableSorting={false}
        // enableBottomToolbar={false}
        enableExpandAll={false}
        enableFullScreenToggle={false}
        enableDensityToggle={false}
        // enableTopToolbar={false}
        //   muiTableBodyRowProps={{ hover: false }}
        manualPagination
        rowCount={userData.data?.total ?? 0}
        onPaginationChange={setPaginationState}
        state={{
          isLoading: userData.isFetching,

          pagination: {
            pageIndex: paginationState.pageIndex,
            pageSize: paginationState.pageSize,
          },
        }}
        muiTopToolbarProps={{
          sx: {
            backgroundColor: "#F9F9F9",
          },
        }}
        muiTablePaperProps={{
          elevation: 0, //change the mui box shadow
          //customize paper styles
          sx: {
            borderRadius: "8px",
            border: "1px solid #e0e0e0",
          },
        }}
        muiTableProps={{
          sx: {
            borderRadius: "8px",
            fontFamily: "BoonBaanRegular",
          },
        }}
        muiTableHeadCellProps={{
          sx: {
            "& .Mui-TableHeadCell-Content": {
              justifyContent: "center",
            },

            fontFamily: "BoonBaanRegular",
            backgroundColor: "#F9F9F9",
          },
        }}
        muiTableBodyCellProps={{
          sx: {
            padding: "8px 0px",
            fontFamily: "BoonBaanRegular",
            textAlign: "center",
          },
        }}
        renderTopToolbarCustomActions={({ table }) => {
          const handleChange = (e) => {
            onChangeSearch(e.target.value);
          };
          return (
            <div className="w-full flex justify-end mx-2 ">
              <div className="relative w-1/4 ">
                <input
                  type="text"
                  id="voice-search"
                  className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full  py-2.5 px-2.5  dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                  placeholder={t("user_management.search") || ""}
                  onChange={handleChange}
                />
                <div className="absolute inset-y-0 right-0 flex items-center pr-3">
                  <svg
                    width="20"
                    height="20"
                    viewBox="0 0 20 20"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <g clipPath="url(#clip0_344_1823)">
                      <path
                        d="M18.3334 18.3333L16.6667 16.6666M9.58341 17.5C10.623 17.5 11.6525 17.2952 12.613 16.8973C13.5735 16.4995 14.4462 15.9164 15.1813 15.1812C15.9165 14.4461 16.4996 13.5734 16.8975 12.6129C17.2953 11.6524 17.5001 10.6229 17.5001 9.58329C17.5001 8.54366 17.2953 7.51421 16.8975 6.55372C16.4996 5.59322 15.9165 4.72049 15.1813 3.98536C14.4462 3.25023 13.5735 2.6671 12.613 2.26925C11.6525 1.8714 10.623 1.66663 9.58341 1.66663C7.48378 1.66663 5.47015 2.5007 3.98549 3.98536C2.50082 5.47003 1.66675 7.48366 1.66675 9.58329C1.66675 11.6829 2.50082 13.6966 3.98549 15.1812C5.47015 16.6659 7.48378 17.5 9.58341 17.5Z"
                        stroke="#B9BCC7"
                        strokeWidth="1.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </g>
                    <defs>
                      <clipPath id="clip0_344_1823">
                        <rect width="20" height="20" fill="white" />
                      </clipPath>
                    </defs>
                  </svg>
                </div>
              </div>
            </div>
          );
        }}
      />
    </div>
  );
}

const CustomInput = function BrowserInput(props: any) {
  const { inputProps, InputProps, ownerState, inputRef, error, ...other } =
    props;

  return (
    <div className="relative mx-2" style={{ fontFamily: "BoonBaanRegular" }}>
      <p className="">{props.label}</p>

      <div className="relative" ref={InputProps?.ref}>
        <div className="absolute top-1/2 left-[-4px]  -translate-y-1/2 ">
          {InputProps?.endAdornment}
        </div>

        <input
          ref={inputRef}
          {...inputProps}
          {...(other as any)}
          className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full pl-10 p-2.5  dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
        />
      </div>
    </div>
  );
};
