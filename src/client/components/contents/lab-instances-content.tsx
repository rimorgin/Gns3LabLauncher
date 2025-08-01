"use client";

import { useState, useMemo } from "react";
import { Search, Filter, Play, Square, RotateCcw } from "lucide-react";
import { Badge } from "@clnt/components/ui/badge";
import { Button } from "@clnt/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@clnt/components/ui/card";
import { Input } from "@clnt/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@clnt/components/ui/select";
import { useGns3Containers } from "@clnt/lib/queries/lab-instances-query";
import Loader from "../common/loader";
import { Navigate } from "react-router";
import { useStopContainerInstance } from "@clnt/lib/mutations/lab/lab-start-or-stop-mutation";
import { toast } from "sonner";

interface ContainerInfo {
  container: { name: string; status: string; state: string };
  user: {
    id: string;
    name: string;
    email: string;
    student: {
      classrooms: Array<{
        classroomName: string;
        course: {
          courseName: string;
          courseCode: string;
        };
      }>;
    };
  };
}

function getStatusColor(status: string) {
  switch (status) {
    case "running":
      return "bg-green-500";
    case "stopped":
      return "bg-red-500";
    case "restarting":
      return "bg-yellow-500";
    default:
      return "bg-gray-500";
  }
}

function getStatusIcon(status: string) {
  switch (status) {
    case "running":
      return <Play className="h-3 w-3" />;
    case "stopped":
      return <Square className="h-3 w-3" />;
    case "restarting":
      return <RotateCcw className="h-3 w-3" />;
    default:
      return null;
  }
}

function ContainerCard({
  container,
  onForceTerminateInstance,
}: {
  container: ContainerInfo;
  onForceTerminateInstance: (containerName: string) => void;
}) {
  return (
    <Card className="hover:shadow-md transition-shadow">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg font-semibold">
            {container.container.name}
          </CardTitle>
          <Badge
            variant="secondary"
            className={`${getStatusColor(container.container.state)} text-white flex items-center gap-1`}
          >
            {getStatusIcon(container.container.state)}
            {container.container.state}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-3 text-sm">
        <div className="grid gap-1">
          <div className="flex justify-between">
            <span className="text-muted-foreground">User:</span>
            <span className="font-medium">{container.user.name}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">Email:</span>
            <span className="font-medium">{container.user.email}</span>
          </div>
          <div className="flex justify-between items-start">
            <span className="text-muted-foreground">Classrooms:</span>
            <div className="flex flex-col items-end font-medium">
              {container.user.student?.classrooms?.length ? (
                container.user.student.classrooms.map((classroom, index) => (
                  <div key={index}>
                    {classroom.classroomName} (
                    {classroom.course?.courseCode ?? "N/A"} -{" "}
                    {classroom.course?.courseName ?? "N/A"})
                  </div>
                ))
              ) : (
                <span>N/A</span>
              )}
            </div>
          </div>
        </div>
        <Button
          size="sm"
          variant="destructive"
          className="w-full"
          onClick={() => onForceTerminateInstance(container.container.name)}
        >
          Force Terminate
        </Button>
      </CardContent>
    </Card>
  );
}

export default function LabInstances() {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  const {
    data: gns3InstancesQry = [],
    isLoading,
    isError,
  } = useGns3Containers();

  const stopInstance = useStopContainerInstance();

  const containers: ContainerInfo[] = gns3InstancesQry;

  const filteredContainers = useMemo(() => {
    return containers.filter((container) => {
      const matchesSearch = container.container.name
        .toLowerCase()
        .includes(searchTerm.toLowerCase());

      const matchesStatus =
        statusFilter === "all" || container.container.state === statusFilter;
      return matchesSearch && matchesStatus;
    });
  }, [searchTerm, statusFilter, containers]);

  const statusCounts = useMemo(() => {
    return containers.reduce(
      (acc, container) => {
        acc[container.container.state] =
          (acc[container.container.state] || 0) + 1;
        return acc;
      },
      {} as Record<string, number>,
    );
  }, [containers]);

  const handleTerminateInstance = (containerName: string) => {
    toast.promise(stopInstance.mutateAsync(containerName), {
      loading: `Stopping ${containerName} instance`,
      success: `Stopped ${containerName} instance`,
      error: `Erro stopping ${containerName} instance`,
    });
  };

  if (isLoading) return <Loader />;
  if (isError) return <Navigate to={"errorPage"} />;

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold tracking-tight mb-2">
            Gns3 Instances
          </h1>
          <p className="text-muted-foreground">
            Manage and monitor Gns3 running instances
          </p>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Total</p>
                  <p className="text-2xl font-bold">{containers.length}</p>
                </div>
                <div className="h-8 w-8 bg-blue-100 rounded-full flex items-center justify-center">
                  <div className="h-4 w-4 bg-blue-500 rounded-full" />
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Running</p>
                  <p className="text-2xl font-bold">
                    {statusCounts.running || 0}
                  </p>
                </div>
                <div className="h-8 w-8 bg-green-100 rounded-full flex items-center justify-center">
                  <Play className="h-4 w-4 text-green-600" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Filters */}
        <div className="flex flex-col sm:flex-row gap-4 mb-6">
          <div className="relative w-xl">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
            <Input
              placeholder="Search containers..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-full sm:w-[200px]">
              <div className="flex flex-row ">
                <Filter className="h-4 w-4 mr-2" />
                <SelectValue placeholder="Filter by status" />
              </div>
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">
                All Status ({containers.length})
              </SelectItem>
              <SelectItem value="running">
                Running ({statusCounts["running"] || 0})
              </SelectItem>
              <SelectItem value="stopped">
                Stopped ({statusCounts["stopped"] || 0})
              </SelectItem>
              <SelectItem value="restarting">
                Restarting ({statusCounts["restarting"] || 0})
              </SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Container Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredContainers.map((container) => (
            <ContainerCard
              key={container.user.id}
              container={container}
              onForceTerminateInstance={handleTerminateInstance}
            />
          ))}
        </div>

        {filteredContainers.length === 0 && (
          <div className="text-center py-12">
            <div className="text-muted-foreground mb-2">
              No containers found
            </div>
            <p className="text-sm text-muted-foreground">
              Try adjusting your search or filter criteria
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
