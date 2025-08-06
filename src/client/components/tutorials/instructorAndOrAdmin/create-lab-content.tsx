import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@clnt/components/ui/card";
import {
  UploadCloud,
  Settings,
  CheckCircle,
  LayoutList,
  ChevronRight,
  FileText,
  Lightbulb,
} from "lucide-react";
import { Button } from "@clnt/components/ui/button";
import { useTutorialStore } from "@clnt/lib/store/tutorial-store";

export default function CreateLabContentTutorial() {
  const { clearTutorial } = useTutorialStore();
  return (
    <div className="container mx-auto px-4 py-12 md:px-6 lg:py-16min-h-screen">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-center text-4xl font-extrabold tracking-tight text-gray-900 dark:text-gray-50 sm:text-5xl lg:text-6xl mb-12">
          Tutorial: Creating Lab Content in Gns3LabLauncher
        </h1>

        <div className="grid gap-8">
          <Card className="shadow-lg hover:shadow-xl transition-shadow duration-300">
            <CardHeader className="flex flex-row items-center space-x-4 pb-2">
              <LayoutList className="h-8 w-8 text-blue-600 dark:text-blue-400" />
              <CardTitle className="text-2xl font-bold text-gray-800 dark:text-gray-100">
                1. Design Your Lab Topology
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-4 text-gray-700 dark:text-gray-300">
              <ul className="list-none space-y-3">
                <li className="flex items-start">
                  <ChevronRight className="h-5 w-5 text-blue-500 dark:text-blue-300 mr-2 mt-1 shrink-0" />
                  <span className="font-semibold text-gray-900 dark:text-gray-50">
                    Conceptualize the Network:
                  </span>
                  <ul className="list-disc pl-6 mt-2 space-y-1">
                    <li>
                      Decide which devices (routers, switches, hosts) and
                      connections are needed.
                    </li>
                  </ul>
                </li>
                <li className="flex items-start">
                  <ChevronRight className="h-5 w-5 text-blue-500 dark:text-blue-300 mr-2 mt-1 shrink-0" />
                  <span className="font-semibold text-gray-900 dark:text-gray-50">
                    Diagram:
                  </span>
                  <ul className="list-disc pl-6 mt-2 space-y-1">
                    <li>Draw your network topology for reference.</li>
                  </ul>
                </li>
                <li className="flex items-start">
                  <ChevronRight className="h-5 w-5 text-blue-500 dark:text-blue-300 mr-2 mt-1 shrink-0" />
                  <span className="font-semibold text-gray-900 dark:text-gray-50">
                    Device List:
                  </span>
                  <ul className="list-disc pl-6 mt-2 space-y-1">
                    <li>
                      List all required virtual devices and their
                      specifications.
                    </li>
                  </ul>
                </li>
                <li className="flex items-start">
                  <ChevronRight className="h-5 w-5 text-blue-500 dark:text-blue-300 mr-2 mt-1 shrink-0" />
                  <span className="font-semibold text-gray-900 dark:text-gray-50">
                    IP Scheme & Protocols:
                  </span>
                  <ul className="list-disc pl-6 mt-2 space-y-1">
                    <li>
                      Plan IP addressing, routing protocols, and network
                      services.
                    </li>
                  </ul>
                </li>
              </ul>
            </CardContent>
          </Card>

          <Card className="shadow-lg hover:shadow-xl transition-shadow duration-300">
            <CardHeader className="flex flex-row items-center space-x-4 pb-2">
              <Settings className="h-8 w-8 text-purple-600 dark:text-purple-400" />
              <CardTitle className="text-2xl font-bold text-gray-800 dark:text-gray-100">
                2. Build and Configure in GNS3
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-4 text-gray-700 dark:text-gray-300">
              <ul className="list-none space-y-3">
                <li className="flex items-start">
                  <ChevronRight className="h-5 w-5 text-purple-500 dark:text-purple-300 mr-2 mt-1 shrink-0" />
                  <span className="font-semibold text-gray-900 dark:text-gray-50">
                    Open GNS3 Desktop or by launching playground in the Labs
                    Playground tab:
                  </span>
                  <ul className="list-disc pl-6 mt-2 space-y-1">
                    <li>Start a new project.</li>
                  </ul>
                </li>
                <li className="flex items-start">
                  <ChevronRight className="h-5 w-5 text-purple-500 dark:text-purple-300 mr-2 mt-1 shrink-0" />
                  <span className="font-semibold text-gray-900 dark:text-gray-50">
                    Add Devices:
                  </span>
                  <ul className="list-disc pl-6 mt-2 space-y-1">
                    <li>Drag and drop devices onto the workspace.</li>
                  </ul>
                </li>
                <li className="flex items-start">
                  <ChevronRight className="h-5 w-5 text-purple-500 dark:text-purple-300 mr-2 mt-1 shrink-0" />
                  <span className="font-semibold text-gray-900 dark:text-gray-50">
                    Connect Devices:
                  </span>
                  <ul className="list-disc pl-6 mt-2 space-y-1">
                    <li>Link devices according to your topology.</li>
                  </ul>
                </li>
                <li className="flex items-start">
                  <ChevronRight className="h-5 w-5 text-purple-500 dark:text-purple-300 mr-2 mt-1 shrink-0" />
                  <span className="font-semibold text-gray-900 dark:text-gray-50">
                    Configure Devices:
                  </span>
                  <ul className="list-disc pl-6 mt-2 space-y-1">
                    <li>Set up interfaces, initial configs, and routing.</li>
                  </ul>
                </li>
                <li className="flex items-start">
                  <ChevronRight className="h-5 w-5 text-purple-500 dark:text-purple-300 mr-2 mt-1 shrink-0" />
                  <span className="font-semibold text-gray-900 dark:text-gray-50">
                    Save Project:
                  </span>
                  <ul className="list-disc pl-6 mt-2 space-y-1">
                    <li>
                      Save your work as a{" "}
                      <span className="font-mono">.gns3project</span> file.
                    </li>
                  </ul>
                </li>
              </ul>
            </CardContent>
          </Card>

          <Card className="shadow-lg hover:shadow-xl transition-shadow duration-300">
            <CardHeader className="flex flex-row items-center space-x-4 pb-2">
              <FileText className="h-8 w-8 text-orange-600 dark:text-orange-400" />
              <CardTitle className="text-2xl font-bold text-gray-800 dark:text-gray-100">
                3. Prepare Lab Guide and Supporting Files
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-4 text-gray-700 dark:text-gray-300">
              <ul className="list-none space-y-3">
                <li className="flex items-start">
                  <ChevronRight className="h-5 w-5 text-orange-500 dark:text-orange-300 mr-2 mt-1 shrink-0" />
                  <span className="font-semibold text-gray-900 dark:text-gray-50">
                    Lab Guide:
                  </span>
                  <ul className="list-disc pl-6 mt-2 space-y-1">
                    <li>
                      Write a step-by-step guide (Markdown or PDF) including:
                    </li>
                    <ul className="list-circle pl-6 mt-1 space-y-1">
                      <li>Objectives</li>
                      <li>Tasks</li>
                      <li>Expected results</li>
                    </ul>
                  </ul>
                </li>
                <li className="flex items-start">
                  <ChevronRight className="h-5 w-5 text-orange-500 dark:text-orange-300 mr-2 mt-1 shrink-0" />
                  <span className="font-semibold text-gray-900 dark:text-gray-50">
                    Supporting Files:
                  </span>
                  <ul className="list-disc pl-6 mt-2 space-y-1">
                    <li>
                      Gather configuration files, scripts, or datasets needed
                      for the lab.
                    </li>
                  </ul>
                </li>
              </ul>
            </CardContent>
          </Card>

          <Card className="shadow-lg hover:shadow-xl transition-shadow duration-300">
            <CardHeader className="flex flex-row items-center space-x-4 pb-2">
              <UploadCloud className="h-8 w-8 text-red-600 dark:text-red-400" />
              <CardTitle className="text-2xl font-bold text-gray-800 dark:text-gray-100">
                4. Upload Lab Content
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-4 text-gray-700 dark:text-gray-300">
              <ul className="list-none space-y-3">
                <li className="flex items-start">
                  <ChevronRight className="h-5 w-5 text-red-500 dark:text-red-300 mr-2 mt-1 shrink-0" />
                  <span className="font-semibold text-gray-900 dark:text-gray-50">
                    Package Files:
                  </span>
                  <ul className="list-disc pl-6 mt-2 space-y-1">
                    <li>
                      (Optional) Archive your GNS3 project and supporting files
                      into a <span className="font-mono">.zip</span> or{" "}
                      <span className="font-mono">.rar</span>.
                    </li>
                  </ul>
                </li>
                <li className="flex items-start">
                  <ChevronRight className="h-5 w-5 text-red-500 dark:text-red-300 mr-2 mt-1 shrink-0" />
                  <span className="font-semibold text-gray-900 dark:text-gray-50">
                    Log in to Gns3LabLauncher:
                  </span>
                  <ul className="list-disc pl-6 mt-2 space-y-1">
                    <li>Use your instructor/admin account.</li>
                  </ul>
                </li>
                <li className="flex items-start">
                  <ChevronRight className="h-5 w-5 text-red-500 dark:text-red-300 mr-2 mt-1 shrink-0" />
                  <span className="font-semibold text-gray-900 dark:text-gray-50">
                    Upload:
                  </span>
                  <ul className="list-disc pl-6 mt-2 space-y-1">
                    <li>
                      Go to the "Upload Lab" section and submit your lab package
                      or files.
                    </li>
                  </ul>
                </li>
                <li className="flex items-start">
                  <ChevronRight className="h-5 w-5 text-red-500 dark:text-red-300 mr-2 mt-1 shrink-0" />
                  <span className="font-semibold text-gray-900 dark:text-gray-50">
                    Fill Metadata:
                  </span>
                  <ul className="list-disc pl-6 mt-2 space-y-1">
                    <li>Enter lab title, description, objectives, and tags.</li>
                  </ul>
                </li>
              </ul>
            </CardContent>
          </Card>

          <Card className="shadow-lg hover:shadow-xl transition-shadow duration-300">
            <CardHeader className="flex flex-row items-center space-x-4 pb-2">
              <CheckCircle className="h-8 w-8 text-green-600 dark:text-green-400" />
              <CardTitle className="text-2xl font-bold text-gray-800 dark:text-gray-100">
                5. Test and Publish
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-4 text-gray-700 dark:text-gray-300">
              <ul className="list-none space-y-3">
                <li className="flex items-start">
                  <ChevronRight className="h-5 w-5 text-green-500 dark:text-green-300 mr-2 mt-1 shrink-0" />
                  <span className="font-semibold text-gray-900 dark:text-gray-50">
                    Test Lab:
                  </span>
                  <ul className="list-disc pl-6 mt-2 space-y-1">
                    <li>
                      Launch a lab instance and follow your guide to verify all
                      steps.
                    </li>
                  </ul>
                </li>
                <li className="flex items-start">
                  <ChevronRight className="h-5 w-5 text-green-500 dark:text-green-300 mr-2 mt-1 shrink-0" />
                  <span className="font-semibold text-gray-900 dark:text-gray-50">
                    Adjust:
                  </span>
                  <ul className="list-disc pl-6 mt-2 space-y-1">
                    <li>Make corrections if needed and re-upload.</li>
                  </ul>
                </li>
                <li className="flex items-start">
                  <ChevronRight className="h-5 w-5 text-green-500 dark:text-green-300 mr-2 mt-1 shrink-0" />
                  <span className="font-semibold text-gray-900 dark:text-gray-50">
                    Publish:
                  </span>
                  <ul className="list-disc pl-6 mt-2 space-y-1">
                    <li>
                      Set the lab status to "Published" so learners can access
                      it.
                    </li>
                  </ul>
                </li>
              </ul>
            </CardContent>
          </Card>

          <Card className="shadow-lg hover:shadow-xl transition-shadow duration-300">
            <CardHeader className="flex flex-row items-center space-x-4 pb-2">
              <Lightbulb className="h-8 w-8 text-yellow-600 dark:text-yellow-400" />
              <CardTitle className="text-2xl font-bold text-gray-800 dark:text-gray-100">
                Tips
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-4 text-gray-700 dark:text-gray-300">
              <ul className="list-none space-y-3">
                <li className="flex items-start">
                  <ChevronRight className="h-5 w-5 text-yellow-500 dark:text-yellow-300 mr-2 mt-1 shrink-0" />
                  Include clear instructions and troubleshooting steps in your
                  guide.
                </li>
                <li className="flex items-start">
                  <ChevronRight className="h-5 w-5 text-yellow-500 dark:text-yellow-300 mr-2 mt-1 shrink-0" />
                  Use consistent naming for files and devices.
                </li>
                <li className="flex items-start">
                  <ChevronRight className="h-5 w-5 text-yellow-500 dark:text-yellow-300 mr-2 mt-1 shrink-0" />
                  Update lab content as needed based on learner feedback.
                </li>
                <li className="flex items-start">
                  <ChevronRight className="h-5 w-5 text-yellow-500 dark:text-yellow-300 mr-2 mt-1 shrink-0" />
                  You’ve now created and published a lab for your learners!
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
