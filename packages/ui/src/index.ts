/*
 * Public API of @repo/ui. Apps must import from "@repo/ui" only: Module Federation shares this
 * entry as a singleton, whereas deep imports would not be shared between host and remotes.
 * Export every component added with `pnpm --filter @repo/ui ui:add <name>` here.
 */
export { cn } from "#lib/utils";

export { Avatar, AvatarFallback, AvatarImage } from "#components/avatar";
export { Badge, badgeVariants } from "#components/badge";
export { Button, buttonVariants } from "#components/button";
export {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "#components/card";
export {
  Command,
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
  CommandShortcut,
} from "#components/command";
export {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogOverlay,
  DialogPortal,
  DialogTitle,
  DialogTrigger,
} from "#components/dialog";
export {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "#components/dropdown-menu";
export { Input } from "#components/input";
export {
  InputGroup,
  InputGroupAddon,
  InputGroupButton,
  InputGroupInput,
  InputGroupText,
  InputGroupTextarea,
} from "#components/input-group";
export {
  Popover,
  PopoverContent,
  PopoverDescription,
  PopoverHeader,
  PopoverTitle,
  PopoverTrigger,
} from "#components/popover";
export { Separator } from "#components/separator";
export { Spinner } from "#components/spinner";
export {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from "#components/table";
export { Textarea } from "#components/textarea";
export { Toggle, toggleVariants } from "#components/toggle";

export { DataTable, DataTableColumnHeader } from "#components/data-table";
export type {
  DataTableColumnDef,
  DataTableColumnHeaderProps,
  DataTableColumnMeta,
  DataTableFeatures,
  DataTableProps,
} from "#components/data-table";

export { ErrorBoundary } from "#components/error-boundary";
export type { ErrorBoundaryProps } from "#components/error-boundary";
