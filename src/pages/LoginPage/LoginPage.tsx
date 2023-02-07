import { Navigate } from "react-router-dom";
import Page from "../../components/Page/Page";
import { useAuthContext } from "../../context/auth";

export default function LoginPage() {
  const { isAuth } = useAuthContext();

  if (isAuth()) {
    return <Navigate to="/" />;
  }

  return <Page title="Login">Login page content</Page>;
}
