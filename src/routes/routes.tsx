import { LazyExoticComponent, Suspense, lazy as l } from "react";
import { Navigate } from "react-router-dom";
import { useAuthenticationGuard } from "../hooks/useAuthenticationGuard";

const HomePage = l(() => import("../pages/HomePage/HomePage"));
const LoginPage = l(() => import("../pages/LoginPage/LoginPage"));
const NotFoundPage = l(() => import("../pages/NotFoundPage/NotFoundPage"));

export const LazyComponent = ({
  Component,
  guards = [],
  ...props
}: {
  Component: LazyExoticComponent<() => JSX.Element>;
  guards: Array<() => { guardCheck: boolean; redirect: string }> | [];
}) => {
  const guardChecks = guards.map((guard) => guard().guardCheck);
  const isAllowed = guardChecks.every((guardCheck) => guardCheck);

  const redirectRoute = guards.map((guard) => guard().redirect)[guardChecks.indexOf(false)];

  if (!isAllowed) {
    return <Navigate to={redirectRoute} />;
  }

  return (
    <Suspense fallback={<div>Loading...</div>}>
      <Component {...props} />
    </Suspense>
  );
};

export const APP_ROUTES = [
  {
    path: "/",
    name: "Home",
    element: <LazyComponent Component={HomePage} guards={[useAuthenticationGuard]} />,
  },
  {
    path: "/login",
    name: "Login",
    element: <LazyComponent Component={LoginPage} guards={[]} />,
  },
  {
    path: "*",
    name: "NotFound",
    element: <LazyComponent Component={NotFoundPage} guards={[]} />,
  },
];
