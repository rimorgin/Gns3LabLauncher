import { useEffect } from "react";
import { Routes, Route, useNavigate } from "react-router";
import HomePage from "@clnt/pages/main/home";
import { useUserStore } from "@clnt/store/user.store";
import LoginPage from "./pages/auth/login";

function App() {
  const { user, validateSession } = useUserStore();
  const navigate = useNavigate()

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

  return (
    <Routes>
      {!user ? (
        <>
          <Route path="/signin" element={<LoginPage />} />
        </>
      ) : (
        <Route path="/" element={<HomePage/>} />
      )}
    </Routes>
  );
}

export default App;
