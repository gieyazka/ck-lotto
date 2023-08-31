/* eslint-disable @typescript-eslint/ban-ts-comment */

import * as React from "react";

import {
  Avatar,
  Box,
  Input,
  MenuItem,
  Select,
  SelectChangeEvent,
  TextField,
} from "@mui/material";
import { Controller, useForm } from "react-hook-form";
import dayjs, { Dayjs } from "dayjs";
import { groupData, pointData, userData } from "../../utils/type";

import AlternateEmailIcon from "@mui/icons-material/AlternateEmail";
import Button from "@mui/material/Button";
import { ReactComponent as CalenDarIcon } from "../../assets/icons/calendar.svg";
import { Card as CardIcon } from "iconsax-react";
import { DatePicker } from "@mui/x-date-pickers";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogTitle from "@mui/material/DialogTitle";
import { UseQueryResult } from "react-query";
import WcIcon from "@mui/icons-material/Wc";
import _ from "lodash";
import { t } from "i18next";

export default function RenderDialog({
  groupQuery,
  dialogState,
  onCloseDialog,
  onEdit,
}: {
  groupQuery: UseQueryResult<any>;
  dialogState: { open: boolean; data: any };
  onCloseDialog: () => void;
  onEdit: (data: pointData, docId: string) => void;
}) {
  const fileRef = React.useRef<HTMLInputElement | null>(null);

  const handleClose = () => {
    reset();
    onCloseDialog();
  };

  const {
    reset,
    register,
    getValues,
    setValue,
    handleSubmit,
    control,
    watch,
    formState: { errors },
  } = useForm({});
  const onSubmit = (data: any) => onEdit(data, dialogState.data.$id);
  React.useEffect(() => {
    if (dialogState.open) {
      console.log("dialogState", dialogState);
      setValue("name", dialogState.data?.name);
      setValue("point", dialogState.data?.point);
      setValue("type", dialogState.data?.type);
      setValue("startDate", dayjs(dialogState.data.startDate));
      setValue("expireDate", dayjs(dialogState.data.expireDate));
    }
  }, [dialogState.open]);
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
  return (
    <div>
      <form onSubmit={handleSubmit(onSubmit)}>
        <Dialog
          open={dialogState.open}
          onClose={handleClose}
          aria-labelledby="alert-dialog-title"
          aria-describedby="alert-dialog-description"
        >
          <DialogTitle id="alert-dialog-title" className="text-center">
            {t("user_management.editUser")}
          </DialogTitle>
          <div className="flex mx-4 my-2 gap-4 items-center ">
            <div className="flex flex-col gap-2">
              <div className="flex gap-2 w-full ">
                <div className="flex flex-end items-center flex-1">
                  <CardIcon className="mr-2" />
                  <Controller
                    control={control}
                    rules={{
                      required: true,
                    }}
                    render={({ field }) => (
                      <TextField
                        {...field}
                        inputProps={{
                          style: { fontFamily: "BoonBaanRegular" },
                        }}
                        className="flex-1"
                        id="input-with-sx"
                        label={t("promotions.promotion_name")}
                        variant="standard"
                      />
                    )}
                    name="name"
                  />

                  {errors.firstName && <p>This is required.</p>}
                </div>
              </div>
              <div className="flex gap-2 pl-7">
                <Select
                  displayEmpty
                  className="font-[BoonBaanRegular] mt-2 w-full"
                  value={watch("type") ?? ""}
                  input={<Input />}
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
                <div className="flex flex-end items-center flex-1 ">
                  <Controller
                    control={control}
                    rules={{
                      required: true,
                    }}
                    render={({ field: { onChange, onBlur, value } }) => (
                      <TextField
                        fullWidth
                        id="input-with-sx"
                        label={t("promotions.point")}
                        variant="standard"
                        inputProps={{
                          style: { fontFamily: "BoonBaanRegular" },
                        }}
                        onBlur={onBlur}
                        onChange={onChange}
                        value={value}
                      />
                    )}
                    name="point"
                  />
                </div>
              </div>
              <div className="flex gap-2">
                <div className="flex flex-end items-center  gap-2 basis-1/2 pl-7">
                  <DatePicker
                    value={watch("startDate") ?? null}
                    format="DD/MM/YYYY"
                    label={t("promotions.start_date") || ""}
                    slotProps={{ textField: { variant: "standard" } }}
                    slots={{
                      openPickerIcon: CalenDarIcon,
                      //   textField: CustomInput,
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
                </div>{" "}
                <div className="flex flex-end items-center  gap-2 ">
                  <DatePicker
                    minDate={watch("startDate") && dayjs(watch("startDate"))}
                    value={watch("expireDate") ?? null}
                    format="DD/MM/YYYY"
                    label={t("promotions.expire_date") || ""}
                    slotProps={{ textField: { variant: "standard" } }}
                    slots={{
                      openPickerIcon: CalenDarIcon,

                      //   textField: CustomInput,
                    }}
                    onChange={(e) => {
                      if (e !== null) {
                        setValue("expireDate", (e as Dayjs).toDate());
                      }
                    }}
                  />
                </div>
              </div>
            </div>
          </div>
          <DialogActions>
            <Button onClick={handleClose}>{t("cancle")}</Button>
            <Button type="submit" onClick={() => onSubmit(getValues())}>
              {t("submit")}
            </Button>
          </DialogActions>
        </Dialog>
      </form>
    </div>
  );
}
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
