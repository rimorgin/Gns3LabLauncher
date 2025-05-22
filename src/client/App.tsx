import { useEffect, useState } from "react";
import { Routes, Route, useNavigate } from "react-router";
import HomePage from "@clnt/pages/main/home";
import { useUserStore } from "@clnt/store/user.store";
import LoginPage from "./pages/auth/login";

function App() {
  const { user, getUser } = useUserStore();
  const navigate = useNavigate()

  useEffect(() => {
    const fetchUser = async () => {
      await getUser();
    };
    fetchUser();
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
