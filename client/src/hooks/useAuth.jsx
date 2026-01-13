import React, { use } from "react";
import { AuthContext } from "../Context/AuthContext";


//to abstract authentication logic from context and make it reusable across components.
const useAuth = () => {
  const authInfo = use(AuthContext);
  return authInfo;
};

export default useAuth;
