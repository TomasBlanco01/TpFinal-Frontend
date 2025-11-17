import { Navigate } from "react-router-dom";

export default function ProtectedRoute({ children, requireAdmin }) {
  const user = JSON.parse(localStorage.getItem("user"));

  if (!user) {
    return <Navigate to="/auth/login" />;
  }

  if (requireAdmin && user.rol?.toLowerCase() !== "admin") {
    return <Navigate to="/" />;
  }

  return children;
}
