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
  Users,
  User,
  BookOpen,
  Calendar,
  ArrowDown,
  ArrowUp,
  ArrowUpDown,
} from "lucide-react";
import {
  Column,
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
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuCheckboxItem,
  DropdownMenuSeparator,
} from "@clnt/components/ui/dropdown-menu";
import { Button } from "@clnt/components/ui/button";
import {
  IconChevronDown,
  IconDotsVertical,
  IconEdit,
  IconEye,
  IconLayoutColumns,
  IconPencilX,
  IconSearch,
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
  DrawerTitle,
} from "@clnt/components/ui/drawer";
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@clnt/components/ui/avatar";
import { UserGroupDbData } from "@clnt/lib/validators/user-group-schema";
import { stringInitials } from "@clnt/lib/utils";
import moment from "moment";
import { UserGroupUpdateForm } from "../forms/usergroup/user-group-update-form";
import { UserGroupDeleteForm } from "../forms/usergroup/user-group-delete-form";

function LimitListCell({ userGroup }: { userGroup: UserGroupDbData }) {
  const totalUsers = userGroup?.student?.length || 0;
  const userGroupLimit = userGroup.limit;
  if (userGroupLimit === 0) {
    return (
      <div className="flex items-center gap-2 text-muted-foreground">
        <Users className="h-4 w-4" />
        <span className="text-sm">No user group limit</span>
      </div>
    );
  }

  return (
    <div className="flex items-center gap-2">
      <Users className="h-4 w-4 text-muted-foreground" />
      <span className="text-sm">
        {totalUsers}/{userGroupLimit} students
      </span>
    </div>
  );
}

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

