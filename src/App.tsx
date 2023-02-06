import {
  Navigate,
  RouterProvider,
  createBrowserRouter,
} from "react-router-dom";
import {
  LazyExoticComponent,
  Suspense,
  createContext,
  lazy,
  useCallback,
  useContext,
  useState,
} from "react";

const HomePage = lazy(() => import("./pages/HomePage/HomePage"));
const LoginPage = lazy(() => import("./pages/LoginPage/LoginPage"));
const NotFoundPage = lazy(() => import("./pages/NotFoundPage/NotFoundPage"));

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

  return (
    <AuthContext.Provider value={{ user, login, logout, isAuth }}>
      {children}
    </AuthContext.Provider>
  );
};

const useAuthContext = () => useContext(AuthContext);

const useAuthenticationGuard = () => {
  const { isAuth } = useAuthContext();
  return {
    guardCheck: isAuth(),
    redirect: "/login",
  };
};

const LazyComponent = ({
  Component,
  guards = [],
  ...props
}: {
  Component: LazyExoticComponent<() => JSX.Element>;
  guards: Array<() => { guardCheck: boolean; redirect: string }> | [];
}) => {
  const guardChecks = guards.map((guard) => guard().guardCheck);
  const isAllowed = guardChecks.every((guardCheck) => guardCheck);

  const redirectRoute = guards.map((guard) => guard().redirect)[
    guardChecks.indexOf(false)
  ];

  if (!isAllowed) {
    return <Navigate to={redirectRoute} />;
  }

  return (
    <Suspense fallback={<div>Loading...</div>}>
      <Component {...props} />
    </Suspense>
  );
};

const APP_ROUTES = [
  {
    path: "/",
    name: "Home",
    element: (
      <LazyComponent Component={HomePage} guards={[useAuthenticationGuard]} />
    ),
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

const router = createBrowserRouter(APP_ROUTES);

function App() {
  return (
    <AuthContextProvider>
      <RouterProvider router={router} />
    </AuthContextProvider>
  );
}

export default App;
