import { useEffect } from "react";
import { Routes, Route, useNavigate } from "react-router";
import HomePage from "@clnt/pages/main/home";
import LoginPage from "@clnt/pages/auth/login";
import { useUserStore } from "@clnt/lib/store/user-store";
import { useAppStateStore } from "./lib/store/app-state-store";

function App() {
  const { user, validateSession, fetchPermissions } = useUserStore();
  const { setIsAppLoading } = useAppStateStore();
  const navigate = useNavigate()

  console.log('running in ',import.meta.env.MODE)
  useEffect(() => {
    const session = async () => {
      await validateSession();
    };
    session();
  }, []);

  useEffect(() => {
    if (user) {
      navigate('/')
    } else navigate('/signin')
  },[user])

  useEffect(() => {
    const delay = () =>
      new Promise((resolve) => setTimeout(resolve, 2000));

    const permissions = async () => {
      await fetchPermissions();
      await delay()
      setIsAppLoading(false)
      /* toast.promise(delay, {
        loading: "fetching permissions...",
        success: () => {
          setIsAppLoading(false);
          return "fetched permissions";
        },
        error: "Error",
      }); */
      //toast.dismiss()
    };

    // fetch only if there is no permission
    if (user && !user?.permissions) {
      setIsAppLoading(true)
      permissions();
    }
  }, [user]);

  return (
    <Routes>
      {!user ? (
          <Route path="/signin" element={<LoginPage />} />
      ) : (
          <Route path="/" element={<HomePage />} />
      )}
    </Routes>
  );
}

export default App;
