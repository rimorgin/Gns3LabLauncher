const users = [
	{ id: 1, username: "anson", displayName: "Anson", password: "hello123" },
	{ id: 2, username: "jack", displayName: "Jack", password: "hello124" },
	{ id: 3, username: "adam", displayName: "Adam", password: "hellohello" },
	{ id: 4, username: "tina", displayName: "Tina", password: "test123" },
	{ id: 5, username: "jason", displayName: "Jason", password: "hello123" },
	{ id: 6, username: "henry", displayName: "Henry", password: "hello123" },
	{ id: 7, username: "marilyn", displayName: "Marilyn", password: "hello123" },
];

// Sample data
const projects = [
	{ id: 1, name: 'BGP Lab', description: 'Simulating BGP between ISPs', status: 'In Progress' },
	{ id: 2, name: 'Firewall Config', description: 'pfSense with VLANs', status: 'Not Started' }
];

const tasks = [
	{ id: 1, projectId: 1, title: 'Configure routers', done: true },
	{ id: 2, projectId: 1, title: 'Test convergence', done: false },
	{ id: 3, projectId: 2, title: 'Setup pfSense VM', done: false }
];

module.exports = { users, projects, tasks };