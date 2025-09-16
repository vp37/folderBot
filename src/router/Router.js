import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Login from "../pages/Login";
import Signup from "../pages/Signup";
import PrivateRoute from "../layout/PrivateRoute";
import Layout from "../layout/Layout";
import Enbot from "../pages/Enbot";
import Folder from "../pages/Folder";
import ForgetPassword from "../pages/ForgetPassword";

const Router = () => {
  const router = createBrowserRouter([
    {
      path: "/login",
      element: <Login />,
    },
    {
      path: "/signup",
      element: <Signup />,
    },
    {
      path: "/forgot-password",
      element: <ForgetPassword />,
    },
    {
      path: "/",
      element: <PrivateRoute />, // Only authenticated users can access children
      children: [
        {
          path: "/", // This renders Layout as the main wrapper
          element: <Layout />,
          children: [
            {
              path: "", // Default page at `/` → Folder
              element: <Folder />,
            },
            {
              path: "bot", // `/bot` route
              element: <Enbot />,
            },
          ],
        },
      ],
    },
  ]);

  return <RouterProvider router={router} />;
};

export default Router;
