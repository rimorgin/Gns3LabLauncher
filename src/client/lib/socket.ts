import { wsBaseUrl } from "@clnt/constants/api";
import { io } from "socket.io-client";

const socket = io(wsBaseUrl, {
  autoConnect: false,
  withCredentials: true,
});

export default socket;
