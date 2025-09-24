import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Login from "../pages/Login";
import Signup from "../pages/Signup";
import PrivateRoute from "../layout/PrivateRoute";
import Layout from "../layout/Layout";
import Enbot from "../pages/Enbot";
import Folder from "../pages/Folder";
import Home from "../pages/Home";
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
      element: <PrivateRoute />,
      children: [
        {
          path: "/",
          element: <Layout />,
          children: [
            {
              path: "", 
              element: <Folder />,
            },
            {
              path: "bot", // `/bot` route
              element: <Enbot />,
            },
            {
              path: "home", // `/bot` route
              element: <Home />,
            },
          ],
        },
      ],
    },
  ]);

  return <RouterProvider router={router} />;
};

export default Router;
