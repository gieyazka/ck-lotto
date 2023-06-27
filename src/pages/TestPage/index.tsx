import * as React from "react";

import { Controller, SubmitHandler, useForm } from "react-hook-form";
import i18n, { changeLanguage } from "i18next";

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
import RenderTable from "./table";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import bg_image from "../../../assets/login_image.svg";
import { useNavigate } from "react-router-dom";
import { useTheme } from "@mui/material/styles";
import { useTranslation } from "react-i18next";

interface Data {
  no: number;
  transaction_id: string;
  bill_id: string;
  buyer_number: string;
  buyer_name: string;
  lottery_date: string;
  date: string;
  time : string;
  pay_by: string;
  amount: number;
  status: string;
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
const Transaction = () => {
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
      no: 1,
      transaction_id: "T-1",
      bill_id: "B-1",
      buyer_number: "99",
      buyer_name: "gieyazka",
      lottery_date: "19/03/2023",
      date: "15/03/2023",
      time: "12:00",
      pay_by: "Bank",
      amount: 50000000,
      status: "win",
    },
    {
      no: 2,
      transaction_id: "T-2",
      bill_id: "B-2",
      buyer_number: "50",
      buyer_name: "gieyazka",
      lottery_date: "19/03/2023",
      date: "15/03/2023",
      time: "12:00",

      pay_by: "Bank",
      amount: 50000000,
      status: "win",
    },
    {
      no: 3,
      transaction_id: "T-3",
      bill_id: "B-3",
      buyer_number: "03",
      buyer_name: "gieyazka",
      lottery_date: "19/03/2023",
      date: "15/03/2023",
      time: "12:00",

      pay_by: "Bank",
      amount: 50000000,
      status: "win",
    },
    {
      no: 4,
      transaction_id: "T-4",
      bill_id: "B-4",
      buyer_number: "55",
      buyer_name: "gieyazka",
      lottery_date: "19/03/2023",
      date: "15/03/2023",
      time: "12:00",

      pay_by: "Bank",
      amount: 50000000,
      status: "win",
    },
    {
      no: 5,
      transaction_id: "T-5",
      bill_id: "B-5",
      buyer_number: "64",
      buyer_name: "gieyazka",
      lottery_date: "19/03/2023",
      date: "15/03/2023",
      time: "12:00",

      pay_by: "Bank",
      amount: 50000000,
      status: "win",
    },
  ];

  return (
    <div className="">
      {/* <div style={{fontFamily : "BoonBaanRegular"}}> */}
      <div className="flex justify-end">
        {/* <Button
          sx={{ color: "white", fontFamily: "BoonBaanRegular" }}
          variant="contained"
          startIcon={<Add />}
        >
          {t("transaction.calculate")}
        </Button> */}
      </div>
      <div className="text-xl">
        <RenderTable data={data} />
      </div>
    </div>
  );
};

export default Transaction;
