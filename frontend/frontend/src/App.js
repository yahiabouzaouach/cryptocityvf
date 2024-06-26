import React, { useEffect } from "react";
import { BrowserRouter, Route, Routes, Navigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { loadUser } from "./redux/features/authSlice";

import Login from "./views/Login";
import ProtectedRoute from "./ProtectedRoute";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import UserProfil from "./components/UserProfil";
import Paiments from "./components/Depenses";
import Depenses from "./components/Depenses";
import PersonIcon from "@mui/icons-material/Person";
import PointOfSaleIcon from "@mui/icons-material/PointOfSale";
import PriceCheckIcon from "@mui/icons-material/PriceCheck";
const role = localStorage.getItem("role");
export const routes = [
  role !== "employee" && 
  {
    type: "item",
    name: "Table",
    key: "User profile",
    route: "/dashboard/profile",
    component: <UserProfil />,
    icon: <PersonIcon />,
  },
  {
    type: "item",
    name: "Electricity",
    key: "Electricity",
    route: "/dashboard/Paiments",
    component: <Paiments />,
    icon: <PointOfSaleIcon />,
  },
  {
    type: "item",
    name: "Marketplace",
    key: "Marketplace",
    route: "/dashboard/Dépenses",
    component: <Depenses />,
    icon: <PriceCheckIcon />,
  },
].filter((route) => route);

function App() {
  const dispatch = useDispatch();

  useEffect(() => {
    const profileData = localStorage.getItem("token");
    if (profileData) {
      dispatch(loadUser());
    }
  }, []);

  return (
    <div>
      <BrowserRouter>
        <ToastContainer />
        <Routes>
          {routes.map((prop, key) => (
            <Route
              key={prop.key}
              path={prop.route}
              element={<ProtectedRoute>{prop.component}</ProtectedRoute>}
            />
          ))}
          <Route
            path="*"
            element={
              role !== "resident" ? (
                <ProtectedRoute>
                  <Navigate to="/dashboard" />
                </ProtectedRoute>
              ) : (
                <ProtectedRoute>
                  <Navigate to="/dashboard/Paiments" />
                </ProtectedRoute>
              )
            }
          />
          <Route path="/auth/login" element={<Login />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
