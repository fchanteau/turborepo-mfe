import { Badge, Button, DataTable, DataTableColumnHeader } from "@repo/ui";
import type { DataTableColumnDef } from "@repo/ui";
import { useMemo } from "react";
import { useNavigate } from "react-router";
import { useAuth } from "../auth.ts";
import { products } from "../data.ts";
import type { Product } from "../data.ts";

const priceFormatter = new Intl.NumberFormat("fr-FR", { style: "currency", currency: "EUR" });

const columns: DataTableColumnDef<Product>[] = [
  {
    accessorKey: "name",
    header: ({ column }) => <DataTableColumnHeader column={column} title="Name" />,
    cell: ({ row }) => <span className="font-medium">{row.original.name}</span>,
  },
  {
    accessorKey: "description",
    header: "Description",
    enableSorting: false,
    cell: ({ row }) => <span className="text-muted-foreground">{row.original.description}</span>,
  },
  {
    accessorKey: "price",
    header: ({ column }) => <DataTableColumnHeader column={column} title="Price" />,
    cell: ({ row }) => priceFormatter.format(row.original.price),
  },
  {
    accessorKey: "inStock",
    header: ({ column }) => <DataTableColumnHeader column={column} title="Availability" />,
    enableGlobalFilter: false,
    cell: ({ row }) => (
      <Badge variant={row.original.inStock ? "secondary" : "destructive"}>
        {row.original.inStock ? "In stock" : "Out of stock"}
      </Badge>
    ),
  },
];

export function ProductList() {
  const navigate = useNavigate();
  const { user } = useAuth();

  const tableColumns = useMemo<DataTableColumnDef<Product>[]>(
    () => [
      ...columns,
      {
        id: "actions",
        header: () => <span className="sr-only">Actions</span>,
        cell: ({ row }) => (
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => navigate(row.original.id)}
            aria-label={`View details of ${row.original.name}`}
          >
            Details
          </Button>
        ),
      },
    ],
    [navigate],
  );

  return (
    <section>
      <h1 className="font-heading text-2xl font-bold tracking-tight">Catalog</h1>
      <p className="mb-4 text-sm text-muted-foreground">Welcome, {user.name}. Pick a product below.</p>
      <DataTable
        columns={tableColumns}
        data={products}
        getRowId={(product) => product.id}
        filterPlaceholder="Search products..."
        getSubRows={(product) => product.variants}
      />
    </section>
  );
}
