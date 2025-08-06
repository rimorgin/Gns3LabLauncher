"use client";

import { useState, useEffect } from "react";
import { Badge } from "@clnt/components/ui/badge";
import { Button } from "@clnt/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@clnt/components/ui/card";
import { Input } from "@clnt/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@clnt/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@clnt/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@clnt/components/ui/dialog";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@clnt/components/ui/tabs";
import { ScrollArea } from "@clnt/components/ui/scroll-area";
import {
  Search,
  Download,
  RefreshCw,
  Eye,
  AlertCircle,
  Info,
  AlertTriangle,
  XCircle,
  CheckCircle,
  Clock,
  Globe,
  User,
  Activity,
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
  ChevronUp,
  ChevronDown,
} from "lucide-react";

// Interface based on your Prisma model
interface LogEntry {
  id: number;
  level?: string;
  timestamp?: string;
  message?: string;
  context?: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  stack?: any; // JSON field
  statusCode: number;
  durationMs: number;
  ip?: string;
}

interface LogsViewerProps {
  logs: LogEntry[];
  onRefresh?: () => void;
  onExport?: () => void;
}

export function LogsViewer({ logs, onRefresh, onExport }: LogsViewerProps) {
  const [filteredLogs, setFilteredLogs] = useState<LogEntry[]>(logs);
  const [searchTerm, setSearchTerm] = useState("");
  const [levelFilter, setLevelFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [contextFilter, setContextFilter] = useState("all");
  const [selectedLog, setSelectedLog] = useState<LogEntry | null>(null);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [dateRange, setDateRange] = useState("all");
  const [sortKey, setSortKey] = useState<keyof LogEntry | null>(null);
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc");

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(25);

  // Get unique contexts for filter
  const uniqueContexts = Array.from(
    new Set(logs.map((log) => log.context).filter(Boolean)),
  );

  // Get unique levels for filter
  const uniqueLevels = Array.from(
    new Set(logs.map((log) => log.level).filter(Boolean)),
  );

  // Filter logs based on current filters
  useEffect(() => {
    let filtered = logs;

    // Search filter
    if (searchTerm) {
      filtered = filtered.filter(
        (log) =>
          log.message?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          log.context?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          log.ip?.toLowerCase().includes(searchTerm.toLowerCase()),
      );
    }

    // Level filter
    if (levelFilter !== "all") {
      filtered = filtered.filter((log) => log.level === levelFilter);
    }

    // Status code filter
    if (statusFilter !== "all") {
      if (statusFilter === "success") {
        filtered = filtered.filter(
          (log) => log.statusCode >= 200 && log.statusCode < 300,
        );
      } else if (statusFilter === "error") {
        filtered = filtered.filter((log) => log.statusCode >= 400);
      } else if (statusFilter === "redirect") {
        filtered = filtered.filter(
          (log) => log.statusCode >= 300 && log.statusCode < 400,
        );
      }
    }

    // Context filter
    if (contextFilter !== "all") {
      filtered = filtered.filter((log) => log.context === contextFilter);
    }

    // Date range filter
    if (dateRange !== "all" && dateRange) {
      const now = new Date();
      const cutoffDate = new Date();

      switch (dateRange) {
        case "1h":
          cutoffDate.setHours(now.getHours() - 1);
          break;
        case "24h":
          cutoffDate.setDate(now.getDate() - 1);
          break;
        case "7d":
          cutoffDate.setDate(now.getDate() - 7);
          break;
        case "30d":
          cutoffDate.setDate(now.getDate() - 30);
          break;
      }

      filtered = filtered.filter(
        (log) => log.timestamp && new Date(log.timestamp) >= cutoffDate,
      );
    }

    // Sort logs
    if (sortKey) {
      filtered = [...filtered].sort((a, b) => {
        const valA = a[sortKey];
        const valB = b[sortKey];

        if (valA == null) return 1;
        if (valB == null) return -1;

        if (typeof valA === "number" && typeof valB === "number") {
          return sortDirection === "asc" ? valA - valB : valB - valA;
        }

        if (typeof valA === "string" && typeof valB === "string") {
          return sortDirection === "asc"
            ? valA.localeCompare(valB)
            : valB.localeCompare(valA);
        }

        if (valA instanceof Date && valB instanceof Date) {
          return sortDirection === "asc"
            ? valA.getTime() - valB.getTime()
            : valB.getTime() - valA.getTime();
        }

        return 0;
      });
    }

    setFilteredLogs(filtered);
    setCurrentPage(1); // Reset to first page when filters change
  }, [
    logs,
    searchTerm,
    levelFilter,
    statusFilter,
    contextFilter,
    dateRange,
    sortKey,
    sortDirection,
  ]);

  // Calculate pagination
  const totalPages = Math.ceil(filteredLogs.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentLogs = filteredLogs.slice(startIndex, endIndex);

  const getLevelIcon = (level?: string) => {
    switch (level?.toLowerCase()) {
      case "error":
        return <XCircle className="h-4 w-4 text-red-500" />;
      case "warn":
      case "warning":
        return <AlertTriangle className="h-4 w-4 text-yellow-500" />;
      case "info":
        return <Info className="h-4 w-4 text-blue-500" />;
      case "debug":
        return <Activity className="h-4 w-4 text-gray-500" />;
      case "success":
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      default:
        return <AlertCircle className="h-4 w-4 text-gray-400" />;
    }
  };

  const getLevelColor = (level?: string) => {
    switch (level?.toLowerCase()) {
      case "error":
        return "bg-red-100 text-red-800";
      case "warn":
      case "warning":
        return "bg-yellow-100 text-yellow-800";
      case "info":
        return "bg-blue-100 text-blue-800";
      case "debug":
        return "bg-gray-100 text-gray-800";
      case "success":
        return "bg-green-100 text-green-800";
      default:
        return "bg-gray-100 text-gray-600";
    }
  };

  const getStatusColor = (statusCode: number) => {
    if (statusCode >= 200 && statusCode < 300)
      return "bg-green-100 text-green-800";
    if (statusCode >= 300 && statusCode < 400)
      return "bg-blue-100 text-blue-800";
    if (statusCode >= 400 && statusCode < 500)
      return "bg-yellow-100 text-yellow-800";
    if (statusCode >= 500) return "bg-red-100 text-red-800";
    return "bg-gray-100 text-gray-800";
  };

  const formatDuration = (ms: number) => {
    if (ms < 1000) return `${ms}ms`;
    if (ms < 60000) return `${(ms / 1000).toFixed(2)}s`;
    return `${(ms / 60000).toFixed(2)}m`;
  };

  const handleViewDetails = (log: LogEntry) => {
    setSelectedLog(log);
    setIsDetailModalOpen(true);
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(Math.max(1, Math.min(totalPages, page)));
  };

  const handleItemsPerPageChange = (value: string) => {
    setItemsPerPage(parseInt(value));
    setCurrentPage(1);
  };

  const handleSort = (key: keyof LogEntry) => {
    if (sortKey === key) {
      setSortDirection((prev) => (prev === "asc" ? "desc" : "asc"));
    } else {
      setSortKey(key);
      setSortDirection("asc");
    }
  };

  // Stats calculations
  const stats = {
    total: filteredLogs.length,
    errors: filteredLogs.filter(
      (log) => log.level === "error" || log.statusCode >= 400,
    ).length,
    warnings: filteredLogs.filter(
      (log) => log.level === "warn" || log.level === "warning",
    ).length,
    avgDuration:
      filteredLogs.length > 0
        ? Math.round(
            filteredLogs.reduce((sum, log) => sum + log.durationMs, 0) /
              filteredLogs.length,
          )
        : 0,
  };

  const headers: {
    key: keyof LogEntry | "actions";
    label: string;
    className?: string;
    sortable?: boolean;
  }[] = [
    { key: "id", label: "id", className: "w-[50px]", sortable: true },
    { key: "level", label: "Level", className: "w-[100px]", sortable: true },
    {
      key: "timestamp",
      label: "Timestamp",
      className: "w-[180px]",
      sortable: true,
    },
    { key: "message", label: "Message", sortable: false },
    {
      key: "context",
      label: "Context",
      className: "w-[120px]",
      sortable: true,
    },
    {
      key: "statusCode",
      label: "Status",
      className: "w-[100px]",
      sortable: true,
    },
    {
      key: "durationMs",
      label: "Duration",
      className: "w-[100px]",
      sortable: true,
    },
    { key: "ip", label: "IP", className: "w-[120px]", sortable: true },
    {
      key: "actions",
      label: "Actions",
      className: "w-[80px]",
      sortable: false,
    },
  ];

  return (
    <div className="space-y-6">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Logs</CardTitle>
            <Activity className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.total}</div>
            <p className="text-xs text-muted-foreground">Filtered entries</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Errors</CardTitle>
            <XCircle className="h-4 w-4 text-red-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">
              {stats.errors}
            </div>
            <p className="text-xs text-muted-foreground">Error entries</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Warnings</CardTitle>
            <AlertTriangle className="h-4 w-4 text-yellow-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-yellow-600">
              {stats.warnings}
            </div>
            <p className="text-xs text-muted-foreground">Warning entries</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Avg Duration</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {formatDuration(stats.avgDuration)}
            </div>
            <p className="text-xs text-muted-foreground">
              Average response time
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>System Logs</CardTitle>
              <CardDescription>
                Monitor and analyze system activity logs
              </CardDescription>
            </div>
            <div className="flex space-x-2">
              {onRefresh && (
                <Button variant="outline" size="sm" onClick={onRefresh}>
                  <RefreshCw className="h-4 w-4 mr-2" />
                  Refresh
                </Button>
              )}
              {onExport && (
                <Button variant="outline" size="sm" onClick={onExport}>
                  <Download className="h-4 w-4 mr-2" />
                  Export
                </Button>
              )}
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4 mb-6">
            <div className="relative w-[200%]">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                placeholder="Search logs by message, context, or IP..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>

            <Select value={levelFilter} onValueChange={setLevelFilter}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Level" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Levels</SelectItem>
                {uniqueLevels.map((level) => (
                  <SelectItem key={level} value={level as string}>
                    {level}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="success">Success (2xx)</SelectItem>
                <SelectItem value="redirect">Redirect (3xx)</SelectItem>
                <SelectItem value="error">Error (4xx+)</SelectItem>
              </SelectContent>
            </Select>

            <Select value={contextFilter} onValueChange={setContextFilter}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Context" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Contexts</SelectItem>
                {uniqueContexts.map((context) => (
                  <SelectItem key={context} value={context as string}>
                    {context}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select value={dateRange} onValueChange={setDateRange}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Time Range" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Time</SelectItem>
                <SelectItem value="1h">Last Hour</SelectItem>
                <SelectItem value="24h">Last 24h</SelectItem>
                <SelectItem value="7d">Last 7 days</SelectItem>
                <SelectItem value="30d">Last 30 days</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Pagination Info and Items Per Page */}
          <div className="flex items-center justify-between mb-4">
            <div className="text-sm text-muted-foreground">
              Showing {startIndex + 1} to{" "}
              {Math.min(endIndex, filteredLogs.length)} of {filteredLogs.length}{" "}
              entries
            </div>
            <div className="flex items-center space-x-2">
              <span className="text-sm text-muted-foreground">Show:</span>
              <Select
                value={itemsPerPage.toString()}
                onValueChange={handleItemsPerPageChange}
              >
                <SelectTrigger className="w-[80px]">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="10">10</SelectItem>
                  <SelectItem value="25">25</SelectItem>
                  <SelectItem value="50">50</SelectItem>
                  <SelectItem value="100">100</SelectItem>
                </SelectContent>
              </Select>
              <span className="text-sm text-muted-foreground">per page</span>
            </div>
          </div>

          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  {headers.map((col) => (
                    <TableHead
                      key={col.key}
                      className={`whitespace-nowrap ${col.sortable ? "cursor-pointer select-none" : ""} ${col.className ?? ""}`}
                      onClick={() =>
                        col.sortable && handleSort(col.key as keyof LogEntry)
                      }
                    >
                      <div className="flex items-center gap-1">
                        <span>{col.label}</span>
                        {col.sortable &&
                          sortKey === col.key &&
                          (sortDirection === "asc" ? (
                            <ChevronUp className="w-5 h-5" />
                          ) : (
                            <ChevronDown className="w-5 h-5" />
                          ))}
                      </div>
                    </TableHead>
                  ))}
                </TableRow>
              </TableHeader>
              <TableBody>
                {currentLogs.map((log) => (
                  <TableRow key={log.id} className="hover:bg-muted/50">
                    <TableCell className="font-mono text-xs">
                      {log.id}
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center space-x-2">
                        {getLevelIcon(log.level)}
                        <Badge
                          className={getLevelColor(log.level)}
                          variant="secondary"
                        >
                          {log.level || "unknown"}
                        </Badge>
                      </div>
                    </TableCell>
                    <TableCell className="font-mono text-xs">
                      {log.timestamp
                        ? new Date(log.timestamp).toLocaleString()
                        : "N/A"}
                    </TableCell>
                    <TableCell className="max-w-[300px]">
                      <div className="truncate" title={log.message}>
                        {log.message || "No message"}
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline" className="text-xs">
                        {log.context || "N/A"}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Badge
                        className={getStatusColor(log.statusCode)}
                        variant="secondary"
                      >
                        {log.statusCode}
                      </Badge>
                    </TableCell>
                    <TableCell className="font-mono text-xs">
                      {formatDuration(log.durationMs)}
                    </TableCell>
                    <TableCell className="font-mono text-xs">
                      {log.ip || "N/A"}
                    </TableCell>
                    <TableCell>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleViewDetails(log)}
                      >
                        <Eye className="h-4 w-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>

          {/* Pagination Controls */}
          {totalPages > 1 && (
            <div className="flex items-center justify-between mt-4">
              <div className="text-sm text-muted-foreground">
                Page {currentPage} of {totalPages}
              </div>
              <div className="flex items-center space-x-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handlePageChange(1)}
                  disabled={currentPage === 1}
                >
                  <ChevronsLeft className="h-4 w-4" />
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handlePageChange(currentPage - 1)}
                  disabled={currentPage === 1}
                >
                  <ChevronLeft className="h-4 w-4" />
                </Button>

                {/* Page numbers */}
                {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                  let pageNum;
                  if (totalPages <= 5) {
                    pageNum = i + 1;
                  } else if (currentPage <= 3) {
                    pageNum = i + 1;
                  } else if (currentPage >= totalPages - 2) {
                    pageNum = totalPages - 4 + i;
                  } else {
                    pageNum = currentPage - 2 + i;
                  }

                  return (
                    <Button
                      key={pageNum}
                      variant={currentPage === pageNum ? "default" : "outline"}
                      size="sm"
                      onClick={() => handlePageChange(pageNum)}
                      className="min-w-[40px]"
                    >
                      {pageNum}
                    </Button>
                  );
                })}

                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handlePageChange(currentPage + 1)}
                  disabled={currentPage === totalPages}
                >
                  <ChevronRight className="h-4 w-4" />
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handlePageChange(totalPages)}
                  disabled={currentPage === totalPages}
                >
                  <ChevronsRight className="h-4 w-4" />
                </Button>
              </div>
            </div>
          )}

          {filteredLogs.length === 0 && (
            <div className="text-center py-8">
              <Activity className="mx-auto h-12 w-12 text-gray-400" />
              <h3 className="mt-2 text-sm font-semibold text-gray-900">
                No logs found
              </h3>
              <p className="mt-1 text-sm text-gray-500">
                Try adjusting your filters or search terms.
              </p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Log Detail Modal */}
      <Dialog open={isDetailModalOpen} onOpenChange={setIsDetailModalOpen}>
        <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center space-x-2">
              {selectedLog && getLevelIcon(selectedLog.level)}
              <span>Log Details - ID: {selectedLog?.id}</span>
            </DialogTitle>
            <DialogDescription>
              Detailed view of log entry and associated metadata
            </DialogDescription>
          </DialogHeader>

          {selectedLog && (
            <Tabs defaultValue="overview" className="w-full">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="overview">Overview</TabsTrigger>
                <TabsTrigger value="stack">Stack Data</TabsTrigger>
                <TabsTrigger value="raw">Raw JSON</TabsTrigger>
              </TabsList>

              <TabsContent value="overview" className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg">
                        Basic Information
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      <div className="flex items-center space-x-3">
                        <Activity className="h-4 w-4 text-muted-foreground" />
                        <div>
                          <div className="font-medium">Log ID</div>
                          <div className="text-sm text-muted-foreground">
                            {selectedLog.id}
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center space-x-3">
                        {getLevelIcon(selectedLog.level)}
                        <div>
                          <div className="font-medium">Level</div>
                          <div className="text-sm text-muted-foreground">
                            {selectedLog.level || "N/A"}
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center space-x-3">
                        <Clock className="h-4 w-4 text-muted-foreground" />
                        <div>
                          <div className="font-medium">Timestamp</div>
                          <div className="text-sm text-muted-foreground">
                            {selectedLog.timestamp
                              ? new Date(selectedLog.timestamp).toLocaleString()
                              : "N/A"}
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center space-x-3">
                        <User className="h-4 w-4 text-muted-foreground" />
                        <div>
                          <div className="font-medium">Context</div>
                          <div className="text-sm text-muted-foreground">
                            {selectedLog.context || "N/A"}
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg">
                        Request Information
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      <div className="flex items-center space-x-3">
                        <CheckCircle className="h-4 w-4 text-muted-foreground" />
                        <div>
                          <div className="font-medium">Status Code</div>
                          <div className="text-sm">
                            <Badge
                              className={getStatusColor(selectedLog.statusCode)}
                            >
                              {selectedLog.statusCode}
                            </Badge>
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center space-x-3">
                        <Clock className="h-4 w-4 text-muted-foreground" />
                        <div>
                          <div className="font-medium">Duration</div>
                          <div className="text-sm text-muted-foreground">
                            {formatDuration(selectedLog.durationMs)}
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center space-x-3">
                        <Globe className="h-4 w-4 text-muted-foreground" />
                        <div>
                          <div className="font-medium">IP Address</div>
                          <div className="text-sm text-muted-foreground font-mono">
                            {selectedLog.ip || "N/A"}
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>

                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Message</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="p-4 bg-muted rounded-lg">
                      <pre className="whitespace-pre-wrap text-sm">
                        {selectedLog.message || "No message available"}
                      </pre>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="stack" className="space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Stack Data</CardTitle>
                    <CardDescription>
                      Additional context and metadata
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    {selectedLog.stack ? (
                      <ScrollArea className="h-[400px] w-full">
                        <div className="space-y-2">
                          {Object.entries(selectedLog.stack).map(
                            ([key, value]) => (
                              <div key={key} className="border-b pb-2">
                                <div className="font-medium text-sm">{key}</div>
                                <div className="text-sm text-muted-foreground font-mono break-all">
                                  {typeof value === "object"
                                    ? JSON.stringify(value, null, 2)
                                    : String(value)}
                                </div>
                              </div>
                            ),
                          )}
                        </div>
                      </ScrollArea>
                    ) : (
                      <div className="text-center py-8 text-muted-foreground">
                        No stack data available
                      </div>
                    )}
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="raw" className="space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Raw JSON Data</CardTitle>
                    <CardDescription>
                      Complete log entry in JSON format
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <ScrollArea className="h-fit w-full">
                      <pre className="text-xs bg-muted p-4 rounded-lg text-wrap">
                        {JSON.stringify(selectedLog, null, 2)}
                      </pre>
                    </ScrollArea>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
