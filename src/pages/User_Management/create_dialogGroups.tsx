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
  onCreate,
}: {
  dialogState: { open: boolean };
  onCloseDialog: () => void;
  onCreate: (data: any) => void;
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
  const onSubmit = (data: any) => onCreate(data);
  const handleInputChange = (event: any) => {
    setValue("image", event.target.files[0]);
  };
  React.useEffect(() => {
    if (dialogState.open) {
      reset();
    }
  }, [dialogState.open]);
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
            <div className="flex flex-col gap-2">
              <div className="flex gap-2 w-full ">
                <div className="flex flex-end items-center  ">
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
                        label={t("user_management.groupName")}
                        variant="standard"
                        inputProps={{
                          style: { fontFamily: "BoonBaanRegular" },
                        }}
                        onBlur={onBlur}
                        onChange={onChange}
                        value={value}
                      />
                    )}
                    name="name"
                  />
                  {errors.username && <p>This is required.</p>}
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
