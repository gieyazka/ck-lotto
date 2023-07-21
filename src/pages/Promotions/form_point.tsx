/* eslint-disable @typescript-eslint/ban-ts-comment */

import {
  IconButton,
  MenuItem,
  Select,
  SelectChangeEvent,
  Theme,
  useTheme,
} from "@mui/material";
import { SubmitHandler, useForm } from "react-hook-form";
import dayjs, { Dayjs } from "dayjs";

import { Add } from "iconsax-react";
import { ReactComponent as CalenDarIcon } from "../../assets/icons/calendar.svg";
import { DatePicker } from "@mui/x-date-pickers";
import { UseQueryResult } from "react-query";
import _ from "lodash";
import { groupData } from "../../utils/type";
import { t } from "i18next";

const RenderForm = ({
  onSubmit,
  groupQuery,
}: {
  onSubmit: SubmitHandler<any>;
  groupQuery: UseQueryResult<any>;
}) => {
  const {
    register,
    handleSubmit,
    watch,
    control,
    setValue,
    reset,
    formState: { errors },
  } = useForm({});
  const theme = useTheme();
  function getStyles(
    name: string,
    personName: readonly string[],
    theme: Theme
  ) {
    return {
      fontWeight:
        personName.indexOf(name) === -1
          ? theme.typography.fontWeightRegular
          : theme.typography.fontWeightMedium,
    };
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <div className="flex p-4 space-x-2">
        <input
          {...register("name")}
          type="text"
          className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full px-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
          placeholder={t("promotions.point_name") || ""}
        />
        <input
          value={watch("point") ?? ""}
          onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
            const text = event.target.value;
            const sanitizedValue = text.replace(/[^.0-9]/g, "");
            if (sanitizedValue === "") {
              setValue("point", 0);
            } else if (sanitizedValue.slice(-1) === ".") {
              if (sanitizedValue.split(".").length < 3) {
                setValue("point", sanitizedValue);
              }
            } else {
              setValue("point", parseFloat(sanitizedValue));
            }
          }}
          type="text"
          className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full px-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
          placeholder={t("promotions.point") || ""}
        />

        <DatePicker
          format="DD/MM/YYYY"
          // value={filterStore.startDate || null}
          label={t("promotions.start_date") || ""}
          slots={{
            openPickerIcon: CalenDarIcon,
            // leftArrowIcon?: elementType,
            // rightArrowIcon?: elementType,
            // switchViewIcon?: elementType
            textField: CustomInput,
          }}
          onChange={(e: any) => {
            if (e !== null) {
              if (watch("expireDate") !== undefined) {
                if (dayjs(e).isAfter(watch("expireDate"))) {
                  setValue("expireDate", undefined);
                }
              }
              setValue("startDate", dayjs(e).toDate());
            }
          }}
        />
        <DatePicker
          format="DD/MM/YYYY"
          // value={filterStore.startDate || null}
          label={t("promotions.expire_date") || ""}
          slots={{
            openPickerIcon: CalenDarIcon,

            textField: CustomInput,
          }}
          onChange={(e) => {
            if (e !== null) {
              setValue("expireDate", (e as Dayjs).toDate());
            }
          }}
        />

        <IconButton
        type="submit"
          sx={{
            backgroundColor: theme.palette.primary.main,
            color: "white",
          }}
          aria-label="delete"
          size="large"
          // onClick={async () => {}}
        >
          <Add />
        </IconButton>
      </div>
    </form>
  );
};
const CustomInput = function BrowserInput(props: any) {
  const { inputProps, InputProps, ownerState, inputRef, error, ...other } =
    props;

  return (
    <div
      className="relative mx-2  w-full "
      style={{ fontFamily: "BoonBaanRegular" }}
    >
      <div className=" relative h-full" ref={InputProps?.ref}>
        <input
          ref={inputRef}
          {...inputProps}
          {...(other as any)}
          placeholder={props.label}
          className="bg-gray-50 border h-full border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block  w-full pr-10 p-2.5  dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
        />
        <div className="absolute top-1/2 right-[16px]  -translate-y-1/2 ">
          {InputProps?.endAdornment}
        </div>
      </div>
    </div>
  );
};
export default RenderForm;
