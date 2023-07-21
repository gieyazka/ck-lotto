import { Controller, SubmitHandler, useForm } from "react-hook-form";
import {
  addUserLog,
  createUser,
  deleteUser,
  getCustomer,
  getEmployee,
  getUserByEmail,
  getUserSession,
  updateUser,
} from "../../utils/service";
import i18n, { changeLanguage } from "i18next";
import { useMutation, useQuery, useQueryClient } from "react-query";

import Button from "@mui/material/Button";
import Quota from "./quota";
import React from "react";
import RenderCalendar from "./calendar";
import Swal from "sweetalert2";
import WinPrice from "./winPrice";
import { callToast } from "../../utils/common";
import { useLoading } from "../../store";
import { useNavigate } from "react-router-dom";
import { useTheme } from "@mui/material/styles";
import { useTranslation } from "react-i18next";
import { userData } from "../../utils/type";

const Setup_Page = () => {



  const [menuState, setMenuState] = React.useState(1);
  const { t } = useTranslation();
  const theme = useTheme();


  return (
    <div className="">
    
      <div
        style={{ fontFamily: "BoonBaanRegular" }}
        className="rounded-lg bg-white p-4"
      >
        <div className="flex flex-col z-10 ">
          <div className="flex justify-between">
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
                <p className="mb-6">{t("setup.calendar")}</p>
              </Button>
              <Button
                onClick={() => {
                  setMenuState(2);
                }}
                style={{
                  fontFamily: "BoonBaanRegular",
                  backgroundColor:
                    menuState === 2 ? theme.palette.primary.main : "#B5B8C0",

                  color: "white",
                }}
                className="px-8 rounded-r-none  rounded-l-none shadow-none"
                variant="contained"
              >
                <p className="mb-6">{t("setup.winPrice")}</p>
              </Button>
              <Button
                onClick={() => {
                  setMenuState(3);
                }}
                style={{
                  fontFamily: "BoonBaanRegular",
                  backgroundColor:
                    menuState === 3 ? theme.palette.primary.main : "#B5B8C0",

                  color: "white",
                }}
                className="px-8 rounded-r-xl  rounded-l-none shadow-none"
                variant="contained"
              >
                <p className="mb-6">{t("setup.quota")}</p>
              </Button>
            </div>

            {/* <Button
              onClick={() => {
                onOpenCreateDialog();
              }}
              style={{
                display: menuState === 3 ? "block" : "none",
                fontFamily: "BoonBaanRegular",
                backgroundColor: theme.palette.primary.main,

                color: "white",
              }}
              className="px-8 rounded-xl  shadow-none "
              variant="contained"
            >
              <p className="mb-6">{t("user_management.addUser")}</p>
            </Button> */}
          </div>
          <div className="-mt-6 z-50 border-2 bg-white border-[#D7D7D7] rounded-lg min-h-[50vh]">
            {menuState === 1 ? (
              <div className=" p-4">
                <RenderCalendar />{" "}
              </div>
            ) : menuState === 2 ? (
              <div className=" p-4  ">
                <WinPrice />
              </div>
            ) : (
              <div className=" p-4  ">
                <Quota />
              </div>
            )}
            {/* {menuState === 1 ? (
                <RenderTable_Customer
                  onOpenDialog={onOpenDialog}
                  userData={customerData}
                  deleteUser={delete_userData}
                  paginationState={paginationStateCus}
                  setPaginationState={setPaginationStateCus}
                  onDelete={onDelete}
                />
              </div>
            ) : (
              <div className="text-xl p-4 ">
                <RenderTable_Ck
                  onOpenDialog={onOpenDialog}
                  userData={employee_Data}
                  deleteUser={delete_userData}
                  paginationState={paginationStateEmp}
                  setPaginationState={setPaginationStateEmp}
                  onDelete={onDelete}
                />
              </div>
            )} */}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Setup_Page;
