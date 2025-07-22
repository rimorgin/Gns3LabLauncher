"use client";

import { useState } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@clnt/components/ui/card";
import { Button } from "@clnt/components/ui/button";
import { Input } from "@clnt/components/ui/input";
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@clnt/components/ui/avatar";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@clnt/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@clnt/components/ui/dropdown-menu";
import {
  Search,
  MoreHorizontal,
  Mail,
  User,
  Calendar,
  Clock,
} from "lucide-react";
import type { Student } from "@clnt/types/classroom";
import { stringInitials } from "@clnt/lib/utils";
import moment from "moment";
import { IconAt } from "@tabler/icons-react";

interface StudentsListProps {
  students: Student[];
  onViewStudent: (student: Student) => void;
  onMessageStudent: (student: Student) => void;
}

export function StudentsList({
  students,
  onViewStudent,
  onMessageStudent,
}: StudentsListProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const filteredStudents = students?.filter(
    (student) =>
      `${student?.user.name}`
        .toLowerCase()
        .includes(searchTerm.toLowerCase()) ||
      student.user.email.toLowerCase().includes(searchTerm.toLowerCase()),
  );
  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <User className="h-5 w-5" />
            Students ({students.length})
          </CardTitle>
          <div className="flex items-center gap-2">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search students..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 w-64"
              />
            </div>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        {filteredStudents.length === 0 ? (
          <div className="text-center py-8">
            <User className="h-12 w-12 mx-auto mb-4 text-muted-foreground opacity-50" />
            <h3 className="text-lg font-medium mb-2">
              {searchTerm ? "No students found" : "No students enrolled"}
            </h3>
            <p className="text-muted-foreground">
              {searchTerm
                ? "Try adjusting your search terms"
                : "Students will appear here once they're added to the classroom"}
            </p>
          </div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Student</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Enrolled</TableHead>
                <TableHead>Last Active</TableHead>
                <TableHead className="w-[100px]">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredStudents.map((student) => {
                return (
                  <TableRow key={student.userId}>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Avatar className="h-8 w-8">
                          <AvatarImage
                            src={student.user.profileImage || undefined}
                          />
                          <AvatarFallback randomizeBg className="text-xs">
                            {stringInitials(student?.user.name ?? "kolokoy")}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <div className="font-medium">{student.user.name}</div>
                          <div className="text-sm text-muted-foreground">
                            {student.user.username}
                          </div>
                        </div>
                      </div>
                    </TableCell>

                    <TableCell className="text-muted-foreground">
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-full bg-orange-100 flex items-center justify-center">
                          <IconAt className="h-4 w-4 text-orange-600" />
                        </div>
                        <div className="font-medium">{student.user.email}</div>
                      </div>
                    </TableCell>

                    <TableCell>
                      <div className="flex items-center gap-1 text-sm text-muted-foreground">
                        <Calendar className="h-3 w-3" />
                        {moment(new Date()).format("LLL")}
                      </div>
                    </TableCell>

                    <TableCell>
                      {student.lastActiveAt ? (
                        <div className="flex items-center gap-1 text-sm text-muted-foreground">
                          <Clock className="h-3 w-3" />
                          {moment(student.lastActiveAt ?? new Date()).format(
                            "LLL",
                          )}
                        </div>
                      ) : (
                        <span className="text-sm text-muted-foreground">
                          Never
                        </span>
                      )}
                    </TableCell>

                    <TableCell>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="sm">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem
                            onClick={() => onViewStudent(student)}
                          >
                            <User className="h-4 w-4 mr-2" />
                            View Profile
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={() => onMessageStudent(student)}
                          >
                            <Mail className="h-4 w-4 mr-2" />
                            Send Message
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        )}
      </CardContent>
    </Card>
  );
}
