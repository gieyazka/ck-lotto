import { Controller, SubmitHandler, useForm } from "react-hook-form";
import { QueryCache, useMutation, useQuery } from "react-query";
import { addAds, addFile, getAds } from "../../utils/service";
import i18n, { changeLanguage } from "i18next";

import Button from "@mui/material/Button";
import { DatePicker } from "@mui/x-date-pickers";
import FormControlLabel from "@mui/material/FormControlLabel";
import React from "react";
import RenderTable from "./table";
import _ from "lodash";
import { adsData } from "../../utils/type";
import { callToast } from "../../utils/common";
import dayjs from "dayjs";
import { useLoading } from "../../store";
import { useNavigate } from "react-router-dom";
import { useTheme } from "@mui/material/styles";
import { useTranslation } from "react-i18next";

const Ads_Page = () => {
  const loadingStore = useLoading();
  const ads = useQuery("ads", getAds, {
    // refetchOnMount : false,
    refetchInterval: false,
    refetchOnWindowFocus: false,
  });
  // console.log(ads);
  const mutation = useMutation({
    mutationFn: (data: adsData) => {
      return addAds(data);
    },
    onMutate: () => {
      loadingStore.setLoad(true);
    },
    onSuccess: () => {
      ads.refetch();
      loadingStore.setLoad(false);
    },
  });
  // console.log(ads);
  const fileRef = React.useRef<HTMLInputElement | null>(null);
  const navigate = useNavigate();
  const { t } = useTranslation();
  const {
    register,
    handleSubmit,
    watch,
    setValue,
    reset,
    control,
    formState: { errors },
  } = useForm<adsData>();

  // React.useEffect(() => {
  //   getTest();
  // }, []);
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

    await mutation.mutateAsync(data);
  };
  const theme = useTheme();

  const handleInputChange = (event: any) => {
    // setSelectedFile(event.target.files[0]);
    setValue("image", event.target.files[0]);
  };

  const handleCancle = () => {
    reset();
  };

  // console.log(ads.data?.documents);
  return (
    <div className="">
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
                accept="image/*"
                onChange={handleInputChange}
                style={{ display: "none" }}
              />
              <div className="flex items-center">
                <label
                  htmlFor="fileInput"
                  className="btn bg-[#D7D7D7] border-[#D7D7D7]  border-2 px-6 py-2 rounded-l-lg test-[#5A5A5A] whitespace-nowrap"
                >
                  {t("ads.select_photo") || ""}
                </label>
                <div
                  onClick={() => fileRef.current?.click()}
                  className="border-[#D7D7D7] rounded-r-lg py-2 border-2 min-w-[50vw]"
                >
                  {" "}
                  <p className="ml-4 inline-block">
                    {(watch("image") as File)?.name}
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
