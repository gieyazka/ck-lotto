import { Button, Skeleton } from "@mui/material";
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
import dayjs from "dayjs";
import { useTranslation } from "react-i18next";

//If using TypeScript, define the shape of your data (optional, but recommended)

//mock data - strongly typed if you are using TypeScript (optional, but recommended)

function App({
  onDelete,
  total,
  data,
  query,
  paginationState,
  setPaginationState,
}: {
  onDelete: (docId: string) => Promise<void>;
  total: number;
  data: any;
  query: UseQueryResult;
  paginationState: { pageIndex: number; pageSize: number };
  setPaginationState: any;
}) {
  const { t } = useTranslation();
  //column definitions - strongly typed if you are using TypeScript (optional, but recommended)
  const columns = useMemo<MRT_ColumnDef<any>[]>(
    () => [
      {
        accessorFn: (originalRow) =>
          dayjs(originalRow.date).format("DD-MM-YYYY"), //alternate way
        id: "date", //id required if you use accessorFn instead of accessorKey
        header: "date",
        Header: (
          <i style={{ fontFamily: "BoonBaanRegular" }}>
            {t("lotto_history.date")}
          </i>
        ), //optional custom markup
      },
      {
        accessorFn: (originalRow) => originalRow.lottery_number, //alternate way
        id: "number", //id required if you use accessorFn instead of accessorKey
        header: "number",
        Header: (
          <i style={{ fontFamily: "BoonBaanRegular" }}>
            {t("lotto_history.number")}
          </i>
        ), //optional custom markup
      },

      {
        accessorFn: (originalRow) => null, //alternate way
        id: "action", //id required if you use accessorFn instead of accessorKey
        header: "action",
        Header: (
          <i style={{ fontFamily: "BoonBaanRegular" }}>
            {t("lotto_history.delete")}
          </i>
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
                  onClick={async () => {
                    await onDelete(data.$id);
                  }}
                  size="small"
                  aria-label="delete"
                  className="hover:opacity-80"
                  style={{ backgroundColor: "#FF0000", color: "#fff" }}
                >
                  <DeletedIcon />
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
        enableRowNumbers
        //   enableRowSelection //enable some features
        enableHiding={false}
        enableGlobalFilter={false} //turn off a feature
        enableColumnActions={false}
        enableColumnFilters={false}
        //   enablePagination={false}
        enableSorting={false}
        // enableBottomToolbar={false}
        enableExpandAll={false}
        enableFullScreenToggle={false}
        enableDensityToggle={false}
        enableTopToolbar={false}
        muiTablePaginationProps={{
          // rowsPerPageOptions: [paginationState.pageSize],
          // rowsPerPageOptions: [paginationState.pageSize],
          showFirstButton: true,
          // showLastButton: false,
        }}
        manualPagination
        rowCount={total}
        onPaginationChange={setPaginationState}
        state={{
          isLoading: query.isFetching,

          pagination: {
            pageIndex: paginationState.pageIndex,
            pageSize: paginationState.pageSize,
            // pageIndex: paginationState.pageIndex,
            // pageSize: paginationState.pageSize,
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
      
      />
    </div>
  );
}
export default React.memo(App);
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
