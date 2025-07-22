import {
  Avatar,
  AvatarImage,
  AvatarFallback,
} from "@clnt/components/ui/avatar";
import {
  Tabs,
  TabsList,
  TabsTrigger,
  TabsContent,
} from "@clnt/components/ui/tabs";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "@clnt/components/ui/card";
import { Label } from "@clnt/components/ui/label";
import { Input } from "@clnt/components/ui/input";
import { Textarea } from "@clnt/components/ui/textarea";
import { Button } from "@clnt/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "@clnt/components/ui/dropdown-menu";
import { ChevronDownIcon } from "lucide-react";
import { useUser } from "@clnt/lib/auth";
import { stringInitials } from "@clnt/lib/utils";
import { useTheme } from "@clnt/components/common/theme-provider";
import { useState } from "react";
import moment from "moment";

export default function AccountContent() {
  const user = useUser();
  const { setTheme } = useTheme();

  const [name, setName] = useState(user.data?.name ?? "");
  const [username, setUsername] = useState(user.data?.username ?? "");
  const [email, setEmail] = useState(user.data?.email ?? "");
  const [bio, setBio] = useState("Gns3 Labbing Enthusiast");

  const [themeSetting, setThemeSetting] = useState<"light" | "dark" | "system">(
    "light",
  );
  const [language, setLanguage] = useState("English");

  const handleProfileSave = () => {
    console.log({ name, username, email, bio });
  };

  const handlePreferencesSave = () => {
    console.log({ themeSetting, language });
    setTheme(themeSetting);
  };

  return (
    <div className="flex flex-col min-h-screen">
      <header className="relative bg-muted py-8 px-4 md:px-6 rounded-lg">
        <div className="container mx-auto flex items-center gap-4">
          <Avatar className="h-16 w-16">
            <AvatarImage src={user.data?.username} alt={user.data?.username} />
            <AvatarFallback randomizeBg>
              {stringInitials(user.data?.name ?? "")}
            </AvatarFallback>
          </Avatar>
          <div className="grid gap-1">
            <h1 className="text-2xl font-bold">{user.data?.name}</h1>
            <p className="text-gray-500 dark:text-gray-400">
              Gns3 Labbing Enthusiast
            </p>
          </div>
        </div>
        <div className="absolute inset-0 rounded-b-lg bg-gradient-to-t from-black/10 to-transparent" />
      </header>

      <div className="container mx-auto py-8 px-4 md:px-6">
        <Tabs defaultValue="overview" className="w-full">
          <TabsList className="border-b">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="settings">Settings</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="py-6">
            <div className="grid gap-4">
              <div className="grid gap-1">
                <h3 className="text-lg font-semibold">Basic Information</h3>
                <div className="grid sm:grid-cols-2 gap-4">
                  <div className="grid gap-1">
                    <p className="text-gray-500 dark:text-gray-400">Email</p>
                    <p>{user.data?.email}</p>
                  </div>
                  <div className="grid gap-1">
                    <p className="text-gray-500 dark:text-gray-400">Username</p>
                    <p>{user.data?.username}</p>
                  </div>
                  <div className="grid gap-1">
                    <p className="text-gray-500 dark:text-gray-400">Role</p>
                    <p>{user.data?.role}</p>
                  </div>
                  <div className="grid gap-1">
                    <p className="text-gray-500 dark:text-gray-400">
                      Created At
                    </p>
                    <p>{moment(user.data?.createdAt).format("llll")}</p>
                  </div>
                  <div className="grid gap-1">
                    <p className="text-gray-500 dark:text-gray-400">
                      Last Active
                    </p>
                    <p>
                      {user.data?.student?.lastActiveAt
                        ? moment(user.data.student?.lastActiveAt).format("llll")
                        : "N/A"}
                    </p>
                  </div>
                  <div className="grid gap-1">
                    <p className="text-gray-500 dark:text-gray-400">
                      Online Status
                    </p>
                    <p>{user.data?.student?.isOnline ? "Online" : "Offline"}</p>
                  </div>
                </div>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="settings" className="py-6">
            <div className="grid gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Profile</CardTitle>
                  <CardDescription>
                    Update your profile information.
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">Name</Label>
                    <Input
                      id="name"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="username">Username</Label>
                    <Input
                      id="username"
                      value={username}
                      onChange={(e) => setUsername(e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="bio">Bio</Label>
                    <Textarea
                      id="bio"
                      value={bio}
                      onChange={(e) => setBio(e.target.value)}
                      className="min-h-[100px]"
                    />
                  </div>
                </CardContent>
                <CardFooter>
                  <Button className="ml-auto" onClick={handleProfileSave}>
                    Save
                  </Button>
                </CardFooter>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Preferences</CardTitle>
                  <CardDescription>
                    Customize your account preferences.
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="theme">Theme</Label>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button
                          variant="outline"
                          className="w-full justify-between"
                        >
                          <span>{themeSetting}</span>
                          <ChevronDownIcon className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="start">
                        {(["light", "dark", "system"] as const).map((t) => (
                          <DropdownMenuItem
                            key={t}
                            onClick={() => {
                              setThemeSetting(t);
                            }}
                          >
                            {t.charAt(0).toUpperCase() + t.slice(1)}
                          </DropdownMenuItem>
                        ))}
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="language">Language</Label>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button
                          variant="outline"
                          className="w-full justify-between"
                        >
                          <span>{language}</span>
                          <ChevronDownIcon className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="start">
                        <DropdownMenuItem
                          onClick={() => setLanguage("English")}
                        >
                          English
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </CardContent>
                <CardFooter>
                  <Button className="ml-auto" onClick={handlePreferencesSave}>
                    Save
                  </Button>
                </CardFooter>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
