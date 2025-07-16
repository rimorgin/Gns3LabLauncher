"use client";

import { useState } from "react";
import { Search, Grid, List, Clock, Users, Star } from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@clnt/components/ui/card";
import { Input } from "@clnt/components/ui/input";
import { Button } from "@clnt/components/ui/button";
import { Badge } from "@clnt/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@clnt/components/ui/select";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@clnt/components/ui/tabs";
import type { LabTemplate } from "@clnt/types/lab-template";
import { templateCategories } from "@clnt/constants/data";

interface TemplateBrowserProps {
  onSelectTemplate: (template: LabTemplate) => void;
  onPreviewTemplate: (template: LabTemplate) => void;
}

export function TemplateBrowser({
  onSelectTemplate,
  onPreviewTemplate,
}: TemplateBrowserProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [difficultyFilter, setDifficultyFilter] = useState<string>("all");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [sortBy, setSortBy] = useState<
    "name" | "difficulty" | "duration" | "popularity"
  >("popularity");

  const filteredTemplates = templateCategories
    .flatMap((category) => category.templates)
    .filter((template) => {
      const matchesSearch =
        template.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        template.description
          .toLowerCase()
          .includes(searchQuery.toLowerCase()) ||
        template.tags.some((tag) =>
          tag.toLowerCase().includes(searchQuery.toLowerCase()),
        );

      const matchesCategory =
        selectedCategory === "all" || template.category === selectedCategory;
      const matchesDifficulty =
        difficultyFilter === "all" || template.difficulty === difficultyFilter;

      return matchesSearch && matchesCategory && matchesDifficulty;
    })
    .sort((a, b) => {
      switch (sortBy) {
        case "name":
          return a.title.localeCompare(b.title);
        case "difficulty": {
          const difficultyOrder = { BEGINNER: 1, INTERMEDIATE: 2, ADVANCED: 3 };
          return difficultyOrder[a.difficulty] - difficultyOrder[b.difficulty];
        }
        case "duration":
          return a.estimatedTime - b.estimatedTime;
        case "popularity":
          return b.usageCount - a.usageCount;
        default:
          return 0;
      }
    });

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case "BEGINNER":
        return "bg-green-100 text-green-800";
      case "INTERMEDIATE":
        return "bg-yellow-100 text-yellow-800";
      case "ADVANCED":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const TemplateCard = ({ template }: { template: LabTemplate }) => (
    <Card className="hover:shadow-md transition-shadow cursor-pointer">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <CardTitle className="text-lg mb-1">{template.title}</CardTitle>
            <CardDescription className="text-sm line-clamp-2">
              {template.description}
            </CardDescription>
          </div>
          <Badge className={getDifficultyColor(template.difficulty)}>
            {template.difficulty}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="pt-0">
        <div className="flex items-center gap-4 text-sm text-muted-foreground mb-3">
          <div className="flex items-center gap-1">
            <Clock className="h-4 w-4" />
            {template.estimatedTime}min
          </div>
          <div className="flex items-center gap-1">
            <Users className="h-4 w-4" />
            {template.usageCount}
          </div>
          <div className="flex items-center gap-1">
            <Star className="h-4 w-4" />
            4.5
          </div>
        </div>

        <div className="flex flex-wrap gap-1 mb-4">
          {template.tags.slice(0, 3).map((tag) => (
            <Badge key={tag} variant="secondary" className="text-xs">
              {tag}
            </Badge>
          ))}
          {template.tags.length > 3 && (
            <Badge variant="secondary" className="text-xs">
              +{template.tags.length - 3}
            </Badge>
          )}
        </div>

        <div className="flex gap-2">
          <Button
            size="sm"
            className="flex-1"
            onClick={() => onSelectTemplate(template)}
          >
            Use Template
          </Button>
          <Button
            size="sm"
            variant="outline"
            onClick={() => onPreviewTemplate(template)}
          >
            Preview
          </Button>
        </div>
      </CardContent>
    </Card>
  );

  const TemplateListItem = ({ template }: { template: LabTemplate }) => (
    <Card className="hover:shadow-sm transition-shadow">
      <CardContent className="p-4">
        <div className="flex items-center justify-between">
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-2">
              <h3 className="font-semibold">{template.title}</h3>
              <Badge className={getDifficultyColor(template.difficulty)}>
                {template.difficulty}
              </Badge>
            </div>
            <p className="text-sm text-muted-foreground mb-2 line-clamp-1">
              {template.description}
            </p>
            <div className="flex items-center gap-4 text-sm text-muted-foreground">
              <div className="flex items-center gap-1">
                <Clock className="h-4 w-4" />
                {template.estimatedTime}min
              </div>
              <div className="flex items-center gap-1">
                <Users className="h-4 w-4" />
                {template.usageCount} uses
              </div>
              <div className="flex flex-wrap gap-1">
                {template.tags.slice(0, 2).map((tag) => (
                  <Badge key={tag} variant="secondary" className="text-xs">
                    {tag}
                  </Badge>
                ))}
              </div>
            </div>
          </div>
          <div className="flex gap-2 ml-4">
            <Button size="sm" onClick={() => onSelectTemplate(template)}>
              Use Template
            </Button>
            <Button
              size="sm"
              variant="outline"
              onClick={() => onPreviewTemplate(template)}
            >
              Preview
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );

  return (
    <div className="space-y-6">
      {/* Search and Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search templates..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>

        <div className="flex gap-2">
          <Select value={selectedCategory} onValueChange={setSelectedCategory}>
            <SelectTrigger className="w-40">
              <SelectValue placeholder="Category" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Categories</SelectItem>
              {templateCategories.map((category) => (
                <SelectItem key={category.id} value={category.id}>
                  {category.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select value={difficultyFilter} onValueChange={setDifficultyFilter}>
            <SelectTrigger className="w-32">
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
            onValueChange={(value: string) =>
              setSortBy(
                value as "name" | "difficulty" | "duration" | "popularity",
              )
            }
          >
            <SelectTrigger className="w-32">
              <SelectValue placeholder="Sort by" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="popularity">Popular</SelectItem>
              <SelectItem value="name">Name</SelectItem>
              <SelectItem value="difficulty">Difficulty</SelectItem>
              <SelectItem value="duration">Duration</SelectItem>
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

      {/* Categories Tabs */}
      <Tabs value={selectedCategory} onValueChange={setSelectedCategory}>
        <TabsList className="grid w-full grid-cols-6">
          <TabsTrigger value="all">All</TabsTrigger>
          {templateCategories.map((category) => (
            <TabsTrigger key={category.id} value={category.id}>
              {category.name.split(" ")[0]}
            </TabsTrigger>
          ))}
        </TabsList>

        <TabsContent value="all" className="mt-6">
          <div className="mb-4">
            <p className="text-sm text-muted-foreground">
              Showing {filteredTemplates.length} templates
            </p>
          </div>

          {viewMode === "grid" ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredTemplates.map((template) => (
                <TemplateCard key={template.id} template={template} />
              ))}
            </div>
          ) : (
            <div className="space-y-4">
              {filteredTemplates.map((template) => (
                <TemplateListItem key={template.id} template={template} />
              ))}
            </div>
          )}
        </TabsContent>

        {templateCategories.map((category) => (
          <TabsContent key={category.id} value={category.id} className="mt-6">
            <div className="mb-6">
              <h2 className="text-2xl font-bold mb-2">{category.name}</h2>
              <p className="text-muted-foreground">{category.description}</p>
            </div>

            {viewMode === "grid" ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {category.templates.map((template) => (
                  <TemplateCard key={template.id} template={template} />
                ))}
              </div>
            ) : (
              <div className="space-y-4">
                {category.templates.map((template) => (
                  <TemplateListItem key={template.id} template={template} />
                ))}
              </div>
            )}
          </TabsContent>
        ))}
      </Tabs>

      {filteredTemplates.length === 0 && (
        <div className="text-center py-12">
          <p className="text-muted-foreground">
            No templates found matching your criteria.
          </p>
          <Button
            variant="outline"
            className="mt-4 bg-transparent"
            onClick={() => {
              setSearchQuery("");
              setSelectedCategory("all");
              setDifficultyFilter("all");
            }}
          >
            Clear Filters
          </Button>
        </div>
      )}
    </div>
  );
}
