import { useEffect } from "react";
import {
  Routes,
  Route,
  Navigate,
  useNavigate,
  useLocation,
} from "react-router";
import HomePage from "@clnt/pages/main/home";
import LoginPage from "@clnt/pages/auth/login";
import { useUserStore } from "@clnt/lib/store/user-store";
import { useAppStateStore } from "@clnt/lib/store/app-state-store";
import socket from "@clnt/lib/socket";
import { useModal } from "@clnt/hooks/use-modal";
import { SessionExpiredAlert } from "@clnt/components/session-expired-alert";

function App() {
  const { user, fetchPermissions } = useUserStore();
  const { setIsAppLoading } = useAppStateStore();
  const { isOpen, openModal, closeModal } = useModal();
  const navigate = useNavigate();
  const location = useLocation();

  console.log("running in ", import.meta.env.MODE);

  useEffect(() => {
    const delay = () => new Promise((resolve) => setTimeout(resolve, 2000));

    const permissions = async () => {
      await fetchPermissions();
      await delay();
      setIsAppLoading(false);
    };

    if (user && !user?.permissions) {
      setIsAppLoading(true);
      permissions();
    }
  }, [user]);

  // Redirect logic based on auth state
  useEffect(() => {
    if (!user && location.pathname !== "/signin") {
      navigate("/signin");
    } else if (user && location.pathname === "/signin") {
      navigate("/");
    }
  }, [user, location.pathname]);

  useEffect(() => {
    if (!user) return;

    // Connect on mount
    socket.connect();

    const onConnect = () => {
      console.log("🟢 Connected to server via WebSocket", socket.id);
    };

    const onDisconnect = () => {
      console.log("🔴 Disconnected from server");
    };

    const onSessionKicked = () => {
      openModal();
      console.log("🔴 Kicked from server");
    }

    socket.on("connect", onConnect);
    socket.on("disconnect", onDisconnect);
    socket.on("session-kicked", onSessionKicked)

    return () => {
      socket.off("connect", onConnect);
      socket.off("disconnect", onDisconnect);
      socket.disconnect();
    };
  }, [user]);

  return (
    <>
      <SessionExpiredAlert 
        isOpen={isOpen}
        onOpenChange={closeModal} 
      />
      <Routes>
        <Route
          path="/signin"
          element={!user ? <LoginPage /> : <Navigate to="/" />}
        />
        <Route
          path="/"
          element={user ? <HomePage /> : <Navigate to="/signin" />}
        />
      </Routes>
    </>
  );
}

export default App;
