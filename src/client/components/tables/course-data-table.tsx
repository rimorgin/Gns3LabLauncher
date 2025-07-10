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
  CheckCircle,
  Clock,
  AlertCircle,
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
  DrawerPortal,
  DrawerTitle,
} from "@clnt/components/ui/drawer";
import { Badge } from "@clnt/components/ui/badge";
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@clnt/components/ui/avatar";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@clnt/components/ui/tooltip";
import { CourseDbData } from "@clnt/lib/validators/course-schema";
import { CourseUpdateForm } from "../forms/course/course-update-form";
import { CourseDeleteForm } from "../forms/course/course-delete-form";

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
function StatusBadge({ status }: { status: string }) {
  const getStatusConfig = (status: string) => {
    const normalizedStatus = status.toLowerCase();

    if (normalizedStatus === "active") {
      return {
        icon: <CheckCircle className="h-3 w-3" />,
        className: "bg-green-100 text-green-800 border-green-200",
        label: "Active",
      };
    } else if (
      normalizedStatus === "inactive" ||
      normalizedStatus === "disabled"
    ) {
      return {
        icon: <AlertCircle className="h-3 w-3" />,
        className: "bg-red-100 text-red-800 border-red-200",
        label: "Inactive",
      };
    } else if (normalizedStatus === "pending") {
      return {
        icon: <Clock className="h-3 w-3" />,
        className: "bg-yellow-100 text-yellow-800 border-yellow-200",
        label: "Pending",
      };
    } else {
      return {
        icon: <AlertCircle className="h-3 w-3" />,
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

// Classrooms component
function ClassroomsList({
  classrooms,
}: {
  classrooms: CourseDbData["classrooms"];
}) {
  if (!classrooms || classrooms.length === 0) {
    return (
      <div className="flex items-center gap-2 text-muted-foreground">
        <Users className="h-4 w-4" />
        <span className="text-sm">No classrooms</span>
      </div>
    );
  }

  const activeClassrooms = classrooms.filter(
    (c) => c.status.toLowerCase() === "active",
  );
  const totalClassrooms = classrooms.length;

  return (
    <div className="flex items-center gap-2">
      <Users className="h-4 w-4 text-muted-foreground" />
      <span className="text-sm">
        {activeClassrooms.length}/{totalClassrooms} active
      </span>
      {totalClassrooms > 0 && (
        <Tooltip>
          <TooltipTrigger>
            <Badge variant="secondary" className="text-xs">
              {totalClassrooms}
            </Badge>
          </TooltipTrigger>
          <TooltipContent>
            <div className="space-y-1 bg-muted ">
              {classrooms.slice(0, 3).map((classroom) => (
                <div
                  key={classroom.id}
                  className="flex items-center gap-2 text-xs"
                >
                  <StatusBadge status={classroom.status} />
                  <span>{classroom.classroomName}</span>
                </div>
              ))}
              {classrooms.length > 3 && (
                <div className="text-xs text-muted-foreground">
                  +{classrooms.length - 3} more
                </div>
              )}
            </div>
          </TooltipContent>
        </Tooltip>
      )}
    </div>
  );
}

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

const columns: ColumnDef<CourseDbData>[] = [
  {
    id: "drag",
    header: () => null,
    cell: ({ row }) => <DragHandle id={row.original.courseCode} />,
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
    accessorKey: "courseCode",
    header: ({ column }) => (
      <SortableHeader column={column}>Course Code</SortableHeader>
    ),
    cell: ({ row }) => {
      const course = row.original;
      return (
        <div className="flex items-center gap-3">
          <Avatar className="h-10 w-10">
            <AvatarImage src={course.imageUrl} alt={course.courseName} />
            <AvatarFallback className="bg-blue-100 text-blue-600">
              <BookOpen className="h-4 w-4" />
            </AvatarFallback>
          </Avatar>
          <div className="min-w-0 flex-1">
            <div className="font-medium text-sm">{course.courseCode}</div>
            <div className="text-xs text-muted-foreground truncate">
              {course.courseName}
            </div>
          </div>
        </div>
      );
    },
    enableHiding: false,
  },
  {
    accessorKey: "courseName",
    header: ({ column }) => (
      <SortableHeader column={column}>Course Name</SortableHeader>
    ),
    cell: ({ row }) => {
      const course = row.original;
      return (
        <div className="min-w-0">
          <div className="font-medium truncate">{course.courseName}</div>
          <div className="text-xs text-muted-foreground">
            Code: {course.courseCode}
          </div>
        </div>
      );
    },
  },
  {
    accessorKey: "classrooms",
    header: ({ column }) => (
      <SortableHeader column={column}>Classrooms</SortableHeader>
    ),
    cell: ({ row }) => <ClassroomsList classrooms={row.original.classrooms} />,
    sortingFn: (rowA, rowB) => {
      const classroomsA = rowA.original.classrooms?.length || 0;
      const classroomsB = rowB.original.classrooms?.length || 0;
      return classroomsA - classroomsB;
    },
  },
  {
    id: "activeClassrooms",
    header: ({ column }) => (
      <SortableHeader column={column}>Active Classrooms</SortableHeader>
    ),
    cell: ({ row }) => {
      const activeCount =
        row.original.classrooms?.filter(
          (c) => c.status.toLowerCase() === "active",
        ).length || 0;

      return (
        <div className="flex items-center gap-2">
          <CheckCircle className="h-4 w-4 text-green-500" />
          <span className="text-sm font-medium">{activeCount}</span>
        </div>
      );
    },
    sortingFn: (rowA, rowB) => {
      const activeA =
        rowA.original.classrooms?.filter(
          (c) => c.status.toLowerCase() === "active",
        ).length || 0;
      const activeB =
        rowB.original.classrooms?.filter(
          (c) => c.status.toLowerCase() === "active",
        ).length || 0;
      return activeA - activeB;
    },
  },
  /* {
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
  }, */
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

function DraggableRow({ row }: { row: Row<CourseDbData> }) {
  const { transform, transition, setNodeRef, isDragging } = useSortable({
    id: row.original.courseCode,
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
  item: CourseDbData | CourseDbData[];
  open: boolean;
  setOpen: (open: boolean) => void;
}) {
  const isMobile = useIsMobile();
  const isArray = Array.isArray(item);
  const course = !isArray ? item : null;

  const title = (() => {
    if (drawerMode === "edit")
      return isArray
        ? "Edit Courses"
        : `Edit ${course?.courseName || "Course"}`;
    if (drawerMode === "view") return `View ${course?.courseName || "Course"}`;
    if (drawerMode === "delete")
      return isArray
        ? `Delete ${item.length} Courses`
        : `Delete ${course?.courseName || "Course"}`;
    return "";
  })();

  const destructiveButtonTitle = drawerMode === "view" ? "Close" : "Cancel";

  const description = (() => {
    switch (drawerMode) {
      case "edit":
        return "Edit course details";
      case "view":
        return "Viewing course details";
      case "delete":
        return isArray
          ? "You're about to delete multiple courses."
          : "You're about to delete this course.";
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
        <DrawerContent>
          <DrawerHeader className="gap-1">
            <DrawerTitle>{title}</DrawerTitle>
            <DrawerDescription>{description}</DrawerDescription>
          </DrawerHeader>

          <div className="flex flex-col gap-4 overflow-y-auto px-4 text-sm">
            {drawerMode === "view" && !isArray && course && (
              <div className="space-y-4">
                {/* <pre className="bg-muted p-4 rounded-lg text-xs overflow-auto">
                  {JSON.stringify(course, null, 2)}
                </pre> */}
                <div className="flex items-center gap-3">
                  <Avatar className="h-16 w-16">
                    <AvatarImage
                      src={course.imageUrl}
                      alt={course.courseName}
                    />
                    <AvatarFallback className="bg-blue-100 text-blue-600">
                      <BookOpen className="h-6 w-6" />
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    <h3 className="font-semibold text-lg">
                      {course.courseName}
                    </h3>
                    <p className="text-muted-foreground">
                      Code: {course.courseCode}
                    </p>
                  </div>
                </div>

                <div>
                  <label className="text-sm font-medium">
                    Classrooms ({course.classrooms?.length || 0})
                  </label>
                  {course.classrooms && course.classrooms.length > 0 ? (
                    <ul className="mt-2 space-y-2">
                      {course.classrooms.map((classroom) => (
                        <li
                          key={classroom.id}
                          className="flex items-center justify-between p-2 border rounded-lg"
                        >
                          <div className="flex items-center gap-2">
                            <Avatar className="h-6 w-6">
                              <AvatarFallback className="bg-purple-100 text-purple-600 text-xs">
                                {classroom.classroomName.charAt(0)}
                              </AvatarFallback>
                            </Avatar>
                            <span className="text-sm font-medium">
                              {classroom.classroomName}
                            </span>
                          </div>
                          <StatusBadge status={classroom.status} />
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <div className="mt-2 text-center py-4 text-muted-foreground">
                      <Users className="h-8 w-8 mx-auto mb-2" />
                      <p>No classrooms assigned</p>
                    </div>
                  )}
                </div>
              </div>
            )}

            {drawerMode === "edit" && !isArray && course && (
              <CourseUpdateForm initialData={course} />
            )}

            {drawerMode === "delete" && <CourseDeleteForm initialData={item} />}
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

export function CourseDataTable({ data }: { data?: CourseDbData[] }) {
  const [rowSelection, setRowSelection] = React.useState({});
  const [columnVisibility, setColumnVisibility] =
    React.useState<VisibilityState>({ createdAt: false, updatedAt: false });
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
    [],
  );
  const [sorting, setSorting] = React.useState<SortingState>([
    {
      id: "courseCode",
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
    () => data?.map(({ courseCode }) => courseCode) || [],
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
    getRowId: (row) => row.courseCode,
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
      queryClient.setQueryData(["courses"], (old) => {
        const oldData = Array.isArray(old) ? [...old] : [];
        const oldIndex = oldData.findIndex((c) => c.courseCode === active.id);
        const newIndex = oldData.findIndex((c) => c.courseCode === over.id);
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
            placeholder="Search courses..."
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
                          <BookOpen className="w-8 h-8" />
                          <p>No courses found</p>
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
