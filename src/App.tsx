import "./App.css";

import React, { useEffect, useState } from "react";
import { Route, Routes } from "react-router-dom";

import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import Advert from "./pages/Advert";
import { AuthRoute } from "./authRoute";
import { ColorModeContextProvider } from "./contexts/color-mode";
import CssBaseline from "@mui/material/CssBaseline";
import Feedback from "./pages/Feedback";
import GlobalStyles from "@mui/material/GlobalStyles";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import Login from "./pages/login";
import LotteryHistory from "./pages/Lottery_History";
import NotSell from "./pages/not_sell";
import Notifications from "./pages/Notifications";
import Promotions from "./pages/Promotions";
import RenderLoading from "./components/loading";
import Sidebar from "./components/sidebar";
import Transaction from "./pages/Transaction";
import User_Management from "./pages/User_Management";
import { removeAppwriteSession } from "./utils/service";

function App() {
  useEffect(() => {
    const user = JSON.parse(sessionStorage.getItem("User") || "null");
    const isLogin = (localStorage.getItem("isLogin"));
    // console.log(isLogin,user);
    if (!user && isLogin) {
      removeAppwriteSession();
    }
  }, []);
  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <ColorModeContextProvider>
        <CssBaseline />
        <GlobalStyles styles={{ html: { WebkitFontSmoothing: "auto" } }} />
        <RenderLoading />
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route element={<AuthRoute />}>
            <Route path="/" element={<Sidebar />}>
              <Route path="dashboard">
                <Route index element={<div>test</div>} />
                {/* <Route path="add_categories/:id">
                  <Route index element={<AddCategories />} />
                  <Route path="add_question/:id" element={<AddQuestion />} />
                </Route> */}
              </Route>
              <Route path="not_sell" element={<NotSell />} />
              <Route path="transaction" element={<Transaction />} />
              <Route path="lotto_history" element={<LotteryHistory />} />
              <Route path="ads" element={<Advert />} />
              <Route path="promotions" element={<Promotions />} />
              <Route path="notifications" element={<Notifications />} />
              <Route path="feedback" element={<Feedback />} />
              <Route path="user_management" element={<User_Management />} />
              <Route path="/*" element={<div>test</div>} />
            </Route>
          </Route>
          <Route path="/" element={<AuthRoute />}>
            <Route index element={<Sidebar />}></Route>
          </Route>
          <Route path="/*" element={<Login />} />
        </Routes>
      </ColorModeContextProvider>
    </LocalizationProvider>
  );
}

export default App;
