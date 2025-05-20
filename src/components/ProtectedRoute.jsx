import { Navigate, Outlet } from 'react-router-dom';

function ProtectedRoute() {
  const isLoggedIn = !!localStorage.getItem('accessToken');

  console.log('ProtectedRoute: ' + isLoggedIn)
  return isLoggedIn ? <Outlet /> : <Navigate to="/login" replace />;
}

export default ProtectedRoute;