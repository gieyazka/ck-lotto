import Swal, { SweetAlertResult } from "sweetalert2";
import {
  addNotSell,
  addPromotions,
  addUserLog,
  deletePromotions,
  getAccumulate,
  getPoints,
  getPromotions,
  getUserSession,
  updatePromotions,
  updateSell,
} from "../../utils/service";
import {
  groupData,
  loadingStore,
  promotionData,
  winPrice,
} from "../../utils/type";
import { useMutation, useQuery, useQueryClient } from "react-query";

import React from "react";
import { callToast } from "../../utils/common";
import { t } from "i18next";
import { useLoading } from "../../store";
import { useTheme } from "@mui/material";

const useHook = (props: {
  lotteryType: number;
  lotteryDate: Date | undefined;
}) => {
  const queryClient = useQueryClient();
  const theme = useTheme();
  const user = getUserSession();
  const loadingStore = useLoading();
  const [dialogState, setDialogState] = React.useState({
    open: false,
    data: undefined,
  });
  const [dialogCreateState, setDialogCreateState] = React.useState({
    open: false,
    data: undefined,
  });
  const [search, setSearch] = React.useState("");
  const [paginationState, setPaginationState] = React.useState({
    pageIndex: 0,
    pageSize: 5,
  });
  const onOpenDialog = (data: any) => {
    setDialogState({
      open: true,
      data: data,
    });
  };
  const onCloseDialog = () => {
    setDialogState({
      open: false,
      data: undefined,
    });
  };
  const onOpenCreateDialog = (data: any) => {
    setDialogCreateState({
      open: true,
      data: data,
    });
  };
  const onCloseCreateDialog = () => {
    setDialogCreateState({
      open: false,
      data: undefined,
    });
  };
  const dataQuery = useQuery(
    [
      "accumulate",
      props.lotteryType,
      props.lotteryDate,
      paginationState.pageIndex,
      paginationState.pageSize,
    ],
    () => getAccumulate(props.lotteryType, props.lotteryDate, paginationState),
    {
      enabled: props.lotteryDate !== undefined,
      refetchOnMount: "always",
      keepPreviousData: true,
      refetchInterval: false,
      refetchOnWindowFocus: false,
    }
  );
  const addQuery = useMutation(
    (props: { lotteryDate: Date | undefined; lotteryNumber: string }) => {
      return addNotSell(props.lotteryNumber, props.lotteryDate);
    },
    {
      onMutate: () => {
        loadingStore.setLoad(true);
      },
      onSuccess: async (data: any, variables: any, context?: any) => {
        await addUserLog({
          type: "create",
          logData: JSON.stringify(data),
          users: user.$id,
          timestamp: new Date(),
          collection: data.$collectionId,
          docId: data.$id,
        });
        // const type = menuState === 1 ? "customer" : "employee";
        dataQuery.refetch();
        // onCloseCreateDialog();

        loadingStore.setLoad(false);
        callToast({
          title: t("createSuccess"),
          type: "success",
        });
      },
      onError: (e: Error) => {
        console.error("e", e);
        callToast({
          title: t(e.message),
          type: "error",
        });
        loadingStore.setLoad(false);
      },
    }
  );

  const deleteQuery = useMutation(
    (props: { docId: string }) => {
      return deletePromotions(props.docId);
    },
    {
      onMutate: () => {
        loadingStore.setLoad(true);
      },
      onSuccess: async (data: any, variables: any, context?: any) => {
        await addUserLog({
          type: "delete",
          logData: JSON.stringify(data),
          users: user.$id,
          timestamp: new Date(),
          collection: data.$collectionId,
          docId: data.$id,
        });
        dataQuery.refetch();

        loadingStore.setLoad(false);
        callToast({
          title: t("deleteSuccess"),
          type: "success",
        });
      },
      onError: (e: Error) => {
        console.error("e", e);
        callToast({
          title: t(e.message),
          type: "error",
        });
        loadingStore.setLoad(false);
      },
    }
  );
  const updateQuery = useMutation(
    (props: { data: any }) => {
      return updateSell(props.data);
    },
    {
      onMutate: () => {
        loadingStore.setLoad(true);
      },
      onSuccess: async (data: any, variables: any, context?: any) => {
        await addUserLog({
          type: "update",
          logData: JSON.stringify(variables),
          users: user.$id,
          timestamp: new Date(),
          collection: data.$collectionId,
          docId: data.$id,
        });
        dataQuery.refetch();
        loadingStore.setLoad(false);
        callToast({
          title: t("updateSuccess"),
          type: "success",
        });
      },
      onError: () => {
        callToast({
          title: t("updateFail"),
          type: "error",
        });
        loadingStore.setLoad(false);
      },
    }
  );

  // const onSubmit = (data: any) => {
  //   Swal.fire({
  //     title: `${t("createConfirm")}`,
  //     icon: "info",
  //     showCancelButton: true,
  //     confirmButtonColor: theme.palette.primary.main,
  //     cancelButtonColor: "#FF5555",
  //     confirmButtonText: `${t("confirm")}`,
  //     cancelButtonText: `${t("cancle")}`,
  //     reverseButtons: true,
  //   }).then(async (result: SweetAlertResult) => {
  //     if (result.isConfirmed) {
  //       const { email, $id, username, firstname, lastname, tel, role, type } =
  //         user;
  //       data.groups = data.groups.map((d: groupData) => d.value.$id);
  //       data.users = $id;

  //       // return ;
  //       await addQuery.mutateAsync({ data });
  //       // onCloseDialog();
  //     }
  //   });
  // };

  const onDelete = async (docId: string) => {
    Swal.fire({
      title: `${t("deleteConfirm")}`,
      icon: "info",
      showCancelButton: true,
      confirmButtonColor: theme.palette.primary.main,
      cancelButtonColor: "#FF5555",
      confirmButtonText: `${t("confirm")}`,
      cancelButtonText: `${t("cancle")}`,
      reverseButtons: true,
    }).then(async (result) => {
      if (result.isConfirmed) {
        await deleteQuery.mutateAsync({ docId });
      }
    });
  };

  const onEdit = async (data: any) => {
    console.log("data", data);
    Swal.fire({
      title: data.isSell
        ? `${t("donotsell.notSellConfirm")}`
        : `${t("donotsell.sellConfirm")}`,
      icon: "info",
      showCancelButton: true,
      confirmButtonColor: theme.palette.primary.main,
      cancelButtonColor: "#FF5555",
      confirmButtonText: `${t("confirm")}`,
      cancelButtonText: `${t("cancle")}`,
      reverseButtons: true,
    }).then(async (result) => {
      if (result.isConfirmed) {
        await updateQuery.mutateAsync({ data });
      }
    });
  };

  const onChangeSearch = (text: string) => {
    if (text.length >= 3 || text.length === 0) {
      queryClient.cancelQueries({
        queryKey: [
          "promotions",
          paginationState.pageIndex,
          paginationState.pageSize,
          search,
        ],
      });
      setSearch(text);
    }
  };

  return {
    onEdit,
    onDelete,
    // onSubmit,
    updateQuery,
    deleteQuery,
    addQuery,
    onCloseDialog,
    onOpenDialog,
    dataQuery,
    setPaginationState,
    paginationState,
    onChangeSearch,
    dialogState,
    onCloseCreateDialog,
    onOpenCreateDialog,
  };
};

export default useHook;
