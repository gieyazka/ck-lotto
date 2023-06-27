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
  send_to: string;
  title: string;
  details: string;
  photo: string;
  sender: string;
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
const Notifications = () => {
  const fileRef = React.useRef<HTMLInputElement | null>(null);
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
      title: "title 123",
      details: "details",
      photo: "photo.jpg",
      sender: "admin",
      status: "Done",
      send_to: "All Customer",
    },
    {
      no: "2",
      title: "title 123",
      details: "details",
      photo: "photo.jpg",
      sender: "admin",
      status: "Done",

      send_to: "All Customer",
    },
    {
      no: "3",
      title: "title 123",
      details: "details",
      photo: "photo.jpg",
      status: "Done",
      sender: "admin",

      send_to: "All Customer",
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
        <div className="flex space-x-4">
          <div className="basis-[40%] flex flex-col space-y-4 justify-between">
            <select
              id="countries"
              className="bg-gray-50 border border-gray-300 py-2.5 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full px-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
            >
              <option value="all" selected>
                {t("notifications.all_custor")}
              </option>
              <option value="US">United States</option>
              <option value="CA">Canada</option>
              <option value="FR">France</option>
              <option value="DE">Germany</option>
            </select>
            <input
              type="text"
              className="bg-gray-50 border border-gray-300 py-2.5 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full px-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
              placeholder={t("notifications.title") || ""}
            />
          </div>
          <div className="basis-[60%]">
            <textarea
              id="message"
              rows={4}
              className="w-full block p-2.5  text-sm text-gray-900 bg-gray-50 rounded-lg border border-gray-300 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
              placeholder={t("notifications.details") || ""}
            ></textarea>
          </div>
        </div>
        <div className="flex justify-between  mt-4">
          <div>
            <input
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
                {t("notifications.select_photo") || ""}
              </label>
              <div
                onClick={() => fileRef.current?.click()}
                className="border-[#D7D7D7] rounded-r-lg py-2 border-2 min-w-[50vw]"
              >
                {" "}
                <p className="ml-4 inline-block">
                  {selectedFile && selectedFile.name}
                </p>
              </div>
            </div>
          </div>
          {/* </div> */}
          {/* </div> */}
          <div className="flex space-x-4">
            <Button
              sx={{
                color: "white",
                fontFamily: "BoonBaanRegular",
                backgroundColor: "#299914",
              }}
              variant="contained"
            >
              {t("notifications.send")}
            </Button>
            <Button
              sx={{
                color: "white",
                fontFamily: "BoonBaanRegular",
                backgroundColor: "#FF5555",
              }}
              variant="contained"
            >
              {t("notifications.clear")}
            </Button>
          </div>
        </div>
      </div>
      <div className="text-xl">
        <RenderTable data={data} />
      </div>
    </div>
  );
};

export default Notifications;
