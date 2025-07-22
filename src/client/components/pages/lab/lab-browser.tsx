"use client";

import { useState, useMemo } from "react";
import {
  Search,
  Filter,
  Grid,
  List,
  Play,
  Clock,
  Users,
  Target,
  AlertCircleIcon,
} from "lucide-react";
import { Button } from "@clnt/components/ui/button";
import { Input } from "@clnt/components/ui/input";
import { Badge } from "@clnt/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@clnt/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@clnt/components/ui/select";
import { LabPreview } from "@clnt/components/pages/lab-builder/lab-preview";
import type { Lab } from "@clnt/types/lab";
import {
  IconDevices,
  IconDotsVertical,
  IconEdit,
  IconEye,
  IconTrash,
  IconVocabulary,
} from "@tabler/icons-react";
import { useLabsQuery } from "@clnt/lib/queries/lab-query";
import Loader from "@clnt/components/common/loader";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@clnt/components/ui/dropdown-menu";
import router from "@clnt/pages/route-layout";
import { Avatar, AvatarFallback } from "@clnt/components/ui/avatar";
import { useDeleteLab } from "@clnt/lib/mutations/lab/lab-delete-mutation";
import { toast } from "sonner";
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@clnt/components/ui/hover-card";

type ViewMode = "grid" | "list";
type SortOption =
  | "title"
  | "difficulty"
  | "duration"
  | "created"
  | "popularity";

