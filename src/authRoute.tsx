import * as React from "react";

import { Navigate, Outlet, useLocation } from "react-router-dom";

import { logout } from "./utils/service";
import menuItem from "./components/sidebar/menuItem";

//import { Cookie } from "@mui/icons-material";

function ProtectedPage() {
  return <h3>Protected</h3>;
}

const AuthRoute = () => {
  const location = useLocation();
  const user = JSON.parse(sessionStorage.getItem("User") || "null");
  const locationArr = location.pathname.split("/").reverse();
  let lastPath = "";
  if (!user) {
    
    logout();
    return <Navigate to="/login" state={{ from: location }} />;
  }
  for (const path of locationArr) {
    if (isNaN(parseInt(path)) && menuItem.some((d: any) => d.path === path)) {
      lastPath = path;
      break;
    }
  }
  //   const checkRole = menuItem.some((d: any) => {
  //     const pathName = d.path.split("/").reverse()[0];
  //     const checkSome = d.role.some((role: string) => {
  //       return role === user.role;
  //     });

  //     const checkPath = pathName === lastPath;
  //     return checkSome && checkPath;
  //   });
  //   return lastPath === "profile" || (user && checkRole) ? (
  return lastPath === "profile" || user ? (
    <Outlet />
  ) : (
    <Navigate to="/" state={{ from: location }} />
  );
};
export { AuthRoute, ProtectedPage };
