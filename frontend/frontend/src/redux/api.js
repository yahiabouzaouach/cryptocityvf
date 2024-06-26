import axios from "axios";

const API = axios.create({ baseURL: "http://localhost:3304" });

API.interceptors.request.use((req) => {
  if (localStorage.getItem("token")) {
     req.headers["x-auth-token"] = localStorage.getItem("token");
  }
  if (localStorage.getItem("role")) {
    req.headers["role"] = localStorage.getItem("role")
  }


  return req;
});


export default API;
