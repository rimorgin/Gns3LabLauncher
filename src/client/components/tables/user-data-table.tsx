import * as React from "react";
import {
  DndContext,
  KeyboardSensor,
  MouseSensor,
  TouchSensor,
  closestCenter,
  useSensor,
  useSensors,
  type DragEndEvent,
  type UniqueIdentifier,
} from "@dnd-kit/core";
import { restrictToVerticalAxis } from "@dnd-kit/modifiers";
import {
  SortableContext,
  arrayMove,
  useSortable,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import {
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
  GripVertical,
  User,
  User2,
  UserCheck,
  ArrowUpDown,
  ArrowUp,
  ArrowDown,
  Calendar,
} from "lucide-react";
import {
  ColumnDef,
  ColumnFiltersState,
  Row,
  SortingState,
  VisibilityState,
  flexRender,
  getCoreRowModel,
  getFacetedRowModel,
  getFacetedUniqueValues,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
  Column,
} from "@tanstack/react-table";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@clnt/components/ui/table";
import { Checkbox } from "@clnt/components/ui/checkbox";
import { Tabs, TabsContent } from "@clnt/components/ui/tabs";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@clnt/components/ui/dropdown-menu";
import { Button } from "@clnt/components/ui/button";
import {
  IconAt,
  IconChevronDown,
  IconDotsVertical,
  IconEdit,
  IconEye,
  IconLayoutColumns,
  IconPencilX,
  IconPlugConnected,
  IconPlugConnectedX,
  IconUserSearch,
} from "@tabler/icons-react";
import { Input } from "@clnt/components/ui/input";
import { useQueryClient } from "@tanstack/react-query";
import { useIsMobile } from "@clnt/hooks/use-mobile";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerOverlay,
  DrawerPortal,
  DrawerTitle,
} from "@clnt/components/ui/drawer";
import { UserDbData } from "@clnt/lib/validators/user-schema";
import { UserUpdateForm } from "@clnt/components/forms/user/user-update-form";
import { UserDeleteForm } from "@clnt/components/forms/user/user-delete-form";
import { Avatar, AvatarFallback } from "@clnt/components/ui/avatar";
import { Badge } from "@clnt/components/ui/badge";
import moment from "moment";
import { capitalizeFirstLetter, stringInitials } from "@clnt/lib/utils";

// Create a separate component for the drag handle
function DragHandle({ id }: { id: string }) {
  const { attributes, listeners } = useSortable({
    id,
  });

  return (
    <button
      {...attributes}
      {...listeners}
      className="text-gray-400 hover:text-gray-600 p-1 cursor-grab active:cursor-grabbing"
    >
      <GripVertical className="h-4 w-4" />
      <span className="sr-only">Drag to reorder</span>
    </button>
  );
}

// Sortable header component
function SortableHeader({
  column,
  children,
}: {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  column: Column<any, unknown>;
  children: React.ReactNode;
}) {
  if (!column.getCanSort()) {
    return <div className="flex items-center gap-2">{children}</div>;
  }

  return (
    <Button
      variant="ghost"
      className="flex items-center gap-2 px-0 h-auto font-medium hover:bg-transparent"
      onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
    >
      {children}
      <div className="flex flex-col">
        {column.getIsSorted() === "desc" ? (
          <ArrowDown className="h-4 w-4" />
        ) : column.getIsSorted() === "asc" ? (
          <ArrowUp className="h-4 w-4" />
        ) : (
          <ArrowUpDown className="h-4 w-4 opacity-50" />
        )}
      </div>
    </Button>
  );
}

