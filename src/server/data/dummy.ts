import { IProject } from "@srvr/types/models.type.ts";

// Ensure IProject includes 'id' property in its definition:
// interface IProject { id: number; projectName: string; projectDescription: string; status: string; }

const projects: IProject[] = [
  {
    projectName: "BGP Lab",
    projectDescription: "Simulating BGP between ISPs",
  },
  {
    projectName: "Firewall Config",
    projectDescription: "pfSense with VLANs",
  },
];

const tasks = [
  { id: 1, projectId: 1, title: "Configure routers", done: true },
  { id: 2, projectId: 1, title: "Test convergence", done: false },
  { id: 3, projectId: 2, title: "Setup pfSense VM", done: false },
];

export { projects, tasks };
