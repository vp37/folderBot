// layout/PrivateRoute.js
import { Navigate, Outlet } from 'react-router-dom';
import { useSelector } from 'react-redux';

const PrivateRoute = () => {
  const token = useSelector(state => state.auth.token); // Or however you store it

  return token ? <Outlet /> : <Navigate to="/login" />;
};

export default PrivateRoute;
