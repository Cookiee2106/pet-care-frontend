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
    // Wake Up Service: Ping backend immediately
    let isTimeoutTriggered = false;
    const timeoutId = setTimeout(() => {
      isTimeoutTriggered = true;
      setShowWakeUpToast(true);
      setWakeUpStatus("awakening");
    }, 3000);

    const pingBackend = async () => {
      try {
        await api.get("/veterinarians/vet/get-all-specialization");
        clearTimeout(timeoutId);

        if (isTimeoutTriggered) {
          setWakeUpStatus("connected");
          setTimeout(() => setShowWakeUpToast(false), 3000); // Auto hide success msg
        }
      } catch (error) {
        clearTimeout(timeoutId);
        if (isTimeoutTriggered) setShowWakeUpToast(false);
      }
    };

    pingBackend();

    const token = localStorage.getItem("authToken");
    if (token) {
      try {
        const decodedToken = jwtDecode(token);
        const currentTime = Date.now() / 1000;
        if (decodedToken.exp < currentTime) {
          // Token expired
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
              ? "Server miễn phí đang ngủ đông. Vui lòng đợi 30-50 giây..."
              : "Hệ thống đã sẵn sàng phục vụ!"}
          </Toast.Body>
        </Toast>
      </ToastContainer>
    </main>
  );
};

export default RootLayout;
