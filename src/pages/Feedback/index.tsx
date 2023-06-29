import { Controller, SubmitHandler, useForm } from "react-hook-form";
import { addUserLog, deleteFeedback, getFeedback } from "../../utils/service";
import i18n, { changeLanguage } from "i18next";
import { useMutation, useQuery } from "react-query";

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
import Swal from "sweetalert2";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import bg_image from "../../../assets/login_image.svg";
import { callToast } from "../../utils/common";
import { useLoading } from "../../store";
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
  const loadingStore = useLoading();
  const user = JSON.parse(sessionStorage.getItem("User") || "null");

  const navigate = useNavigate();
  const { t } = useTranslation();

  const [paginationState, setPaginationState] = React.useState({
    pageIndex: 0,
    pageSize: 25,
  });
  const feedback = useQuery(
    ["feedback", paginationState.pageIndex, paginationState.pageSize],
    () => getFeedback(paginationState),
    {
      // refetchOnMount : false,
      keepPreviousData: true,
      refetchInterval: false,
      refetchOnWindowFocus: false,
    }
  );

  const mutationOption = {
    onMutate: () => {
      loadingStore.setLoad(true);
    },
    onSuccess: async (data: any, variables: any, context?: any) => {
      // reset();
   
      await addUserLog({
        type: "delete",
        logData: JSON.stringify(data),
        // varible : JSON.stringify(variables),
        users: user.$id,
        collection : data.$collectionId,
        docId : data.$id,
        timestamp: new Date(),
      });
      feedback.refetch();
      loadingStore.setLoad(false);
      callToast({
        title: t("deleteSuccess"),
        type: "success",
      });
    },
    onError: () => {
      callToast({
        title: t("deleteFail"),
        type: "error",
      });
      loadingStore.setLoad(false);
    },
  };

  const delete_Feedback = useMutation((docId: string) => {
    return deleteFeedback(docId);
  }, mutationOption);

  console.log(feedback);
  const theme = useTheme();

  const [selectedFile, setSelectedFile] = React.useState<File | null>(null);

  const handleInputChange = (event: any) => {
    setSelectedFile(event.target.files[0]);
  };
  const onDelete = async (docId: string) => {
    Swal.fire({
      title: `${t("deleteConfirm")}`,
      icon: "info",
      showCancelButton: true,
      confirmButtonColor: theme.palette.primary.main,
      cancelButtonColor: "#FF5555",
      confirmButtonText: `${t("comfirm")}`,
      cancelButtonText: `${t("cancle")}`,
      reverseButtons: true,
    }).then(async (result) => {
      if (result.isConfirmed) {
        await delete_Feedback.mutateAsync(docId);
      }
    });
  };

  return (
    <div className="">
      <div className="text-xl">
        <RenderTable
          query={feedback}
          paginationState={paginationState}
          setPaginationState={setPaginationState}
          onDelete={onDelete}
          total={feedback?.data?.total ?? 0}
          data={
            feedback.data?.documents !== undefined
              ? feedback.data.documents
              : []
          }
        />
      </div>
    </div>
  );
};

export default Feedback;
