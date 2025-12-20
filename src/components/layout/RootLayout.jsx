import React from "react";
import { Outlet } from "react-router-dom";
import BackgroundImageSlider from "../common/BackgroundImageSlider";
import NavBar from "./NavBar";

import { useEffect } from "react";
import { jwtDecode } from "jwt-decode";

const RootLayout = () => {
  useEffect(() => {
    const token = localStorage.getItem("authToken");
    if (token) {
      try {
        const decodedToken = jwtDecode(token);
        const currentTime = Date.now() / 1000;
        if (decodedToken.exp < currentTime) {
          localStorage.removeItem("authToken");
          localStorage.removeItem("userId");
          localStorage.removeItem("userRoles");
          // No need to redirect here since we might be on a public page, 
          // but clearing storage ensures NavBar updates to "Login".
          // If we want to be aggressive we could window.location.reload() or redirect.
          // For now, just clearing ensures clean state.
          window.location.reload(); // Reload to update NavBar state immediately
        }
      } catch (error) {
        localStorage.removeItem("authToken");
        localStorage.removeItem("userId");
        localStorage.removeItem("userRoles");
      }
    }
  }, []);
  return (
    <main>
      <NavBar />
      <BackgroundImageSlider />
      <div>
        <Outlet />
      </div>
    </main>
  );
};

export default RootLayout;
