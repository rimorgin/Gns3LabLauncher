import { createBrowserRouter, Outlet, useLocation } from "react-router";
import { AnimatePresence, motion } from "framer-motion";
import { Suspense, lazy } from "react";

import Loader from "@clnt/components/common/loader";
import { AuthLoader } from "@clnt/lib/auth";
import LoginPage from "@clnt/pages/login";
import ErrorPage from "@clnt/pages/error";
import InstancePageRoute from "./lab/instance";

// 👇 Lazy-loaded pages
const HomePage = lazy(() => import("@clnt/pages/home"));
const ClassroomPageRoute = lazy(() => import("./classrooms"));
const LabPageRoute = lazy(() => import("./lab"));
const LabBuilderPageRoute = lazy(() => import("./lab-builder"));
const LabEditorPageRoute = lazy(() => import("./lab-builder/editor"));
const LabTestEnvironmentPageRoute = lazy(
  () => import("./lab-builder/test-build"),
);
const ProjectPageRoute = lazy(() => import("./classrooms/project"));

const AuthenticatedLayout = () => {
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
          className="fixed inset-0 bg-background z-50 h-full flex-1 overflow-y-auto"
        >
          <Suspense fallback={<Loader />}>
            <Outlet />
          </Suspense>
        </motion.div>
      </AnimatePresence>
    </AuthLoader>
  );
};

// 📄 Nested route constants
const projectChildren = [
  {
    path: ":projectId",
    element: (
      <Suspense fallback={<Loader />}>
        <ProjectPageRoute />
      </Suspense>
    ),
  },
  {
    path: ":projectId/labs/:labId",
    element: (
      <Suspense fallback={<Loader />}>
        <LabPageRoute />
      </Suspense>
    ),
  },
  {
    path: ":projectId/labs/:labId/instance",
    element: (
      <Suspense fallback={<Loader />}>
        <InstancePageRoute />
      </Suspense>
    ),
  },
];

const classroomChildren = [
  {
    path: ":classroomId",
    element: (
      <Suspense fallback={<Loader />}>
        <ClassroomPageRoute />
      </Suspense>
    ),
    children: [
      {
        path: "project",
        element: <Outlet />,
        children: projectChildren,
      },
    ],
  },
];

const labBuilderChildren = [
  {
    index: true,
    element: (
      <Suspense fallback={<Loader />}>
        <LabBuilderPageRoute />
      </Suspense>
    ),
  },
  {
    path: "editor/:labId",
    element: (
      <Suspense fallback={<Loader />}>
        <LabEditorPageRoute />
      </Suspense>
    ),
  },
  {
    path: "test-build",
    element: (
      <Suspense fallback={<Loader />}>
        <LabTestEnvironmentPageRoute />
      </Suspense>
    ),
  },
];

const router = createBrowserRouter([
  {
    index: true,
    element: (
      <AuthLoader
        renderLoading={() => <Loader />}
        renderUnauthenticated={() => <LoginPage />}
      >
        <Suspense fallback={<Loader />}>
          <HomePage />
        </Suspense>
      </AuthLoader>
    ),
  },
  {
    path: "classrooms",
    element: <AuthenticatedLayout />,
    children: classroomChildren,
  },
  {
    path: "lab-builder",
    element: <AuthenticatedLayout />,
    children: labBuilderChildren,
  },
  {
    path: "*",
    element: <ErrorPage />, // You can also lazy-load ErrorPage if desired
  },
]);

export default router;
