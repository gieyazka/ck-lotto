import * as React from "react";

import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import { adsData } from "../../utils/type";

const RenderDialog = ({
  handleOpenDialog,
  handleClose,
  state,
}: {
  handleOpenDialog: (data: adsData) => void;
  handleClose: () => void;
  state: { open: boolean; data: adsData | undefined };
}) => {
  const data = state.data;
  return (
    <div>
      <Dialog
        open={state.open}
        onClose={handleClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">{data?.title}</DialogTitle>
        <DialogContent>
          <div className="flex flex-col">
            <p className="text-bold text-2xl">Detail :</p>
            <textarea className="resize-none w-96 max-h-64">
              {data?.detail}
            </textarea>
          </div>
          <div className="flex flex-col mt-2">
            <p className="text-bold text-2xl">Image :</p>
            <div className="flex gap-2">
              {data && Array.from(data.image as any).map((d: any,i :number) => {
                const imgData = JSON.parse(d)
                // console.log(imgData);
                return <>
                <img  key={`img${i}`} src={imgData.url} className="w-24 h-24" />
                </>;
              })}
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default RenderDialog;
