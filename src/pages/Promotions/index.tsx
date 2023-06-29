import { Controller, SubmitHandler, useForm } from "react-hook-form";
import i18n, { changeLanguage } from "i18next";
import { ReactComponent as CalenDarIcon } from "../../assets/icons/calendar.svg";
import { Add } from "@mui/icons-material";
import Avatar from "@mui/material/Avatar";
import Bg_image from "../../components/bgimage";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Checkbox from "@mui/material/Checkbox";
import CssBaseline from "@mui/material/CssBaseline";
import FormControlLabel from "@mui/material/FormControlLabel";
import Grid from "@mui/material/Grid";
import Link from "@mui/material/Link";
import Paper from "@mui/material/Paper";
import React from "react";
import RenderTable from "./table";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import bg_image from "../../../assets/login_image.svg";
import { useNavigate } from "react-router-dom";
import { useTheme } from "@mui/material/styles";
import { useTranslation } from "react-i18next";
import { DatePicker } from "@mui/x-date-pickers";
import { IconButton } from "@mui/material";

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
  const onSubmit: SubmitHandler<any> = (data) => {
    console.log(data);
    localStorage.setItem(
      "User",
      JSON.stringify({
        name: "gie",
      })
    );
    navigate(`/`);
  };
  const theme = useTheme();
  // const onSubmit = (event: React.FormEvent<HTMLFormElement>) => {
  //   event.preventDefault();
  //   const data = new FormData(event.currentTarget);
  //   console.log({
  //     email: data.get("email"),
  //     password: data.get("password"),
  //     rememberMe : data.get("remember")
  //   });
  //   const loginData = {
  //     username: data.get("username")?.toString() || "",
  //     password: data.get("password")?.toString() || "",
  //     remember: false,
  //   };
  //   // login(loginData);
  // };

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
    }
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
              <div className="flex p-4 space-x-2">
                <input
                  type="text"
                  className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full px-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                  placeholder={t("promotions.promotion_name") || ""}
                />
                <input
                  type="text"
                  className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full px-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                  placeholder={t("promotions.bonus") || ""}
                />

                <select
                  id="countries"
                  className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full px-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                >
                  <option value="all" selected>
                    All user
                  </option>
                  <option value="US">United States</option>
                  <option value="CA">Canada</option>
                  <option value="FR">France</option>
                  <option value="DE">Germany</option>
                </select>
                <input
                  type="text"
                  className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full px-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                  placeholder={t("promotions.no") || ""}
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
                      // filterStore.handleChangeStartDate(e);
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
                  onChange={(e: any) => {
                    if (e !== null) {
                      // filterStore.handleChangeStartDate(e);
                    }
                  }}
                />

                <IconButton
                  sx={{
                    backgroundColor: theme.palette.primary.main,
                    color: "white",
                  }}
                  aria-label="delete"
                  size="large"
                  onClick={async () => {
                  }}
                >
                  <Add />
                </IconButton>
              </div>
            ) : (
              <div className="flex p-4 space-x-2">
                <input
                  type="text"
                  className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full px-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                  placeholder={t("promotions.point_name") || ""}
                />
                <input
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
                      // filterStore.handleChangeStartDate(e);
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
                  onChange={(e: any) => {
                    if (e !== null) {
                      // filterStore.handleChangeStartDate(e);
                    }
                  }}
                />

                <IconButton
                  sx={{
                    backgroundColor: theme.palette.primary.main,
                    color: "white",
                  }}
                  aria-label="delete"
                  size="large"
                  onClick={async () => {
                  }}
                >
                  <Add />
                </IconButton>
              </div>
            )}
          </div>
        </div>
      </div>
      <div className="text-xl">
        <RenderTable data={data} />
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
