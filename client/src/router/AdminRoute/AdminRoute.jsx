import Forbidden from "../../components/Forbidden/Forbidden";
import Spinner from "../../components/Spinner/Spinner";
import useAuth from "../../hooks/useAuth";
import useRole from "../../hooks/useRole";

const AdminRoute = ({ children }) => {
  const { role, roleLoading } = useRole();
  const { authLoading } = useAuth();
  if (roleLoading || authLoading) {
    return <Spinner />;
  }
  if (role !== "admin") {
    return <Forbidden />;
  }
  return children;
};

export default AdminRoute;
