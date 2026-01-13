import { Navigate } from "react-router";
import useRole from "../../../hooks/useRole";

const DashBoardHome = () => {
  const { role } = useRole();

  if (role === "admin" || role === "student") {
    return <Navigate to={"/dashboard/me"} replace={true} />;
  }
};

export default DashBoardHome;
