import { Button, Skeleton } from "@mui/material";
import React, { useMemo } from "react";
import {
  UseMutationResult,
  UseQueryResult,
  useMutation,
  useQuery,
} from "react-query";
import {
  addUserLog,
  deleteUser,
  getCustomer,
  getQuota,
  getUserSession,
  getWinPrice,
  upDateQuota,
  upDateWinPrice,
} from "../../utils/service";
import i18n, { changeLanguage } from "i18next";
import { loadingStore, quota, userData, winPrice } from "../../utils/type";

import { Add } from "@mui/icons-material";
import Chip from "@mui/material/Chip";
import { DatePicker } from "@mui/x-date-pickers";
import { ReactComponent as DeleteIcon } from "../../assets/icons/delete.svg";
import DeletedIcon from "@mui/icons-material/Delete";
import { ReactComponent as EditIcon } from "../../assets/icons/edit.svg";
import IconButton from "@mui/material/IconButton";
import { MRT_ColumnDef } from "material-react-table"; // If using TypeScript (optional, but recommended)
import { MRT_Localization_FR } from "material-react-table/locales/fr";
import { MaterialReactTable } from "material-react-table";
import Swal from "sweetalert2";
import VisibilityIcon from "@mui/icons-material/Visibility";
import _ from "lodash";
import { callToast } from "../../utils/common";
import dayjs from "dayjs";
import { useLoading } from "../../store";
import { useTheme } from "@mui/material/styles";
import { useTranslation } from "react-i18next";

//If using TypeScript, define the shape of your data (optional, but recommended)

//mock data - strongly typed if you are using TypeScript (optional, but recommended)

