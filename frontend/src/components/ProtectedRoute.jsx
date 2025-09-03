import { Navigate, Outlet } from "react-router-dom";

export const ProtectedRoute = ({ redirectTo, isAllowed, isAdmin, isOwner, adminOnly,ownerOnly, children }) => {
  
  if (!isAllowed) {
    return <Navigate to={redirectTo} replace />;
  }

  if (adminOnly && !isAdmin) {
    return <Navigate to="/unauthorized" replace />;
  }

  if (ownerOnly && !isOwner && !isAdmin) {
    return <Navigate to="/unauthorized" replace />;
  }

  return children ? children : <Outlet />;
};
