/* eslint-disable @typescript-eslint/ban-ts-comment */

import {
  IconButton,
  MenuItem,
  Select,
  SelectChangeEvent,
  TextField,
  Theme,
  useTheme,
} from "@mui/material";
import { SubmitHandler, useForm } from "react-hook-form";
import dayjs, { Dayjs } from "dayjs";

import { Add } from "iconsax-react";
import Autocomplete from "@mui/material/Autocomplete";
import { ReactComponent as CalenDarIcon } from "../../assets/icons/calendar.svg";
import { DatePicker } from "@mui/x-date-pickers";
import { UseQueryResult } from "react-query";
import _ from "lodash";
import { groupData } from "../../utils/type";
import { t } from "i18next";

const RenderForm = ({
  onSubmitPromotion,
  groupQuery,
}: {
  onSubmitPromotion: SubmitHandler<any>;
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

  const handleChange = (event: SelectChangeEvent<any>) => {
    const {
      target: { value },
    } = event;
    if (_.last(value) === "") {
      setValue("groups", []);
    } else {
      const uniqueArray = _.uniqBy(
        value as any,
        (obj: groupData) => obj["$id"]
      );
      setValue("groups", uniqueArray);
    }
  };

  const handleChangeAutoComplete = (
    newValue: { label: string; value: any }[]
  ) => {
    const uniqueArray = _.uniqBy(
      newValue as any,
      (obj: any) => obj.value["$id"]
    );

    setValue("groups", uniqueArray);
  };
  const transformedArray = _.map(groupQuery.data?.documents, (item) => ({
    label: item.name,
    value: item,
  }));
  return (
    <form onSubmit={handleSubmit(onSubmitPromotion)}>
      <div className="flex p-4 space-x-2">
        <input
          {...register("name")}
          type="text"
          className="bg-gray-50 border  border-gray-300 w-full text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block  px-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
          placeholder={t("promotions.promotion_name") || ""}
        />
        <Select
          displayEmpty
          className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full px-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
          value={watch("type") ?? ""}
          label="Type"
          sx={{
            maxWidth: "144px",
            minWidth: "144px",
          }}
          onChange={(e) => {
            setValue("type", e.target.value);
          }}
        >
          <MenuItem value={""}>Select Type</MenuItem>{" "}
          <MenuItem value={"fixed"}>fixed</MenuItem>{" "}
          <MenuItem value={"percent"}>percent</MenuItem>
        </Select>
        <input
          value={watch("bonus") ?? ""}
          onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
            const text = event.target.value;
            const sanitizedValue = text.replace(/[^.0-9]/g, "");
            if (sanitizedValue === "") {
              setValue("bonus", 0);
            } else if (sanitizedValue.slice(-1) === ".") {
              if (sanitizedValue.split(".").length < 3) {
                setValue("bonus", sanitizedValue);
              }
            } else {
              setValue("bonus", parseFloat(sanitizedValue));
            }
          }}
          type="text"
          className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-[120px] px-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
          placeholder={t("promotions.bonus") || ""}
        />

        <Autocomplete
          multiple={true}
          value={watch("groups") ?? []}
          onChange={(event: any, newValue: any) => {
            handleChangeAutoComplete(newValue);
          }}
          options={transformedArray}
          renderInput={(params) => {
            return (
              <TextField
                {...params}
                placeholder="Groups"
                sx={{
                  ["& .MuiInputBase-root"]: {
                    padding: 0,
                    background: "#F9FAFB",
                    minHeight: 54,
                    //TODO:cahnge bg here
                  },
                }}
                className="  border   border-gray-300 text-gray-900 text-sm w-[300px]  font-semibold      rounded-lg  block    "
              />
              // <div ref={params.InputProps.ref}>
              //   <input
              //     type="text"
              //     {...params.inputProps}
              //     placeholder="Group"
              //     className=" bg-gray-50 border border-gray-300 text-gray-900 text-sm w-[200px] py-1.5 h-[48px] font-semibold      rounded-lg focus:ring-blue-500 focus:border-blue-500 block  pl-2.5   dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
              //   />
              // </div>
            );
          }}
        />
        {/* <Select
          multiple
          displayEmpty
          className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full px-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
          value={watch("groups") ?? []}
          sx={{
            maxWidth: "248px",
            minWidth: "248px",
          }}
          onChange={handleChange}
          renderValue={(selected) => {
            if (selected.length === 0) {
              return <em>Groups</em>;
            }

            return _.flatMap(selected, "name").join(", ");
          }}
        >
     
          {groupQuery.data?.documents?.map((group: groupData) => (
            //@ts-ignore
            <MenuItem
              key={group.$id}
              value={group}
              style={getStyles(group.name, watch("group") ?? [], theme)}
            >
              {group.name}
            </MenuItem>
          ))}
        </Select> */}

        {/* <input
    type="text"
    className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full px-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
    placeholder={t("promotions.no") || ""}
  /> */}

        <DatePicker
          value={watch("startDate") ?? null}
          format="DD/MM/YYYY"
          label={t("promotions.start_date") || ""}
          slots={{
            openPickerIcon: CalenDarIcon,
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
          minDate={watch("startDate") && dayjs(watch("startDate"))}
          value={watch("expireDate") ?? null}
          format="DD/MM/YYYY"
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
