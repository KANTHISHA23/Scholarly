import axios from "axios";
import { useEffect } from "react";
import useAuth from "./useAuth";
import { useNavigate } from "react-router";

const instance = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
  withCredentials: true,
});

//to globally handle authorization failures and auto-logout users when JWT validation fails.
const useAxiosSecure = () => {
  const { user, signOutFunc } = useAuth();
  const navigate = useNavigate();
  useEffect(() => {
    const requestInterceptor = instance.interceptors.request.use(
      (config) => {
        return config;
      },
      (err) => {
        console.log(err);
      }
    );

    const responseInterceptor = instance.interceptors.response.use(
      (response) => {
        return response;
      },
      (err) => {
        const status = err.response?.status;

        if (status === 401 || status === 403) {
          signOutFunc().then(() => {
            navigate("/signIn");
          });
        }
      }
    );

    return () => {
      axios.interceptors.request.eject(requestInterceptor);
      axios.interceptors.response.eject(responseInterceptor);
    };
  }, [user, navigate, signOutFunc]);
  return instance;
};

export default useAxiosSecure;
