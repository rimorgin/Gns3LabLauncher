import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@clnt/components/ui/card";
import {
  BarChart,
  CalendarDays,
  CheckCircle,
  Lightbulb,
  ChevronRight,
} from "lucide-react";
import { Button } from "@clnt/components/ui/button";
import { useTutorialStore } from "@clnt/lib/store/tutorial-store";

export default function ViewingReportsTutorial() {
  const { clearTutorial } = useTutorialStore();
  return (
    <div className="container mx-auto px-4 py-12 md:px-6 lg:py-16 min-h-screen">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-center text-4xl font-extrabold tracking-tight text-gray-900 dark:text-gray-50 sm:text-5xl lg:text-6xl mb-12">
          Tutorial: Viewing Reports – Completions & Calendar
        </h1>

        <div className="grid gap-8">
          <Card className="shadow-lg hover:shadow-xl transition-shadow duration-300">
            <CardHeader className="flex flex-row items-center space-x-4 pb-2">
              <BarChart className="h-8 w-8 text-blue-600 dark:text-blue-400" />
              <CardTitle className="text-2xl font-bold text-gray-800 dark:text-gray-100">
                1. Accessing the Reports Section
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-4 text-gray-700 dark:text-gray-300">
              <ul className="list-none space-y-3">
                <li className="flex items-start">
                  <ChevronRight className="h-5 w-5 text-blue-500 dark:text-blue-300 mr-2 mt-1 shrink-0" />
                  Log in to the Gns3LabLauncher web client.
                </li>
                <li className="flex items-start">
                  <ChevronRight className="h-5 w-5 text-blue-500 dark:text-blue-300 mr-2 mt-1 shrink-0" />
                  Navigate to the{" "}
                  <span className="font-semibold text-gray-900 dark:text-gray-50">
                    Reports
                  </span>{" "}
                  or{" "}
                  <span className="font-semibold text-gray-900 dark:text-gray-50">
                    Dashboard
                  </span>{" "}
                  section from the main menu.
                </li>
              </ul>
            </CardContent>
          </Card>

          <Card className="shadow-lg hover:shadow-xl transition-shadow duration-300">
            <CardHeader className="flex flex-row items-center space-x-4 pb-2">
              <CheckCircle className="h-8 w-8 text-green-600 dark:text-green-400" />
              <CardTitle className="text-2xl font-bold text-gray-800 dark:text-gray-100">
                2. Using the Completions Tab
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-4 text-gray-700 dark:text-gray-300">
              <ul className="list-none space-y-3">
                <li className="flex items-start">
                  <ChevronRight className="h-5 w-5 text-green-500 dark:text-green-300 mr-2 mt-1 shrink-0" />
                  Click on the{" "}
                  <span className="font-semibold text-gray-900 dark:text-gray-50">
                    Completions
                  </span>{" "}
                  tab.
                </li>
                <li className="flex items-start">
                  <ChevronRight className="h-5 w-5 text-green-500 dark:text-green-300 mr-2 mt-1 shrink-0" />
                  Here you can view:
                  <ul className="list-disc pl-6 mt-2 space-y-1">
                    <li>A list of labs and projects you have completed.</li>
                    <li>
                      Progress bars or completion percentages for each lab.
                    </li>
                    <li>Dates and times of completion.</li>
                  </ul>
                </li>
                <li className="flex items-start">
                  <ChevronRight className="h-5 w-5 text-green-500 dark:text-green-300 mr-2 mt-1 shrink-0" />
                  Use filters or search to find specific labs or projects.
                </li>
              </ul>
            </CardContent>
          </Card>

          <Card className="shadow-lg hover:shadow-xl transition-shadow duration-300">
            <CardHeader className="flex flex-row items-center space-x-4 pb-2">
              <CalendarDays className="h-8 w-8 text-purple-600 dark:text-purple-400" />
              <CardTitle className="text-2xl font-bold text-gray-800 dark:text-gray-100">
                3. Using the Calendar Tab
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-4 text-gray-700 dark:text-gray-300">
              <ul className="list-none space-y-3">
                <li className="flex items-start">
                  <ChevronRight className="h-5 w-5 text-purple-500 dark:text-purple-300 mr-2 mt-1 shrink-0" />
                  Click on the{" "}
                  <span className="font-semibold text-gray-900 dark:text-gray-50">
                    Calendar
                  </span>{" "}
                  tab.
                </li>
                <li className="flex items-start">
                  <ChevronRight className="h-5 w-5 text-purple-500 dark:text-purple-300 mr-2 mt-1 shrink-0" />
                  The calendar displays:
                  <ul className="list-disc pl-6 mt-2 space-y-1">
                    <li>Upcoming lab deadlines and project due dates.</li>
                    <li>Scheduled classroom sessions or events.</li>
                    <li>
                      Your completed labs and submissions marked on the
                      calendar.
                    </li>
                  </ul>
                </li>
                <li className="flex items-start">
                  <ChevronRight className="h-5 w-5 text-purple-500 dark:text-purple-300 mr-2 mt-1 shrink-0" />
                  Click on any date to view details or upcoming tasks.
                </li>
              </ul>
            </CardContent>
          </Card>

          <Card className="shadow-lg hover:shadow-xl transition-shadow duration-300">
            <CardHeader className="flex flex-row items-center space-x-4 pb-2">
              <Lightbulb className="h-8 w-8 text-yellow-600 dark:text-yellow-400" />
              <CardTitle className="text-2xl font-bold text-gray-800 dark:text-gray-100">
                4. Tips
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-4 text-gray-700 dark:text-gray-300">
              <ul className="list-none space-y-3">
                <li className="flex items-start">
                  <ChevronRight className="h-5 w-5 text-yellow-500 dark:text-yellow-300 mr-2 mt-1 shrink-0" />
                  Check the{" "}
                  <span className="font-semibold text-gray-900 dark:text-gray-50">
                    Completions
                  </span>{" "}
                  tab regularly to track your progress.
                </li>
                <li className="flex items-start">
                  <ChevronRight className="h-5 w-5 text-yellow-500 dark:text-yellow-300 mr-2 mt-1 shrink-0" />
                  Use the{" "}
                  <span className="font-semibold text-gray-900 dark:text-gray-50">
                    Calendar
                  </span>{" "}
                  tab to plan your work and avoid missing deadlines.
                </li>
                <li className="flex items-start">
                  <ChevronRight className="h-5 w-5 text-yellow-500 dark:text-yellow-300 mr-2 mt-1 shrink-0" />
                  If you see missing or incorrect data, contact your instructor
                  for assistance.
                </li>
                <li className="flex items-start">
                  <ChevronRight className="h-5 w-5 text-yellow-500 dark:text-yellow-300 mr-2 mt-1 shrink-0" />
                  With these tabs, you can easily monitor your learning progress
                  and stay organized!
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