const columns: ColumnDef<UserDbData>[] = [
  {
    id: "drag",
    header: () => null,
    cell: ({ row }) => <DragHandle id={row.original.id} />,
    size: 40,
    enableSorting: false,
  },
  {
    id: "select",
    header: ({ table }) => (
      <div className="flex items-center justify-center">
        <Checkbox
          checked={
            table.getIsAllPageRowsSelected() ||
            (table.getIsSomePageRowsSelected() && "indeterminate")
          }
          onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
          aria-label="Select all"
        />
      </div>
    ),
    cell: ({ row }) => (
      <div className="flex items-center justify-center">
        <Checkbox
          checked={row.getIsSelected()}
          onCheckedChange={(value) => row.toggleSelected(!!value)}
          aria-label="Select row"
        />
      </div>
    ),
    enableSorting: false,
    enableHiding: false,
    size: 40,
  },
  {
    accessorKey: "name",
    header: ({ column }) => (
      <SortableHeader column={column}>Name</SortableHeader>
    ),
    cell: ({ row }) => {
      return (
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center">
            <User className="h-4 w-4 text-blue-600" />
          </div>
          <div>
            <div className="font-medium">{row.original.name}</div>
            <div className="text-sm">{row.original.username}</div>
          </div>
        </div>
      );
    },
    enableHiding: false,
    sortingFn: "alphanumeric",
  },
  {
    accessorKey: "email",
    header: ({ column }) => (
      <SortableHeader column={column}>Email</SortableHeader>
    ),
    cell: ({ row }) => {
      return (
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-full bg-orange-100 flex items-center justify-center">
            <IconAt className="h-4 w-4 text-orange-600" />
          </div>
          <div className="font-medium">{row.original.email}</div>
        </div>
      );
    },
    sortingFn: "alphanumeric",
  },
  {
    accessorKey: "role",
    header: ({ column }) => (
      <SortableHeader column={column}>Role</SortableHeader>
    ),
    cell: ({ row }) => (
      <div className="inline-flex items-center gap-1">
        {row.original.role === "student" ? (
          <User className="h-4 w-4 text-green-500" />
        ) : (
          <UserCheck className="h-4 w-4 text-blue-500" />
        )}
        <span
          className={`px-2 py-1 text-xs font-medium rounded-full ${
            row.original.role === "student"
              ? "bg-green-100 text-green-800"
              : "bg-blue-100 text-blue-800"
          }`}
        >
          {capitalizeFirstLetter(row.original.role)}
        </span>
      </div>
    ),
    sortingFn: "alphanumeric",
  },
  {
    accessorKey: "isOnline",
    header: ({ column }) => (
      <SortableHeader column={column}>Status</SortableHeader>
    ),
    cell: ({ row }) => {
      const isOnline =
        row.original.student?.isOnline || row.original.instructor?.isOnline;
      return (
        <div className="inline-flex items-center gap-1">
          {isOnline ? (
            <IconPlugConnected color="green" />
          ) : (
            <IconPlugConnectedX color="red" />
          )}
          <span
            className={`px-2 py-1 text-xs font-medium rounded-full ${
              isOnline
                ? "bg-green-100 text-green-800"
                : "bg-red-100 text-red-800"
            }`}
          >
            {isOnline ? "Connected" : "Disconnected"}
          </span>
        </div>
      );
    },
    sortingFn: (rowA, rowB) => {
      const aOnline =
        rowA.original.student?.isOnline || rowA.original.instructor?.isOnline;
      const bOnline =
        rowB.original.student?.isOnline || rowB.original.instructor?.isOnline;

      if (aOnline && !bOnline) return 1;
      if (!aOnline && bOnline) return -1;
      return 0;
    },
  },
  {
    accessorKey: "createdAt",
    header: ({ column }) => (
      <SortableHeader column={column}>Created</SortableHeader>
    ),
    cell: ({ row }) => {
      return (
        <div className="flex items-center gap-2">
          <Calendar className="h-4 w-4 text-muted-foreground" />
          <span className="text-sm">
            {moment(row.original.createdAt).format("L")}
          </span>
        </div>
      );
    },
  },
  {
    accessorKey: "updatedAt",
    header: ({ column }) => (
      <SortableHeader column={column}>Updated At</SortableHeader>
    ),
    cell: ({ row }) => {
      return (
        <div className="flex items-center gap-2">
          <Calendar className="h-4 w-4 text-muted-foreground" />
          <span className="text-sm">
            {moment(row.original.updatedAt).format("L")}
          </span>
        </div>
      );
    },
  },
  {
    id: "actions",
    header: "Actions",
    cell: ({ row, table }) => {
      const [isDrawerOpen, toggleDrawer] = React.useState(false);
      const [drawerMode, setDrawerMode] = React.useState<
        "edit" | "view" | "delete"
      >("edit");
      return (
        <>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                className="data-[state=open]:bg-muted text-muted-foreground flex size-8"
                size="icon"
              >
                <IconDotsVertical />
                <span className="sr-only">Open menu</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-32">
              <DropdownMenuItem
                onClick={() => {
                  setDrawerMode("edit");
                  toggleDrawer(true);
                }}
              >
                <IconEdit />
                Edit
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => {
                  setDrawerMode("view");
                  toggleDrawer(true);
                }}
              >
                <IconEye />
                View More
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                variant="destructive"
                onClick={() => {
                  setDrawerMode("delete");
                  toggleDrawer(true);
                }}
              >
                <IconPencilX />
                Delete
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          {/* Drawer placed outside the dropdown, but controlled from it */}
          <TableCellViewer
            drawerMode={drawerMode}
            item={
              drawerMode === "edit" || drawerMode === "view"
                ? row.original
                : table.getSelectedRowModel().rows.length === 0
                  ? row.original
                  : table.getSelectedRowModel().rows.map((row) => row.original)
            }
            open={isDrawerOpen}
            setOpen={toggleDrawer}
          />
        </>
      );
    },
    enableSorting: false,
  },
];

