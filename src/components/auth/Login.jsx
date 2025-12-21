import React, { useEffect, useState } from "react";
import { BsPersonFill, BsLockFill } from "react-icons/bs";
import { jwtDecode } from "jwt-decode";

import {
  Container,
  Row,
  Col,
  Card,
  Form,
  Button,
  InputGroup,
} from "react-bootstrap";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { loginUser } from "./AuthService";
import UseMessageAlerts from "../hooks/UseMessageAlerts";
import AlertMessage from "../common/AlertMessage";

const Login = () => {
  const [credentials, setCredentials] = useState({
    email: "",
    password: "",
  });

  const { errorMessage, setErrorMessage, showErrorAlert, setShowErrorAlert } =
    UseMessageAlerts();
  const navigate = useNavigate();
  const location = useLocation();

  const from = location.state?.from?.pathname || "/";

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setCredentials((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  useEffect(() => {
    const isAthenticated = localStorage.getItem("authToken");
    if (isAthenticated) {
      navigate(from, { replace: true });
    }
  });

  const handleLogin = async (e) => {
    e.preventDefault();
    if (!credentials.email || !credentials.password) {
      setErrorMessage("Vui lòng nhập tên người dùng và mật khẩu hợp lệ.");
      setShowErrorAlert(true);
      return;
    }
    try {
      const data = await loginUser(credentials.email, credentials.password);
      localStorage.setItem("authToken", data.token);
      const decoded = jwtDecode(data.token);
      localStorage.setItem("userRoles", JSON.stringify(decoded.roles));
      localStorage.setItem("userId", decoded.id);
      clearLoginForm();
      navigate(from, { replace: true });
      window.location.reload();
    } catch (error) {
      setErrorMessage(error.response.data.message);
      setShowErrorAlert(true);
    }
  };

  const clearLoginForm = () => {
    setCredentials({ email: "", password: "" });
    setShowErrorAlert(false);
  };

  return (
    <Container className='mt-5'>
      <Row className='justify-content-center'>
        <Col sm={6}>
          <Card>
            {showErrorAlert && (
              <AlertMessage type={"danger"} message={errorMessage} />
            )}

            <Card.Body>
              <Card.Title className='text-center mb-4'>Đăng nhập</Card.Title>
              <Form onSubmit={handleLogin}>
                <Form.Group className='mb-3' controlId='username'>
                  <Form.Label>Tên đăng nhập</Form.Label>
                  <InputGroup>
                    <InputGroup.Text>
                      <BsPersonFill /> {/* User icon */}
                    </InputGroup.Text>
                    <Form.Control
                      type='text'
                      name='email'
                      value={credentials.email}
                      onChange={handleInputChange}
                      required
                      onInvalid={(e) => e.target.setCustomValidity("Vui lòng nhập tên đăng nhập.")}
                      onInput={(e) => e.target.setCustomValidity("")}
                    />
                  </InputGroup>
                </Form.Group>

                <Form.Group className='mb-3' controlId='password'>
                  <Form.Label>Mật khẩu</Form.Label>
                  <InputGroup>
                    <InputGroup.Text>
                      <BsLockFill /> {/* Lock icon */}
                    </InputGroup.Text>
                    <Form.Control
                      type='password'
                      name='password'
                      value={credentials.password}
                      onChange={handleInputChange}
                      required
                      onInvalid={(e) => e.target.setCustomValidity("Vui lòng nhập mật khẩu.")}
                      onInput={(e) => e.target.setCustomValidity("")}
                    />
                  </InputGroup>
                </Form.Group>
                <Button
                  variant='outline-primary'
                  type='submit'
                  className='w-100'>
                  Đăng nhập
                </Button>
              </Form>
              <div className='text-center mt-2'>
                Bạn chưa có tài khoản?{" "}
                <Link to={"/register-user"} style={{ textDecoration: "none" }}>
                  Đăng ký
                </Link>


                <div className='mt-2'>
                  <Link
                    to={"/password-rest-request"}
                    style={{ textDecoration: "none" }}>
                    Quên mật khẩu?
                  </Link>
                </div>



              </div>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default Login;
