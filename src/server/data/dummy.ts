const projects = [
  {
    id: 1,
    name: "BGP Lab",
    description: "Simulating BGP between ISPs",
    status: "In Progress",
  },
  {
    id: 2,
    name: "Firewall Config",
    description: "pfSense with VLANs",
    status: "Not Started",
  },
];

const tasks = [
  { id: 1, projectId: 1, title: "Configure routers", done: true },
  { id: 2, projectId: 1, title: "Test convergence", done: false },
  { id: 3, projectId: 2, title: "Setup pfSense VM", done: false },
];

export { projects, tasks };
