import * as React from "react";

import { Controller, SubmitHandler, useForm } from "react-hook-form";

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
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import bg_image from "../../../assets/login_image.svg";
import { useNavigate } from "react-router-dom";
import { useTheme } from "@mui/material/styles";
import { useTranslation } from "react-i18next";
import { Add } from "@mui/icons-material";
import RenderTable from "./table";
import i18n, { changeLanguage } from "i18next";
interface Data {
  number: string;
  sell_amount: number;
  reward_amount: number;
  isSell: boolean;
}
export interface ILoginForm {
  username: string;
  password: string;
  remember: boolean;
}
type Inputs = {
  username: string;
  password: string;
  remember: boolean;
};
const Login = () => {
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
      number: "22",
      sell_amount: 10000000,
      reward_amount: 600000000,
      isSell: false,
    },
    {
      number: "37",
      sell_amount: 8000000,
      reward_amount: 480000000,
      isSell: false,
    },
    {
      number: "55",
      sell_amount: 7000000,
      reward_amount: 420000000,
      isSell: false,
    },
    {
      number: "47",
      sell_amount: 6000000,
      reward_amount: 360000000,
      isSell: true,
    },
    {
      number: "21",
      sell_amount: 5500000,
      reward_amount: 330000000,
      isSell: true,
    },
  ];

  return (
    <div className="">
      {/* <div style={{fontFamily : "BoonBaanRegular"}}> */}
      <div className="flex justify-end">
        <Button
          sx={{ color: "white", fontFamily: "BoonBaanRegular" }}
          variant="contained"
          startIcon={<Add />}
        >
          {t("donotsell.add_number")}
        </Button>
      </div>
      <div className='text-xl'>
        <p >{t("donotsell.one_digit")}</p>
        <RenderTable data={data} />
        <p>{t("donotsell.two_digit")}</p>
        <RenderTable data={data} />
        <p>{t("donotsell.three")}</p>
        <RenderTable data={data} />
        <p>{t("donotsell.four_digit")}</p>
        <RenderTable data={data} />
        <p>{t("donotsell.five_digit")}</p>
        <RenderTable data={data} />
        <p>{t("donotsell.six_digit")}</p>
        <RenderTable data={data} />
      </div>
    </div>
  );
};

export default Login;
