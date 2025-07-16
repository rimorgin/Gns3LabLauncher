"use client";

import type React from "react";

import type { LabTemplate, SSHConnection } from "@clnt/types/lab-template";
import { Input } from "@clnt/components/ui/input";
import { Label } from "@clnt/components/ui/label";
import { Button } from "@clnt/components/ui/button";
import { PlusIcon, TrashIcon } from "lucide-react";
import { useState } from "react";
import { Card } from "@clnt/components/ui/card";

interface TemplateAccessInfoEditorProps {
  template: LabTemplate;
  setTemplate: React.Dispatch<React.SetStateAction<LabTemplate>>;
}

export function TemplateAccessInfoEditor({
  template,
  setTemplate,
}: TemplateAccessInfoEditorProps) {
  const [newSshInfo, setNewSshInfo] = useState<SSHConnection>({
    deviceName: "", // Added deviceName
    host: "",
    port: 22,
    username: "",
    password: "",
  });

  const handleConsoleUrlChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setTemplate((prev) => ({
      ...prev,
      labEnvironment: {
        // Nested under labEnvironment
        ...prev.labEnvironment,
        accessInfo: {
          ...prev.labEnvironment.accessInfo,
          consoleUrl: e.target.value,
        },
      },
    }));
  };

  const handleWebInterfaceChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setTemplate((prev) => ({
      ...prev,
      labEnvironment: {
        // Nested under labEnvironment
        ...prev.labEnvironment,
        accessInfo: {
          ...prev.labEnvironment.accessInfo,
          webInterface: e.target.value,
        },
      },
    }));
  };

  const handleSshInfoChange = (
    index: number,
    field: keyof SSHConnection,
    value: string | number,
  ) => {
    const updatedSshInfo = (
      template.labEnvironment.accessInfo?.sshInfo || []
    ).map(
      (
        info,
        i, // Nested under labEnvironment
      ) => (i === index ? { ...info, [field]: value } : info),
    );
    setTemplate((prev) => ({
      ...prev,
      labEnvironment: {
        // Nested under labEnvironment
        ...prev.labEnvironment,
        accessInfo: {
          ...prev.labEnvironment.accessInfo,
          sshInfo: updatedSshInfo,
        },
      },
    }));
  };

  const handleNewSshInfoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setNewSshInfo((prev) => ({
      ...prev,
      [name]: name === "port" ? Number(value) : value,
    }));
  };

  const addSshInfo = () => {
    if (newSshInfo.host && newSshInfo.port) {
      setTemplate((prev) => ({
        ...prev,
        labEnvironment: {
          // Nested under labEnvironment
          ...prev.labEnvironment,
          accessInfo: {
            ...prev.labEnvironment.accessInfo,
            sshInfo: [
              ...(prev.labEnvironment.accessInfo?.sshInfo || []),
              { ...newSshInfo },
            ],
          },
        },
      }));
      setNewSshInfo({
        deviceName: "",
        host: "",
        port: 22,
        username: "",
        password: "",
      });
    }
  };

  const removeSshInfo = (index: number) => {
    setTemplate((prev) => ({
      ...prev,
      labEnvironment: {
        // Nested under labEnvironment
        ...prev.labEnvironment,
        accessInfo: {
          ...prev.labEnvironment.accessInfo,
          sshInfo: (prev.labEnvironment.accessInfo?.sshInfo || []).filter(
            (_, i) => i !== index,
          ),
        },
      },
    }));
  };

  return (
    <div className="grid gap-6">
      <div className="grid gap-2">
        <Label htmlFor="console-url">Console URL</Label>
        <Input
          id="console-url"
          value={template.labEnvironment.accessInfo?.consoleUrl || ""} // Nested under labEnvironment
          onChange={handleConsoleUrlChange}
          placeholder="e.g., http://localhost:8000/console"
        />
      </div>
      <div className="grid gap-2">
        <Label htmlFor="web-interface">Web Interface URL</Label>
        <Input
          id="web-interface"
          value={template.labEnvironment.accessInfo?.webInterface || ""} // Nested under labEnvironment
          onChange={handleWebInterfaceChange}
          placeholder="e.g., http://localhost:8080/web-ui"
        />
      </div>

      <div className="grid gap-4">
        <Label>SSH Connections</Label>
        <div className="space-y-4">
          {(template.labEnvironment.accessInfo?.sshInfo || []).map(
            (
              ssh,
              index, // Nested under labEnvironment
            ) => (
              <Card key={index} className="p-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="grid gap-2">
                    <Label htmlFor={`ssh-deviceName-${index}`}>
                      Device Name
                    </Label>
                    <Input
                      id={`ssh-deviceName-${index}`}
                      value={ssh.deviceName || ""}
                      onChange={(e) =>
                        handleSshInfoChange(index, "deviceName", e.target.value)
                      }
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor={`ssh-host-${index}`}>Host</Label>
                    <Input
                      id={`ssh-host-${index}`}
                      value={ssh.host}
                      onChange={(e) =>
                        handleSshInfoChange(index, "host", e.target.value)
                      }
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor={`ssh-port-${index}`}>Port</Label>
                    <Input
                      id={`ssh-port-${index}`}
                      type="number"
                      value={ssh.port}
                      onChange={(e) =>
                        handleSshInfoChange(
                          index,
                          "port",
                          Number(e.target.value),
                        )
                      }
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor={`ssh-username-${index}`}>Username</Label>
                    <Input
                      id={`ssh-username-${index}`}
                      value={ssh.username || ""}
                      onChange={(e) =>
                        handleSshInfoChange(index, "username", e.target.value)
                      }
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor={`ssh-password-${index}`}>Password</Label>
                    <Input
                      id={`ssh-password-${index}`}
                      type="password"
                      value={ssh.password || ""}
                      onChange={(e) =>
                        handleSshInfoChange(index, "password", e.target.value)
                      }
                    />
                  </div>
                </div>
                <Button
                  variant="destructive"
                  size="sm"
                  className="mt-4"
                  onClick={() => removeSshInfo(index)}
                >
                  <TrashIcon className="h-4 w-4 mr-2" /> Remove SSH
                </Button>
              </Card>
            ),
          )}
        </div>

        <Card className="p-4 border-dashed border-2">
          <h3 className="text-lg font-semibold mb-4">Add New SSH Connection</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="grid gap-2">
              <Label htmlFor="new-ssh-deviceName">Device Name</Label>
              <Input
                id="new-ssh-deviceName"
                name="deviceName"
                value={newSshInfo.deviceName || ""}
                onChange={handleNewSshInfoChange}
                placeholder="e.g., Router1"
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="new-ssh-host">Host</Label>
              <Input
                id="new-ssh-host"
                name="host"
                value={newSshInfo.host}
                onChange={handleNewSshInfoChange}
                placeholder="e.g., 192.168.1.100"
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="new-ssh-port">Port</Label>
              <Input
                id="new-ssh-port"
                name="port"
                type="number"
                value={newSshInfo.port}
                onChange={handleNewSshInfoChange}
                placeholder="e.g., 22"
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="new-ssh-username">Username</Label>
              <Input
                id="new-ssh-username"
                name="username"
                value={newSshInfo.username || ""}
                onChange={handleNewSshInfoChange}
                placeholder="e.g., admin"
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="new-ssh-password">Password</Label>
              <Input
                id="new-ssh-password"
                name="password"
                type="password"
                value={newSshInfo.password || ""}
                onChange={handleNewSshInfoChange}
                placeholder="e.g., password123"
              />
            </div>
          </div>
          <Button onClick={addSshInfo} className="mt-4">
            <PlusIcon className="h-4 w-4 mr-2" /> Add SSH Connection
          </Button>
        </Card>
      </div>
    </div>
  );
}
