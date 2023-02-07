import { createContext, useCallback, useContext, useState } from "react";

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

export const AuthContextProvider = ({
  children,
}: {
  children: JSX.Element;
}) => {
  const [user, setUser] = useState<any | null>({ name: "John Doe" });

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

export const useAuthContext = () => useContext(AuthContext);
