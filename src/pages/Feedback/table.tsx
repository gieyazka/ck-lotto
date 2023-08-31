import { Button, Chip } from "@mui/material";
import React, { useMemo } from "react";
import { adsData, feedbackData } from "../../utils/type";
import i18n, { changeLanguage } from "i18next";

import { Add } from "@mui/icons-material";
import { DatePicker } from "@mui/x-date-pickers";
import { ReactComponent as DeleteIcon } from "../../assets/icons/delete.svg";
import DeletedIcon from "@mui/icons-material/Delete";
import { ReactComponent as EditIcon } from "../../assets/icons/edit.svg";
import IconButton from "@mui/material/IconButton";
import { MRT_ColumnDef } from "material-react-table"; // If using TypeScript (optional, but recommended)
import { MRT_Localization_FR } from "material-react-table/locales/fr";
import { MaterialReactTable } from "material-react-table";
import { UseQueryResult } from "react-query";
import VisibilityIcon from "@mui/icons-material/Visibility";
import dayjs from "dayjs";
import { useTranslation } from "react-i18next";

//If using TypeScript, define the shape of your data (optional, but recommended)
interface Data {
  no: string;
  fullName: string;
  rate: string;
  comment: string;
  date: string;
}

//mock data - strongly typed if you are using TypeScript (optional, but recommended)

export default function App({
  onDelete,
  query,
  total,
  paginationState,
  setPaginationState,
  data,
  onChangeSearch
}: {
  total: number;
  data: feedbackData[];
  onDelete: (docId: string) => Promise<void>;
  query: UseQueryResult;
  paginationState: { pageIndex: number; pageSize: number };
  setPaginationState: any;
  onChangeSearch: (text: string) => void;
}) {
  const { t } = useTranslation();
  //column definitions - strongly typed if you are using TypeScript (optional, but recommended)
  const columns = useMemo<MRT_ColumnDef<feedbackData>[]>(
    () => [
      // {
      //   accessorFn: (originalRow) => originalRow.no, //alternate way
      //   id: "no", //id required if you use accessorFn instead of accessorKey
      //   header: "no",
      //   Header: (
      //     <i style={{ fontFamily: "BoonBaanRegular" }}>{t("feedback.no")}</i>
      //   ), //optional custom markup
      // },
      {
        accessorFn: (originalRow) => {
          return `${originalRow.users.firstname ?? ""} ${
            originalRow.users.lastname ?? ""
          }`;
        },
        id: "fullName", //id required if you use accessorFn instead of accessorKey
        header: "fullName",
        Header: (
          <i style={{ fontFamily: "BoonBaanRegular" }}>
            {t("feedback.fullName")}
          </i>
        ), //optional custom markup
      },
      {
        accessorFn: (originalRow) => originalRow.rate, //alternate way
        id: "rate", //id required if you use accessorFn instead of accessorKey
        header: "rate",
        Header: (
          <i style={{ fontFamily: "BoonBaanRegular" }}>{t("feedback.rate")}</i>
        ), //optional custom markup
      },
      {
        accessorFn: (originalRow) => originalRow.comment, //alternate way
        id: "comment", //id required if you use accessorFn instead of accessorKey
        header: "comment",
        Header: (
          <i style={{ fontFamily: "BoonBaanRegular" }}>
            {t("feedback.comment")}
          </i>
        ), //optional custom markup
      },
      {
        accessorFn: (originalRow) => dayjs(originalRow.date).format('DD-MM-YYYY'), //alternate way
        id: "date", //id required if you use accessorFn instead of accessorKey
        header: "date",
        Header: (
          <i style={{ fontFamily: "BoonBaanRegular" }}>{t("feedback.date")}</i>
        ), //optional custom markup
      },

      {
        accessorFn: (originalRow) => null, //alternate way
        id: "delete", //id required if you use accessorFn instead of accessorKey
        header: "delete",
        Header: (
          <i style={{ fontFamily: "BoonBaanRegular" }}>
            {t("promotions.delete")}
          </i>
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
                  onClick={async () => {
                    if (data.$id !== undefined) {
                      await onDelete(data.$id);
                    }
                  }}
                  size="small"
                  aria-label="delete"
                  sx={{ color: "#FF0000" }}
                >
                  <DeleteIcon style={{ fill: "red" }} />
                </IconButton>
              </div>
            </div>
          );
        }, //render Date as a string
      },
      // {
      //   // accessorFn: (originalRow) => originalRow.isSell, //alternate way
      //   header: "control",
      //   Header: (
      //     <div style={{ fontFamily: "BoonBaanRegular" }}>
      //       {t("donotsell.control")}
      //     </div>
      //   ),
      // },
    ],
    [i18n.language]
  );

  return (
    <div className="mt-2">
      <MaterialReactTable
        columns={columns}
        data={data}
        enableHiding={false}
        enableGlobalFilter={false}
        enableColumnActions={false}
        enableColumnFilters={false}
        enableSorting={false}
        enableExpandAll={false}
        enableFullScreenToggle={false}
        enableDensityToggle={false}
        // enableTopToolbar={false}
        rowCount={total}
        onPaginationChange={setPaginationState}
        enableRowNumbers
        rowNumberMode="static"
        manualPagination
        state={{
          isLoading: query.isFetching,

          pagination: {
            pageIndex: paginationState.pageIndex,
            pageSize: paginationState.pageSize,
          },
        }}
        //   muiTableBodyRowProps={{ hover: false }}
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
            //   border: "1px solid #E0E0E0",
            // "& .MuiTableContainer-root th:first-child" : {
            //   borderTopLeftRadius:" 10px",
            //   borderBottomLeftRadius: "10px"
            // },

            // "& .MuiTableContainer-root th:last-child" : {
            //   borderTopRightRadius: "10px",
            //   borderBottomRightRadius: "10px"
            // },
          },
        }}
        muiTableHeadCellProps={{
          sx: {
            "& .Mui-TableHeadCell-Content": {
              justifyContent: "center",
            },
            //   borderRadius: "8px",

            fontFamily: "BoonBaanRegular",
            backgroundColor: "#F9F9F9",
            // border: "1px solid #E0E0E0",
          },
        }}
        muiTableBodyCellProps={{
          sx: {
            padding: "8px 0px",
            fontFamily: "BoonBaanRegular",
            textAlign: "center",
            //   border: "1px solid #E0E0E0",
          },
        }}
        renderTopToolbarCustomActions={({ table }) => {
          const handleChange = (e)=>{
           
            onChangeSearch(e.target.value)
         
          }

          return (
            <div className="w-full flex justify-end mx-2">
              <div className="relative w-1/4 ">
                <input
                  type="text"
                  id="voice-search"
                  className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full  py-2.5 px-2.5  dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                  placeholder={t("feedback.search") || ""}
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
