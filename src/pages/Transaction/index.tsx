import * as React from "react";

import { Controller, SubmitHandler, useForm } from "react-hook-form";
import {
  addUserLog,
  calculateWin,
  getAllWinPrice,
  getLotteryDateTwoYear,
  getUserSession,
  gettransactions,
  transferMoney,
} from "../../utils/service";
import i18n, { changeLanguage } from "i18next";
import { lotteryDate, transaction } from "../../utils/type";
import { useMutation, useQuery, useQueryClient } from "react-query";

import RenderTable from "./table";
import Swal from "sweetalert2";
import _ from "lodash";
import { callToast } from "../../utils/common";
import dayjs from "dayjs";
import { useLoading } from "../../store";
import { useNavigate } from "react-router-dom";
import { useTheme } from "@mui/material/styles";
import { useTranslation } from "react-i18next";

const Transaction = () => {
  const queryClient = useQueryClient();
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
  const loadingStore = useLoading();
  const [lotteryDate, setLotteryDate] = React.useState<Date>();
  const theme = useTheme();
  const user = getUserSession();
  const composatenQuery = useQuery(
    ["composate", lotteryDate],
    () => getAllWinPrice(),
    {
      enabled: lotteryDate !== undefined,
      refetchOnMount: "always",
      keepPreviousData: true,
      refetchInterval: false,
      refetchOnWindowFocus: false,
    }
  );

  const transactionQuery = useQuery(
    ["transaction", lotteryDate],
    () => gettransactions(lotteryDate),
    {
      enabled: lotteryDate !== undefined,
      refetchOnMount: "always",
      keepPreviousData: true,
      refetchInterval: false,
      refetchOnWindowFocus: false,
    }
  );
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
  const transferMutation = useMutation(
    (props: { data: transaction }) => {
      return transferMoney(props.data, composatenQuery.data.documents);
    },
    {
      onMutate: () => {
        loadingStore.setLoad(true);
      },
      onSuccess: async (data: transaction, variables: any, context?: any) => {
        queryClient.setQueryData(
          ["transaction", lotteryDate],
          (oldData: any) => {
            const newData = _.cloneDeep(oldData);
            const arrIndex = _.findIndex(
              newData.documents,
              function (o: transaction) {
                return o.$id == data.$id;
              }
            );
            newData.documents[arrIndex] = data;
            return newData;
          }
        );
        // transactionQuery.refetch();
        await addUserLog({
          type: "tranfersMoney",
          logData: JSON.stringify({ transferAmount: data.transferAmount }),
          users: user.$id,
          timestamp: new Date(),
          collection: data.$collectionId,
          docId: data.$id,
        });
        loadingStore.setLoad(false);
        callToast({
          title: t("updateSuccess"),
          type: "success",
        });
      },
      onError: (e: Error) => {
        callToast({
          title: `${t("updateFail")} : ${e.message}`,
          type: "error",
        });
        loadingStore.setLoad(false);
      },
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

  const onCalculateWin = async () => {
    Swal.fire({
      title: `${t("updateConfirm")}`,
      icon: "info",
      showCancelButton: true,
      confirmButtonColor: theme.palette.primary.main,
      cancelButtonColor: "#FF5555",
      confirmButtonText: `${t("confirm")}`,
      cancelButtonText: `${t("cancle")}`,
      reverseButtons: true,
    }).then(async (result) => {
      if (result.isConfirmed) {
        loadingStore.setLoad(true);
        const res = await calculateWin(lotteryDate, user.$id).finally(() => {
          loadingStore.setLoad(false);
        });
        console.log("res", res);
        if (res.status >= 300) {
          callToast({
            title: res.data,
            type: "error",
          });
          return;
        }
        callToast({
          title: res.data,
          type: "success",
        });
        transactionQuery.refetch();
      }
    });
  };

  return (
    <div className="">
      <div className="flex justify-end"></div>
      <div className="text-xl">
        <RenderTable
          calculateWin={onCalculateWin}
          transactionQuery={transactionQuery}
          lotterDateQuery={lotterDateQuery}
          setLotteryDate={setLotteryDate}
          lotteryDate={lotteryDate}
          transferMutation={transferMutation}
        />
      </div>
    </div>
  );
};

export default Transaction;
