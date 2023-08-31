import { Button, useTheme } from "@mui/material";
import React, { useMemo } from "react";
import Swal, { SweetAlertResult } from "sweetalert2";
import { UseMutationResult, UseQueryResult } from "react-query";
import dayjs, { Dayjs } from "dayjs";
import i18n, { changeLanguage } from "i18next";
import { lotteryDate, transaction } from "../../utils/type";

import { Add } from "@mui/icons-material";
import { DatePicker } from "@mui/x-date-pickers";
import { MRT_ColumnDef } from "material-react-table"; // If using TypeScript (optional, but recommended)
import { MRT_Localization_FR } from "material-react-table/locales/fr";
import { MaterialReactTable } from "material-react-table";
import { useTranslation } from "react-i18next";

//If using TypeScript, define the shape of your data (optional, but recommended)

//mock data - strongly typed if you are using TypeScript (optional, but recommended)

export default function App({
  transactionQuery,
  lotterDateQuery,
  lotteryDate,
  setLotteryDate,
  calculateWin,
  transferMutation,
}: {
  transactionQuery: UseQueryResult<any>;
  setLotteryDate: React.Dispatch<React.SetStateAction<any>>;
  lotterDateQuery: UseQueryResult<any>;
  lotteryDate: Date | undefined;
  calculateWin: () => void;
  transferMutation: UseMutationResult<any, unknown, any, void>;
}) {
  const { t } = useTranslation();
  const theme = useTheme();
  //column definitions - strongly typed if you are using TypeScript (optional, but recommended)
  const columns = useMemo<MRT_ColumnDef<any>[]>(
    () => [
      // {
      //   // accessorFn: (originalRow) => originalRow[`${lotteryDate}_invoice`].$id, //alternate way

      //   id: "no", //id required if you use accessorFn instead of accessorKey
      //   header: "No.",
      //   Header: (
      //     <div style={{ fontFamily: "BoonBaanRegular", textAlign: "center" }}>
      //       {t("transaction.no")}
      //     </div>
      //   ), //optional custom markup
      // },
      {
        id: "transaction_id", //id required if you use accessorFn instead of accessorKey
        header: "transaction_id",
        Header: (
          <i style={{ fontFamily: "BoonBaanRegular" }}>
            {t("transaction.transaction_id")}
          </i>
        ),
        Cell: ({ cell }) => {
          const data = cell.row.original;
          const invoice =
            data[`${dayjs(lotteryDate).format("YYYYMMDD")}_invoice`];
          return (
            <div className="text-center">
              <div className="w-fit mx-auto   hover:opacity-80 cursor-pointer">
                {invoice?.$id ?? ""}
              </div>
            </div>
          );
        },
      },
      {
        accessorFn: (originalRow) => originalRow.lottery, //alternate way
        id: "buyer_number", //id required if you use accessorFn instead of accessorKey
        header: "buyer_number",
        Header: (
          <i style={{ fontFamily: "BoonBaanRegular" }}>
            {t("transaction.buyer_number")}
          </i>
        ), //optional custom markup
      },
      {
        accessorFn: (originalRow) => originalRow.users?.username, //alternate way
        id: "username", //id required if you use accessorFn instead of accessorKey
        header: "username",
        Header: (
          <i style={{ fontFamily: "BoonBaanRegular" }}>{t("username")}</i>
        ), //optional custom markup
      },
      // {
      //   accessorFn: (originalRow) => originalRow.lottery_date, //alternate way
      //   id: "lottery_date", //id required if you use accessorFn instead of accessorKey
      //   header: "lottery_date",
      //   Header: (
      //     <i style={{ fontFamily: "BoonBaanRegular" }}>
      //       {t("transaction.lottery_date")}
      //     </i>
      //   ), //optional custom markup
      // },
      {
        id: "date", //id required if you use accessorFn instead of accessorKey
        header: "date",
        Header: (
          <i style={{ fontFamily: "BoonBaanRegular" }}>
            {t("transaction.date")}
          </i>
        ),
        Cell: ({ cell }) => {
          const data = cell.row.original;

          return (
            <div className="text-center">
              <div className="w-fit mx-auto   hover:opacity-80 cursor-pointer">
                {dayjs(data?.$createdAt).format("DD-MM-YYYY") ?? ""}
              </div>
            </div>
          );
        },
      },
      {
        accessorFn: (originalRow) => originalRow.time, //alternate way
        id: "time", //id required if you use accessorFn instead of accessorKey
        header: "time",
        Header: (
          <i style={{ fontFamily: "BoonBaanRegular" }}>
            {t("transaction.time")}
          </i>
        ),
        Cell: ({ cell }) => {
          const data = cell.row.original;

          return (
            <div className="text-center">
              <div className="w-fit mx-auto   hover:opacity-80 cursor-pointer">
                {dayjs(data?.$createdAt).format("HH:mm:ss") ?? ""}
              </div>
            </div>
          );
        },
      },
      {
        accessorFn: (originalRow) => originalRow.bill_id, //alternate way
        id: "bill_id", //id required if you use accessorFn instead of accessorKey
        header: "bill_id",
        Header: (
          <i style={{ fontFamily: "BoonBaanRegular" }}>
            {t("transaction.bill_id")}
          </i>
        ),
        Cell: ({ cell }) => {
          const data = cell.row.original;

          return (
            <div className="text-center">
              <div className="w-fit mx-auto   hover:opacity-80 cursor-pointer">
                {data.$id ?? ""}
              </div>
            </div>
          );
        },
      },
      {
        accessorFn: (originalRow) => originalRow.bankName, //alternate way
        id: "pay_by", //id required if you use accessorFn instead of accessorKey
        header: "pay_by",
        Header: (
          <i style={{ fontFamily: "BoonBaanRegular" }}>
            {t("transaction.pay_by")}
          </i>
        ), //optional custom markup
      },
      {
        accessorFn: (originalRow) => originalRow.amount, //alternate way
        id: "amount", //id required if you use accessorFn instead of accessorKey
        header: "amount",
        Header: (
          <i style={{ fontFamily: "BoonBaanRegular" }}>
            {t("transaction.amount")}
          </i>
        ), //optional custom markup
      },
      {
        accessorFn: (originalRow) => originalRow.status, //alternate way
        id: "status", //id required if you use accessorFn instead of accessorKey
        header: "status",
        Header: (
          <i style={{ fontFamily: "BoonBaanRegular" }}>
            {t("transaction.status")}
          </i>
        ),
        Cell: ({ cell }) => {
          const data = cell.row.original;
          return (
            <div className="text-center">
              <div className="w-fit mx-auto flex items-center gap-2  hover:opacity-80 cursor-pointer">
                {data.status === null ? "-" : data.status}
                {/* TODO: Status Win */}
                {data.status === "win" && (
                  <Button
                    size="small"
                    sx={{ color: "white", fontFamily: "BoonBaanRegular" }}
                    variant="contained"
                    onClick={async () => {
                      Swal.fire({
                        title: `${t("updateConfirm")}`,
                        icon: "info",
                        showCancelButton: true,
                        confirmButtonColor: theme.palette.primary.main,
                        cancelButtonColor: "#FF5555",
                        confirmButtonText: `${t("confirm")}`,
                        cancelButtonText: `${t("cancle")}`,
                        reverseButtons: true,
                      }).then(async (result: SweetAlertResult) => {
                        if (result.isConfirmed) {
                          await transferMutation.mutateAsync({ data });
                        }
                      });
                    }}
                  >
                    {t("transaction.transfer")}
                  </Button>
                )}
              </div>
            </div>
          );
        },
      },
      // {
      //   // accessorFn: (originalRow) => originalRow.isSell, //alternate way
      //   header: "control",
      //   Header: (
      //     <div style={{ fontFamily: "BoonBaanRegular" }}>
      //       {t("donotsell.control")}
      //     </div>
      //   ),
      //   Cell: ({ cell }) => {
      //     const isSell = cell.row.original.isSell;

      //     return (
      //       <div className="text-center">
      //         <div
      //           className="w-fit mx-auto rounded-md py-1 px-4 text-white min-w-[96px] hover:opacity-80 cursor-pointer"
      //           // <div className="w-fit mx-auto rounded-md border-4 border-indigo-500 text-white"
      //           style={{
      //             backgroundColor: !isSell ? "#299914" : "#FF5555",
      //             // FF5555 : red
      //           }}
      //         >
      //           {!isSell ? t("donotsell.sell") : t("donotsell.not_sell")}
      //         </div>
      //       </div>
      //     );
      //   }, //render Date as a string
      // },
    ],
    [i18n.language, lotteryDate]
  );
  const checkActiveDay = (date: Dayjs) => {
    const checkDay = lotterDateQuery.data?.documents?.some((d: lotteryDate) =>
      dayjs(d.date).isSame(date.startOf("day"))
    );

    return !checkDay;
  };

  const data =
    transactionQuery.data?.documents !== undefined
      ? transactionQuery.data.documents
      : [];
      console.log('',data)
  return (
    <div className="mt-2">
      <MaterialReactTable
        columns={columns}
        data={data}
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
        // enableTopToolbar={false}
        //   muiTableBodyRowProps={{ hover: false }}
        muiTablePaperProps={{
          elevation: 0, //change the mui box shadow
          //customize paper styles
          sx: {
            borderRadius: "8px",
            border: "1px solid #e0e0e0",
          },
        }}
        state={{
          isLoading: transferMutation.isLoading,
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
          return (
            <div className="w-full flex justify-between mx-2">
              <div className="flex w-4/5">
                <div className="relative w-1/4 ">
                  <input
                    type="text"
                    id="voice-search"
                    className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full  py-2.5 px-2.5  dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                    placeholder={t("transaction.search") || ""}
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

                <DatePicker
                  value={dayjs(lotteryDate) ?? undefined}
                  shouldDisableDate={checkActiveDay}
                  format="DD/MM/YYYY"
                  // minDate={watch("endDate") && dayjs(watch("endDate"))}
                  // value={dayjs(watch("date"), "YYYYMMDD") ?? undefined}
                  // label={t("lotto_history.lottery_date")}
                  slots={{
                    textField: CustomInput,
                  }}
                  onChange={(e: any) => {
                    if (e !== null) {
                      console.log("", e);
                      setLotteryDate(e.toDate());
                      // setValue("date", dayjs(e).toDate());
                      // filterStore.handleChangeStartDate(e);
                    }
                  }}
                />

                <select
                  id="countries"
                  className="w-1/4 bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block  p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                >
                  <option selected>{t("transaction.status")}</option>
                  <option value="US">United States</option>
                  <option value="CA">Canada</option>
                  <option value="FR">France</option>
                  <option value="DE">Germany</option>
                </select>
              </div>
              <Button
                sx={{ color: "white", fontFamily: "BoonBaanRegular" }}
                variant="contained"
                // startIcon={<Add />}
                onClick={calculateWin}
              >
                {t("transaction.calculate")}
              </Button>
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
