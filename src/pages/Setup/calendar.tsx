import "./calendar.css";
import "dayjs/locale/th";
import "dayjs/locale/lo";

import {
  ArrowLeft2,
  ArrowRight,
  ArrowRight2,
  Information,
} from "iconsax-react";
import { Button, Skeleton } from "@mui/material";
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
  getLotteryDate,
  getUserSession,
  getWinPrice,
  upDateWinPrice,
  upDatelotteryDate,
} from "../../utils/service";
import dayjs, { Dayjs } from "dayjs";
import i18n, { changeLanguage } from "i18next";
import { loadingStore, userData, winPrice } from "../../utils/type";

import { Add } from "@mui/icons-material";
import Calendar from "react-calendar";
import Chip from "@mui/material/Chip";
import { DatePicker } from "@mui/x-date-pickers";
import { ReactComponent as DeleteIcon } from "../../assets/icons/delete.svg";
import DeletedIcon from "@mui/icons-material/Delete";
import { ReactComponent as EditIcon } from "../../assets/icons/edit.svg";
import IconButton from "@mui/material/IconButton";
import { LooseValue } from "react-calendar/dist/cjs/shared/types";
import { MRT_ColumnDef } from "material-react-table"; // If using TypeScript (optional, but recommended)
import { MRT_Localization_FR } from "material-react-table/locales/fr";
import { MaterialReactTable } from "material-react-table";
import Swal from "sweetalert2";
import { TimePicker } from "@mui/x-date-pickers";
import VisibilityIcon from "@mui/icons-material/Visibility";
import _ from "lodash";
import { callToast } from "../../utils/common";
import { useLoading } from "../../store";
import { useTheme } from "@mui/material/styles";
import { useTranslation } from "react-i18next";

//If using TypeScript, define the shape of your data (optional, but recommended)

//mock data - strongly typed if you are using TypeScript (optional, but recommended)

