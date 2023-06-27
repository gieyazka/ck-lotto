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
import React from "react";
import RenderTable from "./table";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import bg_image from "../../../assets/login_image.svg";
import { useNavigate } from "react-router-dom";
import { useTheme } from "@mui/material/styles";
import { useTranslation } from "react-i18next";

interface Data {
  no: string;
  fullName: string;
  rate: string;
  comment: string;
  date: string;
}

const Feedback = () => {
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
      fullName: "Pokkate Eiampubyai",
      rate: "5",
      comment: "แอพดีจ่ายเงินไว",
      date: "15-06-2023",
    },
    {
      no: "2",
      fullName: "Pokkate Eiampubyai",
      rate: "4.5",
      comment: "แอพดีจ่ายเงินไว",
      date: "14-06-2023",
    },
    {
      no: "3",
      fullName: "Pokkate Eiampubyai",
      rate: "4",
      comment: "แอพดีจ่ายเงินไว",
      date: "13-06-2023",
    },
  ];

  const [selectedFile, setSelectedFile] = React.useState<File | null>(null);

  const handleInputChange = (event: any) => {
    setSelectedFile(event.target.files[0]);
  };

  return (
    <div className="">
      <div className="text-xl">
        <RenderTable data={data} />
      </div>
    </div>
  );
};

export default Feedback;
