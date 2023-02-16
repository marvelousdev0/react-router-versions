import { Suspense, createContext, lazy as l, useCallback, useContext, useState } from "react";
import { Routes, Route, Navigate } from "react-router-dom";

const HomePage = l(() => import("../pages/HomePage/HomePage"));
const LoginPage = l(() => import("../pages/LoginPage/LoginPage"));

type AuthContextType = {
  user: any;
  login: (user: any) => void;
  logout: () => void;
  isAuth: () => boolean;
};

const AuthContext = createContext<AuthContextType>({
  user: null,
  login: () => {},
  logout: () => {},
  isAuth: () => false,
});

const AuthContextProvider = ({ children }: { children: JSX.Element }) => {
  const [user, setUser] = useState<any | null>(null);

  const login = useCallback((user: any) => {
    setUser(user);
  }, []);

  const logout = useCallback(() => {
    setUser(null);
  }, []);

  const isAuth = useCallback(() => {
    return !!user;
  }, [user]);

  return <AuthContext.Provider value={{ user, login, logout, isAuth }}>{children}</AuthContext.Provider>;
};

const useAuthContext = () => useContext(AuthContext);

const ProtectedRoute = ({ ...props }) => {
  return <Route {...props} />;
};

const useAuthenticationGuard = () => {
  const { isAuth } = useAuthContext();
  return {
    guardCheck: isAuth(),
    redirect: "/login",
  };
};

const renderRoute = ({
  name,
  path,
  element,
  guards,
}: {
  name: string;
  path: string;
  element: JSX.Element;
  guards: Array<() => { guardCheck: boolean; redirect: string }> | [];
}): JSX.Element => {
  if (guards.length === 0) {
    return <Route key={name} path={path} element={element} />;
  }

  const guardChecks = guards.map((guard) => guard().guardCheck);
  const isAllowed = guardChecks.every((guardCheck) => guardCheck);

  const redirectRoute = guards.map((guard) => guard().redirect)[guardChecks.indexOf(false)];

  return isAllowed ? (
    <ProtectedRoute key={name} path={path} element={element} />
  ) : (
    <Route key={name} path={name} element={<Navigate to={redirectRoute} />} />
  );
};

const APP_ROUTES = [
  {
    path: "/",
    name: "Home",
    element: <HomePage />,
    guards: [useAuthenticationGuard],
  },
  {
    path: "/login",
    name: "Login",
    element: <LoginPage />,
    guards: [],
  },
  {
    path: "*",
    name: "NotFound",
    element: <div>Not Found</div>,
    guards: [],
  },
];

export const Routing = () => {
  return (
    <AuthContextProvider>
      <Suspense fallback={<div>Loading...</div>}>
        <Routes>{APP_ROUTES.map(renderRoute)}</Routes>
      </Suspense>
    </AuthContextProvider>
  );
};
