"use client";

import { Card } from "@clnt/components/ui/card";

import type React from "react";

import type { LabTemplate } from "@clnt/types/lab-template";
import type {
  LabDevice,
  TopologyNode,
  TopologyLink,
  LabConnection,
} from "@clnt/types/lab";
import { Input } from "@clnt/components/ui/input";
import { Label } from "@clnt/components/ui/label";
import { Textarea } from "@clnt/components/ui/textarea";
import { Button } from "@clnt/components/ui/button";
import { PlusIcon, TrashIcon } from "lucide-react";
import { useState } from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@clnt/components/ui/select";

interface TemplateEnvironmentEditorProps {
  template: LabTemplate;
  setTemplate: React.Dispatch<React.SetStateAction<LabTemplate>>;
}

export function TemplateEnvironmentEditor({
  template,
  setTemplate,
}: TemplateEnvironmentEditorProps) {
  const [newNode, setNewNode] = useState<TopologyNode>({
    id: "",
    name: "",
    type: "router",
    x: 0,
    y: 0,
    icon: "",
  });
  const [newLink, setNewLink] = useState<TopologyLink>({
    id: "",
    source: "",
    target: "",
    sourcePort: "",
    targetPort: "",
  });
  const [newDevice, setNewDevice] = useState<LabDevice>({
    id: "",
    name: "",
    type: "",
    ipAddress: "",
    credentials: { username: "", password: "" },
    interfaces: [],
  });
  const [newConnection, setNewConnection] = useState<LabConnection>({
    id: "",
    from: "",
    to: "",
    fromPort: "",
    toPort: "",
  });

  const handleEnvironmentTypeChange = (
    value: LabTemplate["environment"]["type"],
  ) => {
    setTemplate((prev) => ({
      ...prev,
      environment: { ...prev.environment, type: value },
    }));
  };

  const handleStartupConfigChange = (
    e: React.ChangeEvent<HTMLTextAreaElement>,
  ) => {
    setTemplate((prev) => ({
      ...prev,
      environment: { ...prev.environment, startupConfig: e.target.value },
    }));
  };

  // Node Handlers
  const handleNodeChange = (
    index: number,
    field: keyof TopologyNode,
    value: string | number,
  ) => {
    const updatedNodes = template.environment.topology.nodes.map((node, i) =>
      i === index ? { ...node, [field]: value } : node,
    );
    setTemplate((prev) => ({
      ...prev,
      environment: {
        ...prev.environment,
        topology: { ...prev.environment.topology, nodes: updatedNodes },
      },
    }));
  };

  const handleNewNodeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setNewNode((prev) => ({
      ...prev,
      [name]: name === "x" || name === "y" ? Number(value) : value,
    }));
  };

  const addNode = () => {
    if (newNode.name && newNode.type) {
      setTemplate((prev) => ({
        ...prev,
        environment: {
          ...prev.environment,
          topology: {
            ...prev.environment.topology,
            nodes: [
              ...prev.environment.topology.nodes,
              { ...newNode, id: `node-${Date.now()}` },
            ],
          },
        },
      }));
      setNewNode({ id: "", name: "", type: "router", x: 0, y: 0, icon: "" });
    }
  };

  const removeNode = (id: string) => {
    setTemplate((prev) => ({
      ...prev,
      environment: {
        ...prev.environment,
        topology: {
          ...prev.environment.topology,
          nodes: prev.environment.topology.nodes.filter(
            (node) => node.id !== id,
          ),
        },
      },
    }));
  };

  // Link Handlers
  const handleLinkChange = (
    index: number,
    field: keyof TopologyLink,
    value: string,
  ) => {
    const updatedLinks = template.environment.topology.links.map((link, i) =>
      i === index ? { ...link, [field]: value } : link,
    );
    setTemplate((prev) => ({
      ...prev,
      environment: {
        ...prev.environment,
        topology: { ...prev.environment.topology, links: updatedLinks },
      },
    }));
  };

  const handleNewLinkChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setNewLink((prev) => ({ ...prev, [name]: value }));
  };

  const addLink = () => {
    if (newLink.source && newLink.target) {
      setTemplate((prev) => ({
        ...prev,
        environment: {
          ...prev.environment,
          topology: {
            ...prev.environment.topology,
            links: [
              ...prev.environment.topology.links,
              { ...newLink, id: `link-${Date.now()}` },
            ],
          },
        },
      }));
      setNewLink({
        id: "",
        source: "",
        target: "",
        sourcePort: "",
        targetPort: "",
      });
    }
  };

  const removeLink = (id: string) => {
    setTemplate((prev) => ({
      ...prev,
      environment: {
        ...prev.environment,
        topology: {
          ...prev.environment.topology,
          links: prev.environment.topology.links.filter(
            (link) => link.id !== id,
          ),
        },
      },
    }));
  };

  // Device Handlers
  const handleDeviceChange = (
    index: number,
    field: keyof LabDevice,
    value: string | string[] | { username: string; password: string },
  ) => {
    const updatedDevices = template.environment.devices.map((device, i) =>
      i === index ? { ...device, [field]: value } : device,
    );
    setTemplate((prev) => ({
      ...prev,
      environment: { ...prev.environment, devices: updatedDevices },
    }));
  };

  const handleNewDeviceChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = e.target;
    setNewDevice((prev) => ({ ...prev, [name]: value }));
  };

  const handleNewDeviceInterfacesChange = (
    e: React.ChangeEvent<HTMLInputElement>,
  ) => {
    setNewDevice((prev) => ({
      ...prev,
      interfaces: e.target.value.split(",").map((i) => ({ name: i.trim() })), // Convert to DeviceInterface[]
    }));
  };

  const addDevice = () => {
    if (newDevice.name && newDevice.type) {
      setTemplate((prev) => ({
        ...prev,
        environment: {
          ...prev.environment,
          devices: [
            ...prev.environment.devices,
            { ...newDevice, id: `device-${Date.now()}` },
          ],
        },
      }));
      setNewDevice({
        id: "",
        name: "",
        type: "",
        ipAddress: "",
        credentials: { username: "", password: "" },
        interfaces: [],
      });
    }
  };

  const removeDevice = (id: string) => {
    setTemplate((prev) => ({
      ...prev,
      environment: {
        ...prev.environment,
        devices: prev.environment.devices.filter((device) => device.id !== id),
      },
    }));
  };

  // Connection Handlers (for LabEnvironment.connections)
  const handleConnectionChange = (
    index: number,
    field: keyof LabConnection,
    value: string,
  ) => {
    const updatedConnections = (template.environment.connections || []).map(
      (conn, i) => (i === index ? { ...conn, [field]: value } : conn),
    );
    setTemplate((prev) => ({
      ...prev,
      environment: {
        ...prev.environment,
        connections: updatedConnections,
      },
    }));
  };

  const handleNewConnectionChange = (
    e: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const { name, value } = e.target;
    setNewConnection((prev) => ({ ...prev, [name]: value }));
  };

  const addConnection = () => {
    if (newConnection.from && newConnection.to) {
      setTemplate((prev) => ({
        ...prev,
        environment: {
          ...prev.environment,
          connections: [
            ...(prev.environment.connections || []),
            { ...newConnection, id: `conn-${Date.now()}` },
          ],
        },
      }));
      setNewConnection({ id: "", from: "", to: "", fromPort: "", toPort: "" });
    }
  };

  const removeConnection = (id: string) => {
    setTemplate((prev) => ({
      ...prev,
      environment: {
        ...prev.environment,
        connections: (prev.environment.connections || []).filter(
          (conn) => conn.id !== id,
        ),
      },
    }));
  };

  return (
    <div className="grid gap-6">
      <div className="grid gap-2">
        <Label htmlFor="env-type">Environment Type</Label>
        <Select
          value={template.environment.type}
          onValueChange={(value: LabTemplate["environment"]["type"]) =>
            handleEnvironmentTypeChange(value)
          }
        >
          <SelectTrigger>
            <SelectValue placeholder="Select environment type" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="GNS3">GNS3</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="grid gap-2">
        <Label htmlFor="startup-config">Startup Configuration (Global)</Label>
        <Textarea
          id="startup-config"
          value={template.environment.startupConfig || ""}
          onChange={handleStartupConfigChange}
          placeholder="Enter global startup configuration or notes for the lab environment."
          rows={5}
        />
      </div>

      {/* Topology Nodes */}
      <div className="grid gap-4">
        <Label>Topology Nodes</Label>
        <div className="space-y-4">
          {template.environment.topology.nodes.map((node, index) => (
            <Card key={node.id} className="p-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <Label htmlFor={`node-name-${index}`}>Name</Label>
                  <Input
                    id={`node-name-${index}`}
                    value={node.name}
                    onChange={(e) =>
                      handleNodeChange(index, "name", e.target.value)
                    }
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor={`node-type-${index}`}>Type</Label>
                  <Select
                    value={node.type}
                    onValueChange={(value: TopologyNode["type"]) =>
                      handleNodeChange(index, "type", value)
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="router">Router</SelectItem>
                      <SelectItem value="switch">Switch</SelectItem>
                      <SelectItem value="pc">PC</SelectItem>
                      <SelectItem value="server">Server</SelectItem>
                      <SelectItem value="firewall">Firewall</SelectItem>
                      <SelectItem value="cloud">Cloud</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid gap-2">
                  <Label htmlFor={`node-x-${index}`}>X Coordinate</Label>
                  <Input
                    id={`node-x-${index}`}
                    type="number"
                    value={node.x}
                    onChange={(e) =>
                      handleNodeChange(index, "x", Number(e.target.value))
                    }
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor={`node-y-${index}`}>Y Coordinate</Label>
                  <Input
                    id={`node-y-${index}`}
                    type="number"
                    value={node.y}
                    onChange={(e) =>
                      handleNodeChange(index, "y", Number(e.target.value))
                    }
                  />
                </div>
                <div className="grid gap-2 col-span-full">
                  <Label htmlFor={`node-icon-${index}`}>Icon URL</Label>
                  <Input
                    id={`node-icon-${index}`}
                    value={node.icon}
                    onChange={(e) =>
                      handleNodeChange(index, "icon", e.target.value)
                    }
                    placeholder="e.g., /icons/router.svg"
                  />
                </div>
              </div>
              <Button
                variant="destructive"
                size="sm"
                className="mt-4"
                onClick={() => removeNode(node.id)}
              >
                <TrashIcon className="h-4 w-4 mr-2" /> Remove Node
              </Button>
            </Card>
          ))}
        </div>

        <Card className="p-4 border-dashed border-2">
          <h3 className="text-lg font-semibold mb-4">Add New Node</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="grid gap-2">
              <Label htmlFor="new-node-name">Name</Label>
              <Input
                id="new-node-name"
                name="name"
                value={newNode.name}
                onChange={handleNewNodeChange}
                placeholder="e.g., R1"
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="new-node-type">Type</Label>
              <Select
                value={newNode.type}
                onValueChange={(value: TopologyNode["type"]) =>
                  setNewNode((prev) => ({ ...prev, type: value }))
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="router">Router</SelectItem>
                  <SelectItem value="switch">Switch</SelectItem>
                  <SelectItem value="pc">PC</SelectItem>
                  <SelectItem value="server">Server</SelectItem>
                  <SelectItem value="firewall">Firewall</SelectItem>
                  <SelectItem value="cloud">Cloud</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="new-node-x">X Coordinate</Label>
              <Input
                id="new-node-x"
                name="x"
                type="number"
                value={newNode.x}
                onChange={handleNewNodeChange}
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="new-node-y">Y Coordinate</Label>
              <Input
                id="new-node-y"
                name="y"
                type="number"
                value={newNode.y}
                onChange={handleNewNodeChange}
              />
            </div>
            <div className="grid gap-2 col-span-full">
              <Label htmlFor="new-node-icon">Icon URL</Label>
              <Input
                id="new-node-icon"
                name="icon"
                value={newNode.icon}
                onChange={handleNewNodeChange}
                placeholder="e.g., /icons/router.svg"
              />
            </div>
          </div>
          <Button onClick={addNode} className="mt-4">
            <PlusIcon className="h-4 w-4 mr-2" /> Add Node
          </Button>
        </Card>
      </div>

      {/* Topology Links */}
      <div className="grid gap-4">
        <Label>Topology Links</Label>
        <div className="space-y-4">
          {template.environment.topology.links.map((link, index) => (
            <Card key={link.id} className="p-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <Label htmlFor={`link-source-${index}`}>Source Node ID</Label>
                  <Input
                    id={`link-source-${index}`}
                    value={link.source}
                    onChange={(e) =>
                      handleLinkChange(index, "source", e.target.value)
                    }
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor={`link-target-${index}`}>Target Node ID</Label>
                  <Input
                    id={`link-target-${index}`}
                    value={link.target}
                    onChange={(e) =>
                      handleLinkChange(index, "target", e.target.value)
                    }
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor={`link-source-port-${index}`}>
                    Source Port
                  </Label>
                  <Input
                    id={`link-source-port-${index}`}
                    value={link.sourcePort}
                    onChange={(e) =>
                      handleLinkChange(index, "sourcePort", e.target.value)
                    }
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor={`link-target-port-${index}`}>
                    Target Port
                  </Label>
                  <Input
                    id={`link-target-port-${index}`}
                    value={link.targetPort}
                    onChange={(e) =>
                      handleLinkChange(index, "targetPort", e.target.value)
                    }
                  />
                </div>
              </div>
              <Button
                variant="destructive"
                size="sm"
                className="mt-4"
                onClick={() => removeLink(link.id)}
              >
                <TrashIcon className="h-4 w-4 mr-2" /> Remove Link
              </Button>
            </Card>
          ))}
        </div>

        <Card className="p-4 border-dashed border-2">
          <h3 className="text-lg font-semibold mb-4">Add New Link</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="grid gap-2">
              <Label htmlFor="new-link-source">Source Node ID</Label>
              <Input
                id="new-link-source"
                name="source"
                value={newLink.source}
                onChange={handleNewLinkChange}
                placeholder="e.g., r1"
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="new-link-target">Target Node ID</Label>
              <Input
                id="new-link-target"
                name="target"
                value={newLink.target}
                onChange={handleNewLinkChange}
                placeholder="e.g., sw1"
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="new-link-source-port">Source Port</Label>
              <Input
                id="new-link-source-port"
                name="sourcePort"
                value={newLink.sourcePort}
                onChange={handleNewLinkChange}
                placeholder="e.g., g0/0"
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="new-link-target-port">Target Port</Label>
              <Input
                id="new-link-target-port"
                name="targetPort"
                value={newLink.targetPort}
                onChange={handleNewLinkChange}
                placeholder="e.g., f0/1"
              />
            </div>
          </div>
          <Button onClick={addLink} className="mt-4">
            <PlusIcon className="h-4 w-4 mr-2" /> Add Link
          </Button>
        </Card>
      </div>

      {/* Devices */}
      <div className="grid gap-4">
        <Label>Devices</Label>
        <div className="space-y-4">
          {template.environment.devices.map((device, index) => (
            <Card key={device.id} className="p-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <Label htmlFor={`device-name-${index}`}>Name</Label>
                  <Input
                    id={`device-name-${index}`}
                    value={device.name}
                    onChange={(e) =>
                      handleDeviceChange(index, "name", e.target.value)
                    }
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor={`device-type-${index}`}>Type</Label>
                  <Input
                    id={`device-type-${index}`}
                    value={device.type}
                    onChange={(e) =>
                      handleDeviceChange(index, "type", e.target.value)
                    }
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor={`device-ipAddress-${index}`}>
                    IP Address
                  </Label>
                  <Input
                    id={`device-ipAddress-${index}`}
                    value={device.ipAddress || ""}
                    onChange={(e) =>
                      handleDeviceChange(index, "ipAddress", e.target.value)
                    }
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor={`device-username-${index}`}>Username</Label>
                  <Input
                    id={`device-username-${index}`}
                    value={device.credentials?.username || ""}
                    onChange={(e) =>
                      handleDeviceChange(index, "credentials", {
                        ...(device.credentials || {}),
                        username: e.target.value,
                      })
                    }
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor={`device-password-${index}`}>Password</Label>
                  <Input
                    id={`device-password-${index}`}
                    type="password"
                    value={device.credentials?.password || ""}
                    onChange={(e) =>
                      handleDeviceChange(index, "credentials", {
                        ...(device.credentials || {}),
                        password: e.target.value,
                      })
                    }
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor={`device-interfaces-${index}`}>
                    Interfaces (comma-separated names)
                  </Label>
                  <Input
                    id={`device-interfaces-${index}`}
                    value={device.interfaces.map((i) => i.name).join(", ")}
                    onChange={(e) =>
                      handleDeviceChange(
                        index,
                        "interfaces",
                        e.target.value
                          .split(",")
                          .map((i) => ({ name: i.trim() })),
                      )
                    }
                  />
                </div>
              </div>
              <Button
                variant="destructive"
                size="sm"
                className="mt-4"
                onClick={() => removeDevice(device.id)}
              >
                <TrashIcon className="h-4 w-4 mr-2" /> Remove Device
              </Button>
            </Card>
          ))}
        </div>

        <Card className="p-4 border-dashed border-2">
          <h3 className="text-lg font-semibold mb-4">Add New Device</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="grid gap-2">
              <Label htmlFor="new-device-name">Name</Label>
              <Input
                id="new-device-name"
                name="name"
                value={newDevice.name}
                onChange={handleNewDeviceChange}
                placeholder="e.g., R1"
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="new-device-type">Type</Label>
              <Input
                id="new-device-type"
                name="type"
                value={newDevice.type}
                onChange={handleNewDeviceChange}
                placeholder="e.g., Cisco 2901"
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="new-device-ipAddress">IP Address</Label>
              <Input
                id="new-device-ipAddress"
                name="ipAddress"
                value={newDevice.ipAddress || ""}
                onChange={handleNewDeviceChange}
                placeholder="e.g., 192.168.1.1"
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="new-device-username">Username</Label>
              <Input
                id="new-device-username"
                name="credentials.username"
                value={newDevice.credentials?.username || ""}
                onChange={(e) =>
                  setNewDevice((prev) => ({
                    ...prev,
                    credentials: {
                      ...prev.credentials,
                      username: e.target.value,
                    },
                  }))
                }
                placeholder="e.g., admin"
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="new-device-password">Password</Label>
              <Input
                id="new-device-password"
                name="credentials.password"
                type="password"
                value={newDevice.credentials?.password || ""}
                onChange={(e) =>
                  setNewDevice((prev) => ({
                    ...prev,
                    credentials: {
                      ...prev.credentials,
                      password: e.target.value,
                    },
                  }))
                }
                placeholder="e.g., cisco"
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="new-device-interfaces">
                Interfaces (comma-separated names)
              </Label>
              <Input
                id="new-device-interfaces"
                value={newDevice.interfaces.map((i) => i.name).join(", ")}
                onChange={handleNewDeviceInterfacesChange}
                placeholder="e.g., GigabitEthernet0/0, FastEthernet0/1"
              />
            </div>
          </div>
          <Button onClick={addDevice} className="mt-4">
            <PlusIcon className="h-4 w-4 mr-2" /> Add Device
          </Button>
        </Card>
      </div>

      {/* Connections (for LabEnvironment.connections) */}
      <div className="grid gap-4">
        <Label>Lab Connections</Label>
        <div className="space-y-4">
          {(template.environment.connections || []).map((conn, index) => (
            <Card key={conn.id} className="p-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <Label htmlFor={`conn-from-${index}`}>From Node ID</Label>
                  <Input
                    id={`conn-from-${index}`}
                    value={conn.from}
                    onChange={(e) =>
                      handleConnectionChange(index, "from", e.target.value)
                    }
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor={`conn-to-${index}`}>To Node ID</Label>
                  <Input
                    id={`conn-to-${index}`}
                    value={conn.to}
                    onChange={(e) =>
                      handleConnectionChange(index, "to", e.target.value)
                    }
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor={`conn-from-port-${index}`}>From Port</Label>
                  <Input
                    id={`conn-from-port-${index}`}
                    value={conn.fromPort}
                    onChange={(e) =>
                      handleConnectionChange(index, "fromPort", e.target.value)
                    }
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor={`conn-to-port-${index}`}>To Port</Label>
                  <Input
                    id={`conn-to-port-${index}`}
                    value={conn.toPort}
                    onChange={(e) =>
                      handleConnectionChange(index, "toPort", e.target.value)
                    }
                  />
                </div>
              </div>
              <Button
                variant="destructive"
                size="sm"
                className="mt-4"
                onClick={() => removeConnection(conn.id)}
              >
                <TrashIcon className="h-4 w-4 mr-2" /> Remove Connection
              </Button>
            </Card>
          ))}
        </div>

        <Card className="p-4 border-dashed border-2">
          <h3 className="text-lg font-semibold mb-4">Add New Connection</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="grid gap-2">
              <Label htmlFor="new-conn-from">From Node ID</Label>
              <Input
                id="new-conn-from"
                name="from"
                value={newConnection.from}
                onChange={handleNewConnectionChange}
                placeholder="e.g., r1"
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="new-conn-to">To Node ID</Label>
              <Input
                id="new-conn-to"
                name="to"
                value={newConnection.to}
                onChange={handleNewConnectionChange}
                placeholder="e.g., sw1"
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="new-conn-from-port">From Port</Label>
              <Input
                id="new-conn-from-port"
                name="fromPort"
                value={newConnection.fromPort}
                onChange={handleNewConnectionChange}
                placeholder="e.g., g0/0"
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="new-conn-to-port">To Port</Label>
              <Input
                id="new-conn-to-port"
                name="toPort"
                value={newConnection.toPort}
                onChange={handleNewConnectionChange}
                placeholder="e.g., f0/1"
              />
            </div>
          </div>
          <Button onClick={addConnection} className="mt-4">
            <PlusIcon className="h-4 w-4 mr-2" /> Add Connection
          </Button>
        </Card>
      </div>
    </div>
  );
}
