import { SPACE } from "@clnt/components/contents/tutorial-content";
import { Button } from "@clnt/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@clnt/components/ui/card";
import { useTutorialStore } from "@clnt/lib/store/tutorial-store";
import {
  Lightbulb,
  ChevronRight,
  PlusCircle,
  GraduationCap,
  Monitor,
  Users,
} from "lucide-react";

export default function ManagingLabInstancesAndContentTutorial() {
  const { clearTutorial } = useTutorialStore();
  return (
    <div className="container mx-auto px-4 py-12 md:px-6 lg:py-16 min-h-screen">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-center text-4xl font-extrabold tracking-tight text-gray-900 dark:text-gray-50 sm:text-5xl lg:text-6xl mb-12">
          Tutorial: Managing Lab Instances & Content
        </h1>

        <div className="grid gap-8">
          <Card className="shadow-lg hover:shadow-xl transition-shadow duration-300">
            <CardHeader className="flex flex-row items-center space-x-4 pb-2">
              <PlusCircle className="h-8 w-8 text-blue-600 dark:text-blue-400" />
              <CardTitle className="text-2xl font-bold text-gray-800 dark:text-gray-100">
                1. Creating and Publishing Labs
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-4 text-gray-700 dark:text-gray-300">
              <ul className="list-none space-y-3">
                <li className="flex items-start">
                  <ChevronRight className="h-5 w-5 text-blue-500 dark:text-blue-300 mr-2 mt-1 shrink-0" />
                  ensure logged in as an instructor or administrator.
                </li>
                <li className="flex items-start">
                  <ChevronRight className="h-5 w-5 text-blue-500 dark:text-blue-300 mr-2 mt-1 shrink-0" />
                  Go to the
                  <span className="font-semibold text-gray-900 dark:text-gray-50">
                    {SPACE}Lab Builder{SPACE}
                  </span>
                  section.
                </li>
                <li className="flex items-start">
                  <ChevronRight className="h-5 w-5 text-blue-500 dark:text-blue-300 mr-2 mt-1 shrink-0" />
                  Use the multi-step wizard to:
                  <ul className="list-disc pl-6 mt-2 space-y-2">
                    <li>Define lab info (title, description, objectives).</li>
                    <li>Design the network topology and devices.</li>
                    <li>Write the lab guide and tasks.</li>
                    <li>Attach resources and references.</li>
                    <li>Set lab settings (visibility, deadlines, grading).</li>
                    <li>Preview and test the lab.</li>
                  </ul>
                </li>
                <li className="flex items-start">
                  <ChevronRight className="h-5 w-5 text-blue-500 dark:text-blue-300 mr-2 mt-1 shrink-0" />
                  Click{SPACE}
                  <span className="font-semibold text-gray-900 dark:text-gray-50">
                    Publish
                  </span>
                  {SPACE}
                  to make the lab available to students.
                </li>
              </ul>
            </CardContent>
          </Card>

          <Card className="shadow-lg hover:shadow-xl transition-shadow duration-300">
            <CardHeader className="flex flex-row items-center space-x-4 pb-2">
              <Monitor className="h-8 w-8 text-green-600 dark:text-green-400" />
              <CardTitle className="text-2xl font-bold text-gray-800 dark:text-gray-100">
                2. Managing Lab Instances
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-4 text-gray-700 dark:text-gray-300">
              <ul className="list-none space-y-3">
                <li className="flex items-start">
                  <ChevronRight className="h-5 w-5 text-green-500 dark:text-green-300 mr-2 mt-1 shrink-0" />
                  View all active lab instances from the{SPACE}
                  <span className="font-semibold text-gray-900 dark:text-gray-50">
                    Lab Management
                  </span>
                  {SPACE}
                  dashboard.
                </li>
                <li className="flex items-start">
                  <ChevronRight className="h-5 w-5 text-green-500 dark:text-green-300 mr-2 mt-1 shrink-0" />
                  Monitor student progress and activity in real time.
                </li>
                <li className="flex items-start">
                  <ChevronRight className="h-5 w-5 text-green-500 dark:text-green-300 mr-2 mt-1 shrink-0" />
                  Start, stop, or reset lab environments as needed.
                </li>
                <li className="flex items-start">
                  <ChevronRight className="h-5 w-5 text-green-500 dark:text-green-300 mr-2 mt-1 shrink-0" />
                  Troubleshoot or assist students directly in their lab
                  instance.
                </li>
              </ul>
            </CardContent>
          </Card>

          <Card className="shadow-lg hover:shadow-xl transition-shadow duration-300">
            <CardHeader className="flex flex-row items-center space-x-4 pb-2">
              <GraduationCap className="h-8 w-8 text-purple-600 dark:text-purple-400" />
              <CardTitle className="text-2xl font-bold text-gray-800 dark:text-gray-100">
                3. Reviewing and Grading Submissions
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-4 text-gray-700 dark:text-gray-300">
              <ul className="list-none space-y-3">
                <li className="flex items-start">
                  <ChevronRight className="h-5 w-5 text-purple-500 dark:text-purple-300 mr-2 mt-1 shrink-0" />
                  Access the{SPACE}
                  <span className="font-semibold text-gray-900 dark:text-gray-50">
                    Submissions
                  </span>
                  {SPACE}
                  section for each lab.
                </li>
                <li className="flex items-start">
                  <ChevronRight className="h-5 w-5 text-purple-500 dark:text-purple-300 mr-2 mt-1 shrink-0" />
                  Review uploaded files, screenshots, and results.
                </li>
                <li className="flex items-start">
                  <ChevronRight className="h-5 w-5 text-purple-500 dark:text-purple-300 mr-2 mt-1 shrink-0" />
                  Provide feedback and assign grades.
                </li>
                <li className="flex items-start">
                  <ChevronRight className="h-5 w-5 text-purple-500 dark:text-purple-300 mr-2 mt-1 shrink-0" />
                  Track submission attempts and completion status.
                </li>
              </ul>
            </CardContent>
          </Card>

          <Card className="shadow-lg hover:shadow-xl transition-shadow duration-300">
            <CardHeader className="flex flex-row items-center space-x-4 pb-2">
              <Users className="h-8 w-8 text-orange-600 dark:text-orange-400" />
              <CardTitle className="text-2xl font-bold text-gray-800 dark:text-gray-100">
                4. Classroom and User Management
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-4 text-gray-700 dark:text-gray-300">
              <ul className="list-none space-y-3">
                <li className="flex items-start">
                  <ChevronRight className="h-5 w-5 text-orange-500 dark:text-orange-300 mr-2 mt-1 shrink-0" />
                  Organize students into classrooms or groups.
                </li>
                <li className="flex items-start">
                  <ChevronRight className="h-5 w-5 text-orange-500 dark:text-orange-300 mr-2 mt-1 shrink-0" />
                  Assign labs and projects to specific classrooms.
                </li>
                <li className="flex items-start">
                  <ChevronRight className="h-5 w-5 text-orange-500 dark:text-orange-300 mr-2 mt-1 shrink-0" />
                  Track overall progress, completion rates, and grades.
                </li>
                <li className="flex items-start">
                  <ChevronRight className="h-5 w-5 text-orange-500 dark:text-orange-300 mr-2 mt-1 shrink-0" />
                  Manage user roles and permissions.
                </li>
              </ul>
            </CardContent>
          </Card>

          <Card className="shadow-lg hover:shadow-xl transition-shadow duration-300">
            <CardHeader className="flex flex-row items-center space-x-4 pb-2">
              <Lightbulb className="h-8 w-8 text-yellow-600 dark:text-yellow-400" />
              <CardTitle className="text-2xl font-bold text-gray-800 dark:text-gray-100">
                5. Tips
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-4 text-gray-700 dark:text-gray-300">
              <ul className="list-none space-y-3">
                <li className="flex items-start">
                  <ChevronRight className="h-5 w-5 text-yellow-500 dark:text-yellow-300 mr-2 mt-1 shrink-0" />
                  Use analytics and logs to identify common issues or learning
                  gaps.
                </li>
                <li className="flex items-start">
                  <ChevronRight className="h-5 w-5 text-yellow-500 dark:text-yellow-300 mr-2 mt-1 shrink-0" />
                  Update lab content and guides as needed for clarity or
                  improvement.
                </li>
                {/* <li className="flex items-start">
                  <ChevronRight className="h-5 w-5 text-yellow-500 dark:text-yellow-300 mr-2 mt-1 shrink-0" />
                  Communicate with students via announcements or direct
                  messages.
                </li> */}
              </ul>
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
