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
  LogIn,
  Rocket,
  BookOpen,
  Upload,
  Lightbulb,
  ChevronRight,
} from "lucide-react";

export default function UsingLabInstanceLabContent() {
  const { clearTutorial } = useTutorialStore();
  return (
    <div className="container mx-auto px-4 py-12 md:px-6 lg:py-16 min-h-screen">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-center text-4xl font-extrabold tracking-tight text-gray-900 dark:text-gray-50 sm:text-5xl lg:text-6xl mb-12">
          Tutorial: Using Lab Instance & Lab Content
        </h1>

        <div className="grid gap-8">
          {/* Step 1: Accessing a Lab */}
          <Card className="shadow-lg hover:shadow-xl transition-shadow duration-300">
            <CardHeader className="flex flex-row items-center space-x-4 pb-2">
              <LogIn className="h-8 w-8 text-blue-600 dark:text-blue-400" />
              <CardTitle className="text-2xl font-bold text-gray-800 dark:text-gray-100">
                1. Accessing a Lab
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-4 text-gray-700 dark:text-gray-300">
              <ul className="list-none space-y-3">
                <li className="flex items-start">
                  <ChevronRight className="h-5 w-5 text-blue-500 dark:text-blue-300 mr-2 mt-1 shrink-0" />
                  Ensure you are logged in to the website.
                </li>
                <li className="flex items-start">
                  <ChevronRight className="h-5 w-5 text-blue-500 dark:text-blue-300 mr-2 mt-1 shrink-0" />
                  Navigate to the{SPACE}
                  <span className="font-semibold text-gray-900 dark:text-gray-50">
                    Labs
                  </span>
                  {SPACE}
                  section via{SPACE}
                  <span className="font-semibold text-gray-900 dark:text-gray-50">
                    classroom
                  </span>
                  ,and then navigate to one of the{SPACE}
                  <span className="font-semibold text-gray-900 dark:text-gray-50">
                    projects
                  </span>
                </li>

                <li className="flex items-start">
                  <ChevronRight className="h-5 w-5 text-blue-500 dark:text-blue-300 mr-2 mt-1 shrink-0" />
                  Select a lab from the list to view its details.
                </li>
              </ul>
            </CardContent>
          </Card>

          {/* Step 2: Launching a Lab */}
          <Card className="shadow-lg hover:shadow-xl transition-shadow duration-300">
            <CardHeader className="flex flex-row items-center space-x-4 pb-2">
              <Rocket className="h-8 w-8 text-green-600 dark:text-green-400" />
              <CardTitle className="text-2xl font-bold text-gray-800 dark:text-gray-100">
                2. Launching a Lab Instance
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-4 text-gray-700 dark:text-gray-300">
              <ul className="list-none space-y-3">
                <li className="flex items-start">
                  <ChevronRight className="h-5 w-5 text-green-500 dark:text-green-300 mr-2 mt-1 shrink-0" />
                  Click{SPACE}
                  <span className="font-semibold text-gray-900 dark:text-gray-50">
                    Start Lab
                  </span>
                  {SPACE}
                  or{SPACE}
                  <span className="font-semibold text-gray-900 dark:text-gray-50">
                    Launch Lab Instance
                  </span>
                  .
                </li>
                <li className="flex items-start">
                  <ChevronRight className="h-5 w-5 text-green-500 dark:text-green-300 mr-2 mt-1 shrink-0" />
                  The system will provision a new lab environment (network
                  topology, devices, etc.).
                </li>
                <li className="flex items-start">
                  <ChevronRight className="h-5 w-5 text-green-500 dark:text-green-300 mr-2 mt-1 shrink-0" />
                  Wait for the lab environment to initialize; you’ll see a
                  visual topology and device list.
                </li>
              </ul>
            </CardContent>
          </Card>

          {/* Step 3: Exploring Lab Content */}
          <Card className="shadow-lg hover:shadow-xl transition-shadow duration-300">
            <CardHeader className="flex flex-row items-center space-x-4 pb-2">
              <BookOpen className="h-8 w-8 text-purple-600 dark:text-purple-400" />
              <CardTitle className="text-2xl font-bold text-gray-800 dark:text-gray-100">
                3. Exploring Lab Content
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-4 text-gray-700 dark:text-gray-300">
              <ul className="list-none space-y-3">
                <li className="flex items-start">
                  <ChevronRight className="h-5 w-5 text-purple-500 dark:text-purple-300 mr-2 mt-1 shrink-0" />
                  The{SPACE}
                  <span className="font-semibold text-gray-900 dark:text-gray-50">
                    Lab Guide
                  </span>
                  {SPACE}
                  tab provides step-by-step instructions, code snippets, and
                  tasks.
                </li>
                <li className="flex items-start">
                  <ChevronRight className="h-5 w-5 text-purple-500 dark:text-purple-300 mr-2 mt-1 shrink-0" />
                  Use the sidebar to view objectives, resources, and progress.
                </li>
                <li className="flex items-start">
                  <ChevronRight className="h-5 w-5 text-purple-500 dark:text-purple-300 mr-2 mt-1 shrink-0" />
                  Follow each step in the guide:
                  <ul className="list-none pl-6 mt-2 space-y-2">
                    <li className="flex items-start">
                      <span className="text-gray-500 dark:text-gray-400 mr-2 mt-1 shrink-0">
                        •
                      </span>
                      Read instructions.
                    </li>
                    <li className="flex items-start">
                      <span className="text-gray-500 dark:text-gray-400 mr-2 mt-1 shrink-0">
                        •
                      </span>
                      Execute commands on devices (via GNS3 client or integrated
                      terminals).
                    </li>
                    <li className="flex items-start">
                      <span className="text-gray-500 dark:text-gray-400 mr-2 mt-1 shrink-0">
                        •
                      </span>
                      Complete tasks and mark them as done.
                    </li>
                  </ul>
                </li>
              </ul>
            </CardContent>
          </Card>

          {/* Step 4: Submitting Lab Work */}
          <Card className="shadow-lg hover:shadow-xl transition-shadow duration-300">
            <CardHeader className="flex flex-row items-center space-x-4 pb-2">
              <Upload className="h-8 w-8 text-orange-600 dark:text-orange-400" />
              <CardTitle className="text-2xl font-bold text-gray-800 dark:text-gray-100">
                4. Submitting Lab Work
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-4 text-gray-700 dark:text-gray-300">
              <ul className="list-none space-y-3">
                <li className="flex items-start">
                  <ChevronRight className="h-5 w-5 text-orange-500 dark:text-orange-300 mr-2 mt-1 shrink-0" />
                  When finished, click{SPACE}
                  <span className="font-semibold text-gray-900 dark:text-gray-50">
                    Submit Lab
                  </span>
                  .
                </li>
                <li className="flex items-start">
                  <ChevronRight className="h-5 w-5 text-orange-500 dark:text-orange-300 mr-2 mt-1 shrink-0" />
                  Upload required files, screenshots, or results as prompted.
                </li>
                <li className="flex items-start">
                  <ChevronRight className="h-5 w-5 text-orange-500 dark:text-orange-300 mr-2 mt-1 shrink-0" />
                  Confirm submission; your instructor will review and grade your
                  work.
                </li>
              </ul>
            </CardContent>
          </Card>

          {/* Step 5: Tips */}
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
                  Use the{SPACE}
                  <span className="font-semibold text-gray-900 dark:text-gray-50">
                    Environment
                  </span>
                  {SPACE}
                  tab to interact with network devices.
                </li>
                <li className="flex items-start">
                  <ChevronRight className="h-5 w-5 text-yellow-500 dark:text-yellow-300 mr-2 mt-1 shrink-0" />
                  Refer to the{SPACE}
                  <span className="font-semibold text-gray-900 dark:text-gray-50">
                    Resources
                  </span>
                  {SPACE}
                  section for documentation or reference configs.
                </li>
                <li className="flex items-start">
                  <ChevronRight className="h-5 w-5 text-yellow-500 dark:text-yellow-300 mr-2 mt-1 shrink-0" />
                  Track your progress in the sidebar.
                </li>
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