export default function App() {
  const theme = useTheme();
  const user = getUserSession();
  const { t } = useTranslation();
  const loadingStore = useLoading();

  const [monthState, setMonthState] = React.useState(
    dayjs().locale(i18n.language).startOf("month")
  );
  const onSubtractYear = () => {
    setMonthState((prev: Dayjs) => prev.subtract(1, "year"));
  };
  const onAddYear = () => {
    setMonthState((prev: Dayjs) => prev.add(1, "year"));
  };
  // const [state, setState] = React.useState<winPrice[]>();
  const yearly = [
    "01",
    "02",
    "03",
    "04",
    "05",
    "06",
    "07",
    "08",
    "09",
    "10",
    "11",
    "12",
  ];

  const lotterDateQuery = useQuery(
    ["lotterDate", monthState],
    () => getLotteryDate(monthState),
    {
      refetchOnMount: "always",
      keepPreviousData: true,
      refetchInterval: false,
      refetchOnWindowFocus: false,
    }
  );
  const getTileClassName = (props: any) => {
 
    if (
      props.filterData?.some(
        (d : any) =>
          !d.isDelete &&
          dayjs(d.date).format("YYYYMMDD") === dayjs(props.date).format("YYYYMMDD")
      )
    ) {
      return "react-calendar__tile--hasActive ";
    }

    // return "bg-red-500 text-white";
  };

  const onClickDay = (dateClick: Date, lotteryDate: any) => {
    Swal.fire({
      title: `${
        lotteryDate ? t("setup.addDateLottery") : t("setup.deleteDateLottery")
      }`,
      text: `${t("setup.date")} :  ${dayjs(dateClick).format("DD-MM-YYYY")}`,
      icon: "info",
      showCancelButton: true,
      confirmButtonColor: theme.palette.primary.main,
      cancelButtonColor: "#FF5555",
      confirmButtonText: `${t("confirm")}`,
      cancelButtonText: `${t("cancle")}`,
      reverseButtons: true,
    }).then(async (result) => {
      if (result.isConfirmed) {
        const monthLeave: any[] = _.cloneDeep(lotteryDate);
        console.log("", monthLeave);
        console.log("dateClick", dateClick);
        await LotteryMutation.mutateAsync({ date: dateClick, lotteryDate });
      }
    });
  };

  const onEditTime = () => {
    Swal.fire({
      title: `${t("editTimeConfirm")}`,
      icon: "info",
      showCancelButton: true,
      confirmButtonColor: theme.palette.primary.main,
      cancelButtonColor: "#FF5555",
      confirmButtonText: `${t("confirm")}`,
      cancelButtonText: `${t("cancle")}`,
      reverseButtons: true,
    }).then(async (result) => {
      if (result.isConfirmed) {
        // await userMutation.mutateAsync({ data, docId });
      }
    });
  };

  const LotteryMutation = useMutation(
    ({ date, lotteryDate }: { date: Date; lotteryDate: any }) => {
      return upDatelotteryDate(date, lotteryDate);
    },
    {
      onMutate: () => {
        loadingStore.setLoad(true);
      },
      onSuccess: async (data: any, variables: any, context?: any) => {
        await addUserLog({
          type: "update",
          logData: JSON.stringify(data),
          users: user.$id,
          timestamp: new Date(),
          collection: data.$collectionId,
          docId: data.$id,
        });
        // const type = menuState === 1 ? "customer" : "employee";
        lotterDateQuery.refetch();
        // onCloseCreateDialog();

        loadingStore.setLoad(false);
        callToast({
          title: t("updateSuccess"),
          type: "success",
        });
      },
      onError: (e: Error) => {
        console.error("e", e);
        callToast({
          title: t(e.message),
          type: "error",
        });
        loadingStore.setLoad(false);
      },
    }
  );

  return (
    <div className="mt-2 font-[BoonBaanRegular] ">
      <div className="flex gap-2 flex-col justify-center">
        <div className="flex gap-4 justify-between">
          <div className="flex gap-2 ">
            <TimePicker
              slotProps={{ textField: { size: "small" } }}
              ampm={false}
              label={t("setup.startTime")}
            />
            <TimePicker
              slotProps={{ textField: { size: "small" } }}
              label={t("setup.endTime")}
            />
            <Button
              variant="contained"
              onClick={() => {
                onEditTime();
              }}
              className="text-white font-[BoonBaanRegular] "
            >
              {t("setup.editTime")}
            </Button>
          </div>
          <Button
            style={{
              // display: menuState === 3 ? "block" : "none",
              fontFamily: "BoonBaanRegular",
              backgroundColor: "#FF5555",
              gap: 4,
              color: "white",
            }}
            variant="contained"
          >
            <Information />
            <p className="">{t("setup.emergencyStop")}</p>
          </Button>
        </div>
        <div className="flex justify-center items-center gap-4">
          <IconButton color="primary" onClick={onSubtractYear}>
            <ArrowLeft2 size="32" color={theme.palette.primary.main} />
          </IconButton>
          <p className=" text-center  text-2xl bg-[#FFFFFF] ">
            {monthState.format("YYYY")}
          </p>
          <IconButton color="primary" onClick={onAddYear}>
            <ArrowRight2 size="32" color={theme.palette.primary.main} />
          </IconButton>
        </div>
        <div className="flex gap-4 flex-wrap justify-evenly mt-2">
          {yearly.map((month) => {
            const year = monthState.format("YYYY");
            const monthYear = `${month}${year}`;
            let lotteryDate: any = undefined;
            let filterData: any = [];
            if (!lotterDateQuery.isLoading) {
              filterData = lotterDateQuery.data?.documents.filter(
                (d: any) => dayjs(d.date).format("MMYYYY") === monthYear
              );
              lotteryDate = filterData.map((item: any) => item["date"]);
            }
            return (
              <div
                key={`calendar${month}`}
                className="border-2 border-black w-fit flex flex-col"
              >
                <p className=" text-center  bg-[#FFFFFF] ">
                  {dayjs(monthYear, "MMYYYY")
                    .locale(i18n.language)
                    .format("MMMM")}
                </p>
                <Calendar
                  formatWeekday={(locale, date) => {
                    return dayjs(date).locale(i18n.language).format("dd");
                  }}
                  formatShortWeekday={(locale, date) => {
                    return dayjs(date).locale(i18n.language).format("dd");
                  }}
                  activeStartDate={dayjs(monthYear, "MMYYYY").toDate()}
                  minDate={dayjs(monthYear, "MMYYYY").startOf("month").toDate()}
                  maxDate={dayjs(monthYear, "MMYYYY").endOf("month").toDate()}
                  showNavigation={false}
                  className="flex-1 font-[BoonBaanRegular]"
                  onClickDay={(v, e) => {
                    if (dayjs().isAfter(v)) {
                      return null;
                    }
                    const dayClick = dayjs(v).format("YYYYMMDD");
                    const lotteryDate = filterData.find(
                      (d: any) => dayjs(d.date).format("YYYYMMDD") === dayClick
                    );
                    console.log("lotteryDate", lotteryDate);
                    onClickDay(v, lotteryDate);
                  }}
                  // value={lotteryDate}
                  tileClassName={(props) =>
                    getTileClassName({ ...props, filterData: filterData })
                  }
                />
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
