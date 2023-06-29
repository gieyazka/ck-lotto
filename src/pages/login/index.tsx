/* eslint-disable @typescript-eslint/ban-ts-comment */
import * as React from "react";

import { Controller, SubmitHandler, useForm } from "react-hook-form";
import { addUserLog, appWriteAuth, getUser } from "../../utils/service";

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
import { callSweetAlert } from "../../utils/common";
import { useLoading } from "../../store";
import { useNavigate } from "react-router-dom";
import { useTheme } from "@mui/material/styles";
import { useTranslation } from "react-i18next";

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
  const theme = useTheme();

  const navigate = useNavigate();
  const { t } = useTranslation();
  const loadingStore = useLoading();
  const {
    register,
    handleSubmit,
    watch,
    control,
    setValue,
    formState: { errors },
  } = useForm({
    defaultValues: {
      remember: false,
      username: "",
      password: "",
    },
  });

  React.useEffect(() => {
    const remember = JSON.parse(localStorage.getItem("userRemember") || "null");
    if (remember) {
      setValue("username", remember.username);
      setValue("password", remember.password);
    }
  }, []);

  const onSubmit: SubmitHandler<any> = async (data) => {
    console.log(data);

    if (data.username === "") {
      callSweetAlert({
        type: "info",
        title: "Please input username",
      });
      return;
    }
    if (data.password === "") {
      callSweetAlert({
        type: "info",
        title: "Please input password",
      });
      return;
    }
    loadingStore.setLoad(true);
    const user = await getUser(data.username);

    if (user.length === 0) {
      callSweetAlert({
        type: "error",
        title: "User not founded",
      });
      return;
    }
    const email = user[0].email;
    try {
      const resLogin = await appWriteAuth({ email, password: data.password });
      if (data.remember) {
        localStorage.setItem(
          "userRemember",
          JSON.stringify({ username: data.username, password: data.password })
        );
      } else {
        localStorage.removeItem("userRemember");
      }
      // @ts-ignore

      localStorage.setItem("isLogin", true);
      const userLogin = { ...resLogin, ...user[0] };
      sessionStorage.setItem("User", JSON.stringify(userLogin));
      await addUserLog({
        type: "login",
        users: userLogin.$id,
        timestamp: new Date(),
        collection : "users",
      });
     
   
      // localStorage.setItem("User", JSON.stringify(resLogin));
      // localStorage.setItem("User", JSON.stringify({}));
      navigate(`/`);
    } catch (error) {
      console.log(error);
      // loadingStore.setLoad(false);

      callSweetAlert({
        type: "error",
        title: "Login Failed. Please check Username and Password",
        // title: error.message,
      });
    }
    // loadingStore.setLoad(false);
    loadingStore.setLoad(false);
  };

  return (
    <>
      <Grid container component="main" sx={{ height: "100vh" }}>
        <CssBaseline />
        <Grid item xs={false} sm={4} md={7}>
          <Bg_image
            style={{
              overflow: "hidden",
              // objectFit : 'cover',
              width: "auto",
              height: "100%",
              // maxHeight: "100%",
              // maxWidth: "100%",
            }}
          />
        </Grid>
        <Grid item xs={12} sm={8} md={5} component={Paper} elevation={6} square>
          <Box
            sx={{
              my: 16,
              mx: 4,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
            }}
          >
            <img src="/images/ck_group.png" />

            <h1
              className="text-3xl"
              style={{ color: theme.palette.primary.main }}
            >
              Login Account
            </h1>
            <Box component="div" sx={{ mt: 1 }}>
              <form onSubmit={handleSubmit(onSubmit)}>
                <div className="relative mb-4">
                  <div
                    style={{ backgroundColor: theme.palette.primary.main }}
                    className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none "
                  ></div>
                  <input
                    type="text"
                    id="input-group-1"
                    autoComplete="username"
                    className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full pl-5 p-2.5  dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                    placeholder="Username"
                    {...register("username")}
                  />
                </div>
                <div className="relative mb-4">
                  <div
                    style={{ backgroundColor: theme.palette.primary.main }}
                    className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none "
                  ></div>
                  <input
                    type="password"
                    id="input-group-1"
                    autoComplete="password"
                    className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full pl-5 p-2.5  dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                    placeholder="Password"
                    {...register("password")}
                  />
                </div>
                <Controller
                  name="remember"
                  control={control}
                  // rules={{ required: true }}
                  render={({ field }) => (
                    <FormControlLabel
                      control={<Checkbox {...field} />}
                      label="Remember me"
                    />
                  )}
                />

                <Button
                  type="submit"
                  fullWidth
                  variant="contained"
                  sx={{
                    fontFamily: "BoonBaanRegular",
                    color: "white",
                    mt: 3,
                    mb: 2,
                    // backgroundColor: "#FF5555",
                    borderRadius: "38px",
                  }}
                >
                  Log in
                </Button>
              </form>
              <Grid container>
                <Grid item xs>
                  <Link href="#" variant="body2">
                    Forgot password?
                  </Link>
                </Grid>
                <Grid item>
                  <Link href="#" variant="body2">
                    {"Don't have an account? Sign Up"}
                  </Link>
                </Grid>
              </Grid>
            </Box>
          </Box>
        </Grid>
      </Grid>
      {/* <AuthPage
        type="login"
        title={
          <ThemedTitleV2
            collapsed={false}
            text="refine Project"
            icon={<AppIcon />}
          />
        }
        // contentProps={{
        //   style: {
        //     background: "linear-gradient(45deg, #FE6B8B 30%, #FF8E53 90%)",
        //   },
        // }}
        renderContent={(content: React.ReactNode) => {
          return (
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <h1>Extra Header</h1>
              {content}
              <h2>Extra Footer</h2>
            </div>
          );
        }}
        formProps={{
          defaultValues: { email: "demo@refine.dev", password: "demodemo" },
        }}
      /> */}
    </>
  );
};

export default Login;