export default function App() {
  const theme = useTheme();
  const user = getUserSession();
  const { t } = useTranslation();
  const loadingStore = useLoading();
  const [state, setState] = React.useState<quota[]>();

  const onEditMultiply = (data: quota) => {
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
        const newUserArr = _.cloneDeep(data.users) ?? [];
        const newUpdateDate = _.cloneDeep(data.updateDate) ?? [];
        if (newUpdateDate.length >= 10) {
          newUpdateDate.splice(0, 1);
        }
        if (newUserArr.length >= 10) {
          newUserArr.splice(0, 1);
        }
        const { email, $id, username, firstname, lastname, tel, role, type } =
          user;
        newUserArr.push(
          JSON.stringify({
            email,
            $id,
            username,
            firstname,
            lastname,
            tel,
            role,
            type,
          })
        );
        newUpdateDate?.push(new Date());
        data.users = newUserArr;
        data.updateDate = newUpdateDate;
        console.log("data", data);
        await updateQuotaMutation.mutateAsync({ data });
        // onCloseDialog();
      }
    });
  };
  const [paginationState, setPaginationState] = React.useState({
    pageIndex: 0,
    pageSize: 25,
  });
  const quotaQuery = useQuery(
    ["quota", paginationState.pageIndex, paginationState.pageSize],
    () => getQuota(paginationState),
    {
      refetchOnMount: "always",
      keepPreviousData: true,
      refetchInterval: false,
      refetchOnWindowFocus: false,
    }
  );

  const updateQuotaMutation = useMutation(
    (props: { data: quota }) => {
      return upDateQuota(props.data);
    },
    {
      onMutate: () => {
        loadingStore.setLoad(true);
      },
      onSuccess: async (data: any, variables: any, context?: any) => {
        await addUserLog({
          type: "update",
          logData: JSON.stringify({
            quota: _.last(data.quota),
            users: _.last(data.users),
            updateDate: _.last(data.updateDate),
          }),
          users: user.$id,
          timestamp: new Date(),
          collection: data.$collectionId,
          docId: data.$id,
        });
        // const type = menuState === 1 ? "customer" : "employee";
        quotaQuery.refetch();
        // onCloseCreateDialog();

        loadingStore.setLoad(false);
        callToast({
          title: t("updateSuccess"),
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

  React.useEffect(() => {
    if (!quotaQuery.isLoading) {
      if (quotaQuery.data?.documents?.length !== 6) {
        const defaultArr = ["1", "2", "3", "4", "5", "6"];
        const result: quota[] = defaultArr.map((d) => {
          const findDigit: quota = quotaQuery.data.documents.find(
            (b: quota) => b.digit === d
          );
          return d === findDigit?.digit ? findDigit : ({ digit: d } as quota);
        });
        setState(result);
      } else {
        setState(quotaQuery.data.documents ?? []);
      }
    }
  }, [quotaQuery.data]);
  return (
    <div className="mt-2 ">
      <div className="flex gap-2 flex-col justify-center">
        <div className="flex flex-1 justify-between">
          <p className="text-center  basis-[100px]">{t("setup.digit")}</p>
          <p className="text-center flex-1">{t("setup.quota")}</p>
          <p className="text-center flex-1">{t("setup.updateDate")}</p>
          <p className="text-center flex-1">{t("setup.updateBy")}</p>
          <p className="text-center basis-[100px]">{t("setup.edit")}</p>
        </div>
        {quotaQuery.isLoading ? (
          <div className="flex flex-1  items-center justify-between">
            <p className="flex-1 text-center">
              <Skeleton />
            </p>
            <p className="flex-1 text-center">
              <Skeleton />
            </p>
            <p className="flex-1 text-center">
              <Skeleton />
            </p>

            <p className="flex-1 text-center">
              <Skeleton />
            </p>
            <p className="flex-1 text-center">
              <Skeleton />
            </p>
          </div>
        ) : (
          state?.map((d: quota, index: number) => {
            const updateUser =
              d.users !== undefined
                ? JSON.parse(_.last(d.users) ?? "")
                : undefined;
            return (
              <div
                key={`div${d.digit}`}
                className="flex flex-1   items-center justify-between"
              >
                <p className=" text-center basis-[100px] ">{d.digit} ตัว</p>
                <div className="flex gap-2 items-center flex-1 ">
                  ={" "}
                  <input
                    // maxLength={6}
                    type="text"
                    className="bg-gray-50 border h-fit py-2.5 border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full px-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                    placeholder={t("lotto_history.number") || ""}
                    value={_.last(d.quota)}
                    onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                      const text = event.target.value;
                      const sanitizedValue = text.replace(/[^0-9]/g, "");

                      setState((prev: any) => {
                        const cloneData: quota[] = _.cloneDeep(prev);
                        const cloneQuery: quota[] = _.cloneDeep(
                          quotaQuery.data.documents
                        );
                        const newQuota =
                          _.cloneDeep(cloneQuery[index]?.quota) ?? [];

                        if (newQuota.length >= 10) {
                          newQuota.splice(0, 1);
                        }
                        newQuota.length === 0
                          ? newQuota.push(0)
                          : newQuota.push(newQuota.length - 1);
                        const quotaIndex = newQuota.length - 1;
                        //  console.log(' _.last(d.multiply);', _.last(d.multiply))
                        if (sanitizedValue !== "") {
                          newQuota[quotaIndex] = parseInt(sanitizedValue);
                          // newMultiply?.push(parseInt(sanitizedValue));
                        } else {
                          //newMultiply = 0;
                          newQuota[quotaIndex] = 0;
                        }
                        console.log("", newQuota);
                        cloneData[index].quota = newQuota;
                        return cloneData;
                      });
                    }}
                  />{" "}
                </div>
                <p className="flex-1 text-center">
                  {d.updateDate !== undefined &&
                    dayjs(_.last(d.updateDate)).format("DD-MM-YYYY HH:mm")}
                </p>
                <p className="flex-1 text-center">
                  {updateUser &&
                    `${updateUser.firstname} ${updateUser.lastname} (${updateUser.role})`}
                </p>
                <p className="basis-[100px] flex-0 text-center">
                  {" "}
                  <IconButton
                    onClick={() => {
                      onEditMultiply(d);
                      // onOpenDialog(data);
                    }}
                    size="small"
                    aria-label="delete"
                    sx={{ color: "#FF0000" }}
                  >
                    <EditIcon style={{ fill: theme.palette.primary.main }} />
                  </IconButton>
                </p>
              </div>
            );
          })
        )}
        {/* <div className="flex-col"></div> */}
      </div>
    </div>
  );
}
