import axios from "axios";
import {useNavigate} from "react-router-dom"
import useAuth from "./useAuth";

const axiosSecure = axios.create({
    baseURL: 'http://localhost:6001',
})

const useAxiosSecure = () => {
    const navigate = useNavigate();
    const {logOut} = useAuth();

    axiosSecure.interceptors.request.use(function (config) {
        // Add the access token to the request headers
        const token = localStorage.getItem('access-token');
        config.headers.authorization =`Bearer ${token}`
        return config;
      }, function (error) {
        // Handle request errors
        return Promise.reject(error);
      });

// Add a response interceptor
      axiosSecure.interceptors.response.use(function (response) {
        return response;
      }, async (error) => {
      const status = error.response.status;

      // If the user is unauthorized or forbidden, log them out and redirect to login
      if(status === 401 || status === 403 ){
        await logOut();
        navigate("/login")
      }
        return Promise.reject(error);
      });

  return axiosSecure
}

export default useAxiosSecure;