import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import Login from "../pages/Login"
import Signup from "../pages/Signup"
import PrivateRoute from "../layout/PrivateRoute"
import Layout from "../layout/Layout"
import Enbot from "../pages/Enbot"
import Folder from "../pages/Folder"


const Router = () => {  
  const router = createBrowserRouter([
    {
      path: '/login',
      element: <Login />,
    },
    {
      path: '/signup',
      element: <Signup />,
    },
    {
      path: '/',
      element: <PrivateRoute />,
      children: [
        {
          path: '/',
          element: <Layout />,
          children: [
            {
              path: 'bot',      
              element: <Enbot />,
            },
             {
              path: '/',      
              element: <Folder />,
            },
          ],
        },
      ],
    },
  ]);

  return <RouterProvider router={router} />;
};

export default Router;