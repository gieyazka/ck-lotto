import { Avatar, Chip } from "@mui/material";
import { Controller, SubmitHandler, useForm } from "react-hook-form";
import { QueryCache, useMutation, useQuery } from "react-query";
import {
  addAds,
  addFile,
  addUserLog,
  deleteAds,
  getAds,
} from "../../utils/service";
import i18n, { changeLanguage } from "i18next";

import Button from "@mui/material/Button";
import { DatePicker } from "@mui/x-date-pickers";
import FormControlLabel from "@mui/material/FormControlLabel";
import React from "react";
import RenderDialog from "./dialog";
import RenderTable from "./table";
import Swal from "sweetalert2";
import _ from "lodash";
import { adsData } from "../../utils/type";
import { callToast } from "../../utils/common";
import dayjs from "dayjs";
import { useLoading } from "../../store";
import { useNavigate } from "react-router-dom";
import { useTheme } from "@mui/material/styles";
import { useTranslation } from "react-i18next";

const Ads_Page = () => {
  const user = JSON.parse(sessionStorage.getItem("User") || "null");

  const loadingStore = useLoading();
  const [paginationState, setPaginationState] = React.useState({
    pageIndex: 0,
    pageSize: 25,
  });
  const ads = useQuery(
    ["ads", paginationState.pageIndex, paginationState.pageSize],
    () => getAds(paginationState),
    {
      // refetchOnMount : false,
      keepPreviousData: true,
      refetchInterval: false,
      refetchOnWindowFocus: false,
    }
  );
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
      ads.refetch();
      loadingStore.setLoad(false);
      callToast({
        title: t("deleteSuccess"),
        type: "success",
      });
    },
    onError: () => {
      callToast({
        title: t("deleteFail"),
        type: "error",
      });
      loadingStore.setLoad(false);
    },
  };
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
      reset();
      ads.refetch();
      loadingStore.setLoad(false);
      callToast({
        title: t("createSuccess"),
        type: "success",
      });
    },
    onError: () => {
      callToast({
        title: t("createFail"),
        type: "error",
      });
      loadingStore.setLoad(false);
    },
  };

  const createAds = useMutation((data: adsData) => {
    return addAds(data);
  }, mutationOptionCreate);
  const delete_Ads = useMutation((docId: string) => {
    return deleteAds(docId);
  }, mutationOptionDelete);

  const onDelete = async (docId: string) => {
    Swal.fire({
      title: `${t("deleteConfirm")}`,
      icon: "info",
      showCancelButton: true,
      confirmButtonColor: theme.palette.primary.main,
      cancelButtonColor: "#FF5555",
      confirmButtonText: `${t("confirm")}`,
      cancelButtonText: `${t("cancle")}`,
      reverseButtons: true,
    }).then(async (result) => {
      if (result.isConfirmed) {
        await delete_Ads.mutateAsync(docId);
      }
    });
  };

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    reset,
    control,
    formState: { errors },
  } = useForm<adsData>();
  const watchedImage = watch("image") ?? [];
  const fileRef = React.useRef<HTMLInputElement | null>(null);
  const navigate = useNavigate();
  const { t } = useTranslation();
  const [dialogState, setDialogState] = React.useState<{
    open: boolean;
    data: adsData | undefined;
  }>({ open: false, data: undefined });

  const handleOpenDialog = (data: adsData) => {
    setDialogState({ open: true, data: data });
  };

  const handleClose = () => {
    setDialogState({ open: false, data: undefined });
  };

  const onSubmit: SubmitHandler<any> = async (data: adsData) => {
    const { title, detail, startDate, endDate, image } = data;
    // console.table({ title, detail, startDate, endDate, image });
    if (title === "") {
      callToast({
        title: t("ads.noTitle"),
        type: "error",
      });
      return;
    }
    if (detail === "") {
      callToast({
        title: t("ads.noDetail"),
        type: "error",
      });
      return;
    }
    if (startDate === undefined) {
      callToast({
        title: t("ads.noStartDate"),
        type: "error",
      });
      return;
    }

    if (endDate === undefined) {
      callToast({
        title: t("ads.noEndDate"),
        type: "error",
      });
      return;
    }
    if (image === undefined) {
      callToast({
        title: t("ads.noImage"),
        type: "error",
      });
      return;
    }

    await createAds.mutateAsync(data);
  };
  const theme = useTheme();

  const handleInputChange = (event: any) => {
    if (event.target.files.length > 0) {
      setValue("image", event.target.files);
    }
  };

  const handleCancle = () => {
    reset();
  };
  return (
    <div className="">
      <RenderDialog
        handleClose={handleClose}
        handleOpenDialog={handleOpenDialog}
        state={dialogState}
      />
      <div
        style={{ fontFamily: "BoonBaanRegular" }}
        className="rounded-lg bg-white p-4"
      >
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="flex space-x-4">
            <div className="basis-[40%]">
              <textarea
                {...register("title")}
                id="title"
                rows={4}
                className="w-full block p-2.5  text-sm text-gray-900 bg-gray-50 rounded-lg border border-gray-300 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                placeholder={t("ads.title") || ""}
              ></textarea>
            </div>
            <div className="basis-[60%]">
              <textarea
                {...register("detail")}
                id="details"
                rows={4}
                className="w-full block p-2.5  text-sm text-gray-900 bg-gray-50 rounded-lg border border-gray-300 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                placeholder={t("ads.details") || ""}
              ></textarea>
            </div>
          </div>
          <div className="flex my-2 items-end space-x-2">
            <div>
              <input
                // {...register("image")}
                ref={fileRef}
                id="fileInput"
                type="file"
                multiple
                accept="image/*"
                onChange={handleInputChange}
                style={{ display: "none" }}
              />
              <div className="relative flex items-center border-2 rounded-lg border-[#D7D7D7]">
                <label
                  htmlFor="fileInput"
                  className="btn bg-[#D7D7D7] border-[#D7D7D7]  border-2 px-6 py-2  text-[#5A5A5A] whitespace-nowrap"
                >
                  {t("ads.select_photo") || ""}
                </label>
                <div
                  onClick={() => fileRef.current?.click()}
                  className=" h-full overflow-x-hidden  rounded-r-lg  inline-block min-w-[50vw]"
                >
                  <p className="ml-4 inline-block">
                    {Array.from(watchedImage as any).map((d: any) => {
                      return (
                        <Chip
                          className="h-auto"
                          avatar={<Avatar src={URL.createObjectURL(d)} />}
                          label={d.name}
                          variant="outlined"
                        />
                      );
                    })}
                  </p>
                </div>
              </div>
            </div>
            <div className="flex flex-1 gap-2">
              <DatePicker
                format="DD/MM/YYYY"
                minDate={watch("endDate") && dayjs(watch("endDate"))}
                value={watch("startDate") ?? null}
                label={t("ads.startDate")}
                slots={{
                  textField: CustomInput,
                }}
                onChange={(e: any) => {
                  if (e !== null) {
                    if (watch("endDate") !== undefined) {
                      if (dayjs(e).isAfter(watch("endDate"))) {
                        setValue("endDate", undefined);
                      }
                    }
                    setValue("startDate", dayjs(e).toDate());
                    // filterStore.handleChangeStartDate(e);
                  }
                }}
              />

              <DatePicker
                minDate={watch("startDate") && dayjs(watch("startDate"))}
                format="DD/MM/YYYY"
                value={watch("endDate") ?? null}
                label={t("ads.endDate")}
                slots={{
                  textField: CustomInput,
                }}
                onChange={(e: any) => {
                  if (e !== null) {
                    setValue("endDate", dayjs(e).toDate());
                    // filterStore.handleChangeStartDate(e);
                  }
                }}
              />
            </div>
          </div>

          <div className="flex  mt-4 justify-center">
            {/* </div> */}
            {/* </div> */}
            <div className="flex space-x-4 overflow-clip">
              <Button
                type="submit"
                sx={{
                  color: "white",
                  fontFamily: "BoonBaanRegular",
                  backgroundColor: "#299914",
                }}
                variant="contained"
              >
                {t("ads.send")}
              </Button>
              <Button
                sx={{
                  color: "white",
                  fontFamily: "BoonBaanRegular",
                  backgroundColor: "#FF5555",
                }}
                onClick={handleCancle}
                variant="contained"
              >
                {t("ads.cancle")}
              </Button>
            </div>
          </div>
        </form>
      </div>
      <div className="text-xl">
        <RenderTable
          query={ads}
          onDelete={onDelete}
          paginationState={paginationState}
          setPaginationState={setPaginationState}
          handleOpenDialog={handleOpenDialog}
          total={ads?.data?.total ?? 0}
          data={ads.data?.documents !== undefined ? ads.data.documents : []}
        />
      </div>
    </div>
  );
};

export default Ads_Page;

const CustomInput = function BrowserInput(props: any) {
  const { inputProps, InputProps, ownerState, inputRef, error, ...other } =
    props;
  return (
    <div className="relative w-full" style={{ fontFamily: "BoonBaanRegular" }}>
      <p className="">{props.label}</p>

      <div className="relative" ref={InputProps?.ref}>
        <div className="absolute top-1/2 left-[-4px]  -translate-y-1/2 ">
          {InputProps?.endAdornment}
        </div>

        <input
          ref={inputRef}
          {...inputProps}
          {...(other as any)}
          className="bg-gray-50 border  border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full pl-10 p-2.5  dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
        />
      </div>
    </div>
  );
};
