import React, { useState, useEffect } from "react";
import { verifyEmail, resendVerificationToken } from "./AuthService";
import ProcessSpinner from "../common/ProcessSpinner";

const EmailVerification = () => {
  const [verificationMessage, setVerificationMessage] = useState(
    "Đang xác minh email của bạn, vui lòng chờ..."
  );
  const [alertType, setAlertType] = useState("alert-info");
  const [isProcessing, setIsProcessing] = useState(false);

  useEffect(() => {
    const queryParams = new URLSearchParams(window.location.search);
    const token = queryParams.get("token");
    if (token) {
      verifyEmailToken(token);
    } else if (!token) {
      setVerificationMessage("Chưa cung cấp mã xác thực.");
      setAlertType("alert-danger");
    }
  }, []);

  const verifyEmailToken = async (token) => {
    setIsProcessing(true);
    try {
      const response = await verifyEmail(token);
      switch (response.message) {
        case "VALID":
          setVerificationMessage(
            "Email của bạn đã được xác minh thành công, bạn có thể đăng nhập."
          );
          setAlertType("alert-success");
          break;
        case "VERIFIED":
          setVerificationMessage(
            "Email này đã được xác minh, vui lòng đăng nhập."
          );
          setAlertType("alert-info");
          break;
        default:
          setVerificationMessage("Đã có lỗi xảy ra.");
          setAlertType("alert-danger");
      }
    } catch (error) {
      if (error.response) {
        const { message } = error.response.data;

        if (message && message === "INVALID") {
          setVerificationMessage("Liên kết xác minh này không hợp lệ.");
          setAlertType("alert-danger");
        } else {
          setVerificationMessage(
            "Liên kết xác minh này đã hết hạn, vui lòng thử lại."
          );
          setAlertType("alert-warning");
        }
      } else {
        setVerificationMessage("Không thể kết nối với máy chủ.");
        setAlertType("alert-danger");
      }
    } finally {
      setIsProcessing(false); // Stop loading regardless of the outcome
    }
  };

  //Resend verification to user if the initial one has expired.
  const handleResendToken = async () => {
    setIsProcessing(true);
    const queryParams = new URLSearchParams(location.search);
    const oldToken = queryParams.get("token");
    try {
      if (!oldToken) {
        return;
      }

      const response = await resendVerificationToken(oldToken);
      setVerificationMessage(response.message);
      setAlertType("alert-success");
    } catch (error) {
      console.log("The error : " + error);
      let message = "Không thể gửi lại mã xác minh.";
      if (
        error.response &&
        error.response.data &&
        error.response.data.message
      ) {
        message = error.response.data.message;
      } else if (error.message) {
        message = error.message;
      }
      setVerificationMessage(message);
      setAlertType("alert-danger");
    } finally {
      setIsProcessing(false); // Stop loading regardless of the outcome
    }
  };

  return (
    <div className='d-flex justify-content-center  mt-lg-5'>
      {isProcessing ? (
        <ProcessSpinner message='Đang xử lý yêu cầu của bạn, vui lòng chờ...' />
      ) : (
        <div className='col-12 col-md-6'>
          <div className={`alert ${alertType}`} role='alert'>
            {verificationMessage}

            {alertType === "alert-warning" && (
              <button onClick={handleResendToken} className='btn btn-link'>
                Gửi lại liên kết xác minh
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default EmailVerification;
