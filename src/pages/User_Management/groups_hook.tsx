import Swal, { SweetAlertResult } from "sweetalert2";
import {
  addGroup,
  addPromotions,
  addUserLog,
  deleteGroup,
  deletePromotions,
  getPoints,
  getPromotions,
  getUserGroup,
  getUserSession,
  updateGroup,
  updatePromotions,
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

const useHook = () => {
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
  });
  const [search, setSearch] = React.useState("");
  const [paginationState, setPaginationState] = React.useState({
    pageIndex: 0,
    pageSize: 25,
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

  const onOpenCreateDialog = () => {
    setDialogCreateState({
      open: true,
    });
  };
  const onCloseCreateDialog = () => {
    setDialogCreateState({
      open: false,
    });
  };

  const dataQuery = useQuery(
    ["groups", paginationState.pageIndex, paginationState.pageSize, search],
    () => getUserGroup(paginationState, search),
    {
      refetchOnMount: "always",
      keepPreviousData: true,
      refetchInterval: false,
      refetchOnWindowFocus: false,
    }
  );
  const addQuery = useMutation(
    (props: { data: any }) => {
      return addGroup(props.data);
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
      return deleteGroup(props.docId);
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
    (props: { data: promotionData; docId: string }) => {
      return updateGroup(props.data, props.docId);
    },
    {
      onMutate: () => {
        loadingStore.setLoad(true);
      },
      onSuccess: async (data: any, variables: any, context?: any) => {
        await addUserLog({
          type: "update",
          logData: JSON.stringify(data),
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

  const onCreate = (data: any) => {
    if (data.name === "" || data.name === undefined) {
      callToast({
        title: t("user_management.noGroup_name"),
        type: "error",
      });
      return;
    }

    Swal.fire({
      title: `${t("createConfirm")}`,
      icon: "info",
      showCancelButton: true,
      confirmButtonColor: theme.palette.primary.main,
      cancelButtonColor: "#FF5555",
      confirmButtonText: `${t("confirm")}`,
      cancelButtonText: `${t("cancle")}`,
      reverseButtons: true,
    }).then(async (result: SweetAlertResult) => {
      if (result.isConfirmed) {
        await addQuery.mutateAsync({ data });
        onCloseCreateDialog();
      }
    });
  };

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

  const onEdit = async (data: promotionData, docId: string) => {
    if (data.name === "" || data.name === undefined) {
      callToast({
        title: t("user_management.noGroup_name"),
        type: "error",
      });
      return;
    }
    Swal.fire({
      title: `${t("updateConfirm")}`,
      icon: "info",
      showCancelButton: true,
      confirmButtonColor: theme.palette.primary.main,
      cancelButtonColor: "#FF5555",
      confirmButtonText: `${t("confirm")}`,
      cancelButtonText: `${t("cancle")}`,
      reverseButtons: true,
    }).then(async (result) => {
      if (result.isConfirmed) {
        console.log(' data, docId', data, docId)
        await updateQuery.mutateAsync({ data, docId });
        onCloseDialog();
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
    onCreate,
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
    onOpenCreateDialog,
    onCloseCreateDialog,
    dialogCreateState,
  };
};

export default useHook;
