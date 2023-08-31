import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Typography,
} from "@mui/material";
import React, { useMemo } from "react";
import dayjs, { Dayjs } from "dayjs";
import i18n, { changeLanguage } from "i18next";

import { Add } from "iconsax-react";
import { DatePicker } from "@mui/x-date-pickers";
import { MRT_ColumnDef } from "material-react-table"; // If using TypeScript (optional, but recommended)
import { MRT_Localization_FR } from "material-react-table/locales/fr";
import { MaterialReactTable } from "material-react-table";
import Swal from "sweetalert2";
import _ from "lodash";
import { callToast } from "../../utils/common";
import { getSingleAccumulate } from "../../utils/service";
import useHook from "./accumulate";
import { useLoading } from "../../store";
import { useMutation } from "react-query";
import { useTheme } from "@mui/material/styles";
import { useTranslation } from "react-i18next";

//If using TypeScript, define the shape of your data (optional, but recommended)
interface Data {
  number: string;
  sell_amount: number;
  reward_amount: number;
  isSell: boolean;
}

//mock data - strongly typed if you are using TypeScript (optional, but recommended)

export default function App({
  lotteryDate,
  setLotteryDate,
  quota,
  composate,
  lotteryType,
  checkActiveDay,
}: {
  setLotteryDate: (d: any) => void;
  lotteryDate: Date | undefined;
  quota: any;
  composate: any;
  lotteryType: number;
  checkActiveDay: (date: Dayjs) => boolean;
}) {
  const theme = useTheme();
  const { t } = useTranslation();
  const [open, setOpen] = React.useState(false);
  const [numberState, setNumberState] = React.useState<string | undefined>();
  const loadingStore = useLoading();
  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setNumberState(undefined);
  };
  const lotteryQuery = useHook({ lotteryType, lotteryDate: lotteryDate });
  // console.log(lotteryType.toString(), quota ? JSON.parse(quota.quota) : "");
  const lotteryQuota =
    quota !== undefined
      ? JSON.parse(quota.quota)?.find(
          (d: any) => d.digit == lotteryType.toString()
        )
      : undefined;
  const lotteryComposate =
    composate?.data !== undefined
      ? composate.data.documents.find((d: any) => {
          return d.digit === lotteryType.toString();
        })
      : undefined;

  const onSubmit = async () => {
    console.log("numberState", lotteryDate, numberState, numberState?.length);
    loadingStore.setLoad(true);
    if (numberState === undefined || numberState === "") {
      callToast({
        title: t("noInput"),
        type: "error",
      });
      loadingStore.setLoad(false);
      return;
    }
    if (numberState.length > 6) {
      callToast({
        title: t("noInput"),
        type: "error",
      });
      loadingStore.setLoad(false);
      return;
    }
    let message = t("donotsell.notSellConfirm");
    const checkLottery = await getSingleAccumulate(numberState, lotteryDate);
    if (checkLottery.documents[0]) {
      //ADD
      message = checkLottery.documents[0].isSell
        ? `${t("donotsell.notSellConfirm")}`
        : `${t("donotsell.sellConfirm")}`;
    }
    loadingStore.setLoad(false);
    Swal.fire({
      title: message,

      icon: "info",
      showCancelButton: true,
      confirmButtonColor: theme.palette.primary.main,
      cancelButtonColor: "#FF5555",
      confirmButtonText: `${t("confirm")}`,
      cancelButtonText: `${t("cancle")}`,
      reverseButtons: true,
    }).then(async (result) => {
      if (result.isConfirmed) {
        console.log("checkLottery", checkLottery.documents[0]);
        if (checkLottery.documents[0] === undefined) {
          //ADD
          await lotteryQuery.addQuery.mutateAsync({
            lotteryNumber: numberState,
            lotteryDate: lotteryDate,
          });
          handleClose();
        } else {
          //Edit
          await lotteryQuery.updateQuery.mutateAsync({
            data: checkLottery.documents[0],
          });
          handleClose();
        }
      }
    });
  };

  //column definitions - strongly typed if you are using TypeScript (optional, but recommended)
  const columns = useMemo<MRT_ColumnDef<any>[]>(
    () => [
      {
        accessorKey: "lottery", //simple recommended way to define a column
        header: t("donotsell.number"),
        Cell: ({ cell }) => {
          const data = cell.row.original;

          return (
            <div
              // <div className="w-fit mx-auto rounded-md border-4 border-indigo-500 text-white"
              style={
                {
                  // FF5555 : red
                }
              }
            >
              <Typography component="p">{data.lottery}</Typography>
            </div>
          );
        },
        // muiTableHeadCellProps: { sx: { color: "green" } }, //custom props
      },
      {
        accessorFn: (originalRow) => originalRow.amount, //alternate way
        id: "sell_amount", //id required if you use accessorFn instead of accessorKey
        header: "sell_amount",
        Header: (
          <i style={{ fontFamily: "BoonBaanRegular" }}>
            {t("donotsell.sell_amount")}
          </i>
        ),
        Cell: ({ cell }) => {
          const data = cell.row.original;

          return (
            <div
              // <div className="w-fit mx-auto rounded-md border-4 border-indigo-500 text-white"
              style={
                {
                  // FF5555 : red
                }
              }
            >
              <Typography component="p">{data.amount}</Typography>
            </div>
          );
        },
      },
      {
        id: "reward_amount", //id required if you use accessorFn instead of accessorKey
        header: "reward_amount",
        Header: (
          <i style={{ fontFamily: "BoonBaanRegular" }}>
            {t("donotsell.reward_amount")}
          </i>
        ),
        Cell: ({ cell }) => {
          const data = cell.row.original;
          return (
            <div className="text-center text-[#FF423A]">
              <div
                // <div className="w-fit mx-auto rounded-md border-4 border-indigo-500 text-white"
                style={
                  {
                    // FF5555 : red
                  }
                }
              >
                <Typography component="p">
                  {lotteryComposate
                    ? (
                        (_.last(lotteryComposate.multiply) as number) *
                        data.amount
                      ).toLocaleString()
                    : "-"}
                </Typography>
              </div>
            </div>
          );
        },
      },
      {
        // accessorFn: (originalRow) => originalRow.isSell, //alternate way
        header: "control",
        Header: (
          <div style={{ fontFamily: "BoonBaanRegular" }}>
            {t("donotsell.control")}
          </div>
        ),
        Cell: ({ cell }) => {
          const data = cell.row.original;
          const isSell = data.isSell;
          return (
            <div className="text-center">
              <div
                className="w-fit mx-auto rounded-md py-1 px-4 text-white min-w-[96px] hover:opacity-80 cursor-pointer"
                // <div className="w-fit mx-auto rounded-md border-4 border-indigo-500 text-white"
                style={{
                  backgroundColor: !isSell ? "#299914" : "#FF5555",
                  // FF5555 : red
                }}
                onClick={async () => {
                  await lotteryQuery.onEdit(data);
                }}
              >
                {!isSell ? t("donotsell.sell") : t("donotsell.not_sell")}
              </div>
            </div>
          );
        }, //render Date as a string
      },
    ],
    [i18n.language, composate?.data]
  );
  return (
    <div className="">
      <Dialog
        open={open}
        onClose={handleClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">
          {t("donotsell.add_number")}
        </DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            {lotteryDate &&
              ` ${t("transaction.lottery_date")} : ${dayjs(lotteryDate).format(
                "DD/MM/YYYY"
              )}`}{" "}
            <div className="flex gap-2 mt-4 items-center">
              <Typography component="p" className="whitespace-nowrap">
                {t("donotsell.not_sell_number")} :
              </Typography>
              <input
                maxLength={6}
                value={numberState}
                onChange={(e) => {
                  const text = e.target.value;
                  const sanitizedValue = text.replace(/[^0-9]/g, "");
                  setNumberState(sanitizedValue);
                }}
                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full  py-2.5 px-2.5  dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
              />
            </div>
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}> {t("cancle")}</Button>
          <Button onClick={onSubmit} autoFocus>
            {t("confirm")}
          </Button>
        </DialogActions>
      </Dialog>

      <div className="flex gap-4 justify-end  mb-4">
        <DatePicker
          value={dayjs(lotteryDate) ?? undefined}
          shouldDisableDate={checkActiveDay}
          format="DD/MM/YYYY"
          slots={{
            textField: CustomInput,
          }}
          onChange={(e: any) => {
            if (e !== null) {
              console.log("", e);
              setLotteryDate(e.toDate());
            }
          }}
        />

        <Button
          sx={{ color: "white", fontFamily: "BoonBaanRegular" }}
          variant="contained"
          startIcon={<Add />}
          onClick={handleClickOpen}
        >
          {t("donotsell.add_number")}
        </Button>
      </div>

      <MaterialReactTable
        columns={columns}
        data={lotteryQuery.dataQuery.data?.documents ?? []}
        //   enableRowSelection //enable some features
        //   enableColumnOrdering
        enableGlobalFilter={false} //turn off a feature
        enableColumnActions={false}
        enableColumnFilters={false}
        //   enablePagination={false}
        enableSorting={false}
        // enableBottomToolbar={false}
        enableTopToolbar={false}
        //   muiTableBodyRowProps={{ hover: false }}
        muiTablePaperProps={{
          elevation: 0, //change the mui box shadow
          //customize paper styles
          sx: {
            borderRadius: "8px",
            border: "1px solid #e0e0e0",
          },
        }}
        manualPagination
        rowCount={lotteryQuery.dataQuery.data?.total ?? 0}
        onPaginationChange={lotteryQuery.setPaginationState}
        state={{
          isLoading: lotteryQuery.dataQuery.isFetching || composate?.isLoading,

          pagination: {
            pageIndex: lotteryQuery.paginationState.pageIndex,
            pageSize: lotteryQuery.paginationState.pageSize,
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

const CustomInput = function BrowserInput(props: any) {
  const { inputProps, InputProps, ownerState, inputRef, error, ...other } =
    props;

  return (
    <div className="relative " style={{ fontFamily: "BoonBaanRegular" }}>
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
