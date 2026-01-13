import axios from "axios";

//for public API requests to avoid repeating base configuration
const instance = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
  withCredentials: true, //Cookies must be sent with requests
});

const useAxios = () => {
  return instance;
};

export default useAxios;
