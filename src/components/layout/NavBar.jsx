import React from "react";
import { Navbar, Container, Nav, NavDropdown } from "react-bootstrap";
import { Link } from "react-router-dom";
import { logout } from "../auth/AuthService";

const NavBar = () => {
  const isLoggedIn = localStorage.getItem("authToken");
  const userRoles = JSON.parse(localStorage.getItem("userRoles")) || [];
  const userId = localStorage.getItem("userId") || "";

  const handleLogout = () => {
    logout();
  };

  return (
    <Navbar expand='lg' sticky='top' className='nav-bg'>
      <Container>
        <Navbar.Brand to={"/"} as={Link} className='nav-home'>
          Pet Care
        </Navbar.Brand>
        <Navbar.Toggle aria-controls='responsive-navbar-nav' />
        <Navbar.Collapse id='responsive-navbar-nav'>
          <Nav className='me-auto'>
            <Nav.Link to={"/doctors"} as={Link}>
              Gặp gỡ bác sĩ thú y của chúng tôi
            </Nav.Link>
          </Nav>
          <Nav>
            <NavDropdown title='Tài khoản' id='basic-nav-dropdown'>
              {!isLoggedIn ? (
                <React.Fragment>
                  <NavDropdown.Item to={"/register-user"} as={Link}>
                    Đăng ký
                  </NavDropdown.Item>
                  <NavDropdown.Divider />
                  <NavDropdown.Item to={"/login"} as={Link}>
                    Đăng nhập
                  </NavDropdown.Item>
                </React.Fragment>
              ) : (
                <React.Fragment>
                  <NavDropdown.Divider />
                  <NavDropdown.Item
                    to={`/user-dashboard/${userId}/my-dashboard`}
                    as={Link}>
                    Tổng quan Của Tôi
                  </NavDropdown.Item>

                  {userRoles.includes("ROLE_ADMIN") && (
                    <React.Fragment>
                      <NavDropdown.Divider />
                      <NavDropdown.Item
                        to={`/admin-dashboard/${userId}/admin-dashboard`}
                        as={Link}>
                        Tổng quan Quản trị
                      </NavDropdown.Item>
                    </React.Fragment>
                  )}

                  <NavDropdown.Divider />
                  <NavDropdown.Item to={"#"} onClick={handleLogout}>
                    Đăng xuất
                  </NavDropdown.Item>
                </React.Fragment>
              )}
            </NavDropdown>
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};

export default NavBar;