function DraggableRow({ row }: { row: Row<UserDbData> }) {
  const { transform, transition, setNodeRef, isDragging } = useSortable({
    id: row.original.id,
  });

  return (
    <TableRow
      data-state={row.getIsSelected() && "selected"}
      data-dragging={isDragging}
      ref={setNodeRef}
      className="relative z-0 data-[dragging=true]:z-10 data-[dragging=true]:opacity-80"
      style={{
        transform: CSS.Transform.toString(transform),
        transition: transition,
      }}
    >
      {row.getVisibleCells().map((cell) => (
        <TableCell key={cell.id} className="px-4 py-3">
          {flexRender(cell.column.columnDef.cell, cell.getContext())}
        </TableCell>
      ))}
    </TableRow>
  );
}

function TableCellViewer({
  drawerMode,
  item,
  open,
  setOpen,
}: {
  drawerMode: "edit" | "view" | "delete";
  item: UserDbData | UserDbData[];
  open: boolean;
  setOpen: (open: boolean) => void;
}) {
  const isMobile = useIsMobile();
  const isArray = Array.isArray(item);
  const user = !isArray ? item : null;

  const title = (() => {
    if (drawerMode === "edit")
      return isArray ? "Edit Users" : `Edit ${user?.name || "User"}`;
    if (drawerMode === "view") return `View ${user?.name || "User"}`;
    if (drawerMode === "delete")
      return isArray
        ? `Delete ${item.length} Users`
        : `Delete ${user?.name || "User"}`;
    return "";
  })();

  const destructiveButtonTitle = drawerMode === "view" ? "Back" : "Cancel";

  const description = (() => {
    switch (drawerMode) {
      case "edit":
        return "Edit user details";
      case "view":
        return "Viewing user details";
      case "delete":
        return isArray
          ? "You're about to delete multiple users."
          : "You're about to delete this user.";
      default:
        return "";
    }
  })();

  return (
    <Drawer
      open={open}
      onOpenChange={setOpen}
      direction={isMobile ? "bottom" : "right"}
    >
      <DrawerPortal>
        <DrawerOverlay asChild className="fixed inset-0 bg-black/90" />
        <DrawerContent>
          <DrawerHeader className="gap-1">
            <DrawerTitle>{title}</DrawerTitle>
            <DrawerDescription>{description}</DrawerDescription>
          </DrawerHeader>
          <div className="flex flex-col gap-4 overflow-y-auto px-4 text-sm">
            {drawerMode === "view" && !isArray && user && (
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <Avatar className="h-16 w-16">
                    <AvatarFallback randomizeBg>
                      {user?.name ? (
                        stringInitials(user?.name)
                      ) : (
                        <User2 className="h-6 w-6" />
                      )}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    <h3 className="font-semibold text-lg">{user.name}</h3>
                    <p className="text-muted-foreground">{user.email}</p>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium">Role</label>
                    <p>{user.role}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium">Status</label>
                    <div className="mt-1">
                      <Badge
                        className={`${
                          user?.student?.isOnline || user?.instructor?.isOnline
                            ? "text-green-200 bg-green-600"
                            : "bg-destructive"
                        }`}
                      >
                        {user?.student?.isOnline || user?.instructor?.isOnline
                          ? "Online"
                          : "Offline"}
                      </Badge>
                    </div>
                  </div>
                </div>
                {(user?.student?.classrooms ||
                  user?.instructor?.classrooms) && (
                  <div>
                    <label className="text-sm font-medium">
                      Assigned to{" "}
                      {user.student
                        ? user.student.classrooms.length > 1
                          ? "Classrooms"
                          : "Classroom"
                        : user.instructor
                          ? user.instructor.classrooms.length > 1
                            ? "Classrooms"
                            : "Classroom"
                          : ""}
                    </label>
                    <ul className="mt-1 space-y-1">
                      {(
                        user.student?.classrooms ||
                        user.instructor?.classrooms ||
                        []
                      ).map((classroom, index) => (
                        <li
                          key={classroom.id}
                          className="flex items-center gap-2"
                        >
                          <Avatar className="h-6 w-6">
                            <AvatarFallback className="bg-blue-100 text-blue-600">
                              {index + 1}
                            </AvatarFallback>
                          </Avatar>
                          <span className="text-sm">
                            {`${classroom?.course?.courseCode}-${classroom?.course?.courseName}-${classroom?.classroomName}`}
                          </span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium">Created</label>
                    <p className="mt-1">
                      {moment(user.createdAt).format("llll")}
                    </p>
                  </div>
                  <div>
                    <label className="text-sm font-medium">Last Updated</label>
                    <p className="mt-1">
                      {moment(user.updatedAt).format("llll")}
                    </p>
                  </div>
                </div>
              </div>
            )}

            {drawerMode === "edit" && !isArray && user && (
              <UserUpdateForm initialData={user} />
            )}
            {drawerMode === "delete" && <UserDeleteForm initialData={item} />}
          </div>

          <DrawerFooter>
            <DrawerClose asChild>
              <Button variant="outline">{destructiveButtonTitle}</Button>
            </DrawerClose>
          </DrawerFooter>
        </DrawerContent>
      </DrawerPortal>
    </Drawer>
  );
}

export function UserDataTable({ data }: { data?: UserDbData[] }) {
  const [rowSelection, setRowSelection] = React.useState({});
  const [columnVisibility, setColumnVisibility] =
    React.useState<VisibilityState>({ createdAt: false, updatedAt: false });
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
    [],
  );
  const [sorting, setSorting] = React.useState<SortingState>([
    {
      id: "name",
      desc: false,
    },
  ]);
  const [pagination, setPagination] = React.useState({
    pageIndex: 0,
    pageSize: 10,
  });
  const queryClient = useQueryClient();
  const sensors = useSensors(
    useSensor(MouseSensor, {}),
    useSensor(TouchSensor, {}),
    useSensor(KeyboardSensor, {}),
  );

  const dataIds = React.useMemo<UniqueIdentifier[]>(
    () => data?.map(({ id }) => id) || [],
    [data],
  );

  const table = useReactTable({
    data: data ?? [],
    columns: columns,
    state: {
      sorting,
      columnVisibility,
      rowSelection,
      columnFilters,
      pagination,
    },
    getRowId: (row) => row.id,
    enableRowSelection: true,
    onRowSelectionChange: setRowSelection,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    onColumnVisibilityChange: setColumnVisibility,
    onPaginationChange: setPagination,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFacetedRowModel: getFacetedRowModel(),
    getFacetedUniqueValues: getFacetedUniqueValues(),
  });

  function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event;
    if (active && over && active.id !== over.id) {
      queryClient.setQueryData(["users"], (old) => {
        const oldData = Array.isArray(old) ? [...old] : [];
        const oldIndex = oldData.findIndex((u) => u.id === active.id);
        const newIndex = oldData.findIndex((u) => u.id === over.id);
        return arrayMove(oldData, oldIndex, newIndex);
      });
    }
  }

  return (
    <Tabs
      defaultValue="outline"
      className="w-full h-full flex-col justify-start gap-6"
    >
      <div className="flex items-center justify-between">
        <div>
          <IconUserSearch className="absolute m-1.5" />
          <Input
            type="text"
            placeholder="Search users..."
            className="pl-9"
            onChange={(e) => {
              table?.setGlobalFilter(e.target.value);
            }}
          />
        </div>
        <div className="flex items-center gap-2">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm">
                <IconDotsVertical />
                <span className="hidden lg:inline">
                  {capitalizeFirstLetter(
                    typeof table.getColumn("role")?.getFilterValue() ===
                      "string"
                      ? (table.getColumn("role")?.getFilterValue() as string)
                      : "Select Role",
                  )}
                </span>
                <IconChevronDown />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-32">
              <DropdownMenuItem
                onClick={() => table.getColumn("role")?.setFilterValue("")}
              >
                All Roles
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() =>
                  table.getColumn("role")?.setFilterValue("student")
                }
              >
                Students
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() =>
                  table.getColumn("role")?.setFilterValue("instructor")
                }
              >
                Instructor
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm">
                <IconLayoutColumns />
                <span className="hidden lg:inline">Customize Columns</span>
                <span className="lg:hidden">Columns</span>
                <IconChevronDown />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              {table
                .getAllColumns()
                .filter(
                  (column) =>
                    typeof column.accessorFn !== "undefined" &&
                    column.getCanHide(),
                )
                .map((column) => {
                  return (
                    <DropdownMenuCheckboxItem
                      key={column.id}
                      className="capitalize"
                      checked={column.getIsVisible()}
                      onCheckedChange={(value) =>
                        column.toggleVisibility(!!value)
                      }
                    >
                      {column.id}
                    </DropdownMenuCheckboxItem>
                  );
                })}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
      {/* Table */}
      <TabsContent
        value="outline"
        className="relative flex flex-col gap-4 overflow-auto"
      >
        <div className="overflow-hidden rounded-lg border h-full">
          <DndContext
            collisionDetection={closestCenter}
            modifiers={[restrictToVerticalAxis]}
            onDragEnd={handleDragEnd}
            sensors={sensors}
          >
            <div className="overflow-x-auto">
              <Table>
                <TableHeader className="bg-muted sticky top-0 z-10">
                  {table.getHeaderGroups().map((headerGroup) => (
                    <TableRow key={headerGroup.id}>
                      {headerGroup.headers.map((header) => (
                        <TableHead
                          key={header.id}
                          className="px-4 py-3 text-left text-xs font-medium bg-muted uppercase tracking-wider"
                          style={{ width: header.getSize() }}
                        >
                          {header.isPlaceholder
                            ? null
                            : flexRender(
                                header.column.columnDef.header,
                                header.getContext(),
                              )}
                        </TableHead>
                      ))}
                    </TableRow>
                  ))}
                </TableHeader>
                <TableBody className="**:data-[slot=table-cell]:first:w-8">
                  {table.getRowModel().rows?.length ? (
                    <SortableContext
                      items={dataIds}
                      strategy={verticalListSortingStrategy}
                    >
                      {table.getRowModel().rows.map((row) => (
                        <DraggableRow key={row.id} row={row} />
                      ))}
                    </SortableContext>
                  ) : (
                    <TableRow>
                      <TableCell
                        colSpan={columns.length}
                        className="text-center py-8 align-middle"
                      >
                        <div className="flex flex-col items-center justify-center gap-2 text-muted-foreground">
                          <User className="w-8 h-8" />
                          <p>No users found</p>
                        </div>
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </div>
          </DndContext>
        </div>
      </TabsContent>

      {/* Pagination */}
      <div className="flex items-center justify-between px-4 py-3 border-t bg-muted rounded-lg">
        <div className="flex items-center text-sm">
          {table.getFilteredSelectedRowModel().rows.length} of{" "}
          {table.getFilteredRowModel().rows.length} row(s) selected.
        </div>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <label className="text-sm">Rows per page:</label>
            <select
              className="border rounded px-2 py-1 text-sm"
              value={table.getState().pagination.pageSize}
              onChange={(e) => table.setPageSize(Number(e.target.value))}
            >
              {[10, 20, 30, 40, 50].map((pageSize) => (
                <option key={pageSize} value={pageSize}>
                  {pageSize}
                </option>
              ))}
            </select>
          </div>
          <div className="text-sm">
            Page {table.getState().pagination.pageIndex + 1} of{" "}
            {table.getPageCount()}
          </div>
          <div className="flex items-center gap-1">
            <button
              className="p-1 border rounded hover:bg-gray-100 disabled:opacity-50"
              onClick={() => table.setPageIndex(0)}
              disabled={!table.getCanPreviousPage()}
            >
              <ChevronsLeft className="h-4 w-4" />
            </button>
            <button
              className="p-1 border rounded hover:bg-gray-100 disabled:opacity-50"
              onClick={() => table.previousPage()}
              disabled={!table.getCanPreviousPage()}
            >
              <ChevronLeft className="h-4 w-4" />
            </button>
            <button
              className="p-1 border rounded hover:bg-gray-100 disabled:opacity-50"
              onClick={() => table.nextPage()}
              disabled={!table.getCanNextPage()}
            >
              <ChevronRight className="h-4 w-4" />
            </button>
            <button
              className="p-1 border rounded hover:bg-gray-100 disabled:opacity-50"
              onClick={() => table.setPageIndex(table.getPageCount() - 1)}
              disabled={!table.getCanNextPage()}
            >
              <ChevronsRight className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>
    </Tabs>
  );
}
