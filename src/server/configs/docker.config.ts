import Docker from "dockerode";

// Use socket (default) or TCP if needed
const docker = new Docker({
  socketPath: "/var/run/docker.sock", // Linux default
  // host: 'localhost',
  // port: 2375,
});

export default docker;
