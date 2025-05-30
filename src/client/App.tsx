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
import axios from "./lib/axios";
import { SessionExpiredAlert } from "./components/session-expired-alert";
import { useModal } from "./hooks/use-modal";

function App() {
  const { user, fetchPermissions } = useUserStore();
  const { setIsAppLoading } = useAppStateStore();
  const navigate = useNavigate();
  const location = useLocation();
  const { isOpen, openModal, closeModal } = useModal(false);

  console.log("running in ", import.meta.env.MODE);

  useEffect(() => {
    let interval: any;
    if (user) {
      interval = setInterval(async () => {
        await axios.get("/auth/session/check")
        .catch((err) => {
          if (err.response.data.session === 'invalid') {
            openModal()
          }
        })
      }, 10000); // every 10 seconds
    }
    if (isOpen) return () => clearInterval(interval);
  }, [user?._id]);

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

  const handleOpenChange = (open: boolean) => {
    if (!open) {
      closeModal(); // updates the hook's state
      navigate("/signin"); // redirect to sign-in page
    }
  };

  return (
    <>
      <SessionExpiredAlert 
        isOpen={isOpen} 
        onOpenChange={handleOpenChange}
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
