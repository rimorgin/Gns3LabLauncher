"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { useImmer } from "use-immer";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@clnt/components/ui/card";
import { Button } from "@clnt/components/ui/button";
import { Input } from "@clnt/components/ui/input";
import { Label } from "@clnt/components/ui/label";
import { Textarea } from "@clnt/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@clnt/components/ui/select";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@clnt/components/ui/tabs";
import {
  Plus,
  Trash2,
  Network,
  Router,
  Monitor,
  Server,
  BrickWallFire,
  LetterText,
  ChevronDown,
  ChevronUp,
} from "lucide-react";
import type {
  LabEnvironment,
  TopologyNode,
  TopologyLink,
  DeviceInterface,
  TopologyNote,
} from "@clnt/types/lab";
import { DndContext, useDraggable, DragEndEvent } from "@dnd-kit/core";
import { IconCloud } from "@tabler/icons-react";
import { cn } from "@clnt/lib/utils";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@clnt/components/ui/tooltip";
import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@clnt/components/ui/alert-dialog";

interface EnvironmentStepProps {
  data: Partial<LabEnvironment>;
  onUpdate: (data: Partial<LabEnvironment>) => void;
  onNext: () => void;
  onPrev: () => void;
}

export function EnvironmentStep({
  data,
  onUpdate,
  onNext,
  onPrev,
}: EnvironmentStepProps) {
  const [formData, setFormData] = useImmer<Partial<LabEnvironment>>({
    labId: data.labId || undefined,
    type: "GNS3",
    topology: data.topology || {
      nodes: [],
      links: [],
      notes: [],
      layout: { width: 1500, height: 1200 },
    },
    startupConfig: data.startupConfig || "",
  });

  const handleNext = () => {
    onUpdate(formData); // send updated state
    onNext();
  };

  const handlePrev = () => {
    onUpdate(formData);
    onPrev();
  };

  const updateFormData = (
    mutator: (draft: Partial<LabEnvironment>) => void,
  ) => {
    setFormData(mutator);
  };

  const [isDraggingNode, setIsDraggingNode] = useState(false);
  const [zoom, setZoom] = useState(1);
  const [pan, setPan] = useState({ x: 0, y: 0 });
  const [isPanning, setIsPanning] = useState(false);
  const [startPan, setStartPan] = useState<{ x: number; y: number } | null>(
    null,
  );

  const [editingNote, setEditingNote] = useState<
    (TopologyNote & { index: number }) | null
  >(null);

  const width = formData.topology?.layout?.width || 1500;
  const height = formData.topology?.layout?.height || 1200;

  const centerOfLayout = width / height + 2;

  const handleZoom = (delta: number) => {
    setZoom((prev) => Math.min(4, Math.max(0.2, prev + delta))); // clamp between 0.2x and 4x
  };
  const onMouseDown = (e: React.MouseEvent) => {
    if (isDraggingNode) return;
    setIsPanning(true);
    setStartPan({ x: e.clientX - pan.x, y: e.clientY - pan.y });
  };

  const onMouseMove = (e: React.MouseEvent) => {
    if (isDraggingNode || !isPanning || !startPan) return;
    setPan({
      x: e.clientX - startPan.x,
      y: e.clientY - startPan.y,
    });
  };

  const onMouseUp = () => {
    if (isDraggingNode) return;
    setIsPanning(false);
    setStartPan(null);
  };

  const updateNodeInterface = <K extends keyof DeviceInterface>(
    nodeIndex: number,
    interfaceIndex: number,
    field: K,
    value: DeviceInterface[K],
  ) => {
    updateFormData(
      (draft) =>
        (draft.topology!.nodes[nodeIndex].interfaces[interfaceIndex][field] =
          value),
    );
  };

  const addTopologyNote = () => {
    const newId = crypto.randomUUID();

    const newNote: TopologyNote = {
      id: newId,
      text: `Note-${formData.topology!.notes.length + 1}`,
      x: Math.random() * (centerOfLayout * 200) + 100,
      y: Math.random() * (centerOfLayout * 100) + 100,
      width: 200,
      height: 50,
    };

    updateFormData((draft) => {
      draft.topology!.notes.push(newNote);
    });
  };

  const updateTopologyNote = <K extends keyof TopologyNote>(
    index: number,
    field: K,
    value: TopologyNote[K],
  ) => {
    if (field === "text" && typeof value === "string" && value.trim() === "")
      return;
    updateFormData((draft) => {
      draft.topology!.notes[index][field] = value;
    });
  };

  const handleUpdateNote = (index: number, updates: Partial<TopologyNote>) => {
    updateFormData((draft) => {
      Object.assign(draft.topology!.notes[index], updates);
    });
  };

  const removeTopologyNote = (index: number) => {
    updateFormData((draft) => {
      draft.topology!.notes.splice(index, 1);
    });
  };

  const addTopologyNode = () => {
    const newNodeId = crypto.randomUUID();
    const newIfaceId = crypto.randomUUID();
    const newNode: TopologyNode = {
      id: newNodeId,
      name: `Node-${formData.topology!.nodes.length + 1}`,
      type: "router",
      x: Math.random() * (centerOfLayout * 200) + 100,
      y: Math.random() * (centerOfLayout * 100) + 100,
      icon: "router",
      interfaces: [{ topologyNodeId: newNodeId, id: newIfaceId, name: "eth0" }],
    };
    updateFormData((draft) => {
      draft.topology!.nodes.push(newNode);
    });
  };

  const updateTopologyNode = <K extends keyof TopologyNode>(
    index: number,
    field: K,
    value: TopologyNode[K],
  ) => {
    updateFormData((draft) => {
      draft.topology!.nodes[index][field] = value;
    });
  };

  const removeTopologyNode = (index: number) => {
    updateFormData((draft) => {
      draft.topology!.nodes.splice(index, 1);
    });
  };

  const addTopologyLink = () => {
    if (formData.topology!.nodes.length < 2) return;

    const sourceNode = formData.topology!.nodes[0];
    const targetNode = formData.topology!.nodes[1];

    const getNextInterfaceName = (interfaces: DeviceInterface[]): string => {
      let index = 0;
      while (interfaces.some((i) => i.name === `eth${index}`)) {
        index++;
      }
      return `eth${index}`;
    };

    updateFormData((draft) => {
      const sourceIfaceName =
        sourceNode.interfaces[0]?.name ??
        getNextInterfaceName(sourceNode.interfaces);
      const targetIfaceName =
        targetNode.interfaces[0]?.name ??
        getNextInterfaceName(targetNode.interfaces);

      // Add interfaces if they don't exist yet
      if (!sourceNode.interfaces.some((i) => i.name === sourceIfaceName)) {
        sourceNode.interfaces.push({
          id: crypto.randomUUID(),
          topologyNodeId: sourceNode.id,
          name: sourceIfaceName,
        });
      }

      if (!targetNode.interfaces.some((i) => i.name === targetIfaceName)) {
        targetNode.interfaces.push({
          id: crypto.randomUUID(),
          topologyNodeId: targetNode.id,
          name: targetIfaceName,
        });
      }

      draft.topology!.links.push({
        id: crypto.randomUUID(),
        source: sourceNode.id,
        target: targetNode.id,
        sourcePort: sourceIfaceName,
        targetPort: targetIfaceName,
      });
    });
  };

  const updateTopologyLink = <K extends keyof TopologyLink>(
    index: number,
    field: K,
    value: TopologyLink[K],
  ) => {
    updateFormData((draft) => {
      const oldLink = draft.topology!.links[index];
      const links = draft.topology!.links;
      const nodes = draft.topology!.nodes;

      const ensureInterface = (
        nodeId: string,
        oldPort: string,
        newPort: string,
      ) => {
        const node = nodes.find((n) => n.id === nodeId)!;

        if (
          !links.some(
            (l) =>
              (l.source === nodeId && l.sourcePort === oldPort) ||
              (l.target === nodeId && l.targetPort === oldPort),
          )
        ) {
          node.interfaces = node.interfaces.filter((i) => i.name !== oldPort);
        }

        if (!node.interfaces.some((i) => i.name === newPort)) {
          node.interfaces.push({ id: crypto.randomUUID(), name: newPort });
        }
      };

      if (field === "sourcePort" && typeof value === "string") {
        ensureInterface(oldLink.source, oldLink.sourcePort, value);
      }
      if (field === "targetPort" && typeof value === "string") {
        ensureInterface(oldLink.target, oldLink.targetPort, value);
      }
      if (field === "source" && typeof value === "string") {
        ensureInterface(oldLink.source, oldLink.sourcePort, oldLink.sourcePort);
        ensureInterface(value, oldLink.sourcePort, oldLink.sourcePort);
      }
      if (field === "target" && typeof value === "string") {
        ensureInterface(oldLink.target, oldLink.targetPort, oldLink.targetPort);
        ensureInterface(value, oldLink.targetPort, oldLink.targetPort);
      }

      links[index][field] = value;
    });
  };

  const removeTopologyLink = (index: number) => {
    updateFormData((draft) => {
      const linkToRemove = draft.topology!.links[index];
      draft.topology!.links.splice(index, 1);

      draft.topology!.nodes.forEach((node) => {
        if (node.id !== linkToRemove.source && node.id !== linkToRemove.target)
          return;
        node.interfaces = node.interfaces.filter((intf) =>
          draft.topology!.links.some(
            (l) =>
              (l.source === node.id && l.sourcePort === intf.name) ||
              (l.target === node.id && l.targetPort === intf.name),
          ),
        );
      });
    });
  };

  const getdevicesColor = (type: string) => {
    const colors = {
      router: "text-blue-700",
      switch: "text-green-600",
      pc: "text-gray-700",
      server: "text-amber-700",
      firewall: "text-red-900",
      cloud: "text-cyan-600",
    };
    const color = colors[type as keyof typeof colors] || "text-blue-700";
    return color;
  };

  const getdevicesIcon = (type: string) => {
    const icons = {
      router: Router,
      switch: Network,
      pc: Monitor,
      server: Server,
      firewall: BrickWallFire,
      cloud: IconCloud,
    };
    const Icon = icons[type as keyof typeof icons] || Monitor;
    const iconColor = getdevicesColor(type);
    return <Icon className={cn(iconColor, "h-10 w-10")} />;
  };

  const [collapsedDevices, setCollapsedDevices] = useState<
    Record<string, boolean>
  >({});

  const toggleDeviceCollapse = (sectionId: string) => {
    setCollapsedDevices((prev) => ({
      ...prev,
      [sectionId]: !prev[sectionId],
    }));
  };

  // Function to handle scrolling to node configuration
  const scrollToNodeConfig = (nodeId: string) => {
    const element = document.getElementById(nodeId);
    if (element) {
      element.scrollIntoView({
        behavior: "smooth",
        block: "center",
      });

      // Add blinking effect
      element.classList.add("blinking-highlight");

      // Remove the class after 3 seconds
      setTimeout(() => {
        element.classList.remove("blinking-highlight");
      }, 3000);
    }
  };

  function DraggableNode({ node }: { node: TopologyNode }) {
    const { attributes, listeners, setNodeRef, transform, isDragging } =
      useDraggable({
        id: node.id,
      });

    const handleRightClick = (e: React.MouseEvent) => {
      e.preventDefault();
      scrollToNodeConfig(node.id);
    };

    return (
      <Tooltip delayDuration={500}>
        <TooltipTrigger asChild>
          <g
            ref={(node) => setNodeRef(node as unknown as HTMLElement)}
            {...listeners}
            {...attributes}
            onContextMenu={handleRightClick}
            transform={`translate(${node.x + (transform?.x ?? 0)}, ${node.y + (transform?.y ?? 0)})`}
            style={{
              cursor: isDragging ? "grabbing" : "grab",
              opacity: isDragging ? 0.8 : 1,
            }}
          >
            <circle r="40" fill="white" stroke="#3B3B3B" strokeWidth="3" />
            {/* Render icon */}
            <foreignObject x={-20} y={-20} width="50" height="50">
              <div className="flex items-center justify-center w-10 h-10">
                {getdevicesIcon(node.type)}
              </div>
            </foreignObject>

            {/* Render name below the node */}
            <text
              y={70}
              textAnchor="middle"
              className="text-2xl font-medium fill-gray-700"
              style={{ userSelect: "none" }}
            >
              {node.name}
            </text>
          </g>
        </TooltipTrigger>
        <TooltipContent side="right">
          <p>Right-click to go to node properties</p>
        </TooltipContent>
      </Tooltip>
    );
  }

  function useDragResize(
    note: TopologyNote,
    index: number,
    onUpdate: (index: number, updates: Partial<TopologyNote>) => void,
  ) {
    const [resizing, setResizing] = useState(false);
    const [hovered, setHovered] = useState(false);
    const [hoveringResize, setHoveringResize] = useState(false);

    const sizeRef = useRef({ width: note.width, height: note.height });

    const { setNodeRef, attributes, listeners, transform, isDragging } =
      useDraggable({
        id: note.id,
        disabled: resizing || hoveringResize,
      });

    useEffect(() => {
      sizeRef.current = { width: note.width, height: note.height };
    }, [note.width, note.height]);

    const handleResize = useCallback(
      (e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();

        setResizing(true);

        const startX = e.clientX;
        const startY = e.clientY;
        const { width: startWidth, height: startHeight } = sizeRef.current;

        const handleMouseMove = (e: MouseEvent) => {
          const deltaX = e.clientX - startX;
          const deltaY = e.clientY - startY;

          const newWidth = Math.max(50, startWidth + deltaX);
          const newHeight = Math.max(30, startHeight + deltaY);

          onUpdate(index, { width: newWidth, height: newHeight });
        };

        const handleMouseUp = () => {
          setResizing(false);
          document.removeEventListener("mousemove", handleMouseMove);
          document.removeEventListener("mouseup", handleMouseUp);
        };

        document.addEventListener("mousemove", handleMouseMove);
        document.addEventListener("mouseup", handleMouseUp);
      },
      [index, onUpdate],
    );

    // Update position when drag ends
    useEffect(() => {
      if (!isDragging && transform && !resizing) {
        onUpdate(index, {
          x: note.x + transform.x,
          y: note.y + transform.y,
        });
      }
    }, [isDragging, transform, resizing, index, note.x, note.y, onUpdate]);

    return {
      resizing,
      hovered,
      setHovered,
      isDragging,
      transform,
      setNodeRef,
      attributes,
      listeners,
      handleResize,
      hoveringResize,
      setHoveringResize,
    };
  }

  function DraggableNote({
    note,
    index,
    onUpdate,
  }: {
    note: TopologyNote;
    index: number;
    onUpdate: (index: number, updates: Partial<TopologyNote>) => void;
  }) {
    const {
      resizing,
      hovered,
      setHovered,
      isDragging,
      transform,
      setNodeRef,
      attributes,
      listeners,
      handleResize,
      //hoveringResize,
      setHoveringResize,
    } = useDragResize(note, index, onUpdate);

    const translateStyle =
      transform && !resizing
        ? `translate(${note.x + transform.x}, ${note.y + transform.y})`
        : `translate(${note.x}, ${note.y})`;

    const handleRightClick = (e: React.MouseEvent) => {
      e.preventDefault();
      setEditingNote({ index, ...note });
    };

    return (
      <g
        ref={(node) => setNodeRef(node as unknown as HTMLElement)}
        {...attributes}
        {...listeners}
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
        transform={translateStyle}
        onContextMenu={handleRightClick}
        style={{ cursor: isDragging ? "grabbing" : "grab" }}
      >
        <foreignObject width={note.width} height={note.height}>
          <div
            style={{
              width: note.width,
              height: note.height,
              position: "relative",
              border: hovered || resizing ? "2px solid #3b82f6" : "0px",
              background: "white",
              boxSizing: "border-box",
              opacity: isDragging ? 0.7 : 1,
              borderRadius: "6px",
              padding: "8px",
              boxShadow: hovered
                ? "0 4px 12px rgba(0,0,0,0.1)"
                : "0 1px 3px rgba(0,0,0,0.1)",
            }}
          >
            <p
              style={{
                margin: 0,
                pointerEvents: "none",
                userSelect: "none",
                wordWrap: "break-word",
                overflow: "hidden",
              }}
              className="text-2xl text-gray-700 font-medium"
            >
              {note.text}
            </p>

            <div
              onMouseEnter={() => setHoveringResize(true)}
              onMouseLeave={() => setHoveringResize(false)}
              onMouseDown={handleResize}
              style={{
                position: "absolute",
                right: 0,
                bottom: 0,
                width: 16,
                height: 16,
                background: hovered || resizing ? "#3b82f6" : "#d1d5db",
                cursor: "nw-resize",
                borderRadius: "0 6px 6px 0",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                opacity: hovered || resizing ? 1 : 0.5,
                transition: "all 0.2s ease",
              }}
            >
              <div
                style={{
                  width: "6px",
                  height: "6px",
                  borderRight: "2px solid white",
                  borderBottom: "2px solid white",
                }}
              />
            </div>
          </div>
        </foreignObject>
      </g>
    );
  }

  const renderTopology = () => {
    const handleDragEnd = (event: DragEndEvent) => {
      setIsDraggingNode(false);

      const { active, delta } = event;
      if (!delta) return;

      updateFormData((draft) => {
        const nodeIndex = draft.topology!.nodes.findIndex(
          (n) => n.id === active.id,
        );
        const noteIndex = draft.topology!.notes.findIndex(
          (n) => n.id === active.id,
        );

        if (nodeIndex >= 0) {
          const node = draft.topology!.nodes[nodeIndex];
          const newX = Math.max(25, Math.min(width - 25, node.x + delta.x));
          const newY = Math.max(25, Math.min(height - 25, node.y + delta.y));
          node.x = newX;
          node.y = newY;
        } else if (noteIndex >= 0) {
          const note = draft.topology!.notes[noteIndex];
          const newX = Math.max(25, Math.min(width - 25, note.x + delta.x));
          const newY = Math.max(25, Math.min(height - 25, note.y + delta.y));
          note.x = newX;
          note.y = newY;
        }
      });
    };

    return (
      <div
        className={`relative bg-gray-50 rounded-lg  max-h-[550px] ${editingNote && "pointer-events-none"}`}
      >
        <DndContext
          onDragStart={() => setIsDraggingNode(true)}
          onDragEnd={handleDragEnd}
          onDragCancel={() => setIsDraggingNode(false)}
        >
          <div className="w-full h-full min-h-[350px] border border-gray-200 rounded bg-white">
            <div className="flex justify-end gap-2 p-2">
              <button
                onClick={() => handleZoom(0.1)}
                className="px-2 py-1 bg-gray-200 rounded"
              >
                +
              </button>
              <button
                onClick={() => handleZoom(-0.1)}
                className="px-2 py-1 bg-gray-200 rounded"
              >
                -
              </button>
              <span className="text-sm text-black">
                Zoom: {(zoom * 100).toFixed(0)}%
              </span>
            </div>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              version="1.1"
              viewBox={`0 0 ${width} ${height}`}
              onMouseDown={onMouseDown}
              onMouseMove={onMouseMove}
              onMouseUp={onMouseUp}
              onMouseLeave={onMouseUp}
              style={{
                cursor: isPanning ? "grabbing" : "grab",
              }}
              className={`w-full  max-h-[450px] border-2 ${editingNote && "pointer-events-none"}`}
            >
              {/* Grid pattern for better visual reference */}
              <defs>
                <pattern
                  id="grid"
                  width="30"
                  height="30"
                  patternUnits="userSpaceOnUse"
                >
                  <path
                    d="M 30 0 L 0 0 0 30"
                    fill="none"
                    stroke="#f0f0f0"
                    strokeWidth="1"
                  />
                </pattern>
              </defs>

              {/* Zoom wrapper */}
              <g transform={`translate(${pan.x},${pan.y}) scale(${zoom})`}>
                <rect
                  x={0}
                  y={0}
                  width={width}
                  height={height}
                  fill="url(#grid)"
                />
                {/* Links */}
                {formData.topology!.links.map((link) => {
                  const sourceNode = formData.topology!.nodes.find(
                    (n) => n.id === link.source,
                  );
                  const targetNode = formData.topology!.nodes.find(
                    (n) => n.id === link.target,
                  );
                  if (!sourceNode || !targetNode) return null;

                  const dx = targetNode.x - sourceNode.x;
                  const dy = targetNode.y - sourceNode.y;
                  const length = Math.sqrt(dx * dx + dy * dy);
                  const unitX = dx / length;
                  const unitY = dy / length;
                  const offset = 100; // offset from the node to avoid overlapping

                  return (
                    <g key={link.id}>
                      <line
                        x1={sourceNode.x}
                        y1={sourceNode.y}
                        x2={targetNode.x}
                        y2={targetNode.y}
                        stroke={"#3B3B3B"}
                        strokeWidth="2"
                        strokeDasharray={
                          link.status === "down" ? "5,5" : "none"
                        }
                      />

                      <foreignObject
                        x={sourceNode.x + unitX * offset}
                        y={sourceNode.y + unitY * offset}
                        width="100"
                        height="50"
                        style={{ pointerEvents: "none" }}
                      >
                        <p className="w-max text-lg bg-white/80 shadow text-black">
                          {link.sourcePort}
                        </p>
                      </foreignObject>

                      <foreignObject
                        x={targetNode.x - unitX * offset}
                        y={targetNode.y - unitY * offset}
                        width="100"
                        height="50"
                        style={{ pointerEvents: "none" }}
                      >
                        <p className="w-max text-lg bg-white/50 rounded shadow text-black">
                          {link.targetPort}
                        </p>
                      </foreignObject>
                    </g>
                  );
                })}

                {/* Nodes */}
                {formData.topology!.nodes.map((node) => (
                  <DraggableNode key={node.id} node={node} />
                ))}
                {/* Nodes */}
                {formData.topology!.notes.map((note, index) => (
                  <DraggableNote
                    key={note.id}
                    note={note}
                    index={index}
                    onUpdate={handleUpdateNote}
                  />
                ))}
              </g>
            </svg>
          </div>
        </DndContext>
      </div>
    );
  };

  return (
    <>
      <AlertDialog
        open={!!editingNote}
        onOpenChange={(o) => !o && setEditingNote(null)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>
              {editingNote?.text.split(" ")[0]}
            </AlertDialogTitle>

            <AlertDialogDescription>Edit note here:</AlertDialogDescription>
          </AlertDialogHeader>

          <Textarea
            value={editingNote?.text ?? ""}
            onChange={(e) => {
              const newText = e.target.value;
              if (editingNote) {
                updateTopologyNote(editingNote.index, "text", newText);
                // also update the editingNote so UI stays in sync
                setEditingNote({ ...editingNote, text: newText });
              }
            }}
            onKeyDown={(e) => e.key === "Enter" && setEditingNote(null)}
          />

          <AlertDialogFooter className="sm:justify-start">
            <AlertDialogCancel asChild>
              <Button type="button" variant="secondary">
                Close
              </Button>
            </AlertDialogCancel>
            <Button
              onClick={() => {
                if (editingNote) {
                  removeTopologyNote(editingNote.index);
                  setEditingNote(null);
                }
              }}
            >
              Delete
            </Button>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Network className="w-5 h-5" />
            Lab Environment Setup
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="topology" className="space-y-6">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="topology">Network Topology</TabsTrigger>
              <TabsTrigger value="devices">Devices</TabsTrigger>
              <TabsTrigger value="config">Configuration</TabsTrigger>
            </TabsList>

            <TabsContent value="topology" className="space-y-4">
              {renderTopology()}
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-medium">Network Topology</h3>
                <div className="space-x-2">
                  <Button onClick={addTopologyNote} size="sm">
                    <LetterText className="w-4 h-4 mr-2" />
                    Add Notes
                  </Button>
                  <Button onClick={addTopologyNode} size="sm">
                    <Plus className="w-4 h-4 mr-2" />
                    Add Node
                  </Button>
                  <Button
                    onClick={addTopologyLink}
                    size="sm"
                    disabled={formData.topology!.nodes.length < 2}
                  >
                    <Plus className="w-4 h-4 mr-2" />
                    Add Link
                  </Button>
                </div>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <h4 className="font-medium">Nodes</h4>
                  {formData.topology!.nodes.map((node, index) => (
                    <Card id={node.id} key={node.id} className="p-4">
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <Label>Name</Label>
                          <Input
                            value={node.name}
                            onChange={(e) =>
                              updateTopologyNode(index, "name", e.target.value)
                            }
                          />
                        </div>
                        <div>
                          <Label>Type</Label>
                          <Select
                            value={node.type}
                            onValueChange={(value: TopologyNode["type"]) =>
                              updateTopologyNode(index, "type", value)
                            }
                          >
                            <SelectTrigger>
                              <SelectValue />
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
                        <div>
                          <Label>X Position</Label>
                          <Input
                            type="number"
                            value={node.x}
                            onChange={(e) =>
                              updateTopologyNode(
                                index,
                                "x",
                                Number.parseInt(e.target.value),
                              )
                            }
                          />
                        </div>
                        <div>
                          <Label>Y Position</Label>
                          <Input
                            type="number"
                            value={node.y}
                            onChange={(e) =>
                              updateTopologyNode(
                                index,
                                "y",
                                Number.parseInt(e.target.value),
                              )
                            }
                          />
                        </div>
                      </div>
                      <Button
                        variant="destructive"
                        size="sm"
                        className="mt-2"
                        onClick={() => removeTopologyNode(index)}
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </Card>
                  ))}
                </div>

                <div className="space-y-4">
                  <h4 className="font-medium">Links</h4>
                  {formData.topology!.links.map((link, index) => (
                    <Card key={link.id} className="p-4">
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <Label>Source Node</Label>
                          <Select
                            value={link.source}
                            onValueChange={(value) =>
                              updateTopologyLink(index, "source", value)
                            }
                          >
                            <SelectTrigger>
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              {formData.topology!.nodes.map((node) => (
                                <SelectItem key={node.id} value={node.id}>
                                  {node.name}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                        <div>
                          <Label>Target Node</Label>
                          <Select
                            value={link.target}
                            onValueChange={(value) =>
                              updateTopologyLink(index, "target", value)
                            }
                          >
                            <SelectTrigger>
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              {formData.topology!.nodes.map((node) => (
                                <SelectItem key={node.id} value={node.id}>
                                  {node.name}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                        <div>
                          <Label>Source Port</Label>
                          <Input
                            value={link.sourcePort}
                            onChange={(e) =>
                              updateTopologyLink(
                                index,
                                "sourcePort",
                                e.target.value,
                              )
                            }
                          />
                        </div>
                        <div>
                          <Label>Target Port</Label>
                          <Input
                            value={link.targetPort}
                            onChange={(e) =>
                              updateTopologyLink(
                                index,
                                "targetPort",
                                e.target.value,
                              )
                            }
                          />
                        </div>
                      </div>
                      <Button
                        variant="destructive"
                        size="sm"
                        className="mt-2"
                        onClick={() => removeTopologyLink(index)}
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </Card>
                  ))}
                </div>
              </div>
            </TabsContent>

            <TabsContent value="devices" className="space-y-4">
              {renderTopology()}
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-medium">Lab Devices</h3>
                <Button onClick={addTopologyNode} size="sm">
                  <Plus className="w-4 h-4 mr-2" />
                  Add Device
                </Button>
              </div>

              <div className="space-y-4">
                {formData.topology?.nodes!.map((nodeDevice, index) => (
                  <Card key={nodeDevice.id} className="p-4">
                    <CardHeader className="font-medium text-md flex justify-between items-center">
                      {nodeDevice.name} Basic Device Info
                      <div className="flex gap-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => toggleDeviceCollapse(nodeDevice.id)}
                        >
                          {collapsedDevices[nodeDevice.id] ? (
                            <>
                              <p>Toggle Collapse</p>
                              <ChevronDown className="w-4 h-4" />
                            </>
                          ) : (
                            <>
                              <p>Toggle Collapse</p>
                              <ChevronUp className="w-4 h-4" />
                            </>
                          )}
                        </Button>
                        <Button
                          variant="destructive"
                          size="sm"
                          className="text-white"
                          onClick={() => removeTopologyNode(index)}
                        >
                          <Trash2 className="w-4 h-4 mr-2" />
                          Remove Device
                        </Button>
                      </div>
                    </CardHeader>
                    {!collapsedDevices[nodeDevice.id] && (
                      <CardContent className="space-y-4">
                        <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-4">
                          <div>
                            <Label>Device Name</Label>
                            <Input
                              value={nodeDevice.name}
                              onChange={(e) =>
                                updateTopologyNode(
                                  index,
                                  "name",
                                  e.target.value,
                                )
                              }
                            />
                          </div>
                          <div>
                            <Label>Type</Label>
                            <Select
                              value={nodeDevice.type}
                              onValueChange={(value: TopologyNode["type"]) =>
                                updateTopologyNode(index, "type", value)
                              }
                            >
                              <SelectTrigger>
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="router">Router</SelectItem>
                                <SelectItem value="switch">Switch</SelectItem>
                                <SelectItem value="pc">PC</SelectItem>
                                <SelectItem value="server">Server</SelectItem>
                                <SelectItem value="firewall">
                                  Firewall
                                </SelectItem>
                                <SelectItem value="cloud">Cloud</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                          <div>
                            <Label>Appliance Name</Label>
                            <Input
                              value={nodeDevice.applianceName}
                              onChange={(e) =>
                                updateTopologyNode(
                                  index,
                                  "applianceName",
                                  e.target.value,
                                )
                              }
                              placeholder="e.g., Cisco 2901, Virtual PC"
                            />
                          </div>
                        </div>
                        {(nodeDevice.interfaces ?? []).map(
                          (intf, intfIndex) => (
                            <div
                              key={`${nodeDevice.id}-${intfIndex}-${intf.name}`}
                              className="grid sm:grid-cols-2 md:grid-cols-3 gap-4"
                            >
                              <div>
                                <Label>Interface Name</Label>
                                <Input
                                  value={intf.name}
                                  onChange={(e) =>
                                    updateNodeInterface(
                                      index,
                                      intfIndex,
                                      "name",
                                      e.target.value,
                                    )
                                  }
                                />
                              </div>
                              <div>
                                <Label>IP Address</Label>
                                <Input
                                  value={intf.ipAddress || ""}
                                  placeholder="192.168.1.1"
                                  onChange={(e) =>
                                    updateNodeInterface(
                                      index,
                                      intfIndex,
                                      "ipAddress",
                                      e.target.value,
                                    )
                                  }
                                />
                              </div>
                              <div>
                                <Label>Subnet Mask</Label>
                                <Input
                                  value={intf.subnet || ""}
                                  placeholder="255.255.255.0"
                                  onChange={(e) =>
                                    updateNodeInterface(
                                      index,
                                      intfIndex,
                                      "subnet",
                                      e.target.value,
                                    )
                                  }
                                />
                              </div>
                            </div>
                          ),
                        )}
                      </CardContent>
                    )}
                  </Card>
                ))}
              </div>
            </TabsContent>

            <TabsContent value="config" className="space-y-4">
              <div>
                <Label htmlFor="startupConfig">Startup Configuration</Label>
                <Textarea
                  id="startupConfig"
                  value={formData.startupConfig || ""}
                  onChange={(e) =>
                    updateFormData((draft) => {
                      draft.startupConfig = e.target.value;
                    })
                  }
                  placeholder="Enter initial configuration commands..."
                  rows={10}
                  className="font-mono text-sm"
                />
              </div>
            </TabsContent>
          </Tabs>

          <div className="flex justify-between pt-6">
            <Button variant="outline" onClick={handlePrev}>
              Previous: Basic Info
            </Button>
            <Button onClick={handleNext}>Next: Lab Guide</Button>
          </div>
        </CardContent>
      </Card>
    </>
  );
}
