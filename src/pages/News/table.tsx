import { Button, Chip } from "@mui/material";
import React, { useMemo } from "react";
import i18n, { changeLanguage } from "i18next";

import { Add } from "@mui/icons-material";
import { DatePicker } from "@mui/x-date-pickers";
import DeletedIcon from "@mui/icons-material/Delete";
import IconButton from "@mui/material/IconButton";
import { MRT_ColumnDef } from "material-react-table"; // If using TypeScript (optional, but recommended)
import { MRT_Localization_FR } from "material-react-table/locales/fr";
import { MaterialReactTable } from "material-react-table";
import { UseQueryResult } from "react-query";
import VisibilityIcon from "@mui/icons-material/Visibility";
import dayjs from "dayjs";
import { newsData } from "../../utils/type";
import { useTranslation } from "react-i18next";

//If using TypeScript, define the shape of your data (optional, but recommended)

//mock data - strongly typed if you are using TypeScript (optional, but recommended)

export default function App({
  onDelete,
  data,
  handleOpenDialog,
  query,
  total,
  paginationState,
  setPaginationState,
}: {
  total : number;
  onDelete: (docId: string) => void;
  data: newsData[];
  handleOpenDialog: (data: newsData) => void;
  query: UseQueryResult;
  paginationState: { pageIndex: number; pageSize: number };
  setPaginationState: any;
}) {
  // console.log(data);
  // data?.map((d, i) => ({ ...d, no: i + 1 }));
  const { t } = useTranslation();
  //column definitions - strongly typed if you are using TypeScript (optional, but recommended)
  const columns = useMemo<MRT_ColumnDef<newsData>[]>(
    () => [
      // {
      //   accessorFn: (originalRow) => {
      //     console.log(originalRow);
      //     return originalRow.no;
      //   },
      //   id: "no",
      //   header: "no",
      //   Header: <i style={{ fontFamily: "BoonBaanRegular" }}>{t("news.no")}</i>, //optional custom markup
      // },
      {
        accessorFn: (originalRow) => originalRow.title,
        id: "title",
        header: "title",
        Header: (
          <i style={{ fontFamily: "BoonBaanRegular" }}>{t("news.title")}</i>
        ), //optional custom markup
      },
      {
        size: 150,
        accessorFn: (originalRow) => originalRow.detail,
        id: "detail",
        header: "detail",
        Header: (
          <i style={{ fontFamily: "BoonBaanRegular" }}>{t("news.details")}</i>
        ),
        Cell: ({ cell }) => {
          const data = cell.row.original;
          // const photo = data.image ? JSON.parse((data.image as string)) : null;
          return (
            <div className="text-center flex justify-center">
              <p className=" whitespace-nowrap text-ellipsis overflow-hidden w-[200px] ">
                {data.detail}
              </p>
              {/* <img className="w-1/2" src={photo && photo.url}></img> */}
            </div>
          );
        }, //rende
      },
      {
        accessorFn: (originalRow) => originalRow.photo,
        id: "image",
        header: "image",
        Header: (
          <i style={{ fontFamily: "BoonBaanRegular" }}>{t("news.photo")}</i>
        ),
        Cell: ({ cell }) => {
          const data = cell.row.original;

          // const photo = data.image ? JSON.parse((data.image as string)) : null;
          return (
            <div className="text-center flex justify-center">
              <p className="text-ellipsis overflow-hidden w-1/2 ">
                {data.image?.length ?? 0} {t("image")}
              </p>
              {/* <img className="w-1/2" src={photo && photo.url}></img> */}
            </div>
          );
        }, //render Date
      },
      {
        accessorFn: (originalRow) =>
          dayjs(originalRow.startDate).format("DD/MM/YYYY"),
        id: "startDate",
        header: "startDate",
        Header: (
          <i style={{ fontFamily: "BoonBaanRegular" }}>{t("news.startDate")}</i>
        ), //optional custom markup
      },
      {
        accessorFn: (originalRow) =>
          dayjs(originalRow.endDate).format("DD/MM/YYYY"),
        id: "endDate",
        header: "endDate",
        Header: (
          <i style={{ fontFamily: "BoonBaanRegular" }}>{t("news.endDate")}</i>
        ), //optional custom markup
      },
      {
        id: "status",
        header: "status",
        size: 50,
        Header: (
          <i style={{ fontFamily: "BoonBaanRegular" }}>{t("news.status")}</i>
        ),
        Cell: ({ cell }) => {
          const data = cell.row.original;

          const checkAfter = dayjs().isAfter(data.startDate);
          const checkBefore = dayjs().isBefore(
            dayjs(data.endDate).add(1, "day")
          );
          const now = dayjs();
          return (
            <div className="text-center flex justify-center">
              {checkBefore && checkAfter ? (
                <Chip
                  label="Active"
                  style={{ fontFamily: "BoonBaanRegular" }}
                  className="text-md bg-[#299914] text-white"
                />
              ) : (
                <Chip
                  label="Expire"
                  style={{ fontFamily: "BoonBaanRegular" }}
                  className="text-md bg-[#FF5555] text-white"
                />
              )}
            </div>
          );
        }, //render Date
      },
      // {
      //   accessorFn: (originalRow) =>
      //     dayjs(originalRow.date).format("DD/MM/YYYY"),
      //   id: "date",
      //   header: "date",
      //   Header: (
      //     <i style={{ fontFamily: "BoonBaanRegular" }}>{t("news.date")}</i>
      //   ), //optional custom markup
      // },

      {
        accessorFn: (originalRow) => null,
        id: "action",
        header: "action",
        size: 50,
        Header: (
          <i style={{ fontFamily: "BoonBaanRegular" }}>{t("news.view")}</i>
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
                <IconButton
                  onClick={() => {
                    handleOpenDialog(data);
                  }}
                  size="small"
                  aria-label="delete"
                  sx={{ color: "#40CFFF" }}
                >
                  <VisibilityIcon />
                </IconButton>
              </div>
            </div>
          );
        }, //render Date as a string
      },
      {
        accessorFn: (originalRow) => null,
        id: "delete",
        header: "delete",
        size: 50,
        Header: (
          <i style={{ fontFamily: "BoonBaanRegular" }}>{t("news.delete")}</i>
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
                  aria-label="delete"
                  sx={{ color: "#FF0000" }}
                  onClick={async () => {
                    if(data.$id !== undefined){

                      await onDelete(data.$id);
                    }
                  }}
                >
                  <DeletedIcon />
                </IconButton>
              </div>
            </div>
          );
        }, //render Date as a string
      },
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
        enableTopToolbar={false}
        rowCount={total}
        manualPagination
        onPaginationChange={setPaginationState}
        state={{
          isLoading: query.isFetching,

          pagination: {
            pageIndex: paginationState.pageIndex,
            pageSize: paginationState.pageSize,
          },
        }}
     
        muiTablePaperProps={{
          elevation: 0, 
        
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
