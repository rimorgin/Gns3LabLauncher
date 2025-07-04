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
  BookOpen,
  Users,
  Calendar,
  Archive,
  Lock,
  CheckCircle,
  XCircle,
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
  IconChevronDown,
  IconDotsVertical,
  IconEdit,
  IconEye,
  IconLayoutColumns,
  IconPencilX,
  IconSearch,
  IconSubtask,
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
import { Badge } from "@clnt/components/ui/badge";
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@clnt/components/ui/avatar";

// Define the ClassroomData type
type ClassroomData = {
  id: string;
  classroomName: string;
  status: "active" | "expired" | "archived" | "locked";
  course: { courseCode: string; courseName?: string | null };
  instructor: { user: { name: string; email: string; username: string } };
  students: { user: { name: string; email: string; username: string } }[];
  projects: {
    projectName: string;
    projectDescription: string;
    visible: boolean;
  }[];
  imageUrl: string;
  createdAt: string;
  updatedAt: string;
};

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

// Status badge component
function StatusBadge({ status }: { status: ClassroomData["status"] }) {
  const getStatusConfig = (status: ClassroomData["status"]) => {
    switch (status) {
      case "active":
        return {
          icon: <CheckCircle className="h-3 w-3" />,
          className: "bg-green-100 text-green-800 border-green-200",
          label: "Active",
        };
      case "expired":
        return {
          icon: <XCircle className="h-3 w-3" />,
          className: "bg-red-100 text-red-800 border-red-200",
          label: "Expired",
        };
      case "archived":
        return {
          icon: <Archive className="h-3 w-3" />,
          className: "bg-gray-100 text-gray-800 border-gray-200",
          label: "Archived",
        };
      case "locked":
        return {
          icon: <Lock className="h-3 w-3" />,
          className: "bg-yellow-100 text-yellow-800 border-yellow-200",
          label: "Locked",
        };
      default:
        return {
          icon: null,
          className: "bg-gray-100 text-gray-800 border-gray-200",
          label: status,
        };
    }
  };

  const config = getStatusConfig(status);

  return (
    <Badge
      variant="outline"
      className={`inline-flex items-center gap-1 ${config.className}`}
    >
      {config.icon}
      {config.label}
    </Badge>
  );
}

const columns: ColumnDef<ClassroomData>[] = [
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
    accessorKey: "classroomName",
    header: "Classroom",
    cell: ({ row }) => {
      const classroom = row.original;
      return (
        <div className="flex items-center gap-3">
          <Avatar className="h-10 w-10">
            <AvatarImage
              src={classroom.imageUrl}
              alt={classroom.classroomName}
            />
            <AvatarFallback className="bg-blue-100 text-blue-600">
              <BookOpen className="h-4 w-4" />
            </AvatarFallback>
          </Avatar>
          <div className="min-w-0">
            <div className="font-medium truncate">
              {classroom.classroomName}
            </div>
            <div className="text-sm text-muted-foreground truncate">
              {classroom.course.courseCode}
              {classroom.course.courseName &&
                ` - ${classroom.course.courseName}`}
            </div>
          </div>
        </div>
      );
    },
    enableHiding: false,
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => <StatusBadge status={row.original.status} />,
    filterFn: (row, id, value) => {
      return value.includes(row.getValue(id));
    },
  },
  {
    accessorKey: "instructor",
    header: "Instructor",
    cell: ({ row }) => {
      const instructor = row.original.instructor.user;
      return (
        <div className="flex items-center gap-2">
          <Avatar className="h-8 w-8">
            <AvatarFallback className="bg-purple-100 text-purple-600 text-xs">
              {instructor.name
                .split(" ")
                .map((n) => n[0])
                .join("")
                .toUpperCase()}
            </AvatarFallback>
          </Avatar>
          <div className="min-w-0">
            <div className="font-medium truncate">{instructor.name}</div>
            <div className="text-sm text-muted-foreground truncate">
              {instructor.email}
            </div>
          </div>
        </div>
      );
    },
  },
  {
    accessorKey: "students",
    header: "Students",
    cell: ({ row }) => {
      const students = row.original.students;
      const studentCount = students.length;

      return (
        <div className="flex items-center gap-2">
          <Users className="h-4 w-4 text-muted-foreground" />
          <span className="font-medium">{studentCount}</span>
          <span className="text-sm text-muted-foreground">
            {studentCount === 1 ? "student" : "students"}
          </span>
        </div>
      );
    },
    sortingFn: (rowA, rowB) => {
      return rowA.original.students.length - rowB.original.students.length;
    },
  },
  {
    accessorKey: "projects",
    header: "Projects",
    cell: ({ row }) => {
      const projects = row.original.projects;
      const projectsCount = projects.length;

      return (
        <div className="flex items-center gap-2">
          <IconSubtask className="h-4 w-4 text-muted-foreground" />
          <span className="font-medium">{projectsCount}</span>
          <span className="text-sm text-muted-foreground">
            {projectsCount === 1 ? "project" : "projects"}
          </span>
        </div>
      );
    },
    sortingFn: (rowA, rowB) => {
      return rowA.original.projects.length - rowB.original.projects.length;
    },
  },
  {
    accessorKey: "createdAt",
    header: "Created",
    cell: ({ row }) => {
      const date = new Date(row.original.createdAt);
      return (
        <div className="flex items-center gap-2">
          <Calendar className="h-4 w-4 text-muted-foreground" />
          <span className="text-sm">{date.toLocaleDateString()}</span>
        </div>
      );
    },
  },
  {
    id: "actions",
    header: "Actions",
    cell: ({ row, table }) => {
      const [openDrawer, setOpenDrawer] = React.useState(false);
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
                  setOpenDrawer(true);
                }}
              >
                <IconEdit />
                Edit
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => {
                  setDrawerMode("view");
                  setOpenDrawer(true);
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
                  setOpenDrawer(true);
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
            open={openDrawer}
            setOpen={setOpenDrawer}
          />
        </>
      );
    },
  },
];

