"use client";
import { DataTable } from "@/components/table/DataTable";
import {
  ActionConfig,
  ColumnConfig,
  createColumns,
} from "@/components/table/_utils/columns";
import {
  AlertDialogHeader,
  AlertDialogFooter,
} from "@/components/ui/alert-dialog";

import { useLocalStorage } from "@/hook/useLocalstorage";
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogCancel,
  AlertDialogAction,
} from "@/components/ui/alert-dialog";
import React, { useEffect, useState } from "react";
import { Inbound, Product, Satuan } from "@prisma/client";
import { convertTotalStockToUnits } from "@/lib/stockInUnit";
import { useQuery } from "@tanstack/react-query";
import { getInbound } from "@/lib/actions/inbound";
import InboundForm from "@/components/InboundForm";

const StockCell = ({ total, Satuan }: { total: number; Satuan: Satuan[] }) => {
  const [stockInUnits, setStockInUnits] = useState<{ [key: string]: number }>(
    {},
  );

  useEffect(() => {
    (async () => {
      const result = await convertTotalStockToUnits(total, Satuan);
      setStockInUnits(result);
    })();
  }, [total, Satuan]);

  return (
    <p className="flex items-center gap-2">
      {Object.entries(stockInUnits).map(([unit, quantity], index) => {
        if (quantity !== 0) {
          return (
            <i key={index}>
              <h3>
                {quantity} {unit}
              </h3>
            </i>
          );
        }
      })}
    </p>
  );
};

interface IInbound extends Inbound {
  product: Product | null;
}

const Page = () => {
  const [warehouseId, setWarehouseId] = useLocalStorage("warehouse-id", "1");
  const { data } = useQuery({
    queryKey: ["inbound"],
    queryFn: async () => await getInbound(Number(warehouseId)),
  });
  const [open, setOpen] = useState(false);
  const [openAdd, setOpenAdd] = useState(false);
  const [selected, setSelected] = useState<string>();
  //   const deleteQuery = useMutation({
  //     mutationFn: async (id: number) => await deleteCustomer(id),
  //     onSuccess: () => {
  //       queryClient.invalidateQueries({ queryKey: ["customer"] });

  //       setOpen(false);
  //       toast({
  //         description: (
  //           <div className="flex items-center justify-between gap-2">
  //             <div>
  //               <span className="text-green-500">
  //                 <CheckCircle2 size={28} strokeWidth={1} />
  //               </span>
  //             </div>
  //             <div>
  //               <h3 className="text-lg">Customer Deleted!</h3>
  //             </div>
  //           </div>
  //         ),
  //       });
  //     },
  //     onError(error) {
  //       toast({
  //         title: `Error: ${error.message}`,
  //         description: `${error.message}`,
  //         variant: "destructive",
  //       });
  //     },
  //   });
  //   const deleteQuerys = useMutation({
  //     mutationFn: async (customers: Product[]) =>
  //       await deleteCustomers(customers),
  //     onSuccess: () => {
  //       queryClient.invalidateQueries({ queryKey: ["products"] });

  //       setOpen(false);
  //       toast({
  //         description: (
  //           <div className="flex items-center justify-between gap-2">
  //             <div>
  //               <span className="text-green-500">
  //                 <CheckCircle2 size={28} strokeWidth={1} />
  //               </span>
  //             </div>
  //             <div>
  //               <h3 className="text-lg">Customer Deleted!</h3>
  //             </div>
  //           </div>
  //         ),
  //       });
  //     },
  //     onError(error) {
  //       toast({
  //         title: `Error: ${error.message}`,
  //         description: `${error.message}`,
  //         variant: "destructive",
  //       });
  //     },
  //   });
  const columnsConfig: ColumnConfig<IInbound>[] = [
    {
      accessorKey: "product.name",
      title: "Product",
    },
    {
      accessorKey: "quantity",
      title: "Quantity",
    },
    {
      accessorKey: "notes",
      title: "Notes",
    },
    {
      accessorKey: "createdAt",
      title: "Created At",
      type: "date",
    },
    {
      accessorKey: "inputBy",
      title: "Input By",
    },
  ];

  const actionsConfig: ActionConfig<IInbound>[] = [
    {
      label: "Copy Id",
      onClick: (product: Inbound) =>
        navigator.clipboard.writeText(JSON.stringify(product.product_id)),
    },
    {
      label: "Delete",
      onClick: (product: IInbound) => {
        setOpen(true);
        setSelected(product.product_id || "");
      },
    },
  ];

  const columns = createColumns({
    columns: columnsConfig,
    actions: actionsConfig,
    showAction: false,
    selectable: false,
  });
  const handleDelete = (selectedRows: IInbound[]) => {
    // Implement your delete logic here
    console.log("Deleted rows:", selectedRows);
    // deleteQuerys.mutate(selectedRows);
  };

  const handlePrint = (selectedRows: IInbound[]) => {
    // Implement your edit logic here
    console.log("Edited rows:", selectedRows);
  };
  if (!data) return null;
  return (
    <div>
      <InboundForm />
      <DataTable
        columns={columns}
        data={data}
        onDelete={handleDelete}
        onPrint={handlePrint}
        printButton={false}
        deleteButton={false}
      />
      <AlertDialog open={open}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete and
              remove your data from our servers.
              {/* {selected} */}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel
              onClick={() => {
                setOpen(false);
                setSelected(undefined);
              }}
            >
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              //   onClick={() => deleteQuery.mutate(selected as string)}
              className="bg-destructive hover:bg-destructive"
            >
              Continue
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default Page;