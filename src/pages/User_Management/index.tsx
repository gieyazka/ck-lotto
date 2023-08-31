import { Controller, SubmitHandler, useForm } from "react-hook-form";
import {
  addUserLog,
  createUser,
  deleteUser,
  getCustomer,
  getEmployee,
  getUserByEmail,
  getUserById,
  getUserGroup,
  getUserSession,
  updateUser,
} from "../../utils/service";
import i18n, { changeLanguage } from "i18next";
import { useMutation, useQuery, useQueryClient } from "react-query";

import Button from "@mui/material/Button";
import React from "react";
import RenderCreateDialogCustomer from "./create_dialog";
import RenderCreateDialogGroups from "./create_dialogGroups";
import RenderDialog from "./dialog";
import RenderDialogGroups from "./dialogGroups";
import RenderTable_Ck from "./table_ckGroup";
import RenderTable_Customer from "./table_customer";
import RenderUserGroup from "./table_userGroup";
import Swal from "sweetalert2";
import _ from "lodash";
import { callToast } from "../../utils/common";
import useCustomer from "./customer_Hook";
import { useLoading } from "../../store";
import { useNavigate } from "react-router-dom";
import { useTheme } from "@mui/material/styles";
import { useTranslation } from "react-i18next";
import useUserHook from "./groups_hook";
import { userData } from "../../utils/type";

