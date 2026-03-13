import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

function AdminRoute({ children }) {
  const { authLoading, isAdmin } = useAuth();

  if (authLoading) {
    return (
      <section className="container py-5">
        <p className="mb-0 text-muted">Checking admin access...</p>
      </section>
    );
  }

  if (!isAdmin) {
    return <Navigate to="/" replace />;
  }

  return children;
}

export default AdminRoute;