function DraggableRow({ row }: { row: Row<ClassroomData> }) {
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
  item: ClassroomData | ClassroomData[];
  open: boolean;
  setOpen: (open: boolean) => void;
}) {
  const isMobile = useIsMobile();
  const isArray = Array.isArray(item);
  const classroom = !isArray ? item : null;

  const title = (() => {
    if (drawerMode === "edit")
      return isArray
        ? "Edit Classrooms"
        : `Edit ${classroom?.classroomName || "Classroom"}`;
    if (drawerMode === "view")
      return `View ${classroom?.classroomName || "Classroom"}`;
    if (drawerMode === "delete")
      return isArray
        ? `Delete ${item.length} Classrooms`
        : `Delete ${classroom?.classroomName || "Classroom"}`;
    return "";
  })();

  const destructiveButtonTitle = drawerMode === "view" ? "Close" : "Cancel";

  const description = (() => {
    switch (drawerMode) {
      case "edit":
        return "Edit classroom details";
      case "view":
        return "Viewing classroom details";
      case "delete":
        return isArray
          ? "You're about to delete multiple classrooms."
          : "You're about to delete this classroom.";
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
          {drawerMode === "view" && !isArray && classroom && (
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <Avatar className="h-16 w-16">
                  <AvatarImage
                    src={classroom.imageUrl}
                    alt={classroom.classroomName}
                  />
                  <AvatarFallback className="bg-blue-100 text-blue-600">
                    <BookOpen className="h-6 w-6" />
                  </AvatarFallback>
                </Avatar>
                <div>
                  <h3 className="font-semibold text-lg">
                    {classroom.classroomName}
                  </h3>
                  <p className="text-muted-foreground">
                    {classroom.course.courseCode}
                  </p>
                  {classroom.course.courseName && (
                    <p className="text-sm text-muted-foreground">
                      {classroom.course.courseName}
                    </p>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium">Status</label>
                  <div className="mt-1">
                    <StatusBadge status={classroom.status} />
                  </div>
                </div>
                <div>
                  <label className="text-sm font-medium">Students</label>
                  <p className="mt-1">{classroom.students.length} enrolled</p>
                </div>
              </div>

              <div>
                <label className="text-sm font-medium">Instructor</label>
                <div className="mt-1 flex items-center gap-2">
                  <Avatar className="h-8 w-8">
                    <AvatarFallback className="bg-purple-100 text-purple-600 text-xs">
                      {classroom.instructor.user.name
                        .split(" ")
                        .map((n) => n[0])
                        .join("")
                        .toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="font-medium">
                      {classroom.instructor.user.name}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      {classroom.instructor.user.email}
                    </p>
                  </div>
                </div>
              </div>

              <div>
                <label className="text-sm font-medium">Created</label>
                <p className="mt-1">
                  {new Date(classroom.createdAt).toLocaleDateString()}
                </p>
              </div>

              <div>
                <label className="text-sm font-medium">Last Updated</label>
                <p className="mt-1">
                  {new Date(classroom.updatedAt).toLocaleDateString()}
                </p>
              </div>
            </div>
          )}

          {drawerMode === "edit" && !isArray && classroom && (
            <div className="space-y-4">
              <p className="text-muted-foreground">
                Classroom edit form would go here. You can create a
                ClassroomUpdateForm component similar to UserUpdateForm.
              </p>
            </div>
          )}

          {drawerMode === "delete" && (
            <div className="space-y-4">
              <p className="text-muted-foreground">
                Classroom delete form would go here. You can create a
                ClassroomDeleteForm component similar to UserDeleteForm.
              </p>
            </div>
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

export function ClassroomDataTable({ data }: { data?: ClassroomData[] }) {
  const [rowSelection, setRowSelection] = React.useState({});
  const [columnVisibility, setColumnVisibility] =
    React.useState<VisibilityState>({});
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
    [],
  );
  const [sorting, setSorting] = React.useState<SortingState>([]);
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
    initialState: {
      sorting: [
        {
          id: "classroomName",
          desc: false,
        },
      ],
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
      queryClient.setQueryData(["classrooms"], (old) => {
        const oldData = Array.isArray(old) ? [...old] : [];
        const oldIndex = oldData.findIndex((c) => c.id === active.id);
        const newIndex = oldData.findIndex((c) => c.id === over.id);
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
            placeholder="Search classrooms..."
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
                  {String(
                    table.getColumn("status")?.getFilterValue() || "All Status",
                  )}
                </span>
                <IconChevronDown />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-32">
              <DropdownMenuItem
                onClick={() => table.getColumn("status")?.setFilterValue("")}
              >
                All Status
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() =>
                  table.getColumn("status")?.setFilterValue("active")
                }
              >
                Active
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() =>
                  table.getColumn("status")?.setFilterValue("expired")
                }
              >
                Expired
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() =>
                  table.getColumn("status")?.setFilterValue("archived")
                }
              >
                Archived
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() =>
                  table.getColumn("status")?.setFilterValue("locked")
                }
              >
                Locked
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
                          <BookOpen className="w-8 h-8" />
                          <p>No classrooms found</p>
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
