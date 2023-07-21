import * as React from "react";

import Backdrop from "@mui/material/Backdrop";
import Button from "@mui/material/Button";
import CircularProgress from "@mui/material/CircularProgress";
import { useLoading } from "../store";

export default function RenderLoading() {
  const loadingStore = useLoading();

  return (
    <div>
      <Backdrop
        sx={{ color: "#fff", zIndex: (theme) => 99999}}
        open={loadingStore.isLoad}
      >
        <CircularProgress color="inherit" />
      </Backdrop>
    </div>
  );
}
