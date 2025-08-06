import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@clnt/components/ui/card";
import {
  FlaskConical,
  TestTube,
  Save,
  UploadCloud,
  Lightbulb,
  ChevronRight,
  LayoutDashboard,
  PlusCircle,
} from "lucide-react";
import { Button } from "@clnt/components/ui/button";
import { useTutorialStore } from "@clnt/lib/store/tutorial-store";
import { SPACE } from "@clnt/components/contents/tutorial-content";

export default function LabsPlaygroundTutorial() {
  const { clearTutorial } = useTutorialStore();
  return (
    <div className="container mx-auto px-4 py-12 md:px-6 lg:py-16 min-h-screen">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-center text-4xl font-extrabold tracking-tight text-gray-900 dark:text-gray-50 sm:text-5xl lg:text-6xl mb-12">
          Tutorial: Labs Playground Tab
        </h1>

        <div className="grid gap-8">
          <Card className="shadow-lg hover:shadow-xl transition-shadow duration-300">
            <CardHeader className="flex flex-row items-center space-x-4 pb-2">
              <FlaskConical className="h-8 w-8 text-blue-600 dark:text-blue-400" />
              <CardTitle className="text-2xl font-bold text-gray-800 dark:text-gray-100">
                What is the Labs Playground Tab?
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-4 text-gray-700 dark:text-gray-300">
              <p className="mb-4">
                The{SPACE}
                <span className="font-semibold text-gray-900 dark:text-gray-50">
                  Labs Playground Tab
                </span>
                {SPACE}
                allows instructors and administrators to:
              </p>
              <ul className="list-none space-y-3">
                <li className="flex items-start">
                  <ChevronRight className="h-5 w-5 text-blue-500 dark:text-blue-300 mr-2 mt-1 shrink-0" />
                  Build, configure, and test lab topologies interactively.
                </li>
                <li className="flex items-start">
                  <ChevronRight className="h-5 w-5 text-blue-500 dark:text-blue-300 mr-2 mt-1 shrink-0" />
                  Experiment with network setups before publishing labs.
                </li>
                <li className="flex items-start">
                  <ChevronRight className="h-5 w-5 text-blue-500 dark:text-blue-300 mr-2 mt-1 shrink-0" />
                  Validate lab content and troubleshoot configurations.
                </li>
              </ul>
            </CardContent>
          </Card>

          <Card className="shadow-lg hover:shadow-xl transition-shadow duration-300">
            <CardHeader className="flex flex-row items-center space-x-4 pb-2">
              <LayoutDashboard className="h-8 w-8 text-green-600 dark:text-green-400" />
              <CardTitle className="text-2xl font-bold text-gray-800 dark:text-gray-100">
                1. How to Use: Access the Playground
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-4 text-gray-700 dark:text-gray-300">
              <ul className="list-none space-y-3">
                <li className="flex items-start">
                  <ChevronRight className="h-5 w-5 text-green-500 dark:text-green-300 mr-2 mt-1 shrink-0" />
                  Log in as an instructor or administrator.
                </li>
                <li className="flex items-start">
                  <ChevronRight className="h-5 w-5 text-green-500 dark:text-green-300 mr-2 mt-1 shrink-0" />
                  Navigate to the{SPACE}
                  <span className="font-semibold text-gray-900 dark:text-gray-50">
                    Labs Playground
                  </span>
                  {SPACE}
                  tab from the main dashboard or sidebar.
                </li>
              </ul>
            </CardContent>
          </Card>

          <Card className="shadow-lg hover:shadow-xl transition-shadow duration-300">
            <CardHeader className="flex flex-row items-center space-x-4 pb-2">
              <PlusCircle className="h-8 w-8 text-purple-600 dark:text-purple-400" />
              <CardTitle className="text-2xl font-bold text-gray-800 dark:text-gray-100">
                2. Create or Open a Project
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-4 text-gray-700 dark:text-gray-300">
              <ul className="list-none space-y-3">
                <li className="flex items-start">
                  <ChevronRight className="h-5 w-5 text-purple-500 dark:text-purple-300 mr-2 mt-1 shrink-0" />
                  Click{SPACE}
                  <span className="font-semibold text-gray-900 dark:text-gray-50">
                    New Project
                  </span>
                  {SPACE}
                  to start from scratch, or{SPACE}
                  <span className="font-semibold text-gray-900 dark:text-gray-50">
                    Open Project
                  </span>
                  {SPACE}
                  to modify an existing one.
                </li>
              </ul>
            </CardContent>
          </Card>

          <Card className="shadow-lg hover:shadow-xl transition-shadow duration-300">
            <CardHeader className="flex flex-row items-center space-x-4 pb-2">
              <TestTube className="h-8 w-8 text-orange-600 dark:text-orange-400" />
              <CardTitle className="text-2xl font-bold text-gray-800 dark:text-gray-100">
                3. Design Your Topology
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-4 text-gray-700 dark:text-gray-300">
              <ul className="list-none space-y-3">
                <li className="flex items-start">
                  <ChevronRight className="h-5 w-5 text-orange-500 dark:text-orange-300 mr-2 mt-1 shrink-0" />
                  Drag and drop devices (routers, switches, hosts) onto the
                  canvas.
                </li>
                <li className="flex items-start">
                  <ChevronRight className="h-5 w-5 text-orange-500 dark:text-orange-300 mr-2 mt-1 shrink-0" />
                  Connect devices as needed.
                </li>
                <li className="flex items-start">
                  <ChevronRight className="h-5 w-5 text-orange-500 dark:text-orange-300 mr-2 mt-1 shrink-0" />
                  Configure device settings and network parameters.
                </li>
              </ul>
            </CardContent>
          </Card>

          <Card className="shadow-lg hover:shadow-xl transition-shadow duration-300">
            <CardHeader className="flex flex-row items-center space-x-4 pb-2">
              <TestTube className="h-8 w-8 text-red-600 dark:text-red-400" />
              <CardTitle className="text-2xl font-bold text-gray-800 dark:text-gray-100">
                4. Test and Validate
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-4 text-gray-700 dark:text-gray-300">
              <ul className="list-none space-y-3">
                <li className="flex items-start">
                  <ChevronRight className="h-5 w-5 text-red-500 dark:text-red-300 mr-2 mt-1 shrink-0" />
                  Use the integrated console or GNS3 Desktop to interact with
                  devices.
                </li>
                <li className="flex items-start">
                  <ChevronRight className="h-5 w-5 text-red-500 dark:text-red-300 mr-2 mt-1 shrink-0" />
                  Run commands, scripts, or troubleshooting steps.
                </li>
                <li className="flex items-start">
                  <ChevronRight className="h-5 w-5 text-red-500 dark:text-red-300 mr-2 mt-1 shrink-0" />
                  Ensure all tasks and objectives can be completed as intended.
                </li>
              </ul>
            </CardContent>
          </Card>

          <Card className="shadow-lg hover:shadow-xl transition-shadow duration-300">
            <CardHeader className="flex flex-row items-center space-x-4 pb-2">
              <Save className="h-8 w-8 text-indigo-600 dark:text-indigo-400" />
              <CardTitle className="text-2xl font-bold text-gray-800 dark:text-gray-100">
                5. Save and Export
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-4 text-gray-700 dark:text-gray-300">
              <ul className="list-none space-y-3">
                <li className="flex items-start">
                  <ChevronRight className="h-5 w-5 text-indigo-500 dark:text-indigo-300 mr-2 mt-1 shrink-0" />
                  Save your playground project for future editing.
                </li>
                <li className="flex items-start">
                  <ChevronRight className="h-5 w-5 text-indigo-500 dark:text-indigo-300 mr-2 mt-1 shrink-0" />
                  Export the topology and configs to use as lab content.
                </li>
              </ul>
            </CardContent>
          </Card>

          <Card className="shadow-lg hover:shadow-xl transition-shadow duration-300">
            <CardHeader className="flex flex-row items-center space-x-4 pb-2">
              <UploadCloud className="h-8 w-8 text-yellow-600 dark:text-yellow-400" />
              <CardTitle className="text-2xl font-bold text-gray-800 dark:text-gray-100">
                6. Publish as Lab
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-4 text-gray-700 dark:text-gray-300">
              <ul className="list-none space-y-3">
                <li className="flex items-start">
                  <ChevronRight className="h-5 w-5 text-yellow-500 dark:text-yellow-300 mr-2 mt-1 shrink-0" />
                  Once validated, use the{SPACE}
                  <span className="font-semibold text-gray-900 dark:text-gray-50">
                    Lab Builder
                  </span>
                  {SPACE}
                  to convert your playground setup into a published lab for
                  learners.
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
                The playground is a safe space for experimentation—changes here
                won’t affect published labs.
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
