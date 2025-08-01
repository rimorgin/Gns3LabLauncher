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
  ArrowDown,
  ArrowUp,
  ArrowUpDown,
  List,
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
  IconSubtask,
  IconTable,
  IconWorldWww,
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
import { ClassroomDbData } from "@clnt/lib/validators/classroom-schema";
import moment from "moment";
import { ClassroomDeleteForm } from "@clnt/components/forms/classroom/classroom-delete-form";
import { ClassroomUpdateForm } from "../forms/classroom/classroom-update-form";
import { NavLink } from "react-router";
import { ClassroomList } from "../cards/classroom-cards";

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
function StatusBadge({ status }: { status: ClassroomDbData["status"] }) {
  const getStatusConfig = (status: ClassroomDbData["status"]) => {
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

const columns: ColumnDef<ClassroomDbData>[] = [
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
    header: ({ column }) => (
      <SortableHeader column={column}>Classroom</SortableHeader>
    ),
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
    header: ({ column }) => (
      <SortableHeader column={column}>Status</SortableHeader>
    ),
    cell: ({ row }) => <StatusBadge status={row.original.status} />,
    filterFn: (row, id, value) => {
      return value.includes(row.getValue(id));
    },
  },
  {
    accessorKey: "instructor",
    header: ({ column }) => (
      <SortableHeader column={column}>Instructor</SortableHeader>
    ),
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
    sortingFn: (rowA, rowB) => {
      const nameA = rowA.original.instructor.user.name.toLowerCase();
      const nameB = rowB.original.instructor.user.name.toLowerCase();
      if (nameA < nameB) return -1;
      if (nameA > nameB) return 1;
      return 0;
    },
    filterFn: (row, columnId, filterValue) => {
      const instructor = row.original.instructor.user;
      const name = instructor.name?.toLowerCase() || "";
      const email = instructor.email?.toLowerCase() || "";
      const query = String(filterValue).toLowerCase();

      return name.includes(query) || email.includes(query);
    },
  },
  {
    accessorKey: "students",
    header: ({ column }) => (
      <SortableHeader column={column}>Students</SortableHeader>
    ),
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
    header: ({ column }) => (
      <SortableHeader column={column}>Projects</SortableHeader>
    ),
    cell: ({ row }) => {
      const projects = row.original.projects ?? [];
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
    header: ({ column }) => (
      <SortableHeader column={column}>Created At</SortableHeader>
    ),
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
    accessorKey: "updatedAt",
    header: ({ column }) => (
      <SortableHeader column={column}>Updated At</SortableHeader>
    ),
    cell: ({ row }) => {
      const date = new Date(row.original.updatedAt);
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
            <DropdownMenuContent align="end" className="w-fit">
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
              <DropdownMenuItem>
                <NavLink
                  to={`classrooms/${row.original.id}`}
                  className="flex gap-2"
                >
                  <IconWorldWww />
                  View Full Details in Page
                </NavLink>
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

function DraggableRow({ row }: { row: Row<ClassroomDbData> }) {
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
  item: ClassroomDbData | ClassroomDbData[];
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
      <DrawerPortal>
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
                      {classroom.course.courseCode}-
                      {classroom.course.courseName}
                    </p>
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

                {classroom.projects && (
                  <div>
                    {classroom.projects.length > 1 ? (
                      <>
                        <label className="text-sm font-medium">
                          Assigned to Projects
                        </label>
                        <ul className="mt-1 space-y-1">
                          {classroom.projects.map((project, index) => (
                            <li
                              key={project.id}
                              className="flex items-center gap-2"
                            >
                              <Avatar className="h-8 w-8  ">
                                <AvatarFallback className="bg-blue-100 text-blue-600">
                                  {index + 1}
                                </AvatarFallback>
                              </Avatar>
                              <div className="flex flex-row gap-2 justify-between">
                                <span className="text-sm font-medium">
                                  {project.projectName}
                                  <p className="text-sm text-muted-foreground">
                                    {project.projectDescription}
                                  </p>
                                  {project.duration && (
                                    <p className="text-red-200 text-sm">
                                      until{" "}
                                      {moment(project.duration).format("llll")}
                                    </p>
                                  )}
                                </span>
                              </div>
                              <Badge
                                className="h-6 ml-3"
                                variant={
                                  project.visible ? "default" : "destructive"
                                }
                              >
                                {project.visible ? "visible" : "hidden"}
                              </Badge>
                            </li>
                          ))}
                        </ul>
                      </>
                    ) : (
                      <label className="text-sm font-medium">
                        No Projects Assigned
                      </label>
                    )}
                  </div>
                )}

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium">Created</label>
                    <p className="mt-1">
                      {moment(classroom.createdAt).format("llll")}
                    </p>
                  </div>
                  <div>
                    <label className="text-sm font-medium">Last Updated</label>
                    <p className="mt-1">
                      {moment(classroom.updatedAt).format("llll")}
                    </p>
                  </div>
                </div>
              </div>
            )}

            {drawerMode === "edit" && !isArray && classroom && (
              <ClassroomUpdateForm initialData={classroom} />
            )}

            {drawerMode === "delete" && (
              <ClassroomDeleteForm initialData={item} />
            )}
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

export function ClassroomDataTable({ data }: { data?: ClassroomDbData[] }) {
  const [viewMode, setViewMode] = React.useState<"table" | "cards">("table");
  const [rowSelection, setRowSelection] = React.useState({});
  const [columnVisibility, setColumnVisibility] =
    React.useState<VisibilityState>({ createdAt: false, updatedAt: false });
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
    [],
  );
  const [sorting, setSorting] = React.useState<SortingState>([
    {
      id: "classroomName",
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
      queryClient.setQueryData(
        [
          "classrooms",
          {
            includes: ["course", "instructor", "projects", "students"],
            only_ids: false,
          },
          ["course", "instructor", "projects", "students"],
        ],
        (old) => {
          const oldData = Array.isArray(old) ? [...old] : [];
          const oldIndex = oldData.findIndex((c) => c.id === active.id);
          const newIndex = oldData.findIndex((c) => c.id === over.id);
          return arrayMove(oldData, oldIndex, newIndex);
        },
      );
    }
  }

  console.log(
    "filteredRows",
    table.getFilteredRowModel().rows.map((row) => row.original),
  );

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
          {viewMode === "table" && (
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
          )}
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
          <div className="flex border rounded-md">
            <Button
              variant={viewMode === "table" ? "default" : "ghost"}
              size="sm"
              onClick={() => setViewMode("table")}
              className="rounded-r-none"
            >
              <IconTable className="h-4 w-4" />
            </Button>
            <Button
              variant={viewMode === "cards" ? "default" : "ghost"}
              size="sm"
              onClick={() => setViewMode("cards")}
              className="rounded-l-none"
            >
              <List className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>

      {/* Table */}
      {viewMode === "table" ? (
        <>
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
        </>
      ) : (
        <ClassroomList
          classrooms={table
            .getFilteredRowModel()
            .rows.map((row) => row.original)}
        />
      )}
    </Tabs>
  );
}
