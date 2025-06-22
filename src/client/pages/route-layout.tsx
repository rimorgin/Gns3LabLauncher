import { createBrowserRouter } from "react-router";
import HomePage from "@clnt/pages/home";
import LoginPage from "@clnt/pages/login";
import ErrorPage from "@clnt/pages/error";
import { AuthLoader } from "@clnt/lib/auth";
import Loader from "@clnt/components/common/loader";

const router = createBrowserRouter([
  {
    index: true,
    element: (
      <AuthLoader
        renderLoading={() => <Loader />}
        renderUnauthenticated={() => <LoginPage />}
      >
        <HomePage />
      </AuthLoader>
    ),
  },
  {
    path: "error",
    Component: ErrorPage,
  },
]);

export default router