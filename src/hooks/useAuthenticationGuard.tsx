import { useAuthContext } from "../context/auth";

export const useAuthenticationGuard = () => {
  const { isAuth } = useAuthContext();
  return {
    guardCheck: isAuth(),
    redirect: "/login",
  };
};
