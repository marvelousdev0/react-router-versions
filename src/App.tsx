import { RouterProvider, createBrowserRouter } from "react-router-dom";
import { AuthContextProvider } from "./context/auth";
import { APP_ROUTES } from "./routes/routes";

const router = createBrowserRouter(APP_ROUTES);

function App() {
  return (
    <AuthContextProvider>
      <RouterProvider router={router} />
    </AuthContextProvider>
  );
}

export default App;
