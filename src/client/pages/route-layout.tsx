import { createBrowserRouter, Outlet, useLocation } from "react-router";
import { AnimatePresence, motion } from "framer-motion";

import HomePage from "@clnt/pages/home";
import LoginPage from "@clnt/pages/login";
import ProjectPage from "@clnt/pages/labs";
import ErrorPage from "@clnt/pages/error";
import { AuthLoader } from "@clnt/lib/auth";
import Loader from "@clnt/components/common/loader";
import ReadingPageRoute from "@clnt/pages/labs/reading";
import QuizPageRoute from "@clnt/pages/labs/quiz";
import ClassroomPageRoute from "./classrooms";
import LabPageRoute from "./lab";
import LabTemplatesPageRoute from "./lab-builder/template";
import TemplateEditOrCreatePageRoute from "./lab-builder";

const Layout = () => {
  const location = useLocation();
  const isNotMainProjectPage =
    location.pathname.includes("reading") || location.pathname.includes("quiz");

  return (
    <AuthLoader
      renderLoading={() => <Loader />}
      renderUnauthenticated={() => <LoginPage />}
    >
      <AnimatePresence mode="popLayout">
        <motion.div
          key={location.pathname}
          initial={
            isNotMainProjectPage ? { y: 0, opacity: 1 } : { y: 300, opacity: 0 }
          }
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 0, opacity: 0 }}
          transition={{ duration: 0.3, ease: "easeInOut" }}
          className="fixed inset-0 bg-background z-50 h-1/1 flex-1 overflow-y-auto"
        >
          <Outlet />
        </motion.div>
      </AnimatePresence>
    </AuthLoader>
  );
};

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
    path: "classrooms",
    element: <Layout />,
    children: [
      {
        path: ":classroomId",
        element: <ClassroomPageRoute />,
      },
    ],
  },
  {
    path: "lab-builder",
    element: <Layout />,
    children: [
      {
        index: true,
        element: <TemplateEditOrCreatePageRoute />,
      },
      {
        path: "templates",
        element: <LabTemplatesPageRoute />,
      },
    ],
  },
  {
    path: "lab",
    element: <Layout />,
    children: [
      {
        path: ":projectId",
        element: <LabPageRoute />,
      },
    ],
  },
  {
    path: "labs",
    element: <Layout />,
    children: [
      {
        path: ":projectId",
        element: <ProjectPage />,
      },
      { path: ":projectId/reading", element: <ReadingPageRoute /> },
      { path: ":projectId/quiz", element: <QuizPageRoute /> },
    ],
  },
  {
    path: "*",
    element: <ErrorPage />,
  },
]);

export default router;
