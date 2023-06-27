import React, { useMemo } from "react";
import { MaterialReactTable } from "material-react-table";
import { MRT_ColumnDef } from "material-react-table"; // If using TypeScript (optional, but recommended)
import { useTranslation } from "react-i18next";
import { MRT_Localization_FR } from "material-react-table/locales/fr";
import i18n, { changeLanguage } from "i18next";
//If using TypeScript, define the shape of your data (optional, but recommended)
interface Data {
  number: string;
  sell_amount: number;
  reward_amount: number;
  isSell: boolean;
}

//mock data - strongly typed if you are using TypeScript (optional, but recommended)

export default function App({ data }: { data: Data[] }) {
  const { t } = useTranslation();
  //column definitions - strongly typed if you are using TypeScript (optional, but recommended)
  const columns = useMemo<MRT_ColumnDef<Data>[]>(
    () => [
      {
        accessorKey: "number", //simple recommended way to define a column
        header: t("donotsell.number"),
        // muiTableHeadCellProps: { sx: { color: "green" } }, //custom props
      },
      {
        accessorFn: (originalRow) => originalRow.sell_amount.toLocaleString(), //alternate way
        id: "sell_amount", //id required if you use accessorFn instead of accessorKey
        header: "sell_amount",
        Header: (
          <i style={{ fontFamily: "BoonBaanRegular" }}>
            {t("donotsell.sell_amount")}
          </i>
        ), //optional custom markup
      },
      {
        accessorFn: (originalRow) => originalRow.reward_amount.toLocaleString(), //alternate way
        id: "reward_amount", //id required if you use accessorFn instead of accessorKey
        header: "reward_amount",
        Header: (
          <i style={{ fontFamily: "BoonBaanRegular" }}>
            {t("donotsell.reward_amount")}
          </i>
        ), //optional custom markup
      },
      {
        // accessorFn: (originalRow) => originalRow.isSell, //alternate way
        header: "control",
        Header: (
          <div style={{ fontFamily: "BoonBaanRegular" }}>
            {t("donotsell.control")}
          </div>
        ),
        Cell: ({ cell }) => {
          const isSell = cell.row.original.isSell;

          return (
            <div className="text-center">
              <div
                className="w-fit mx-auto rounded-md py-1 px-4 text-white min-w-[96px] hover:opacity-80 cursor-pointer"
                // <div className="w-fit mx-auto rounded-md border-4 border-indigo-500 text-white"
                style={{
                  backgroundColor: !isSell ? "#299914" : "#FF5555",
                  // FF5555 : red
                }}
              >
                {!isSell ? t("donotsell.sell") : t("donotsell.not_sell")}
              </div>
            </div>
          );
        }, //render Date as a string
      },
    ],
    [i18n.language]
  );

  return (
    <div className='mt-2'> 

    <MaterialReactTable
      columns={columns}
      data={data}
      //   enableRowSelection //enable some features
      //   enableColumnOrdering
      enableGlobalFilter={false} //turn off a feature
      enableColumnActions={false}
      enableColumnFilters={false}
      //   enablePagination={false}
      enableSorting={false}
      enableBottomToolbar={false}
      enableTopToolbar={false}
      //   muiTableBodyRowProps={{ hover: false }}
      muiTablePaperProps={{
        elevation: 0, //change the mui box shadow
        //customize paper styles
        sx: {
          borderRadius: '8px',
          border: '1px solid #e0e0e0',
        },
      }}
      muiTableProps={{
        sx: {
          borderRadius: "8px",
          fontFamily: "BoonBaanRegular",
          //   border: "1px solid #E0E0E0",
          // "& .MuiTableContainer-root th:first-child" : {
            //   borderTopLeftRadius:" 10px",
            //   borderBottomLeftRadius: "10px"
            // },
            
            // "& .MuiTableContainer-root th:last-child" : {
              //   borderTopRightRadius: "10px",
          //   borderBottomRightRadius: "10px"
          // },
        },
      }}
      muiTableHeadCellProps={{
        sx: {
          "& .Mui-TableHeadCell-Content": {
            justifyContent: "center",
          },
          //   borderRadius: "8px",
          
          fontFamily: "BoonBaanRegular",
          backgroundColor: "#F9F9F9",
          // border: "1px solid #E0E0E0",
        },
      }}
      muiTableBodyCellProps={{
        sx: {
          padding : "8px 0px",
          fontFamily: "BoonBaanRegular",
          textAlign: "center",
          //   border: "1px solid #E0E0E0",
        },
      }}
      />
      </div>
  );
}
