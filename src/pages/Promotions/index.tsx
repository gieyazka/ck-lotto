/* eslint-disable @typescript-eslint/ban-ts-comment */

import { Controller, SubmitHandler, useForm } from "react-hook-form";
import {
  IconButton,
  MenuItem,
  OutlinedInput,
  Select,
  SelectChangeEvent,
} from "@mui/material";
import Swal, { SweetAlertResult } from "sweetalert2";
import { Theme, useTheme } from "@mui/material/styles";
import {
  addPromotions,
  addUserLog,
  deletePromotions,
  getAllGroup,
  getPromotions,
  getUserSession,
  getWinPrice,
  updatePromotions,
} from "../../utils/service";
import dayjs, { Dayjs } from "dayjs";
import { groupData, promotionData, winPrice } from "../../utils/type";
import i18n, { changeLanguage } from "i18next";
import { useMutation, useQuery, useQueryClient } from "react-query";

import { Add } from "@mui/icons-material";
import Button from "@mui/material/Button";
import { ReactComponent as CalenDarIcon } from "../../assets/icons/calendar.svg";
import { DatePicker } from "@mui/x-date-pickers";
import Point_Table from "./table_point";
import Promotion_Table from "./table_promotion";
import React from "react";
import RenderDialogPoint from "./edit_point";
import RenderDialogPromotion from "./edit_promotion";
import RenderFormPoint from "./form_point";
import RenderFormPromotion from "./form_promotions";
import _ from "lodash";
import { callToast } from "../../utils/common";
import { useLoading } from "../../store";
import { useNavigate } from "react-router-dom";
import usePoint from "./point_hook";
import usePromotion from "./promotions_hook";
import { useTranslation } from "react-i18next";

const Promotions = () => {
  const point = usePoint();
  const promotion = usePromotion();

  const user = getUserSession();
  const [menuState, setMenuState] = React.useState(1);
  const navigate = useNavigate();
  const { t } = useTranslation();
  const {
    register,
    handleSubmit,
    watch,
    control,
    setValue,
    reset,
    formState: { errors },
  } = useForm({});
  const loadingStore = useLoading();
  const queryClient = useQueryClient();
  const theme = useTheme();
  const groupQuery = useQuery(["group"], () => getAllGroup(), {
    refetchOnMount: "always",
    keepPreviousData: true,
    refetchInterval: false,
    refetchOnWindowFocus: false,
  });

  return (
    <div className="">
      <RenderDialogPromotion
        groupQuery={groupQuery}
        onCloseDialog={promotion.onCloseDialog}
        dialogState={promotion.dialogState}
        onEdit={promotion.onEdit}
      />
      <RenderDialogPoint
        groupQuery={groupQuery}
        onCloseDialog={point.onCloseDialog}
        dialogState={point.dialogState}
        onEdit={point.onEdit}
      />
      <div
        style={{ fontFamily: "BoonBaanRegular" }}
        className="rounded-lg bg-white p-4"
      >
        <div className="flex flex-col z-10 ">
          <div className="flex">
            <Button
              style={{
                fontFamily: "BoonBaanRegular",
                backgroundColor:
                  menuState === 1 ? theme.palette.primary.main : "#B5B8C0",
                color: "white",
              }}
              onClick={() => {
                reset();
                setMenuState(1);
              }}
              className="px-8  rounded-l-xl rounded-r-none border-r-0 shadow-none"
              variant="contained"
            >
              <p className="mb-6">{t("promotions.buy_lottery")}</p>
            </Button>
            <Button
              onClick={() => {
                reset();
                setMenuState(2);
              }}
              style={{
                fontFamily: "BoonBaanRegular",
                backgroundColor:
                  menuState === 2 ? theme.palette.primary.main : "#B5B8C0",

                color: "white",
              }}
              className="px-8 rounded-r-xl  rounded-l-none shadow-none"
              variant="contained"
            >
              <p className="mb-6">{t("promotions.point_management")}</p>
            </Button>
          </div>
          <div className="-mt-6 z-50 border-2 bg-white border-[#D7D7D7] rounded-lg">
            {menuState === 1 ? (
              <RenderFormPromotion
                groupQuery={groupQuery}
                onSubmitPromotion={promotion.onSubmit}
              />
            ) : (
              <RenderFormPoint
                groupQuery={groupQuery}
                onSubmit={point.onSubmit}
              />
            )}
          </div>
        </div>
      </div>
      <div className="text-xl">
        {menuState === 1 && (
          <Promotion_Table
            onChangeSearch={promotion.onChangeSearch}
            onOpenDialog={promotion.onOpenDialog}
            dataQuery={promotion.dataQuery}
            paginationState={promotion.paginationState}
            setPaginationState={promotion.setPaginationState}
            onDelete={promotion.onDelete}
          />
        )}
        {menuState === 2 && (
          <>
            <Point_Table
              onChangeSearch={point.onChangeSearch}
              onOpenDialog={point.onOpenDialog}
              dataQuery={point.dataQuery}
              paginationState={point.paginationState}
              setPaginationState={point.setPaginationState}
              onDelete={point.onDelete}
            />
          </>
        )}
      </div>
    </div>
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
export default Promotions;
