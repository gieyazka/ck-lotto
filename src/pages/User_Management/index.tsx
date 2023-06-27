import { Controller, SubmitHandler, useForm } from "react-hook-form";
import i18n, { changeLanguage } from "i18next";

import Button from "@mui/material/Button";
import React from "react";
import RenderTable_Ck from "./table_ckGroup";
import RenderTable_Customer from "./table_customer";
import { useNavigate } from "react-router-dom";
import { useTheme } from "@mui/material/styles";
import { useTranslation } from "react-i18next";

interface Data {
  no: string;
  promotion_name: string;
  bonus: string;
  start_date: string;
  expire_date: string;
  status: string;
}
const Promotions = () => {
  const [menuState, setMenuState] = React.useState(1);
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

  const theme = useTheme();

  const data: Data[] = [
    {
      no: "1",
      promotion_name: "Normal",
      bonus: "0.001",
      start_date: "01-05-2023",
      expire_date: "30-05-2023",
      status: "On progress",
    },
    {
      no: "2",
      promotion_name: "New Year",
      bonus: "0.002",
      start_date: "01-04-2023",
      expire_date: "30-04-2023",
      status: "Done",
    },
    {
      no: "3",
      promotion_name: "Normal",
      bonus: "0.001",
      start_date: "01-03-2023",
      expire_date: "30-03-2023",
      status: "Done",
    },
    {
      no: "3",
      promotion_name: "Normal",
      bonus: "0.001",
      start_date: "01-03-2023",
      expire_date: "30-03-2023",
      status: "Done",
    },
    {
      no: "3",
      promotion_name: "Normal",
      bonus: "0.001",
      start_date: "01-03-2023",
      expire_date: "30-03-2023",
      status: "Done",
    },
    {
      no: "3",
      promotion_name: "Normal",
      bonus: "0.001",
      start_date: "01-03-2023",
      expire_date: "30-03-2023",
      status: "Done",
    },
    {
      no: "3",
      promotion_name: "Normal",
      bonus: "0.001",
      start_date: "01-03-2023",
      expire_date: "30-03-2023",
      status: "Done",
    },
    {
      no: "3",
      promotion_name: "Normal",
      bonus: "0.001",
      start_date: "01-03-2023",
      expire_date: "30-03-2023",
      status: "Done",
    },
    {
      no: "3",
      promotion_name: "Normal",
      bonus: "0.001",
      start_date: "01-03-2023",
      expire_date: "30-03-2023",
      status: "Done",
    },
    {
      no: "3",
      promotion_name: "Normal",
      bonus: "0.001",
      start_date: "01-03-2023",
      expire_date: "30-03-2023",
      status: "Done",
    },
    {
      no: "3",
      promotion_name: "Normal",
      bonus: "0.001",
      start_date: "01-03-2023",
      expire_date: "30-03-2023",
      status: "Done",
    },
    {
      no: "3",
      promotion_name: "Normal",
      bonus: "0.001",
      start_date: "01-03-2023",
      expire_date: "30-03-2023",
      status: "Done",
    },
    {
      no: "3",
      promotion_name: "Normal",
      bonus: "0.001",
      start_date: "01-03-2023",
      expire_date: "30-03-2023",
      status: "Done",
    },
    {
      no: "3",
      promotion_name: "Normal",
      bonus: "0.001",
      start_date: "01-03-2023",
      expire_date: "30-03-2023",
      status: "Done",
    },
    {
      no: "3",
      promotion_name: "Normal",
      bonus: "0.001",
      start_date: "01-03-2023",
      expire_date: "30-03-2023",
      status: "Done",
    },
    {
      no: "3",
      promotion_name: "Normal",
      bonus: "0.001",
      start_date: "01-03-2023",
      expire_date: "30-03-2023",
      status: "Done",
    },
    {
      no: "3",
      promotion_name: "Normal",
      bonus: "0.001",
      start_date: "01-03-2023",
      expire_date: "30-03-2023",
      status: "Done",
    },
    {
      no: "3",
      promotion_name: "Normal",
      bonus: "0.001",
      start_date: "01-03-2023",
      expire_date: "30-03-2023",
      status: "Done",
    },
    {
      no: "3",
      promotion_name: "Normal",
      bonus: "0.001",
      start_date: "01-03-2023",
      expire_date: "30-03-2023",
      status: "Done",
    },
    {
      no: "3",
      promotion_name: "Normal",
      bonus: "0.001",
      start_date: "01-03-2023",
      expire_date: "30-03-2023",
      status: "Done",
    },
    {
      no: "3",
      promotion_name: "Normal",
      bonus: "0.001",
      start_date: "01-03-2023",
      expire_date: "30-03-2023",
      status: "Done",
    },
    {
      no: "3",
      promotion_name: "Normal",
      bonus: "0.001",
      start_date: "01-03-2023",
      expire_date: "30-03-2023",
      status: "Done",
    },
    {
      no: "3",
      promotion_name: "Normal",
      bonus: "0.001",
      start_date: "01-03-2023",
      expire_date: "30-03-2023",
      status: "Done",
    },
    {
      no: "3",
      promotion_name: "Normal",
      bonus: "0.001",
      start_date: "01-03-2023",
      expire_date: "30-03-2023",
      status: "Done",
    },
    {
      no: "3",
      promotion_name: "Normal",
      bonus: "0.001",
      start_date: "01-03-2023",
      expire_date: "30-03-2023",
      status: "Done",
    },
    {
      no: "3",
      promotion_name: "Normal",
      bonus: "0.001",
      start_date: "01-03-2023",
      expire_date: "30-03-2023",
      status: "Done",
    },
    {
      no: "4",
      promotion_name: "Normal",
      bonus: "0.001",
      start_date: "01-03-2023",
      expire_date: "30-03-2023",
      status: "Done",
    },
    {
      no: "3",
      promotion_name: "Normal",
      bonus: "0.001",
      start_date: "01-03-2023",
      expire_date: "30-03-2023",
      status: "Done",
    },
  ];

  const [selectedFile, setSelectedFile] = React.useState<File | null>(null);

  const handleInputChange = (event: any) => {
    setSelectedFile(event.target.files[0]);
  };

  return (
    <div className="">
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
                setMenuState(1);
              }}
              className="px-8  rounded-l-xl rounded-r-none border-r-0 shadow-none"
              variant="contained"
            >
              <p className="mb-6">{t("promotions.buy_lottery")}</p>
            </Button>
            <Button
              onClick={() => {
                setMenuState(2);
              }}
              style={{
                fontFamily: "BoonBaanRegular",
                backgroundColor:
                  menuState !== 1 ? theme.palette.primary.main : "#B5B8C0",

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
              <div className="text-xl p-4  ">
                <RenderTable_Customer data={data} />
              </div>
            ) : (
              <div className="text-xl p-4 ">
                <RenderTable_Ck data={data} />
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
const CustomInput = function BrowserInput(props: any) {
  const { inputProps, InputProps, ownerState, inputRef, error, ...other } =
    props;

  return (
    <div
      className="relative mx-2 w-full "
      style={{ fontFamily: "BoonBaanRegular" }}
    >
      <div className=" relative h-full" ref={InputProps?.ref}>
        <input
          ref={inputRef}
          {...inputProps}
          {...(other as any)}
          placeholder={props.label}
          className="bg-gray-50 border h-full border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full pr-10 p-2.5  dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
        />
        <div className="absolute top-1/2 right-[16px]  -translate-y-1/2 ">
          {InputProps?.endAdornment}
        </div>
      </div>
    </div>
  );
};
export default Promotions;
