import { useUser } from "@clnt/lib/auth";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@clnt/components/ui/card";
import { Button } from "@clnt/components/ui/button";
import {
  BookOpen,
  PlusCircle,
  LayoutDashboard,
  UserCog,
  Users,
  LinkIcon,
  BarChart2,
  FlaskConical,
} from "lucide-react";
import { Fragment, lazy, Suspense } from "react";
import { useTutorialStore } from "@clnt/lib/store/tutorial-store";
import Loader from "../common/loader";

const UsingLabInstanceLabContent = lazy(
  () => import("../tutorials/learners/using-lab-instance-and-lab-content"),
);
const CreateLabContentTutorial = lazy(
  () => import("../tutorials/instructorAndOrAdmin/create-lab-content"),
);
const ManagingEntitiesTutorial = lazy(
  () => import("../tutorials/instructorAndOrAdmin/managing-entities"),
);
const AssignProjectsLabsTutorial = lazy(
  () => import("../tutorials/instructorAndOrAdmin/assign-project"),
);
const ManagingLabInstancesAndContentTutorial = lazy(
  () =>
    import(
      "../tutorials/instructorAndOrAdmin/managing-lab-instance-and-content"
    ),
);
const ViewingReportsTutorial = lazy(
  () => import("../tutorials/learners/viewing-reports"),
);

const LabsPlaygroundTutorial = lazy(
  () => import("../tutorials/instructorAndOrAdmin/labs-playground"),
);

export const SPACE = <Fragment>&nbsp;</Fragment>;

export default function Gns3LabLauncherTutorialsPage() {
  const user = useUser();
  const { selectedTutorial, setSelectedTutorial } = useTutorialStore();

  const tutorials = [
    {
      id: "gns3-lab-launcher-tutorial",
      title: "Using Lab Instance & Lab Content",
      description:
        "A comprehensive guide on accessing, launching, exploring, and submitting your GNS3 lab work.",
      icon: (
        <LayoutDashboard className="h-8 w-8 text-blue-600 dark:text-blue-400" />
      ),
      role: ["student"],
    },
    {
      id: "viewing-reports",
      title: "Viewing Reports – Completions & Calendar",
      description:
        "Learn how to track your lab completions and manage deadlines using the reports and calendar features.",
      icon: (
        <BarChart2 className="h-8 w-8 text-indigo-600 dark:text-indigo-400" />
      ),
      role: ["student"],
    },
    {
      id: "create-lab-content",
      title: "Creating Your Own Lab Content",
      description:
        "Learn how to design, build, and upload custom lab topologies and content for GNS3LabLauncher.",
      icon: (
        <PlusCircle className="h-8 w-8 text-green-600 dark:text-green-400" />
      ),
      role: ["instructor", "administrator"],
    },
    {
      id: "managing-lab-instances-and-content",
      title: "Managing Lab Instances & Content",
      description:
        "A guide for instructors and administrators on creating, publishing, and managing labs and users.",
      icon: (
        <UserCog className="h-8 w-8 text-purple-600 dark:text-purple-400" />
      ),
      role: ["instructor", "administrator"],
    },
    {
      id: "managing-entities",
      title: "Managing Entities",
      description:
        "Learn how instructors and administrators can manage users, courses, labs, and permissions.",
      icon: <Users className="h-8 w-8 text-orange-600 dark:text-orange-400" />,
      role: ["instructor", "administrator"],
    },
    {
      id: "assign-projects-labs",
      title: "Assigning Projects & Labs to Classrooms",
      description:
        "Guide on how instructors assign projects to classrooms and labs within those projects.",
      icon: <LinkIcon className="h-8 w-8 text-red-600 dark:text-red-400" />,
      role: ["instructor", "administrator"],
    },
    {
      id: "labs-playground",
      title: "Labs Playground",
      description:
        "Explore the Labs Playground, a space to practice and experiment with gns3 labs.",
      icon: (
        <FlaskConical className="h-8 w-8 text-teal-600 dark:text-teal-400" />
      ),
      role: ["instructor", "administrator"],
    },
  ];

  const filteredTutorials = tutorials.filter((tutorial) =>
    tutorial.role.includes(user.data?.role || ""),
  );

  const renderSelectedTutorial = () => {
    switch (selectedTutorial) {
      case "gns3-lab-launcher-tutorial":
        return <UsingLabInstanceLabContent />;
      case "viewing-reports":
        return <ViewingReportsTutorial />;
      case "create-lab-content":
        return <CreateLabContentTutorial />;
      case "managing-entities":
        return <ManagingEntitiesTutorial />;
      case "assign-projects-labs":
        return <AssignProjectsLabsTutorial />;
      case "managing-lab-instances-and-content":
        return <ManagingLabInstancesAndContentTutorial />;
      case "labs-playground":
        return <LabsPlaygroundTutorial />;
      default:
        return null;
    }
  };

  return selectedTutorial ? (
    <div className="container mx-auto px-4 py-12 md:px-6 lg:py-16 min-h-screen">
      <Suspense fallback={<Loader />}>{renderSelectedTutorial()}</Suspense>
    </div>
  ) : (
    <div className="container mx-auto px-4 py-12 md:px-6 lg:py-16 min-h-screen">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-center text-4xl font-extrabold tracking-tight text-gray-900 dark:text-gray-50 sm:text-5xl lg:text-6xl mb-12">
          All Tutorials
        </h1>

        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-2">
          {filteredTutorials.map((tutorial) => (
            <Card
              key={tutorial.id}
              className="shadow-lg hover:shadow-xl transition-shadow duration-300"
            >
              <CardHeader className="flex flex-row items-center space-x-4 pb-2">
                {tutorial.icon}
                <CardTitle className="text-2xl font-bold text-gray-800 dark:text-gray-100">
                  {tutorial.title}
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-4">
                <CardDescription className="text-gray-700 dark:text-gray-300 mb-6">
                  {tutorial.description}
                </CardDescription>
                <Button
                  className="w-full"
                  onClick={() => setSelectedTutorial(tutorial.id)}
                >
                  <BookOpen className="mr-2 h-4 w-4" /> Read Tutorial
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}
