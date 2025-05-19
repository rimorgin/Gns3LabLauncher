import { useEffect, useState } from "react";
import { Button } from "@clnt/components/ui/button";
import LoginPage from "./pages/auth/login";
import { Router, Route, Switch } from "wouter";
import axios from 'axios'
import { useUserStore } from "./store/user.store";

function App() {
  const [count, setCount] = useState(0);
  const { user, getUser } = useUserStore();

  //const user = getUser()
  //console.log(user)
  useEffect(() => {
    getUser()
  },[])

  return (
    <Router>
      <Switch>
        {/* If user is NOT logged in, always redirect to /login */}
        {!user ? (
          <>
            <Route path="/login" component={LoginPage} />
          </>
        ) : (
          <>
            <Route path="/" component={HomePage} />
            {/* Add other authenticated routes here */}
          </>
        )}
      </Switch>
    </Router>
  );
}

export default App;
