import { useEffect } from "react";
import { RouterProvider } from "react-router";
import socket from "@clnt/lib/socket";
import { useModal } from "@clnt/hooks/use-modal";
import { SessionKickedAlert } from "@clnt/components/common/session-kicked-alert";
import router from "@clnt/pages/route-layout";
import { useLogout, useUser } from "./lib/auth";

function App() {
  const user = useUser();
  const logoutUser = useLogout();
  const { isOpen: isModalOpen, openModal, closeModal } = useModal();

  console.log("running in ", import.meta.env.MODE);

  useEffect(() => {
    if (!user.data?.id) return;

    // Connect on mount
    socket.connect();

    const onConnect = () => {
      console.log("🟢 Connected to server via WebSocket", socket.id);
    };

    const onDisconnect = () => {
      console.log("🔴 Disconnected from server");
    };

    const onSessionExpired = async () => {
      await logoutUser.mutateAsync({});
      console.log("🔴 Session expired");
    };

    const onSessionKicked = () => {
      openModal();
      console.log("🔴 Kicked from server");
    };

    socket.on("connect", onConnect);
    socket.on("disconnect", onDisconnect);
    socket.on("session-expired", onSessionExpired);
    socket.on("session-kicked", onSessionKicked);

    return () => {
      socket.off("connect", onConnect);
      socket.off("disconnect", onDisconnect);
      socket.disconnect();
    };
  }, [user.data?.id]);

  return isModalOpen ? (
    <SessionKickedAlert isOpen={isModalOpen} onOpenChange={closeModal} />
  ) : (
    <RouterProvider router={router} />
  );
}

export default App;
