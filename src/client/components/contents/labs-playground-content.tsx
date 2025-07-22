import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@clnt/components/ui/card";
import { Separator } from "@clnt/components/ui/separator";
import { Button } from "../ui/button";
import {
  BookOpen,
  Download,
  MonitorCogIcon,
  Play,
  RotateCcw,
  Square,
} from "lucide-react";
import { NavLink } from "react-router";
import { IconBuildingCommunity, IconBuildingStore } from "@tabler/icons-react";
import {
  useStartContainerInstance,
  useStopContainerInstance,
} from "@clnt/lib/mutations/lab/lab-start-or-stop-mutation";
import { toast } from "sonner";
import { useUser } from "@clnt/lib/auth";
import { useState } from "react";

const links = [
  {
    to: "https://docs.gns3.com/docs/",
    title: "GNS3 Official Documentation",
    icon: BookOpen,
  },
  {
    to: "https://www.gns3.com/marketplace/featured",
    title: "GNS3 Marketplace",
    icon: IconBuildingStore,
  },
  {
    to: "",
    title: "GNS3 Community",
    icon: IconBuildingCommunity,
  },
];

export default function LabsPlaygroundContent() {
  const user = useUser();
  const containerName = user.data?.username;
  const startContainer = useStartContainerInstance();
  const stopContainer = useStopContainerInstance();
  const [isLabRunning, setIsLabRunning] = useState(false);

  if (!containerName) return <div>Forbidden</div>;

  const handleLaunchLab = async () => {
    await toast.promise(startContainer.mutateAsync(containerName), {
      loading: "Starting lab instance...",
      success: (response) => {
        setIsLabRunning(true);
        return response.data.message;
      },
      error: () => {
        return "Error starting lab instance";
      },
    });
  };

  const handleStopLab = async () => {
    await toast.promise(stopContainer.mutateAsync(containerName), {
      loading: "Stopping lab instance...",
      success: () => {
        setIsLabRunning(false);
        return "Stopped lab instance";
      },
      error: "Error stopping lab instance",
    });
  };

  const handleResetLab = async () => {
    await new Promise((resolve) => setTimeout(resolve, 2000));
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="grid lg:grid-cols-4 gap-8">
        {/* Main Content */}
        <div className="lg:col-span-3 space-y-8">
          {/* Introduction */}
          <Card className="w-full h-fit">
            <CardHeader>
              <CardTitle>Welcome to the GNS3 Playground!</CardTitle>
              <CardDescription>
                Here's a quick guide on how to get started with building your
                network and security labs.
              </CardDescription>
            </CardHeader>
            <CardContent className="grid gap-4">
              <div>
                <h3 className="font-semibold mb-2">
                  1. Import GNS3 Images (Appliances)
                </h3>
                <p className="text-muted-foreground">
                  GNS3 uses "appliances" which are pre-configured virtual
                  machines or router images. You can import these by downloading
                  the{" "}
                  <code className="relative rounded bg-muted px-[0.3rem] py-[0.2rem] font-mono text-sm font-semibold">
                    .gns3a
                  </code>{" "}
                  file from the{" "}
                  <a
                    href="https://gns3.com/marketplace/appliances"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-primary underline hover:no-underline"
                  >
                    GNS3 Marketplace
                  </a>{" "}
                  or creating your own. In the GNS3 desktop application, go to{" "}
                  <code className="relative rounded bg-muted px-[0.3rem] py-[0.2rem] font-mono text-sm font-semibold">
                    File &gt; Import appliance
                  </code>{" "}
                  and follow the wizard. These images will then be available in
                  your GNS3 server to be used in projects.
                </p>
              </div>
              <Separator />
              <div>
                <h3 className="font-semibold mb-2">
                  2. Build a Network or Security Lab
                </h3>
                <p className="text-muted-foreground">
                  Once your images are imported, you can drag and drop them onto
                  the GNS3 workspace. Connect devices using virtual cables to
                  simulate network topologies. You can add various components
                  like routers, switches, firewalls, and end-hosts (e.g., Kali
                  Linux, Windows). Configure devices via their web console or
                  CLI to set up routing protocols, security policies, and more.
                </p>
              </div>
              <Separator />
              <div>
                <h3 className="font-semibold mb-2">
                  3. Create Importable Projects
                </h3>
                <p className="text-muted-foreground">
                  After building your lab, you can save it as a GNS3 project
                  (`.gns3` file). This project file contains all the topology
                  information, device configurations, and links to the used
                  appliances. To share or back up your lab, simply save the
                  project. Others can then import this `.gns3` file into their
                  GNS3 environment to recreate your lab exactly as you designed
                  it.
                </p>
              </div>
            </CardContent>
          </Card>
          <Card className="w-full h-fit">
            <CardHeader>
              <CardTitle>Getting Started Video Tutorial</CardTitle>
              <CardDescription>
                Watch this video to quickly learn the basics of GNS3.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="relative w-200 h-100">
                <iframe
                  className="absolute top-0 left-0 w-full h-full rounded-md"
                  src="https://www.youtube.com/embed/DfjnQNbSUyY"
                  title="GNS3 Getting Started Tutorial"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                ></iframe>
              </div>
            </CardContent>
          </Card>
        </div>
        {/* Sidebar */}
        <div className="space-y-6">
          {/* Quick Actions */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Quick Actions</CardTitle>
            </CardHeader>
            <CardContent className="flex flex-col space-y-2">
              <NavLink to={"https://www.gns3.com/software"}>
                <Button className="w-full" variant="default">
                  <Download className="h-4 w-4 mr-2" />
                  Download GNS3 Client software
                </Button>
              </NavLink>
              {!isLabRunning ? (
                <Button
                  variant={"outline"}
                  onClick={handleLaunchLab}
                  disabled={startContainer.status === "pending"}
                >
                  <Play className="h-4 w-4 mr-2" />
                  {startContainer.status === "pending"
                    ? "Launching playground..."
                    : "Launch Playground"}
                </Button>
              ) : (
                <>
                  <Button variant="default" onClick={handleResetLab}>
                    <MonitorCogIcon className="h-4 w-4 mr-2" />
                    View web console
                  </Button>
                  <Button variant="outline" onClick={handleResetLab}>
                    <RotateCcw className="h-4 w-4 mr-2" />
                    Reset
                  </Button>
                  <Button
                    variant="destructive"
                    onClick={handleStopLab}
                    disabled={stopContainer.status === "pending"}
                  >
                    <Square className="h-4 w-4 mr-2" />
                    {stopContainer.status === "pending"
                      ? "Stopping lab..."
                      : "Stop Lab"}
                  </Button>
                </>
              )}
            </CardContent>
          </Card>
          {/* Resources */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Additional Resources</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              {links.map((link) => (
                <NavLink
                  to={link.to}
                  className="flex gap-2 text-sm items-center text-accent-foreground hover:underline hover:text-primary"
                >
                  <link.icon />
                  {link.title}
                </NavLink>
              ))}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
