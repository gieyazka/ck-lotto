/* eslint-disable @typescript-eslint/ban-ts-comment */

import "./calendar.css";
import "dayjs/locale/th";
import "dayjs/locale/lo";

import {
  ArrowLeft2,
  ArrowRight,
  ArrowRight2,
  Information,
} from "iconsax-react";
import { Button, Skeleton, Typography } from "@mui/material";
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
  getSetup,
  getUserSession,
  getWinPrice,
  upDateWinPrice,
  upDatelotteryDate,
  updateSetting,
} from "../../utils/service";
import dayjs, { Dayjs } from "dayjs";
import i18n, { changeLanguage } from "i18next";
import { loadingStore, userData, winPrice } from "../../utils/type";

import LoadingButton from "@mui/lab/LoadingButton";
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

  const lotterDateQuery = useQuery(["setup"], () => getSetup(), {
    refetchOnMount: "always",
    keepPreviousData: true,
    refetchInterval: false,
    refetchOnWindowFocus: false,
  });
  const [timeSetupState, setTimeSetupState] = React.useState<{
    $id: string | null;
    startTime: Dayjs | null;
    stopTime: Dayjs | null;
  }>({
    $id: null,
    startTime: null,
    stopTime: null,
  });
  const [amountState, setAmountState] = React.useState<{
    $id: string | null;
    amount: number;
  }>({
    $id: null,
    amount: 0,
  });
  const [emergencyState, setEmergencyState] = React.useState<{
    $id: string | null;
    isStop: boolean;
  }>({
    $id: null,
    isStop: false,
  });

  React.useEffect(() => {
    //@ts-ignore
    if (lotterDateQuery.isFetched && lotterDateQuery.data?.documents) {
      //@ts-ignore
      const dataSellTime = lotterDateQuery.data?.documents.find(
        (d: { [key: string]: any }) => d.type === "sellTime"
      );
      if (dataSellTime) {
        const sellTime = JSON.parse(dataSellTime.setting);
        setTimeSetupState({
          $id: dataSellTime.$id as string,
          startTime: dayjs(sellTime.startTime, "HHmmss"),
          stopTime: dayjs(sellTime.stopTime, "HHmmss"),
        });
      }

      const dataMinTransfer = lotterDateQuery.data?.documents.find(
        (d: { [key: string]: any }) => d.type === "minTransfer"
      );
      if (dataMinTransfer) {
        const minTransfer = JSON.parse(dataMinTransfer.setting);
        setAmountState({
          $id: dataMinTransfer.$id as string,
          amount: minTransfer.amount,
        });
      }

      const dataMinEmer = lotterDateQuery.data?.documents.find(
        (d: { [key: string]: any }) => d.type === "emergencyStop"
      );
      if (dataMinEmer) {
        console.log("dataMinEmer", dataMinEmer);
        const emergencyStop = JSON.parse(dataMinEmer.setting);
        setEmergencyState({
          $id: dataMinEmer.$id as string,
          isStop: emergencyStop.isStop,
        });
      }
    }
  }, [lotterDateQuery.isFetching]);
  const onEditTime = () => {
    if (timeSetupState.startTime === null) {
      callToast({
        type: "error",
        title: `${t("setup.nostartTime")}`,
      });
      return;
    }
    if (timeSetupState.stopTime === null) {
      callToast({
        type: "error",
        title: `${t("setup.noEndTime")}`,
      });
      return;
    }
    const sellTime = JSON.stringify({
      startTime: timeSetupState.startTime.format("HHmm00"),
      stopTime: timeSetupState.stopTime.format("HHmm00"),
    });
    Swal.fire({
      title: `${t("setup.editTimeConfirm")}`,
      icon: "info",
      showCancelButton: true,
      confirmButtonColor: theme.palette.primary.main,
      cancelButtonColor: "#FF5555",
      confirmButtonText: `${t("confirm")}`,
      cancelButtonText: `${t("cancle")}`,
      reverseButtons: true,
    }).then(async (result) => {
      if (result.isConfirmed) {
        // if (timeSetupState.startTime === null) {
        // }
        // if (timeSetupState.stopTime === null) {
        // }
        await LotteryMutation.mutateAsync({
          type: "sellTime",
          setting: sellTime,
          $id: timeSetupState.$id,
        });
      }
    });
  };
  const onEditAmount = () => {
    const amountMin = JSON.stringify({
      amount: amountState.amount,
    });
    Swal.fire({
      title: `${t("setup.editAmountConfirm")}`,
      icon: "info",
      showCancelButton: true,
      confirmButtonColor: theme.palette.primary.main,
      cancelButtonColor: "#FF5555",
      confirmButtonText: `${t("confirm")}`,
      cancelButtonText: `${t("cancle")}`,
      reverseButtons: true,
    }).then(async (result) => {
      if (result.isConfirmed) {
        // if (timeSetupState.startTime === null) {
        // }
        // if (timeSetupState.stopTime === null) {
        // }
        await LotteryMutation.mutateAsync({
          type: "minTransfer",
          setting: amountMin,
          $id: amountState.$id,
        });
      }
    });
  };
  const onEditEmergency = () => {
    const emergencyStop = JSON.stringify({
      isStop: !emergencyState.isStop,
    });
    Swal.fire({
      title: `${t("setup.editEmerConfirm")}`,
      icon: "info",
      showCancelButton: true,
      confirmButtonColor: theme.palette.primary.main,
      cancelButtonColor: "#FF5555",
      confirmButtonText: `${t("confirm")}`,
      cancelButtonText: `${t("cancle")}`,
      reverseButtons: true,
    }).then(async (result) => {
      if (result.isConfirmed) {
        await LotteryMutation.mutateAsync({
          type: "emergencyStop",
          setting: emergencyStop,
          $id: emergencyState.$id,
        });
      }
    });
  };

  const LotteryMutation = useMutation(
    (data) => {
      return updateSetting(data);
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
      <div className="flex gap-4 flex-col justify-center">
        {lotterDateQuery.isLoading ? (
          <LoadingButton variant="outlined"></LoadingButton>
        ) : (
          <Button
            style={{
              // display: menuState === 3 ? "block" : "none",
              fontFamily: "BoonBaanRegular",
              backgroundColor: emergencyState.isStop ? "#86DC89" : "#FF5555",
              gap: 4,
              color: "white",
            }}
            variant="contained"
            onClick={onEditEmergency}
          >
            <Information />
            <p className="">
              {emergencyState.isStop
                ? t("setup.sell")
                : t("setup.emergencyStop")}
            </p>
          </Button>
        )}
        <div className="flex gap-2">
          <div className="flex gap-4 h-full   justify-between items-start">
            <div className="flex gap-4 border-2 flex-col p-4 rounded-xl">
              <Typography className="text-center text-xl" component="p">
                {t("setup.setTime")}
              </Typography>
              <TimePicker
                slotProps={{ textField: { size: "small" } }}
                ampm={false}
                label={t("setup.startTime")}
                onChange={(e: Dayjs | null) => {
                  setTimeSetupState((prev) => ({
                    ...prev,
                    startTime: e ? e : null,
                  }));
                }}
                value={timeSetupState.startTime ?? null}
              />
              <TimePicker
                onChange={(e: Dayjs | null) => {
                  setTimeSetupState((prev) => ({
                    ...prev,
                    stopTime: e ? e : null,
                  }));
                }}
                ampm={false}
                value={timeSetupState.stopTime ?? null}
                slotProps={{ textField: { size: "small" } }}
                label={t("setup.endTime")}
              />
              <Button
                variant="contained"
                onClick={onEditTime}
                className="text-white h-fit "
              >
                {t("setup.editTime")}
              </Button>
            </div>
          </div>

          <div className="flex gap-4 border-2 justify-between flex-col p-4 rounded-xl">
            <div className="flex flex-col gap-4">
              <Typography className="text-center text-xl" component="p">
                {t("setup.minimumAmount")}
              </Typography>
              <input
                id="minimum"
                // maxLength={6}
                value={amountState.amount}
                type="text"
                className="border h-fit py-2.5 border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block   px-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                placeholder={t("amount") || ""}
                onChange={(event) => {
                  const text = event.target.value;
                  const sanitizedValue = text.replace(/[^0-9]/g, "");
                  if (sanitizedValue !== "") {
                    // newQuota[quotaIndex] = parseInt(sanitizedValue);
                    setAmountState((prev) => ({
                      ...prev,
                      amount: parseInt(sanitizedValue),
                    }));
                  } else {
                    setAmountState((prev) => ({ ...prev, amount: 0 }));
                    // newQuota[quotaIndex] = 0;
                  }
                }}
              />
            </div>
            <Button
              variant="contained"
              className="text-white font-[BoonBaanRegular] "
              onClick={onEditAmount}
            >
              {t("setup.editAmount")}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