const Users = () => {
  const loadingStore = useLoading();
  let user = getUserSession();
  const [dialogState, setDialogState] = React.useState<{
    open: boolean;
    data: userData | undefined;
    type: null | string;
  }>({
    open: false,
    data: undefined,
    type: null,
  });
  const [createDialogState, setCreateDialogState] = React.useState<{
    open: boolean;
  }>({
    open: false,
  });
  const userQuery = useQuery(["userSession"], () => getUserById(user["$id"]), {
    // refetchOnMount : false,
    keepPreviousData: true,
    refetchInterval: false,
    refetchOnWindowFocus: false,
  });
  const customers = useCustomer(userQuery.data);

  const groups = useUserHook();
  const queryClient = useQueryClient();
  const [menuState, setMenuState] = React.useState(1);
  const { t } = useTranslation();
  const theme = useTheme();
  const createUserMutation = useMutation(
    (props: { data: userData }) => {
      return createUser(props.data);
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
        employee_Data.refetch();
        onCloseCreateDialog();

        loadingStore.setLoad(false);
        callToast({
          title: t("createSuccess"),
          type: "success",
        });
      },
      onError: (e: Error) => {
        console.log("e", e);
        callToast({
          title: t(e.message),
          type: "error",
        });
        loadingStore.setLoad(false);
      },
    }
  );
  const userMutation = useMutation(
    (props: { data: userData; docId: string }) => {
      return updateUser(props.data, props.docId);
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
        // const type = menuState === 1 ? "customer" : "employee";
        if (menuState === 2) {
          employee_Data.refetch();
        } else {
          customers.dataQuery.refetch();
        }

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
  const [empSearch, setEmpSearch] = React.useState("");

  const [groupSearch, setGroupSearch] = React.useState("");

  const onChangeEmpSearch = (text: string) => {
    if (text.length >= 3 || text.length === 0) {
      queryClient.cancelQueries({
        queryKey: [
          "employee",
          paginationStateEmp.pageIndex,
          paginationStateEmp.pageSize,
          empSearch,
        ],
      });
      setEmpSearch(text);
    }
  };


  const [paginationStateEmp, setPaginationStateEmp] = React.useState({
    pageIndex: 0,
    pageSize: 25,
  });

  const [paginationStateGroup, setPaginationStateGroup] = React.useState({
    pageIndex: 0,
    pageSize: 25,
  });

  const employee_Data = useQuery(
    [
      "employee",
      paginationStateEmp.pageIndex,
      paginationStateEmp.pageSize,
      empSearch,
    ],
    () => getEmployee(paginationStateEmp, empSearch),
    {
      refetchOnMount: "always",
      keepPreviousData: true,
      refetchInterval: false,
      refetchOnWindowFocus: false,
    }
  );

  const delete_userData = useMutation(
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
        if (menuState === 2) {
          employee_Data.refetch();
        }
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
    }
  );

  const onCreateUser = (data: userData) => {
    Swal.fire({
      title: `${t("createConfirm")}`,
      icon: "info",
      showCancelButton: true,
      confirmButtonColor: theme.palette.primary.main,
      cancelButtonColor: "#FF5555",
      confirmButtonText: `${t("confirm")}`,
      cancelButtonText: `${t("cancle")}`,
      reverseButtons: true,
    }).then(async (result) => {
      if (result.isConfirmed) {
        console.table({ ...data });
        return;
        await createUserMutation.mutateAsync({ data });
      }
    });
  };
  const onEditUser = async (data: userData, docId: string) => {
    data.groups = _.flatMap(data.groups, "$id") || [];
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
        await userMutation.mutateAsync({ data, docId });
        onCloseDialog();
      }
    });
  };

  const onOpenDialog = (data: any, type: string | null) => {
    setDialogState({
      open: true,
      data: data,
      type,
    });
  };
  const onCloseDialog = () => {
    setDialogState({
      open: false,
      data: undefined,
      type: null,
    });
  };

  const onOpenCreateDialog = () => {
    setCreateDialogState({
      open: true,
    });
  };

  const onCloseCreateDialog = () => {
    setCreateDialogState({
      open: false,
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
        await delete_userData.mutateAsync(docId);
      }
    });
  };
  console.log("menuState", menuState);
  if (userQuery.isLoading) {
    return <div>Loading ...</div>;
  }
  user = userQuery.data;
  console.log("user", user);
  return (
    <div className="">
      <RenderDialog
        onCloseDialog={
          menuState === 1 ? customers.onCloseDialog : onCloseDialog
        }
        dialogState={menuState === 1 ? customers.dialogState : dialogState}
        onEditUser={onEditUser}
        groups={groups.dataQuery.data?.documents}
      />
      <RenderCreateDialogCustomer
        onCloseDialog={onCloseCreateDialog}
        dialogState={createDialogState}
        onCreateUser={onCreateUser}
      />
      <RenderDialogGroups
        onCloseDialog={groups.onCloseDialog}
        dialogState={groups.dialogState}
        onEditUser={groups.onEdit}
      />
      <RenderCreateDialogGroups
        onCloseDialog={groups.onCloseCreateDialog}
        dialogState={groups.dialogCreateState}
        onCreate={groups.onCreate}
      />
      <div
        style={{ fontFamily: "BoonBaanRegular" }}
        className="rounded-lg bg-white p-4"
      >
        <div className="flex flex-col z-10 ">
          <div className="flex justify-between">
            <div className="flex">
              {user.role === "external" ? (
                <Button
                  style={{
                    fontFamily: "BoonBaanRegular",
                    backgroundColor:
                      menuState === 1 ? theme.palette.primary.main : "#B5B8C0",
                    color: "white",
                  }}
                  onClick={() => {
                    customers.setSearch("");
                    setGroupSearch("");
                    setMenuState(1);
                  }}
                  className="px-8  rounded-t-xl rounded-r-none border-r-0 shadow-none"
                  variant="contained"
                >
                  <p className="mb-6">{t("user_management.customer")}</p>
                </Button>
              ) : (
                <div>
                  <Button
                    style={{
                      fontFamily: "BoonBaanRegular",
                      backgroundColor:
                        menuState === 1
                          ? theme.palette.primary.main
                          : "#B5B8C0",
                      color: "white",
                    }}
                    onClick={() => {
                      customers.setSearch("");
                      setGroupSearch("");
                      setMenuState(1);
                    }}
                    className="px-8  rounded-l-xl rounded-r-none border-r-0 shadow-none"
                    variant="contained"
                  >
                    <p className="mb-6">{t("user_management.customer")}</p>
                  </Button>

                  <Button
                    onClick={() => {
                      customers.setSearch("");
                      setEmpSearch("");
                      setMenuState(2);
                    }}
                    style={{
                      fontFamily: "BoonBaanRegular",
                      backgroundColor:
                        menuState === 2
                          ? theme.palette.primary.main
                          : "#B5B8C0",

                      color: "white",
                    }}
                    className="px-8 rounded-r-none  rounded-l-none shadow-none"
                    variant="contained"
                  >
                    <p className="mb-6">{t("User Group")}</p>
                  </Button>
                  <Button
                    onClick={() => {
                      setEmpSearch("");
                      setGroupSearch("");
                      setMenuState(3);
                    }}
                    style={{
                      fontFamily: "BoonBaanRegular",
                      backgroundColor:
                        menuState === 3
                          ? theme.palette.primary.main
                          : "#B5B8C0",

                      color: "white",
                    }}
                    className="px-8 rounded-r-xl rounded-l-none shadow-none"
                    variant="contained"
                  >
                    <p className="mb-6">{t("CK Group")}</p>
                  </Button>
                </div>
              )}
            </div>

            <Button
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
            </Button>
            <Button
              onClick={() => {
                groups.onOpenCreateDialog();
              }}
              style={{
                display: menuState === 2 ? "block" : "none",
                fontFamily: "BoonBaanRegular",
                backgroundColor: theme.palette.primary.main,

                color: "white",
              }}
              className="px-8 rounded-xl  shadow-none "
              variant="contained"
            >
              <p className="mb-6">{t("user_management.addGroup")}</p>
            </Button>
          </div>
          <div className="-mt-6 z-50 border-2 bg-white border-[#D7D7D7] rounded-lg">
            {menuState === 1 ? (
              <div className="text-xl p-4  ">
                <RenderTable_Customer
                  onChangeSearch={customers.onChangeSearch}
                  onOpenDialog={onOpenDialog}
                  userData={customers.dataQuery}
                  deleteUser={delete_userData}
                  paginationState={customers.paginationState}
                  setPaginationState={customers.setPaginationState}
                  onDelete={onDelete}
                  user={user}
                />
              </div>
            ) : menuState === 2 ? (
              <div className="text-xl p-4 ">
                <RenderUserGroup
                  onChangeSearch={groups.onChangeSearch}
                  onOpenDialog={groups.onOpenDialog}
                  userData={groups.dataQuery}
                  deleteUser={delete_userData}
                  paginationState={groups.paginationState}
                  setPaginationState={groups.setPaginationState}
                  onDelete={groups.onDelete}
                
                />
              </div>
            ) : (
              <div className="text-xl p-4 ">
                <RenderTable_Ck
                  onChangeSearch={onChangeEmpSearch}
                  onOpenDialog={onOpenDialog}
                  userData={employee_Data}
                  deleteUser={delete_userData}
                  paginationState={paginationStateEmp}
                  setPaginationState={setPaginationStateEmp}
                  onDelete={onDelete}
                />
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Users;
