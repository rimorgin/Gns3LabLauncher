import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@clnt/components/ui/card";
import {
  Users,
  BookOpen,
  FlaskConical,
  Link,
  ShieldCheck,
  Lightbulb,
  ChevronRight,
} from "lucide-react";
import { Button } from "@clnt/components/ui/button";
import { SPACE } from "@clnt/components/contents/tutorial-content";
import { useTutorialStore } from "@clnt/lib/store/tutorial-store";

export default function ManagingEntitiesTutorial() {
  const { clearTutorial } = useTutorialStore();
  return (
    <div className="container mx-auto px-4 py-12 md:px-6 lg:py-16  min-h-screen">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-center text-4xl font-extrabold tracking-tight text-gray-900 dark:text-gray-50 sm:text-5xl lg:text-6xl mb-12">
          Tutorial: Managing Entities
        </h1>

        <div className="grid gap-8">
          <Card className="shadow-lg hover:shadow-xl transition-shadow duration-300">
            <CardHeader className="flex flex-row items-center space-x-4 pb-2">
              <Users className="h-8 w-8 text-blue-600 dark:text-blue-400" />
              <CardTitle className="text-2xl font-bold text-gray-800 dark:text-gray-100">
                1. Users & User-Groups
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-4 text-gray-700 dark:text-gray-300">
              <ul className="list-none space-y-3">
                <li className="flex items-start flex-wrap">
                  <ChevronRight className="h-5 w-5 text-blue-500 dark:text-blue-300 mr-2 mt-1 shrink-0" />
                  <div className="flex-1">
                    <span className="font-semibold text-gray-900 dark:text-gray-50">
                      Add:{" "}
                    </span>
                    Go to the{" "}
                    <span className="font-semibold text-gray-900 dark:text-gray-50">
                      User Management
                    </span>{" "}
                    section. Click "Add User" or "Create Group", fill in the
                    required details, and submit.
                  </div>
                </li>
                <li className="flex items-start flex-wrap">
                  <ChevronRight className="h-5 w-5 text-blue-500 dark:text-blue-300 mr-2 mt-1 shrink-0" />
                  <div className="flex-1">
                    <span className="font-semibold text-gray-900 dark:text-gray-50">
                      Update:{" "}
                    </span>
                    Select a user or group, click "Edit", modify the
                    information, and save changes.
                  </div>
                </li>
                <li className="flex items-start flex-wrap">
                  <ChevronRight className="h-5 w-5 text-blue-500 dark:text-blue-300 mr-2 mt-1 shrink-0" />
                  <div className="flex-1">
                    <span className="font-semibold text-gray-900 dark:text-gray-50">
                      Delete:{" "}
                    </span>
                    Select the user or group, click "Delete", and confirm the
                    action.
                  </div>
                </li>
              </ul>
            </CardContent>
          </Card>

          <Card className="shadow-lg hover:shadow-xl transition-shadow duration-300">
            <CardHeader className="flex flex-row items-center space-x-4 pb-2">
              <BookOpen className="h-8 w-8 text-green-600 dark:text-green-400" />
              <CardTitle className="text-2xl font-bold text-gray-800 dark:text-gray-100">
                2. Courses & Classrooms
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-4 text-gray-700 dark:text-gray-300">
              <ul className="list-none space-y-3">
                <li className="flex items-start flex-wrap">
                  <ChevronRight className="h-5 w-5 text-green-500 dark:text-green-300 mr-2 mt-1 shrink-0" />
                  <div className="flex-1">
                    <span className="font-semibold text-gray-900 dark:text-gray-50">
                      Add:
                    </span>
                    {SPACE}
                    In the{SPACE}
                    <span className="font-semibold text-gray-900 dark:text-gray-50">
                      Courses/Classrooms
                    </span>
                    {SPACE}
                    dashboard, click "Create Course" or "Create Classroom",
                    enter details, and submit.
                  </div>
                </li>
                <li className="flex items-start flex-wrap">
                  <ChevronRight className="h-5 w-5 text-green-500 dark:text-green-300 mr-2 mt-1 shrink-0" />
                  <span className="font-semibold text-gray-900 dark:text-gray-50">
                    Update:
                  </span>
                  {SPACE}
                  Select the course/classroom, click "Edit", update info, and
                  save.
                </li>
                <li className="flex items-start flex-wrap">
                  <ChevronRight className="h-5 w-5 text-green-500 dark:text-green-300 mr-2 mt-1 shrink-0" />
                  <span className="font-semibold text-gray-900 dark:text-gray-50">
                    Delete:
                  </span>
                  {SPACE}
                  Select the course/classroom, click "Delete", and confirm.
                </li>
              </ul>
            </CardContent>
          </Card>

          <Card className="shadow-lg hover:shadow-xl transition-shadow duration-300">
            <CardHeader className="flex flex-row items-center space-x-4 pb-2">
              <FlaskConical className="h-8 w-8 text-purple-600 dark:text-purple-400" />
              <CardTitle className="text-2xl font-bold text-gray-800 dark:text-gray-100">
                3. Projects & Labs
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-4 text-gray-700 dark:text-gray-300">
              <ul className="list-none space-y-3">
                <li className="flex items-start">
                  <ChevronRight className="h-5 w-5 text-purple-500 dark:text-purple-300 mr-2 mt-1 shrink-0" />
                  <span className="font-semibold text-gray-900 dark:text-gray-50">
                    Add:
                  </span>
                  {SPACE}
                  Use the{SPACE}
                  <span className="font-semibold text-gray-900 dark:text-gray-50">
                    Lab Builder
                  </span>
                  {SPACE}
                  or{SPACE}
                  <span className="font-semibold text-gray-900 dark:text-gray-50">
                    Project Create Form
                  </span>
                  {SPACE}
                  to create new labs/projects. Fill in all required steps and
                  publish.
                </li>
                <li className="flex items-start">
                  <ChevronRight className="h-5 w-5 text-purple-500 dark:text-purple-300 mr-2 mt-1 shrink-0" />
                  <span className="font-semibold text-gray-900 dark:text-gray-50">
                    Update:
                  </span>
                  {SPACE}
                  Select an existing lab/project, click "Edit", make changes,
                  and save/publish.
                </li>
                <li className="flex items-start">
                  <ChevronRight className="h-5 w-5 text-purple-500 dark:text-purple-300 mr-2 mt-1 shrink-0" />
                  <span className="font-semibold text-gray-900 dark:text-gray-50">
                    Delete:
                  </span>
                  {SPACE}
                  Select the lab/project, click "Delete", and confirm.
                </li>
              </ul>
            </CardContent>
          </Card>

          <Card className="shadow-lg hover:shadow-xl transition-shadow duration-300">
            <CardHeader className="flex flex-row items-center space-x-4 pb-2">
              <Link className="h-8 w-8 text-orange-600 dark:text-orange-400" />
              <CardTitle className="text-2xl font-bold text-gray-800 dark:text-gray-100">
                4. Assigning & Organizing
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-4 text-gray-700 dark:text-gray-300">
              <ul className="list-none space-y-3">
                <li className="flex items-start">
                  <ChevronRight className="h-5 w-5 text-orange-500 dark:text-orange-300 mr-2 mt-1 shrink-0" />
                  Assign users to groups, classrooms, or courses via the
                  respective management dashboards.
                </li>
                <li className="flex items-start">
                  <ChevronRight className="h-5 w-5 text-orange-500 dark:text-orange-300 mr-2 mt-1 shrink-0" />
                  Assign labs/projects to classrooms or courses for student
                  access.
                </li>
              </ul>
            </CardContent>
          </Card>

          <Card className="shadow-lg hover:shadow-xl transition-shadow duration-300">
            <CardHeader className="flex flex-row items-center space-x-4 pb-2">
              <ShieldCheck className="h-8 w-8 text-yellow-600 dark:text-yellow-400" />
              <CardTitle className="text-2xl font-bold text-gray-800 dark:text-gray-100">
                5. Permissions & Roles
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-4 text-gray-700 dark:text-gray-300">
              <ul className="list-none space-y-3">
                <li className="flex items-start">
                  <ChevronRight className="h-5 w-5 text-yellow-500 dark:text-yellow-300 mr-2 mt-1 shrink-0" />
                  Manage user roles (student, instructor, admin) in the User
                  Management section.
                </li>
                <li className="flex items-start">
                  <ChevronRight className="h-5 w-5 text-yellow-500 dark:text-yellow-300 mr-2 mt-1 shrink-0" />
                  Set access levels for courses, classrooms, labs, and projects.
                </li>
              </ul>
            </CardContent>
          </Card>

          <Card className="shadow-lg hover:shadow-xl transition-shadow duration-300">
            <CardHeader className="flex flex-row items-center space-x-4 pb-2">
              <Lightbulb className="h-8 w-8 text-gray-600 dark:text-gray-400" />
              <CardTitle className="text-2xl font-bold text-gray-800 dark:text-gray-100">
                Tip
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-4 text-gray-700 dark:text-gray-300">
              <p className="flex items-start">
                <ChevronRight className="h-5 w-5 text-gray-500 dark:text-gray-300 mr-2 mt-1 shrink-0" />
                All entity management actions are available in the
                admin/instructor dashboard, typically under "Management",
                "Settings", or "Builder" sections. Always confirm changes before
                saving or deleting.
              </p>
            </CardContent>
          </Card>
        </div>
        <div className="mt-12 text-center">
          <Button variant="outline" onClick={clearTutorial}>
            Back to All Tutorials
          </Button>
        </div>
      </div>
    </div>
  );
}
