import * as React from "react";

import { Controller, SubmitHandler, useForm } from "react-hook-form";
import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Typography,
} from "@mui/material";
import dayjs, { Dayjs } from "dayjs";
import {
  getComposate,
  getLotteryDateTwoYear,
  getLotteryQuotas,
} from "../../utils/service";
import i18n, { changeLanguage } from "i18next";

import { Add } from "@mui/icons-material";
import Avatar from "@mui/material/Avatar";
import Button from "@mui/material/Button";
import { DatePicker } from "@mui/x-date-pickers";
import RenderTable from "./table";
import _ from "lodash";
import { callToast } from "../../utils/common";
import { lotteryDate } from "../../utils/type";
import useHook from "./accumulate";
import { useNavigate } from "react-router-dom";
import { useQuery } from "react-query";
import { useTheme } from "@mui/material/styles";
import { useTranslation } from "react-i18next";

const Login = () => {
  const navigate = useNavigate();

  const { t } = useTranslation();
  const {
    register,
    handleSubmit,
    watch,
    control,
    formState: { errors },
  } = useForm({
    defaultValues: {
      remember: false,
      username: "",
      password: "",
    },
  });
  const [lotteryDate, setLotteryDate] = React.useState<Date>();

  const theme = useTheme();
  const lotterDateQuery = useQuery(
    ["lotterDate"],
    () => getLotteryDateTwoYear(),
    {
      refetchOnMount: "always",
      keepPreviousData: true,
      refetchInterval: false,
      refetchOnWindowFocus: false,
    }
  );
  React.useEffect(() => {
    if (lotterDateQuery.isFetchedAfterMount) {
      const filterDate = lotterDateQuery.data.documents.filter(
        (d: lotteryDate) => dayjs(d.date).isAfter(dayjs())
      );
      const nextDate = _.orderBy(filterDate, ["date"], ["asc"])[0];
      setLotteryDate(dayjs(nextDate.date).toDate());
    }
  }, [lotterDateQuery.isFetchedAfterMount]);

  const composateQuery = useQuery(["composateAmount"], () => getComposate(), {
    refetchOnMount: "always",
    keepPreviousData: true,
    refetchInterval: false,
    refetchOnWindowFocus: false,
  });
  const lotterQuotaQuery = useQuery(
    ["lottery_quotas"],
    () => getLotteryQuotas(lotteryDate),
    {
      enabled: lotteryDate !== undefined,
      refetchOnMount: "always",
      keepPreviousData: true,
      refetchInterval: false,
      refetchOnWindowFocus: false,
    }
  );

  const [menuState, setMenuState] = React.useState(1);

  const checkActiveDay = (date: Dayjs) => {
    const checkDay = lotterDateQuery.data?.documents?.some((d: lotteryDate) =>
      dayjs(d.date).isSame(date.startOf("day"))
    );

    return !checkDay;
  };
  return (
    <div className="">
      <div className="">
        <div
          style={{ fontFamily: "BoonBaanRegular" }}
          className="rounded-lg bg-white p-4"
        >
          <div className="flex flex-col z-10 ">
            <div className="flex justify-between">
              <div className="flex">
                <Button
                  style={{
                    fontFamily: "BoonBaanRegular",
                    backgroundColor:
                      menuState === 1 ? theme.palette.primary.main : "#B5B8C0",
                    color: "white",
                  }}
                  onClick={() => {
                    setMenuState(1);
                  }}
                  className="px-8  rounded-l-xl rounded-r-none border-r-0 shadow-none"
                  variant="contained"
                >
                  <p className="mb-6">{t("donotsell.one_digit")}</p>
                </Button>
                <Button
                  style={{
                    fontFamily: "BoonBaanRegular",
                    backgroundColor:
                      menuState === 2 ? theme.palette.primary.main : "#B5B8C0",
                    color: "white",
                  }}
                  onClick={() => {
                    setMenuState(2);
                  }}
                  className="px-8  rounded-r-none  rounded-l-none shadow-none"
                  variant="contained"
                >
                  <p className="mb-6">{t("donotsell.two_digit")}</p>
                </Button>
                <Button
                  onClick={() => {
                    setMenuState(3);
                  }}
                  style={{
                    fontFamily: "BoonBaanRegular",
                    backgroundColor:
                      menuState === 3 ? theme.palette.primary.main : "#B5B8C0",

                    color: "white",
                  }}
                  className="px-8 rounded-r-none  rounded-l-none shadow-none"
                  variant="contained"
                >
                  <p className="mb-6">{t("donotsell.three_digit")}</p>
                </Button>
                <Button
                  onClick={() => {
                    setMenuState(4);
                  }}
                  style={{
                    fontFamily: "BoonBaanRegular",
                    backgroundColor:
                      menuState === 4 ? theme.palette.primary.main : "#B5B8C0",

                    color: "white",
                  }}
                  className="px-8 rounded-r-none  rounded-l-none shadow-none"
                  variant="contained"
                >
                  <p className="mb-6">{t("donotsell.four_digit")}</p>
                </Button>
                <Button
                  onClick={() => {
                    setMenuState(5);
                  }}
                  style={{
                    fontFamily: "BoonBaanRegular",
                    backgroundColor:
                      menuState === 5 ? theme.palette.primary.main : "#B5B8C0",

                    color: "white",
                  }}
                  className="px-8 rounded-r-none  rounded-l-none shadow-none"
                  variant="contained"
                >
                  <p className="mb-6">{t("donotsell.five_digit")}</p>
                </Button>
                <Button
                  onClick={() => {
                    setMenuState(6);
                  }}
                  style={{
                    fontFamily: "BoonBaanRegular",
                    backgroundColor:
                      menuState === 6 ? theme.palette.primary.main : "#B5B8C0",

                    color: "white",
                  }}
                  className="px-8 rounded-r-xl  rounded-l-none shadow-none"
                  variant="contained"
                >
                  <p className="mb-6">{t("donotsell.six_digit")}</p>
                </Button>
              </div>

              <div className="flex justify-end gap-4"></div>
            </div>
            <div className="-mt-6 z-50 border-2 bg-white border-[#D7D7D7] rounded-lg min-h-[50vh]">
              <div className="p-4">
                <RenderTable
                  setLotteryDate={setLotteryDate}
                  checkActiveDay={checkActiveDay}
                  lotteryDate={lotteryDate}
                  quota={lotterQuotaQuery.data}
                  composate={composateQuery}
                  lotteryType={menuState}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
      {/* <div style={{fontFamily : "BoonBaanRegular"}}> */}

      {/* <div className="text-xl flex flex-col gap-2">
        <p>{t("donotsell.one_digit")}</p>
        <RenderTable
          lotteryDate={lotteryDate}
          quota={lotterQuotaQuery.data}
          composate={composateQuery}
          lotteryType={1}
        />
        <p>{t("donotsell.two_digit")}</p>
        <RenderTable
          lotteryDate={lotteryDate}
          quota={lotterQuotaQuery.data}
          composate={composateQuery}
          lotteryType={2}
        />
        <p>{t("donotsell.three_digit")}</p>
        <RenderTable
          lotteryDate={lotteryDate}
          quota={lotterQuotaQuery.data}
          composate={composateQuery}
          lotteryType={3}
        />
        <p>{t("donotsell.four_digit")}</p>
        <RenderTable
          lotteryDate={lotteryDate}
          quota={lotterQuotaQuery.data}
          composate={composateQuery}
          lotteryType={4}
        />
        <p>{t("donotsell.five_digit")}</p>
        <RenderTable
          lotteryDate={lotteryDate}
          quota={lotterQuotaQuery.data}
          composate={composateQuery}
          lotteryType={5}
        />
        <p>{t("donotsell.six_digit")}</p>
        <RenderTable
          lotteryDate={lotteryDate}
          quota={lotterQuotaQuery.data}
          composate={composateQuery}
          lotteryType={6}
        />
      </div> */}
    </div>
  );
};

export default Login;
