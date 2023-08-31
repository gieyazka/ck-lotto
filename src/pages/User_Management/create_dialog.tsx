import * as React from "react";

import {
  Avatar,
  Box,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  TextField,
} from "@mui/material";
import { Controller, useForm } from "react-hook-form";

import { AccountCircle } from "@mui/icons-material";
import AlternateEmailIcon from "@mui/icons-material/AlternateEmail";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import HomeIcon from "@mui/icons-material/Home";
import { MuiTelInput } from "mui-tel-input";
import PersonIcon from "@mui/icons-material/Person";
import PhoneIphoneIcon from "@mui/icons-material/PhoneIphone";
import WcIcon from "@mui/icons-material/Wc";
import { t } from "i18next";
import { userData } from "../../utils/type";

export default function RenderDialog({
  dialogState,
  onCloseDialog,
  onCreateUser,
}: {
  dialogState: { open: boolean };
  onCloseDialog: () => void;
  onCreateUser: (data: userData) => void;
}) {
  const fileRef = React.useRef<HTMLInputElement | null>(null);

  const handleClose = () => {
    reset();
    onCloseDialog();
  };

  const {
    reset,
    register,
    getValues,
    setValue,
    handleSubmit,
    control,
    watch,
    formState: { errors },
  } = useForm({});
  const onSubmit = (data: any) => onCreateUser(data);
  //   React.useEffect(() => {
  //     if (dialogState.open) {
  //       setValue("email", dialogState.data?.email);
  //       setValue("firstname", dialogState.data?.firstname);
  //       setValue("lastname", dialogState.data?.lastname);
  //       setValue("tel", dialogState.data?.tel);
  //       setValue("address", dialogState.data?.address);
  //       setValue("gender", dialogState.data?.gender);
  //     }
  //   }, [dialogState.open]);
  const handleInputChange = (event: any) => {
    setValue("image", event.target.files[0]);
  };
  React.useEffect(()=>{
    if(dialogState.open){
      reset()
    }
  },[dialogState.open])
  return (
    <div>
      <form onSubmit={handleSubmit(onSubmit)}>
        <Dialog
          open={dialogState.open}
          onClose={handleClose}
          aria-labelledby="alert-dialog-title"
          aria-describedby="alert-dialog-description"
        >
          <DialogTitle id="alert-dialog-title" className="text-center">
            {t("user_management.addUser")}
          </DialogTitle>
          <div className="flex mx-4 my-2 gap-4 items-center ">
            <input
              ref={fileRef}
              id="fileInput"
              type="file"
              accept="image/*"
              onChange={handleInputChange}
              style={{ display: "none" }}
            />
            <Avatar
              className="cursor-pointer opacity-80"
              onClick={() => fileRef.current?.click()}
              alt="Remy Sharp"
              sx={{ width: 168, height: 168 }}
            >
              {watch("image") ? (
                <img src={URL.createObjectURL(watch("image"))} />
              ) : (
                <PersonIcon sx={{ fontSize: 168 }} />
              )}
            </Avatar>
            <div className="flex flex-col gap-2">
              <div className="flex gap-2">
                <div className="flex flex-end items-center flex-1">
                  <AlternateEmailIcon
                    sx={{ color: "action.active", mr: 1, my: 0.5 }}
                  />
                  <Controller
                    control={control}
                    render={({ field }) => (
                      <TextField
                        className="flex-1 "
                        {...field}
                        id="input-with-sx"
                        label={t("email")}
                        variant="standard"
                        inputProps={{
                          style: { fontFamily: "BoonBaanRegular" },
                        }}
                      />
                    )}
                    name="email"
                  />
                  {errors.email && <p>This is required.</p>}
                </div>
                <div className="flex flex-end items-center flex-1">
                  <Controller
                  
                    control={control}
                    render={({ field }) => (
                      <FormControl
                      className="flex-1 "

                        variant="standard"
                        // sx={{ m: 1, minWidth: 120 }}
                      >
                        <InputLabel id="demo-simple-select-standard-label">
                          {t("user_management.role")}
                        </InputLabel>
                        <Select
                          className="flex-1 "
                          labelId="demo-simple-select-standard-label"
                          id="demo-simple-select-standard"
                          {...field}
                        >
                  
                          <MenuItem value={"user"}>User</MenuItem>
                          <MenuItem value={"external"}>External</MenuItem>
                          <MenuItem value={"admin"}>Admin</MenuItem>
                          <MenuItem value={"super_admin"}>Super Admin</MenuItem>
                        </Select>
                      </FormControl>
                      //   <TextField
                      //     className="flex-1 "
                      //     {...field}
                      //     id="input-with-sx"
                      //     label={t("user_management.role")}
                      //     variant="standard"
                      //     inputProps={{
                      //       style: { fontFamily: "BoonBaanRegular" },
                      //     }}
                      //   />
                    )}
                    name="role"
                  />
                  {errors.role && <p>This is required.</p>}
                </div>
              </div>

              <div className="flex gap-2 w-full ">
                <div className="flex flex-end items-center basis-1/2 ">
                  <AccountCircle
                    sx={{ color: "action.active", mr: 1, my: 0.5 }}
                  />
                  <Controller
                    control={control}
                    rules={{
                      required: true,
                    }}
                    render={({ field: { onChange, onBlur, value } }) => (
                      <TextField
                        id="input-with-sx"
                        label={t("firstName")}
                        variant="standard"
                        inputProps={{
                          style: { fontFamily: "BoonBaanRegular" },
                        }}
                        onBlur={onBlur}
                        onChange={onChange}
                        value={value}
                      />
                    )}
                    name="firstname"
                  />
                  {errors.firstName && <p>This is required.</p>}
                </div>

                <div className="flex flex-end items-center flex-1 ">
                  <Controller
                    control={control}
                    rules={{
                      required: true,
                    }}
                    render={({ field }) => (
                      <TextField
                        {...field}
                        inputProps={{
                          style: { fontFamily: "BoonBaanRegular" },
                        }}
                        className="flex-1"
                        id="input-with-sx"
                        label={t("lastName")}
                        variant="standard"
                      />
                    )}
                    name="lastname"
                  />
                  {errors.lastName && <p>This is required.</p>}
                </div>
              </div>
              <div className="flex gap-2 w-full ">
                <div className="flex flex-end items-center basis-1/2 ">
                  <AccountCircle
                    sx={{ color: "action.active", mr: 1, my: 0.5 }}
                  />
                  <Controller
                    control={control}
                    rules={{
                      required: true,
                    }}
                    render={({ field: { onChange, onBlur, value } }) => (
                      <TextField
                        id="input-with-sx"
                        label={t("username")}
                        variant="standard"
                        inputProps={{
                          style: { fontFamily: "BoonBaanRegular" },
                        }}
                        onBlur={onBlur}
                        onChange={onChange}
                        value={value}
                      />
                    )}
                    name="username"
                  />
                  {errors.username && <p>This is required.</p>}
                </div>

                <div className="flex flex-end items-center flex-1 ">
                  <Controller
                    control={control}
                    rules={{
                      required: true,
                    }}
                    render={({ field }) => (
                      <TextField
                        {...field}
                        inputProps={{
                          style: { fontFamily: "BoonBaanRegular" },
                        }}
                        type="password"
                        className="flex-1"
                        id="input-with-sx"
                        label={t("password")}
                        variant="standard"
                      />
                    )}
                    name="password"
                  />
                  {errors.password && <p>This is required.</p>}
                </div>
              </div>

              <div className="flex gap-2">
                <div className="flex flex-end items-center ">
                  <WcIcon sx={{ color: "action.active", mr: 1, my: 0.5 }} />
                  <Controller
                    control={control}
                    rules={{
                      required: true,
                    }}
                    render={({ field }) => (
                      <TextField
                        inputProps={{
                          style: { fontFamily: "BoonBaanRegular" },
                        }}
                        {...field}
                        id="input-with-sx"
                        label={t("gender")}
                        variant="standard"
                      />
                    )}
                    name="gender"
                  />
                  {errors.gender && <p>This is required.</p>}
                </div>

                <div className="flex flex-end items-center ">
                  <PhoneIphoneIcon
                    sx={{ color: "action.active", mr: 1, my: 0.5 }}
                  />
                  <Controller
                    control={control}
                    rules={{
                      required: true,
                    }}
                    render={({ field: { onChange, onBlur, value } }) => (
                      <MuiTelInput
                        variant="standard"
                        onlyCountries={["LA", "TH"]}
                        defaultCountry="LA"
                        focusOnSelectCountry
                        value={value}
                        onChange={onChange}
                        label={t("tel")}
                      />
                      // <TextField
                      //   inputProps={{
                      //     style: { fontFamily: "BoonBaanRegular" },
                      //   }}
                      //   {...field}
                      //   id="input-with-sx"
                      //   label={t("tel")}
                      //   variant="standard"
                      // />
                    )}
                    name="tel"
                  />
                  {errors.tel && <p>This is required.</p>}
                </div>
              </div>

              <div className="flex gap-2">
                <div className="flex flex-end items-center flex-1 ">
                  <HomeIcon sx={{ color: "action.active", mr: 1, my: 0.5 }} />

                  <Controller
                    control={control}
                    rules={{
                      required: true,
                    }}
                    render={({ field }) => (
                      <TextField
                        inputProps={{
                          style: { fontFamily: "BoonBaanRegular" },
                        }}
                        {...field}
                        className="flex-1"
                        id="input-with-sx"
                        label={t("address")}
                        variant="standard"
                        multiline
                        rows={2}
                      />
                    )}
                    name="address"
                  />
                  {errors.address && <p>This is required.</p>}
                </div>
              </div>
            </div>
          </div>
          <DialogActions>
            <Button onClick={handleClose}>{t("cancle")}</Button>
            <Button type="submit" onClick={() => onSubmit(getValues())}>
              {t("submit")}
            </Button>
          </DialogActions>
        </Dialog>
      </form>
    </div>
  );
}
