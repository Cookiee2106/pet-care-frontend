import React, { useEffect, useState } from "react";
import { Outlet } from "react-router-dom";
import BackgroundImageSlider from "../common/BackgroundImageSlider";
import NavBar from "./NavBar";
import { jwtDecode } from "jwt-decode";
import { api } from "../utils/api";
import { Toast, ToastContainer } from "react-bootstrap";
import { FaServer } from "react-icons/fa";

const RootLayout = () => {
  const [showWakeUpToast, setShowWakeUpToast] = useState(false);
  const [wakeUpStatus, setWakeUpStatus] = useState("awakening"); // awakening | connected

  useEffect(() => {
    let timeoutId;
    let isMounted = true;

    const pingBackend = async () => {
      let isTimeoutTriggered = false;

      // Clear any existing timeout from previous runs (debouncing essentially)
      if (timeoutId) clearTimeout(timeoutId);

      // Set a timer: if request takes > 2s, show toast
      timeoutId = setTimeout(() => {
        if (isMounted) {
          isTimeoutTriggered = true;
          setShowWakeUpToast(true);
          setWakeUpStatus("awakening");
        }
      }, 2000);

      try {
        await api.get("/veterinarians/vet/get-all-specialization");

        if (isMounted) {
          clearTimeout(timeoutId);
          if (isTimeoutTriggered) {
            // If we showed the 'awakening' toast, update it to 'connected'
            setWakeUpStatus("connected");
            setTimeout(() => {
              if (isMounted) setShowWakeUpToast(false);
            }, 3000);
          }
          // If we didn't show toast (fast response), do nothing
        }
      } catch (error) {
        if (isMounted) {
          clearTimeout(timeoutId);
          // If error, better hide the "awakening" toast to avoid Stuck UI
          // Or we could show "Error connecting" but that might be annoying.
          if (isTimeoutTriggered) setShowWakeUpToast(false);
        }
      }
    };

    // 1. Initial Ping
    pingBackend();

    // 2. Token Check
    const token = localStorage.getItem("authToken");
    if (token) {
      try {
        const decodedToken = jwtDecode(token);
        const currentTime = Date.now() / 1000;
        if (decodedToken.exp < currentTime) {
          localStorage.removeItem("authToken");
          localStorage.removeItem("userId");
          localStorage.removeItem("userRoles");
          window.location.reload();
        }
      } catch (error) {
        localStorage.removeItem("authToken");
        localStorage.removeItem("userId");
        localStorage.removeItem("userRoles");
      }
    }

    // 3. Visibility Change Listener (Wake up when user returns)
    const handleVisibilityChange = () => {
      if (document.visibilityState === "visible") {
        // Trigger ping again when tab becomes visible
        pingBackend();
      }
    };

    document.addEventListener("visibilitychange", handleVisibilityChange);

    return () => {
      isMounted = false;
      document.removeEventListener("visibilitychange", handleVisibilityChange);
      if (timeoutId) clearTimeout(timeoutId);
    };
  }, []);

  return (
    <main>
      <NavBar />
      <BackgroundImageSlider />
      <div>
        <Outlet />
      </div>

      <ToastContainer className="p-3" position="bottom-end" style={{ zIndex: 9999, position: 'fixed' }}>
        <Toast show={showWakeUpToast} onClose={() => setShowWakeUpToast(false)} delay={5000} autohide={wakeUpStatus === 'connected'}>
          <Toast.Header closeButton={false} className={wakeUpStatus === 'connected' ? "bg-success text-white" : "bg-warning text-dark"}>
            <FaServer className="me-2" />
            <strong className="me-auto">
              {wakeUpStatus === 'awakening' ? 'Hệ thống đang khởi động...' : 'Đã kết nối!'}
            </strong>
          </Toast.Header>
          <Toast.Body className={wakeUpStatus === 'connected' ? "bg-success text-white" : "bg-light"}>
            {wakeUpStatus === 'awakening'
              ? "Server miễn phí đang ngủ đông. Vui lòng đợi 3-4 phút..."
              : "Hệ thống đã sẵn sàng phục vụ!"}
          </Toast.Body>
        </Toast>
      </ToastContainer>
    </main>
  );
};

export default RootLayout;