export function LabsBrowser() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [selectedDifficulty, setSelectedDifficulty] = useState<string>("all");
  const [sortBy, setSortBy] = useState<SortOption>("title");
  const [viewMode, setViewMode] = useState<ViewMode>("grid");
  const [previewLab, setPreviewLab] = useState<Lab | null>(null);
  const [selectedStatus, setSelectedStatus] = useState<string>("all");

  const { data: labsQry, isLoading, isError } = useLabsQuery();
  const deleteLab = useDeleteLab();

  const handleDeleteLab = (id: string) => {
    toast.promise(deleteLab.mutateAsync(id), {
      loading: "Deleting lab",
      success: "Deleted lab successfully",
      error: "Error deleting lab",
    });
  };

  const categories = useMemo(() => {
    const cats = Array.from(new Set(labsQry?.map((lab) => lab.category)));
    return ["all", ...cats];
  }, []);

  const filteredAndSortedLabs = useMemo(() => {
    const filtered = labsQry?.filter((lab) => {
      const matchesSearch =
        lab.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        lab.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        lab.tags.some((tag) =>
          tag.toLowerCase().includes(searchQuery.toLowerCase()),
        );

      const matchesCategory =
        selectedCategory === "all" || lab.category === selectedCategory;

      const matchesDifficulty =
        selectedDifficulty === "all" || lab.difficulty === selectedDifficulty;

      const matchesStatus =
        selectedStatus === "all" || lab.status === selectedStatus;

      return (
        matchesSearch && matchesCategory && matchesDifficulty && matchesStatus
      );
    });

    // Sort labs
    filtered?.sort((a, b) => {
      switch (sortBy) {
        case "title":
          return a.title.localeCompare(b.title);
        case "difficulty": {
          const difficultyOrder = {
            BEGINNER: 1,
            INTERMEDIATE: 2,
            ADVANCED: 3,
          };

          return difficultyOrder[a.difficulty] - difficultyOrder[b.difficulty];
        }
        case "duration":
          return a.estimatedTime - b.estimatedTime;
        case "created":
          return (
            new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
          );
        case "popularity":
          return b.objectives.length - a.objectives.length;
        default:
          return 0;
      }
    });

    return filtered;
  }, [
    searchQuery,
    selectedCategory,
    selectedDifficulty,
    selectedStatus,
    sortBy,
  ]);

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case "BEGINNER":
        return "bg-green-100 text-green-800 border-green-200";
      case "INTERMEDIATE":
        return "bg-yellow-100 text-yellow-800 border-yellow-200";
      case "ADVANCED":
        return "bg-red-100 text-red-800 border-red-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  const formatDuration = (minutes: number) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    if (hours > 0) {
      return `${hours}h ${mins}m`;
    }
    return `${mins}m`;
  };

  const handleLaunchLab = (lab: Lab) => {
    // Navigate to lab page
    window.location.href = `/lab/${lab.id}`;
  };

  if (isLoading) return <Loader />;
  if (isError || !labsQry)
    return (
      <div className="flex flex-col w-full h-full items-center justify-center py-20 space-y-5">
        <Avatar className="w-30 h-30">
          <AvatarFallback randomizeBg>
            <IconVocabulary className="w-15 h-15" />
          </AvatarFallback>
        </Avatar>
        <p className="text-muted-foreground">No labs content yet</p>
      </div>
    );

  return (
    <div className="space-y-6">
      {/* Search and Filters */}
      <div className="flex flex-col lg:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
          <Input
            placeholder="Search labs by title, description, or tags..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>

        <div className="flex gap-2">
          <Select value={selectedCategory} onValueChange={setSelectedCategory}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Category" />
            </SelectTrigger>
            <SelectContent>
              {categories.map((category) => (
                <SelectItem key={category} value={category}>
                  {category === "all" ? "All Categories" : category}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Select value={selectedStatus} onValueChange={setSelectedStatus}>
            <SelectTrigger className="w-[150px]">
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Statuses</SelectItem>
              <SelectItem value="PUBLISHED">Published</SelectItem>
              <SelectItem value="DRAFT">Draft</SelectItem>
            </SelectContent>
          </Select>

          <Select
            value={selectedDifficulty}
            onValueChange={setSelectedDifficulty}
          >
            <SelectTrigger className="w-[150px]">
              <SelectValue placeholder="Difficulty" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Levels</SelectItem>
              <SelectItem value="BEGINNER">Beginner</SelectItem>
              <SelectItem value="INTERMEDIATE">Intermediate</SelectItem>
              <SelectItem value="ADVANCED">Advanced</SelectItem>
            </SelectContent>
          </Select>

          <Select
            value={sortBy}
            onValueChange={(value: SortOption) => setSortBy(value)}
          >
            <SelectTrigger className="w-[150px]">
              <SelectValue placeholder="Sort by" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="title">Title</SelectItem>
              <SelectItem value="difficulty">Difficulty</SelectItem>
              <SelectItem value="duration">Duration</SelectItem>
              <SelectItem value="created">Newest</SelectItem>
              <SelectItem value="popularity">Popular</SelectItem>
            </SelectContent>
          </Select>

          <div className="flex border rounded-md">
            <Button
              variant={viewMode === "grid" ? "default" : "ghost"}
              size="sm"
              onClick={() => setViewMode("grid")}
              className="rounded-r-none"
            >
              <Grid className="h-4 w-4" />
            </Button>
            <Button
              variant={viewMode === "list" ? "default" : "ghost"}
              size="sm"
              onClick={() => setViewMode("list")}
              className="rounded-l-none"
            >
              <List className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>

      {/* Results Count */}
      <div className="text-sm text-muted-foreground">
        Showing {filteredAndSortedLabs?.length} of {labsQry.length} labs
      </div>

      {/* Labs Grid/List */}
      {viewMode === "grid" ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredAndSortedLabs?.map((lab) => (
            <Card key={lab.id} className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <CardTitle className="text-lg mb-2">{lab.title}</CardTitle>
                    <CardDescription className="line-clamp-2">
                      {lab.description}
                    </CardDescription>
                  </div>
                  <div className="flex flex-col gap-2 items-end">
                    <Badge className={getDifficultyColor(lab.difficulty)}>
                      {lab.difficulty}
                    </Badge>
                    {lab.status === "DRAFT" && (
                      <div className="flex flex-row gap-2">
                        <HoverCard openDelay={200}>
                          <HoverCardTrigger>
                            <Badge variant="destructive">
                              DRAFT
                              <AlertCircleIcon />
                            </Badge>
                          </HoverCardTrigger>
                          <HoverCardContent className="flex flex-col text-red-400 space-y-4">
                            <p className="text-md font-medium">
                              Unable to be applied to projects.
                            </p>
                            <p className="text-sm text-muted-foreground">
                              Please complete the lab steps in order for this
                              lab to be used.
                            </p>
                          </HoverCardContent>
                        </HoverCard>
                      </div>
                    )}
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-1">
                  {/* Lab Stats */}
                  <div className="flex items-center gap-4 text-sm text-muted-foreground">
                    <div className="flex items-center gap-1">
                      <Clock className="h-4 w-4" />
                      {formatDuration(lab.estimatedTime)}
                    </div>
                    <div className="flex items-center gap-1">
                      <Target className="h-4 w-4" />
                      {lab.objectives.length} objectives
                    </div>
                    <div className="flex items-center gap-1">
                      <IconDevices className="h-4 w-4" />
                      {lab.environment.topology.nodes.length} devices/nodes
                    </div>
                  </div>

                  {/* Tags */}
                  <div className="flex flex-wrap gap-1">
                    {lab.tags.slice(0, 3).map((tag) => (
                      <Badge key={tag} variant="secondary" className="text-xs">
                        {tag}
                      </Badge>
                    ))}
                    {lab.tags.length > 3 && (
                      <Badge variant="secondary" className="text-xs">
                        +{lab.tags.length - 3}
                      </Badge>
                    )}
                  </div>

                  {/* Actions */}
                  <div className="w-full flex justify-end gap-5 bottom-0">
                    <DropdownMenu>
                      <DropdownMenuTrigger>
                        <Button variant="default" className="p-1">
                          <IconDotsVertical />
                          Actions
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent>
                        <DropdownMenuItem onClick={() => setPreviewLab(lab)}>
                          <IconEye />
                          Preview
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={() =>
                            router.navigate(`/lab-builder/editor/${lab.id}`)
                          }
                        >
                          <IconEdit /> Edit
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem
                          variant="destructive"
                          onClick={() => handleDeleteLab(lab.id)}
                        >
                          <IconTrash /> Delete
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <div className="space-y-4">
          {filteredAndSortedLabs?.map((lab) => (
            <Card key={lab.id} className="hover:shadow-md transition-shadow">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="text-lg font-semibold">{lab.title}</h3>
                      <Badge className={getDifficultyColor(lab.difficulty)}>
                        {lab.difficulty}
                      </Badge>
                    </div>
                    <p className="text-muted-foreground mb-3 line-clamp-2">
                      {lab.description}
                    </p>
                    <div className="flex items-center gap-6 text-sm text-muted-foreground">
                      <div className="flex items-center gap-1">
                        <Clock className="h-4 w-4" />
                        {formatDuration(lab.estimatedTime)}
                      </div>
                      <div className="flex items-center gap-1">
                        <Target className="h-4 w-4" />
                        {lab.objectives.length} objectives
                      </div>
                      <div className="flex items-center gap-1">
                        <Users className="h-4 w-4" />
                        {lab.environment.topology.nodes.length} devices
                      </div>
                      <div className="text-xs">Category: {lab.category}</div>
                    </div>
                  </div>
                  <div className="flex gap-2 ml-4">
                    <Button onClick={() => handleLaunchLab(lab)}>
                      <Play className="h-4 w-4 mr-2" />
                      Launch Lab
                    </Button>
                    <Button
                      variant="outline"
                      onClick={() => setPreviewLab(lab)}
                    >
                      Preview
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Empty State */}
      {filteredAndSortedLabs?.length === 0 && (
        <div className="text-center py-12">
          <div className="text-muted-foreground mb-4">
            <Filter className="h-12 w-12 mx-auto mb-4 opacity-50" />
            <h3 className="text-lg font-semibold mb-2">No labs found</h3>
            <p>Try adjusting your search criteria or filters</p>
          </div>
          <Button
            variant="outline"
            onClick={() => {
              setSearchQuery("");
              setSelectedCategory("all");
              setSelectedDifficulty("all");
            }}
          >
            Clear Filters
          </Button>
        </div>
      )}

      {/* Lab Preview Modal */}
      {previewLab && (
        <LabPreview
          lab={previewLab}
          isOpen={!!previewLab}
          onClose={() => setPreviewLab(null)}
          onEditLab={() =>
            router.navigate(`/lab-builder/editor/${previewLab.id}`)
          }
        />
      )}
    </div>
  );
}