const columns: ColumnDef<UserGroupDbData>[] = [
  {
    id: "drag",
    header: () => null,
    cell: ({ row }) => <DragHandle id={row.original.id} />,
    size: 40,
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
    accessorKey: "groupName",
    header: ({ column }) => (
      <SortableHeader column={column}>Group Name</SortableHeader>
    ),
    cell: ({ row }) => {
      const group = row.original;
      return (
        <div className="flex items-center gap-3">
          <Avatar className="h-10 w-10">
            <AvatarImage src={group.imageUrl} alt={group.groupName} />
            <AvatarFallback className="bg-blue-100 text-blue-600">
              <Users className="h-6 w-6" />
            </AvatarFallback>
          </Avatar>
          <div className="min-w-0">
            <div className="font-medium truncate">{group.groupName}</div>
            <div className="text-sm text-muted-foreground truncate">
              Group ID: {group.id}
            </div>
          </div>
        </div>
      );
    },
    enableHiding: false,
  },
  {
    accessorKey: "classroom",
    header: ({ column }) => (
      <SortableHeader column={column}>Classroom</SortableHeader>
    ),
    cell: ({ row }) => {
      const classroom = row.original.classrooms;
      if (!classroom) {
        return (
          <div className="text-sm text-muted-foreground">
            No classroom assigned
          </div>
        );
      }

      return (
        <div className="flex items-center gap-2">
          <BookOpen className="h-4 w-4 text-muted-foreground" />
          <div className="min-w-0">
            <div className="font-medium truncate">
              {classroom.classroomName}
            </div>
            {classroom.course && (
              <div className="text-sm text-muted-foreground truncate">
                {classroom.course.courseCode}
                {classroom.course.courseName &&
                  ` - ${classroom.course.courseName}`}
              </div>
            )}
          </div>
        </div>
      );
    },
    sortingFn: (rowA, rowB) => {
      const a = rowA.original.classrooms?.classroomName || "";
      const b = rowB.original.classrooms?.classroomName || "";
      return a.localeCompare(b);
    },
  },
  {
    accessorKey: "limit",
    header: ({ column }) => (
      <SortableHeader column={column}>Limit</SortableHeader>
    ),
    cell: ({ row }) => <LimitListCell userGroup={row.original} />,
  },
  {
    accessorKey: "students",
    header: ({ column }) => (
      <SortableHeader column={column}>Students</SortableHeader>
    ),
    cell: ({ row }) => {
      const students = row.original.student || [];
      const studentCount = students.length;

      return (
        <div className="flex items-center gap-2">
          <User className="h-4 w-4 text-muted-foreground" />
          <span className="font-medium">{studentCount}</span>
          <span className="text-sm text-muted-foreground">
            {studentCount === 1 ? "student" : "students"}
          </span>
        </div>
      );
    },
    sortingFn: (rowA, rowB) => {
      const a = rowA.original.student?.length || 0;
      const b = rowB.original.student?.length || 0;
      return a - b;
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
                View Details
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
  },
];

function DraggableRow({ row }: { row: Row<UserGroupDbData> }) {
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
  item: UserGroupDbData | UserGroupDbData[];
  open: boolean;
  setOpen: (open: boolean) => void;
}) {
  const isMobile = useIsMobile();
  const isArray = Array.isArray(item);
  const group = !isArray ? item : null;

  const title = (() => {
    if (drawerMode === "edit")
      return isArray
        ? "Edit User Groups"
        : `Edit ${group?.groupName || "User Group"}`;
    if (drawerMode === "view")
      return `View ${group?.groupName || "User Group"}`;
    if (drawerMode === "delete")
      return isArray
        ? `Delete ${item.length} User Groups`
        : `Delete ${group?.groupName || "User Group"}`;
    return "";
  })();

  const destructiveButtonTitle = drawerMode === "view" ? "Close" : "Cancel";

  const description = (() => {
    switch (drawerMode) {
      case "edit":
        return "Edit user group details";
      case "view":
        return "Viewing user group details";
      case "delete":
        return isArray
          ? "You're about to delete multiple user groups."
          : "You're about to delete this user group.";
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
      <DrawerContent>
        <DrawerHeader className="gap-1">
          <DrawerTitle>{title}</DrawerTitle>
          <DrawerDescription>{description}</DrawerDescription>
        </DrawerHeader>

        <div className="flex flex-col gap-4 overflow-y-auto px-4 text-sm">
          {drawerMode === "view" && !isArray && group && (
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <Avatar className="h-16 w-16">
                  <AvatarImage src={group.imageUrl} alt={group.groupName} />
                  <AvatarFallback randomizeBg>
                    <Users className="h-6 w-6" />
                  </AvatarFallback>
                </Avatar>
                <div>
                  <h3 className="font-semibold text-lg">{group.groupName}</h3>
                  <p className="text-muted-foreground">Group ID: {group.id}</p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium">Students</label>
                  <p className="mt-1">{group.student?.length || 0} members</p>
                </div>
                <div>
                  <label className="text-sm font-medium">Classroom</label>
                  <p className="mt-1">
                    {group.classrooms?.classroomName || "No classroom assigned"}
                  </p>
                </div>
              </div>

              {group.classrooms && (
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium">
                      Course Details
                    </label>
                    <div className="mt-1 space-y-1">
                      <p className="flex flex-row">
                        {group.classrooms.classroomName}-
                        {group.classrooms?.course?.courseCode}-
                        {group.classrooms?.course?.courseName}
                      </p>
                    </div>
                  </div>
                  <div>
                    <label className="text-sm font-medium">Group Limit</label>
                    <div className="mt-1 space-y-1">
                      <LimitListCell userGroup={group} />
                    </div>
                  </div>
                </div>
              )}

              {group.student && group.student.length > 0 && (
                <div>
                  <label className="text-sm font-medium">Group Members</label>
                  <div className="mt-2 space-y-2">
                    {group.student.map((student) => (
                      <div
                        key={student.userId}
                        className="flex items-center gap-2"
                      >
                        <Avatar className="h-8 w-8">
                          <AvatarFallback randomizeBg className="text-xs">
                            {student.user.name
                              ? stringInitials(student.user.name)
                              : student.user.username.slice(0, 2).toUpperCase()}
                          </AvatarFallback>
                        </Avatar>
                        <div className="min-w-0">
                          <p className="font-medium">
                            {student.user.name || student.user.username}
                          </p>
                          <p className="text-sm text-muted-foreground">
                            {student.user.email}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium">Created</label>
                  <p className="mt-1">
                    {moment(group.createdAt).format("llll")}
                  </p>
                </div>

                <div>
                  <label className="text-sm font-medium">Last Updated</label>
                  <p className="mt-1">
                    {moment(group.updatedAt).format("llll")}
                  </p>
                </div>
              </div>
            </div>
          )}

          {drawerMode === "edit" && !isArray && group && (
            <UserGroupUpdateForm initialData={group} />
          )}

          {drawerMode === "delete" && (
            <UserGroupDeleteForm initialData={item} />
          )}
        </div>

        <DrawerFooter>
          <DrawerClose asChild>
            <Button variant="outline">{destructiveButtonTitle}</Button>
          </DrawerClose>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  );
}

export function UserGroupDataTable({ data }: { data?: UserGroupDbData[] }) {
  const [rowSelection, setRowSelection] = React.useState({});
  const [columnVisibility, setColumnVisibility] =
    React.useState<VisibilityState>({ createdAt: false, updatedAt: false });
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
    [],
  );
  const [sorting, setSorting] = React.useState<SortingState>([
    {
      id: "groupName",
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
      queryClient.setQueryData(["userGroups"], (old) => {
        const oldData = Array.isArray(old) ? [...old] : [];
        const oldIndex = oldData.findIndex((g) => g.id === active.id);
        const newIndex = oldData.findIndex((g) => g.id === over.id);
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
        <div className="relative">
          <IconSearch className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            type="text"
            placeholder="Search user groups..."
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
                <TableBody>
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
                          <Users className="w-8 h-8" />
                          <p>No user groups found</p>
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
