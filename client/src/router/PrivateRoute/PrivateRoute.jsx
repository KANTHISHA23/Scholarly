import Lottie from "lottie-react";
import useAuth from "../../hooks/useAuth";
import { Navigate, useLocation } from "react-router";
import Loading from "../../assets/animations/Loading.json";
const PrivateRoute = ({ children }) => {
  const { user, authLoading } = useAuth();
  const location = useLocation();

  if (authLoading) {
    return (
      <div className="flex items-center justify-center h-[calc(100vh-80px)]">
        <Lottie animationData={Loading} loop />
      </div>
    );
  }

  if (!user && !user?.email) {
    return <Navigate to={"/signIn"} state={location.pathname} />;
  }
  return children;
};

export default PrivateRoute;
