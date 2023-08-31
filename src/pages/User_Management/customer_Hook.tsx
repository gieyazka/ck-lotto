import Swal, { SweetAlertResult } from "sweetalert2";
import {
  addPromotions,
  addUserLog,
  deletePromotions,
  deleteUser,
  getCustomer,
  getCustomerHideTell,
  getPoints,
  getPromotions,
  getUserSession,
  updatePromotions,
} from "../../utils/service";
import {
  groupData,
  loadingStore,
  promotionData,
  userData,
  winPrice,
} from "../../utils/type";
import { useMutation, useQuery, useQueryClient } from "react-query";

import React from "react";
import { callToast } from "../../utils/common";
import { t } from "i18next";
import { useLoading } from "../../store";
import { useTheme } from "@mui/material";

const useHook = (data: any) => {
  console.log("29", data);
  const queryClient = useQueryClient();
  const theme = useTheme();
  const user = getUserSession();
  const loadingStore = useLoading();
  const [dialogState, setDialogState] = React.useState<{
    open: boolean;
    data: userData | undefined;
  }>({
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
    ["customer", paginationState.pageIndex, paginationState.pageSize, search],
    () => {
      //TODO: Checj role and create custom API
      if (data.role === "external") {
        return getCustomerHideTell(paginationState, search);
      }

      return getCustomer(paginationState, search);
    },
    {
      enabled: data !== undefined,
      refetchOnMount: "always",
      keepPreviousData: true,
      refetchInterval: false,
      refetchOnWindowFocus: false,
    }
  );
  const addQuery = useMutation(
    (props: { data: any }) => {
      return addPromotions(props.data);
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
    (docId: string) => {
      return deleteUser(docId);
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
      return updatePromotions(props.data, props.docId);
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

  const onSubmit = (data: any) => {
    if (data.name === "") {
      callToast({
        title: t("promotions.noPromotion_name"),
        type: "error",
      });
      return;
    }
    if (data.bonus == 0 || data.bonus === undefined) {
      callToast({
        title: t("promotions.noPromotion_bonus"),
        type: "error",
      });
      return;
    }
    if (data.startDate === undefined) {
      callToast({
        title: t("promotions.noStartDate"),
        type: "error",
      });
      return;
    }
    if (data.expireDate === undefined) {
      callToast({
        title: t("promotions.noExpireDate"),
        type: "error",
      });
      return;
    }
    if (data.type === undefined || data.type === "") {
      callToast({
        title: t("promotions.noPromotion_type"),
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
        const { email, $id, username, firstname, lastname, tel, role, type } =
          user;
        data.groups = data.groups.map((d: groupData) => d.value.$id);
        data.users = $id;

        // return ;
        await addQuery.mutateAsync({ data });
        // onCloseDialog();
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
        await deleteQuery.mutateAsync(docId);
      }
    });
  };

  const onEdit = async (data: promotionData, docId: string) => {
    if (data.name === "") {
      callToast({
        title: t("promotions.noPromotion_name"),
        type: "error",
      });
      return;
    }
    if (data.type === undefined || data.type === "") {
      callToast({
        title: t("promotions.noPromotion_type"),
        type: "error",
      });
      return;
    }
    if (data.bonus == 0 || data.bonus === undefined) {
      callToast({
        title: t("promotions.noPromotion_bonus"),
        type: "error",
      });
      return;
    }
    if (data.startDate === undefined) {
      callToast({
        title: t("promotions.noStartDate"),
        type: "error",
      });
      return;
    }
    if (data.expireDate === undefined) {
      callToast({
        title: t("promotions.noExpireDate"),
        type: "error",
      });
      return;
    }
    console.log("data", data);
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
        data.groups = data.groups.map((d: groupData) => d.value.$id);
        await updateQuery.mutateAsync({ data, docId });
        onCloseDialog();
      }
    });
  };

  const onChangeSearch = (text: string) => {
    if (text.length >= 3 || text.length === 0) {
      queryClient.cancelQueries({
        queryKey: [
          "customer",
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
    onSubmit,
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
    setSearch,
    search,
    onCloseCreateDialog,
    onOpenCreateDialog,
  };
};

export default useHook;
