import React, { useState } from "react";
import { Container, Form, Row, Col, Card, Button } from "react-bootstrap";
import { Link } from "react-router-dom";

import UseMessageAlerts from "../hooks/UseMessageAlerts";
import AlertMessage from "../common/AlertMessage";
import ProcessSpinner from "../common/ProcessSpinner";
import VetSpecializationSelector from "../veterinarian/VetSpecializationSelector";
import { registerUser } from "./UserService";


const UserRegistration = () => {
  const [user, setUser] = useState({
    firstName: "",
    lastName: "",
    gender: "",
    phoneNumber: "",
    email: "",
    password: "",
    userType: "",
    specialization: "",
  });
  const {
    successMessage,
    setSuccessMessage,
    errorMessage,
    setErrorMessage,
    showSuccessAlert,
    setShowSuccessAlert,
    showErrorAlert,
    setShowErrorAlert,
  } = UseMessageAlerts();
  const [isProcessing, setIsProcessing] = useState(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    if (name === "phoneNumber") {
      if (!/^\d*$/.test(value)) return;
      if (value.length > 10) return;
    }
    setUser((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (user.phoneNumber.length !== 10) {
      setErrorMessage("Số điện thoại phải đủ 10 chữ số.");
      setShowErrorAlert(true);
      return;
    }
    setIsProcessing(true);
    try {
      const response = await registerUser(user);
      setSuccessMessage(response.message);
      setShowSuccessAlert(true);
      setIsProcessing(false);
      handleReset();
    } catch (error) {
      setErrorMessage(error.response.data.message);
      setShowErrorAlert(true);
      setIsProcessing(false);
    }
  };

  const handleReset = () => {
    setUser({
      firstName: "",
      lastName: "",
      gender: "",
      phoneNumber: "",
      email: "",
      password: "",
      userType: "",
      specialization: "",
    });
  };

  return (
    <Container className='mt-5'>
      <Row className='justify-content-center'>
        <Col xs={12} md={8} lg={6}>
          <Form onSubmit={handleSubmit}>
            <Card className='shadow mb-5'>
              <Card.Header className='text-center'>
                Đăng ký
              </Card.Header>
              <Card.Body>
                <fieldset>
                  <legend>Họ và tên</legend>

                  <Row>
                    <Col xs={6} className='mb-2 mb-sm-0'>
                      <Form.Control
                        type='text'
                        name='firstName'
                        placeholder='Họ'
                        value={user.firstName}
                        onChange={handleInputChange}
                        required
                      />
                    </Col>
                    <Col xs={6}>
                      <Form.Control
                        type='text'
                        name='lastName'
                        placeholder='Tên'
                        value={user.lastName}
                        onChange={handleInputChange}
                        required
                      />
                    </Col>
                  </Row>
                </fieldset>

                {/* Gender Selector */}
                <Form.Group as={Row} controlId='gender' className='mb-3'>
                  <Col>
                    <Form.Label>Gender</Form.Label>
                    <Form.Control
                      as='select'
                      name='gender'
                      required
                      value={user.gender}
                      onChange={handleInputChange}>
                      <option value=''>...chọn giới tính...</option>
                      <option value='Nam'>Nam</option>
                      <option value='Nữ'>Nữ</option>
                      <option value='Khác'>Khác</option>
                    </Form.Control>
                  </Col>
                </Form.Group>

                <fieldset>
                  <legend>Thông tin liên hệ</legend>
                  <Row>
                    <Col sm={6} className='mb-2 mb-sm-0'>
                      <Form.Control
                        type='email'
                        name='email'
                        required
                        placeholder='...địa chỉ email...'
                        value={user.email}
                        onChange={handleInputChange}
                      />
                    </Col>
                    <Col sm={6}>
                      <Form.Control
                        type='text'
                        name='phoneNumber'
                        required
                        placeholder='số điện thoại'
                        value={user.phoneNumber}
                        onChange={handleInputChange}
                      />
                    </Col>
                  </Row>
                </fieldset>

                {/* Password */}
                <Form.Group as={Row} controlId='password' className='mb-3'>
                  <Col>
                    <Form.Label>Mật khẩu</Form.Label>
                    <Form.Control
                      type='password'
                      name='password'
                      required
                      placeholder='...đặt mật khẩu...'
                      value={user.password}
                      onChange={handleInputChange}
                    />
                  </Col>
                </Form.Group>

                {/* Account Type */}
                <Form.Group as={Row} controlId='user-type' className='mb-3'>
                  <Col>
                    <Form.Label>Loại tài khoản</Form.Label>
                    <Form.Control
                      as='select'
                      name='userType'
                      required
                      value={user.userType}
                      onChange={handleInputChange}>
                      <option value=''>...chọn loại tài khoản...</option>
                      <option value='VET'>Tôi là bác sĩ thú y</option>
                      <option value='PATIENT'>Tôi là chủ thú cưng</option>
                    </Form.Control>
                  </Col>
                </Form.Group>
                {user.userType === "VET" && (
                  <Form.Group>
                    <Row>
                      <Col>
                        {/*Create a component called VetSpecializationSelector,
  the implementation in this component should look
  exactly like the ones we have implemented in the
  PetEntry (TypeSelector, ....) in some of our
  previous videos.
  Steps tp follow:

  Backend:
1. Create a new service in the VeterinarianService class to call a 
  custom method in the VeterinarianRepository. This custom method has
  a custom Query to get all specializations distinctively from the database.
  (refer to the PetService  and PetRepository for this implementation)

2. Create a new endpoint in the VeterinarianController to return the
 response to the frontend ( you may want to look at the PetController
  for a similar endpoint).


Frontend:

1. Create a new function in the VeterinarianService to make the API
  call to the backend to get specializations.

2. In the VetSpecializationSelector, receive the result from the
   VeterinarianService and populate the select control.

Finally, import the VetSpecializationSelector to the UserRegistration
 component to occupy the reserve column.
 */}

                        <VetSpecializationSelector
                          value={user.specialization}
                          onChange={handleInputChange}
                        />
                      </Col>
                    </Row>
                  </Form.Group>
                )}

                {/* Action Buttons */}
                <div className='d-flex justify-content-center mb-3'>
                  <Button
                    type='submit'
                    variant='outline-primary'
                    size='sm'
                    className='me-2'
                    disabled={isProcessing}>
                    {isProcessing ? (
                      <ProcessSpinner message='Đang xử lý đăng ký..' />
                    ) : (
                      "Đăng ký"
                    )}
                  </Button>
                  <Button
                    variant='outline-info'
                    size='sm'
                    onClick={handleReset}>
                    Đặt lại
                  </Button>
                </div>

                {/* Adjust column sizes for different screens */}
                {showErrorAlert && (
                  <AlertMessage type='danger' message={errorMessage} />
                )}
                {showSuccessAlert && (
                  <AlertMessage type='success' message={successMessage} />
                )}

                <div className='text-center'>
                  Đã có tài khoản?{" "}
                  <Link to={"/login"} style={{ textDecoration: "none" }}>
                    Đăng nhập
                  </Link>
                </div>
              </Card.Body>
            </Card>
          </Form>
        </Col>
      </Row>
    </Container>
  );
};

export default UserRegistration;
