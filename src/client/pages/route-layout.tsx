import { createBrowserRouter, Outlet, useLocation } from "react-router";
import { AnimatePresence, motion } from "framer-motion";

import HomePage from "@clnt/pages/home";
import LoginPage from "@clnt/pages/login";
import ErrorPage from "@clnt/pages/error";
import { AuthLoader } from "@clnt/lib/auth";
import Loader from "@clnt/components/common/loader";
import ClassroomPageRoute from "./classrooms";
import LabPageRoute from "./lab";
import LabTemplatesPageRoute from "./lab-builder/template";
import LabBuilderPageRoute from "./lab-builder";
import LabEditorPageRoute from "./lab-builder/editor";
import ProjectPageRoute from "./classrooms/project";

const Layout = () => {
  const location = useLocation();
  return (
    <AuthLoader
      renderLoading={() => <Loader />}
      renderUnauthenticated={() => <LoginPage />}
    >
      <AnimatePresence mode="popLayout">
        <motion.div
          key={location.pathname}
          initial={{ y: 300, opacity: 0 }}
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
  // sample nested route http://localhost:5000/classrooms/c70695db-4269-46d6-9172-3622f32904d7/labs/45eeda7e-7845-4112-8c42-7dfb1cd71964
  {
    path: "classrooms",
    element: <Layout />,
    children: [
      {
        path: ":classroomId",
        element: <ClassroomPageRoute />,
        children: [
          {
            path: "project",
            element: <Layout />,
            children: [
              {
                path: ":projectId",
                element: <ProjectPageRoute />,
              },
              {
                path: ":projectId/labs/:labId",
                element: <LabPageRoute />,
              },
            ],
          },
        ],
      },
    ],
  },
  {
    path: "lab-builder",
    element: <Layout />,
    children: [
      {
        index: true,
        element: <LabBuilderPageRoute />,
      },
      {
        path: "editor/:labId",
        element: <LabEditorPageRoute />,
      },
      {
        path: "templates",
        element: <LabTemplatesPageRoute />,
      },
    ],
  },
  {
    path: "lab-builder-2",
    element: <Layout />,
    children: [
      {
        index: true,
        element: <LabTemplatesPageRoute />,
      },
    ],
  },
  {
    path: "*",
    element: <ErrorPage />,
  },
]);

export default router;
