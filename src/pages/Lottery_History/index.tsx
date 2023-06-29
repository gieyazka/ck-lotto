import * as React from "react";

import { Controller, SubmitHandler, useForm } from "react-hook-form";
import {
  addLottery_history,
  addUserLog,
  deleteLottery_history,
  getLottery_history,
} from "../../utils/service";
import { adsData, lottory_history } from "../../utils/type";
import i18n, { changeLanguage } from "i18next";
import { useMutation, useQuery } from "react-query";

import { Add } from "@mui/icons-material";
import Avatar from "@mui/material/Avatar";
import Bg_image from "../../components/bgimage";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Checkbox from "@mui/material/Checkbox";
import CssBaseline from "@mui/material/CssBaseline";
import { DatePicker } from "@mui/x-date-pickers";
import FormControlLabel from "@mui/material/FormControlLabel";
import Grid from "@mui/material/Grid";
import Link from "@mui/material/Link";
import Paper from "@mui/material/Paper";
import RenderDialog from "./dialog";
import RenderTable from "./table";
import Swal from "sweetalert2";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import bg_image from "../../../assets/login_image.svg";
import { callToast } from "../../utils/common";
import dayjs from "dayjs";
import { useLoading } from "../../store";
import { useNavigate } from "react-router-dom";
import { useTheme } from "@mui/material/styles";
import { useTranslation } from "react-i18next";

interface Data {
  number: string;
  date: string;
}

const Lottery_History = () => {
  const user = JSON.parse(sessionStorage.getItem("User") || "null");

  const [paginationState, setPaginationState] = React.useState({
    pageIndex: 0,
    pageSize: 25,
  });
  //  console.log(paginationState);

  const lotter_history = useQuery(
    ["lotter_history", paginationState.pageIndex, paginationState.pageSize],
    () => getLottery_history(paginationState),
    {
      // refetchOnMount : false,
      keepPreviousData: true,
      refetchInterval: false,
      refetchOnWindowFocus: false,
    }
  );
  const mutationOptionCreate = {
    onMutate: () => {
      loadingStore.setLoad(true);
    },
    onSuccess: async (data: any, variables: any, context?: any) => {
      await addUserLog({
        type: "create",
        logData: JSON.stringify(data),
        users: user.$id,
        timestamp: new Date(),
        collection: data.$collectionId,
        docId: data.$id,
      });

      lotter_history.refetch();
      loadingStore.setLoad(false);
    },
  };
  const mutationOptionDelete = {
    onMutate: () => {
      loadingStore.setLoad(true);
    },
    onSuccess: async (data: any, variables: any, context?: any) => {
      await addUserLog({
        type: "delete",
        logData: JSON.stringify(data),
        users: user.$id,
        timestamp: new Date(),
        collection: data.$collectionId,
        docId: data.$id,
      });
      lotter_history.refetch();
      loadingStore.setLoad(false);
    },
  };

  const create_data = useMutation((data: lottory_history) => {
    return addLottery_history(data);
  }, mutationOptionCreate);
  const delete_data = useMutation((docId: string) => {
    return deleteLottery_history(docId);
  }, mutationOptionDelete);

  const theme = useTheme();

  const loadingStore = useLoading();
  const {
    register,
    handleSubmit,
    watch,
    setValue,
    control,
    formState: { errors },
  } = useForm<lottory_history>({
    defaultValues: {
      lottery_number: "",
    },
  });
  const navigate = useNavigate();
  const { t } = useTranslation();

  const onDelete = async (docId: string) => {
    Swal.fire({
      title: `${t("deleteConfirm")}`,
      icon: "info",
      showCancelButton: true,
      confirmButtonColor: theme.palette.primary.main,
      cancelButtonColor: "#FF5555",
      confirmButtonText: `${t("comfirm")}`,
      cancelButtonText: `${t("cancle")}`,
      reverseButtons: true,
    }).then(async (result) => {
      if (result.isConfirmed) {
        await delete_data
          .mutateAsync(docId)
          .then(() => {
            callToast({
              title: t("deleteSuccess"),
              type: "success",
            });
          })
          .catch(() => {
            callToast({
              title: t("deleteFail"),
              type: "error",
            });
          });
      }
    });
  };

  const onSubmit: SubmitHandler<any> = async (data: lottory_history) => {
    const { date, lottery_number } = data;
    console.table({ date, lottery_number });
    // return
    if (lottery_number === "") {
      callToast({
        title: t("lotto_history.noNumber"),
        type: "error",
      });
      return;
    }
    if (lottery_number.length !== 6) {
      callToast({
        title: t("lotto_history.numberLength"),
        type: "error",
      });
      return;
    }
    if (date === undefined) {
      callToast({
        title: t("lotto_history.noDate"),
        type: "error",
      });
      return;
    }

    create_data
      .mutateAsync(data)
      .then(() => {
        callToast({
          title: t("createSuccess"),
          type: "success",
        });
      })
      .catch(() => {
        callToast({
          title: t("createFail"),
          type: "error",
        });
      });
  };
  const data = React.useMemo(() => {
    return lotter_history.data?.documents !== undefined
      ? lotter_history.data.documents
      : [];
  }, [lotter_history.data]);
  return (
    <div className="">
      {/* <div style={{fontFamily : "BoonBaanRegular"}}> */}

      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="flex justify-between items-end">
          <div className="flex gap-2 items-end ">
            <DatePicker
              format="DD/MM/YYYY"
              // minDate={watch("endDate") && dayjs(watch("endDate"))}
              value={dayjs(watch("date"), "YYYYMMDD") ?? undefined}
              label={t("lotto_history.lottery_date")}
              slots={{
                textField: CustomInput,
              }}
              onChange={(e: any) => {
                if (e !== null) {
                  setValue("date", dayjs(e).toDate());
                  // filterStore.handleChangeStartDate(e);
                }
              }}
            />
            <input
              maxLength={6}
              type="text"
              className="bg-gray-50 border h-fit py-2.5 border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full px-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
              placeholder={t("lotto_history.number") || ""}
              value={watch("lottery_number")}
              onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                const text = event.target.value;
                const sanitizedValue = text.replace(/[^1-9]/g, "");
                setValue("lottery_number", sanitizedValue);
              }}
              // {...register("lottery_number")}
            />
          </div>
          <Button
            type="submit"
            className="h-fit py-2.5"
            sx={{ color: "white", fontFamily: "BoonBaanRegular" }}
            variant="contained"
            startIcon={<Add />}
          >
            {t("lotto_history.add_lottery")}
          </Button>
        </div>
      </form>
      {/* <RenderDialog state={[dialogState, setDialogState]} /> */}
      <div className="text-xl">
        <RenderTable
          query={lotter_history}
          paginationState={paginationState}
          setPaginationState={setPaginationState}
          onDelete={onDelete}
          total={lotter_history?.data?.total ?? 0}
          data={data}
        />
      </div>
    </div>
  );
};

export default Lottery_History;

const CustomInput = function BrowserInput(props: any) {
  const { inputProps, InputProps, ownerState, inputRef, error, ...other } =
    props;
  return (
    <div className="relative" style={{ fontFamily: "BoonBaanRegular" }}>
      <p className="">{props.label}</p>

      <div className="relative" ref={InputProps?.ref}>
        <div className="absolute top-1/2 left-[-4px]  -translate-y-1/2 ">
          {InputProps?.endAdornment}
        </div>

        <input
          // focused={0}
          ref={inputRef}
          {...inputProps}
          {...(other as any)}
          className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full pl-10 p-2.5  dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
        />
      </div>
    </div>
  );
};
