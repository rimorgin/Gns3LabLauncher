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
  FolderOpen,
  Calendar,
  Clock,
  Eye,
  EyeOff,
  Tag,
  CheckCircle,
  Circle,
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
import { Progress } from "@clnt/components/ui/progress";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@clnt/components/ui/tooltip";
import { ProjectDbData } from "@clnt/lib/validators/projects-schema";
import moment from "moment";
import { ProjectUpdateForm } from "../forms/project/project-update-form";
import { ProjectDeleteForm } from "../forms/project/project-delete-form";

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

// Progress indicator component
function ProgressIndicator({ progress }: { progress?: number }) {
  const progressValue = progress || 0;

  const getProgressConfig = (progress: number) => {
    if (progress === 100) {
      return {
        icon: <CheckCircle className="h-4 w-4 text-green-500" />,
        className: "text-green-600",
        label: "Complete",
      };
    } else if (progress >= 75) {
      return {
        icon: <AlertCircle className="h-4 w-4 text-blue-500" />,
        className: "text-blue-600",
        label: "Near Complete",
      };
    } else if (progress >= 25) {
      return {
        icon: <Circle className="h-4 w-4 text-yellow-500" />,
        className: "text-yellow-600",
        label: "In Progress",
      };
    } else {
      return {
        icon: <Circle className="h-4 w-4 text-gray-500" />,
        className: "text-gray-600",
        label: "Started",
      };
    }
  };

  const config = getProgressConfig(progressValue);

  return (
    <div className="flex items-center gap-2 min-w-0">
      <div className="flex items-center gap-1">
        {config.icon}
        <span className={`text-sm font-medium ${config.className}`}>
          {progressValue}%
        </span>
      </div>
      <div className="flex-1 min-w-0">
        <Progress value={progressValue} className="h-2" />
      </div>
    </div>
  );
}

// Visibility badge component
function VisibilityBadge({ visible }: { visible: boolean }) {
  return (
    <Badge
      variant="outline"
      className={`inline-flex items-center gap-1 ${
        visible
          ? "bg-green-100 text-green-800 border-green-200"
          : "bg-gray-100 text-gray-800 border-gray-200"
      }`}
    >
      {visible ? <Eye className="h-3 w-3" /> : <EyeOff className="h-3 w-3" />}
      {visible ? "Visible" : "Hidden"}
    </Badge>
  );
}

