import { redisClient } from "@srvr/database/redis.database.ts";
import { io } from "@srvr/main.ts";
import prisma from "@srvr/utils/db/prisma.ts";
import { waitForContainer } from "@srvr/utils/docker-run.utils.ts";
import {
  forceLogoutUserBySessionID,
  getSocket,
} from "@srvr/utils/session-ws.utils.ts";
import { spawn } from "child_process";
import { Socket } from "socket.io";

/**
 * Handles a new Socket.IO connection.
 *
 * This function ensures that:
 * - The user is authenticated via session.
 * - Only one active session/socket per user is allowed.
 * - If the user logs in from another device/location, the old session is disconnected.
 * - User joins in the sockets group
 *
 * @param {Socket} socket - The newly connected Socket.IO client instance.
 */
export const onSocketConnection = async (socket: Socket) => {
  const user = socket.request.user;
  const currentSocketId = socket.id;
  const currentSessionId = socket.request.sessionID;

  // If no authenticated user ID found in session, disconnect the socket
  if (!user) {
    console.log("session expired", user);
    socket.emit("session-expired", {
      reason: "Your time has run out. Please login again to continue...",
    });
    socket.disconnect();
    return;
  }

  const redisKey = `gns3labuser:session:${user.id}`;
  const sessionRecord = await redisClient.hGetAll(redisKey);

  const previousSessionId = sessionRecord.sessionID;
  const previousSocketId = sessionRecord.socketID;

  // If there's a previous session and it's different from the current one
  if (previousSessionId && previousSessionId !== currentSessionId) {
    const oldSocket = getSocket(previousSocketId);

    // Notify and disconnect the old session's socket
    if (oldSocket) {
      console.log(`🛑 Found old socket ${previousSocketId}, disconnecting...`);
      oldSocket.emit("session-kicked", {
        reason: "You were logged in elsewhere.",
      });
      oldSocket.disconnect();
    }

    // Force logout the previous session from Redis and session store
    try {
      await forceLogoutUserBySessionID(previousSessionId);
    } catch {
      console.warn(`Failed to destroy session ${previousSessionId}`);
    }
  }

  // Save the current session and socket ID in Redis
  await redisClient.hSet(redisKey, {
    sessionID: currentSessionId,
    socketID: currentSocketId,
  });

  console.log(`🔌 User ${user.id} connected with socket ${currentSocketId}`);

  /* for (const classes in user.classes) {
    console.log(classes);
    //socket.join(classes)
  } */
  // Join a room specific to this user for targeted messaging
  socket.join(`container:${user.username}`);

  console.log(socket.rooms);

  console.log("🚀 ~ onSocketConnection ~ user:", user);

  if (user?.role === "instructor") {
    await prisma.instructor.update({
      where: { userId: user.id },
      data: {
        lastActiveAt: new Date(),
        isOnline: true,
      },
    });
  } else if (user?.role === "student") {
    await prisma.student.update({
      where: { userId: user.id },
      data: {
        lastActiveAt: new Date(),
        isOnline: true,
      },
    });
  }

  socket.on("start-container-logs", ({ containerName }) => {
    console.log(`📄 Streaming logs for container: ${containerName}`);

    waitForContainer(containerName).then(() => {
      const dockerLogs = spawn("docker", ["logs", "-f", containerName]);
      dockerLogs.stdout.on("data", (data) => {
        io.to(`container:${user.username}`).emit("container-log", {
          containerName,
          log: data.toString(),
        });
      });

      dockerLogs.stderr.on("data", (data) => {
        io.to(`container:${user.username}`).emit("container-log", {
          containerName,
          log: data.toString(),
        });
      });

      dockerLogs.on("close", (code) => {
        io.to(`container:${user.username}`).emit("container-log", {
          containerName,
          log: `📄 Logs ended (exit code: ${code})`,
        });
      });

      socket.on("disconnect", () => {
        dockerLogs.kill();
      });

      socket.on("stop-container-logs", () => {
        dockerLogs.kill();
      });
    });
  });
};