// Tags component
function ProjectTags({ tags }: { tags?: string }) {
  if (!tags) return null;

  const tagList = tags
    .split(",")
    .map((tag) => tag.trim())
    .filter(Boolean);

  if (tagList.length === 0) return null;

  return (
    <div className="flex items-center gap-1 flex-wrap">
      <Tag className="h-3 w-3 text-muted-foreground" />
      {tagList.slice(0, 2).map((tag, index) => (
        <Badge key={index} variant="secondary" className="text-xs">
          {tag}
        </Badge>
      ))}
      {tagList.length > 2 && (
        <Badge variant="secondary" className="text-xs">
          +{tagList.length - 2}
        </Badge>
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

const columns: ColumnDef<ProjectDbData>[] = [
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
    accessorKey: "projectName",
    header: ({ column }) => (
      <SortableHeader column={column}>Project</SortableHeader>
    ),
    cell: ({ row }) => {
      const project = row.original;
      const [onExpand, setOnExpand] = React.useState(false);
      return (
        <div className="flex items-center gap-3">
          <Avatar className="h-10 w-10">
            <AvatarImage src={project.imageUrl} alt={project.projectName} />
            <AvatarFallback className="bg-purple-100 text-purple-600">
              <FolderOpen className="h-4 w-4" />
            </AvatarFallback>
          </Avatar>
          <div className="min-w-0 flex-1">
            <div className="font-medium truncate">{project.projectName}</div>
            {project.projectDescription && (
              <Tooltip>
                <TooltipTrigger onClick={() => setOnExpand(!onExpand)}>
                  <details className="max-w-xs text-sm text-muted-foreground text-wrap text-left">
                    <summary className="truncate cursor-pointer select-none">
                      {project.projectDescription}
                    </summary>
                    <div className="mt-1">{project.projectDescription}</div>
                  </details>
                </TooltipTrigger>
                <TooltipContent side="left">
                  {onExpand ? "Collapse" : "Expand"}
                </TooltipContent>
              </Tooltip>
            )}
            <ProjectTags tags={project.tags} />
          </div>
        </div>
      );
    },
    enableHiding: false,
  },
  {
    accessorKey: "progress",
    header: ({ column }) => (
      <SortableHeader column={column}>Progress</SortableHeader>
    ),
    cell: ({ row }) => <ProgressIndicator progress={row.original.progress} />,
    sortingFn: (rowA, rowB) => {
      const progressA = rowA.original.progress || 0;
      const progressB = rowB.original.progress || 0;
      return progressA - progressB;
    },
  },
  {
    accessorKey: "visible",
    header: ({ column }) => (
      <SortableHeader column={column}>Visibility</SortableHeader>
    ),
    cell: ({ row }) => <VisibilityBadge visible={row.original.visible} />,
    filterFn: (row, id, value) => {
      return value.includes(row.getValue(id));
    },
  },
  {
    accessorKey: "duration",
    header: ({ column }) => (
      <SortableHeader column={column}>Duration</SortableHeader>
    ),
    cell: ({ row }) => {
      const duration = row.original.duration;
      return (
        <div className="flex items-center gap-2">
          <Clock className="h-4 w-4 text-muted-foreground" />
          <span className="text-sm">
            {moment(duration).format("LLL") || "Not specified"}
          </span>
        </div>
      );
    },
  },
  {
    accessorKey: "createdAt",
    header: ({ column }) => (
      <SortableHeader column={column}>Created At</SortableHeader>
    ),
    cell: ({ row }) => {
      const date = new Date(row.original?.createdAt ?? 0);
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
      const date = new Date(row.original?.updatedAt ?? 0);
      const timeAgo = getTimeAgo(date);

      // Helper function to format "time ago"
      function getTimeAgo(date: Date) {
        const now = new Date();
        const diffInDays = Math.floor(
          (now.getTime() - date.getTime()) / (1000 * 60 * 60 * 24),
        );

        if (diffInDays === 0) {
          return "Today";
        } else if (diffInDays === 1) {
          return "Yesterday";
        } else if (diffInDays < 7) {
          return `${diffInDays} days ago`;
        } else {
          return date.toLocaleDateString();
        }
      }

      return (
        <div className="flex items-center gap-2">
          <Calendar className="h-4 w-4 text-muted-foreground" />
          <span className="text-sm">{timeAgo}</span>
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

function DraggableRow({ row }: { row: Row<ProjectDbData> }) {
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
  item: ProjectDbData | ProjectDbData[];
  open: boolean;
  setOpen: (open: boolean) => void;
}) {
  const isMobile = useIsMobile();
  const isArray = Array.isArray(item);
  const project = !isArray ? item : null;

  const title = (() => {
    if (drawerMode === "edit")
      return isArray
        ? "Edit Projects"
        : `Edit ${project?.projectName || "Project"}`;
    if (drawerMode === "view")
      return `View ${project?.projectName || "Project"}`;
    if (drawerMode === "delete")
      return isArray
        ? `Delete ${item.length} Projects`
        : `Delete ${project?.projectName || "Project"}`;
    return "";
  })();

  const destructiveButtonTitle = drawerMode === "view" ? "Close" : "Cancel";

  const description = (() => {
    switch (drawerMode) {
      case "edit":
        return "Edit project details";
      case "view":
        return "Viewing project details";
      case "delete":
        return isArray
          ? "You're about to delete multiple projects."
          : "You're about to delete this project.";
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
            {drawerMode === "view" && !isArray && project && (
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <Avatar className="h-16 w-16">
                    <AvatarImage
                      src={project.imageUrl}
                      alt={project.projectName}
                    />
                    <AvatarFallback className="bg-purple-100 text-purple-600">
                      <FolderOpen className="h-6 w-6" />
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    <h3 className="font-semibold text-lg">
                      {project.projectName}
                    </h3>
                    {project.projectDescription && (
                      <p className="text-muted-foreground">
                        {project.projectDescription}
                      </p>
                    )}
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium">Progress</label>
                    <div className="mt-1">
                      <ProgressIndicator progress={project.progress} />
                    </div>
                  </div>
                  <div>
                    <label className="text-sm font-medium">Visibility</label>
                    <div className="mt-1">
                      <VisibilityBadge visible={project.visible} />
                    </div>
                  </div>
                </div>

                <div>
                  <label className="text-sm font-medium">Duration</label>
                  <div className="mt-1 flex items-center gap-2">
                    <Clock className="h-4 w-4 text-muted-foreground" />
                    <span>{project.duration || "Not specified"}</span>
                  </div>
                </div>

                {project.tags && (
                  <div>
                    <label className="text-sm font-medium">Tags</label>
                    <div className="mt-1 flex flex-wrap gap-2">
                      {project.tags.split(",").map((tag, index) => (
                        <Badge key={index} variant="secondary">
                          {tag.trim()}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}
                {project.classrooms && (
                  <div>
                    <label className="text-sm font-medium">
                      Assigned to{" "}
                      {project.classrooms.length > 1
                        ? "Classrooms"
                        : "Classroom"}
                    </label>
                    <ul className="mt-1 space-y-1">
                      {project.classrooms.map((classroom, index) => (
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
                            {`${classroom.course.courseCode}-${classroom.course.courseName}-${classroom.classroomName}`}
                          </span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
                {/*project.submissions && (
                  <div>
                    <label className="text-sm font-medium">
                      {project.submissions.length > 1
                        ? `All Submissions in this project ${project.submissions.length}`
                        : "No Submissions yet"}
                    </label>
                    <ul className="mt-1 space-y-1">
                      {project.submissions.length > 1 &&
                        project.submissions.map((submission, index) => (
                          <li
                            key={submission.id}
                            className="flex items-center gap-2"
                          >
                            <Avatar className="h-6 w-6">
                              <AvatarFallback className="bg-amber-100 text-amber-600">
                                {index + 1}
                              </AvatarFallback>
                            </Avatar>
                            <span className="text-sm">{submission.student.length}</span>
                          </li>
                        ))}
                    </ul>
                  </div>
                ) */}

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium">Created</label>
                    <p className="mt-1">
                      {moment(project.createdAt).format("llll")}
                    </p>
                  </div>
                  <div>
                    <label className="text-sm font-medium">Last Updated</label>
                    <p className="mt-1">
                      {moment(project.updatedAt).format("llll")}
                    </p>
                  </div>
                </div>
              </div>
            )}

            {drawerMode === "edit" && !isArray && project && (
              <ProjectUpdateForm initialData={item} />
            )}

            {drawerMode === "delete" && (
              <ProjectDeleteForm initialData={item} />
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

export function ProjectDataTable({ data }: { data?: ProjectDbData[] }) {
  const [rowSelection, setRowSelection] = React.useState({});
  const [columnVisibility, setColumnVisibility] =
    React.useState<VisibilityState>({ createdAt: false, updatedAt: false });
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
    [],
  );
  const [sorting, setSorting] = React.useState<SortingState>([
    {
      id: "projectName",
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
      queryClient.setQueryData(["projects"], (old) => {
        const oldData = Array.isArray(old) ? [...old] : [];
        const oldIndex = oldData.findIndex((p) => p.id === active.id);
        const newIndex = oldData.findIndex((p) => p.id === over.id);
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
            placeholder="Search projects..."
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
                    table.getColumn("visible")?.getFilterValue() ||
                      "All Projects",
                  )}
                </span>
                <IconChevronDown />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-32">
              <DropdownMenuItem
                onClick={() => table.getColumn("visible")?.setFilterValue("")}
              >
                All Projects
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => table.getColumn("visible")?.setFilterValue(true)}
              >
                Visible Only
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() =>
                  table.getColumn("visible")?.setFilterValue(false)
                }
              >
                Hidden Only
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
                          <FolderOpen className="w-8 h-8" />
                          <p>No projects found</p>
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
