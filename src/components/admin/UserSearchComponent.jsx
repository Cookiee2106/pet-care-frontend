import React, { useState, useEffect } from "react";
import { Table, Row, Col, Form, Button, InputGroup } from "react-bootstrap";
// import { BsSearch } from "react-icons/bs";
// import { BsArrowRepeat } from "react-icons/bs";
import AlertMessage from "../common/AlertMessage";
import UseMessageAlerts from "../hooks/UseMessageAlerts";
import { searchUsers } from "../user/UserService";
import NoDataAvailable from "../common/NoDataAvailable";

const UserSearchComponent = () => {
    const [users, setUsers] = useState([]);
    const [keyword, setKeyword] = useState("");
    const [role, setRole] = useState("");
    const [isSearching, setIsSearching] = useState(false);

    const {
        errorMessage,
        setErrorMessage,
        showErrorAlert,
        setShowErrorAlert,
    } = UseMessageAlerts();

    const handleSearch = async (e) => {
        if (e) e.preventDefault();
        setIsSearching(true);
        try {
            const data = await searchUsers(keyword, role);
            setUsers(data);
            setShowErrorAlert(false);
        } catch (error) {
            setErrorMessage(error.message);
            setShowErrorAlert(true);
            setUsers([]);
        } finally {
            setIsSearching(false);
        }
    };

    const clearFilters = () => {
        setKeyword("");
        setRole("");
        setUsers([]);
        setShowErrorAlert(false);
    };

    return (
        <main>
            <Row className="mb-4">
                <Col>
                    <h5>Tra cứu & Lọc người dùng</h5>
                </Col>
            </Row>

            <Row className="mb-4 align-items-end">
                <Col md={4}>
                    <Form.Group>
                        <Form.Label>Từ khóa (Tên, Email)</Form.Label>
                        <Form.Control
                            type="text"
                            placeholder="Nhập tên hoặc email..."
                            value={keyword}
                            onChange={(e) => setKeyword(e.target.value)}
                        />
                    </Form.Group>
                </Col>
                <Col md={3}>
                    <Form.Group>
                        <Form.Label>Vai trò</Form.Label>
                        <Form.Select value={role} onChange={(e) => setRole(e.target.value)}>
                            <option value="">-- Tất cả --</option>
                            <option value="PATIENT">Chủ thú cưng (Patient)</option>
                            <option value="VET">Bác sĩ (Veterinarian)</option>
                            <option value="ADMIN">Quản trị viên (Admin)</option>
                        </Form.Select>
                    </Form.Group>
                </Col>
                <Col md={3}>
                    <Button variant="primary" className="me-2" onClick={handleSearch} disabled={isSearching}>
                        {isSearching ? "Đang tìm..." : "Tìm kiếm"}
                    </Button>
                    <Button variant="secondary" onClick={clearFilters}>
                        Xóa lọc
                    </Button>
                </Col>
            </Row>

            {showErrorAlert && <AlertMessage type="danger" message={errorMessage} />}

            {users && users.length > 0 ? (
                <Table bordered hover striped responsive>
                    <thead>
                        <tr>
                            <th>ID</th>
                            <th>Họ tên</th>
                            <th>Email</th>
                            <th>SĐT</th>
                            <th>Vai trò</th>
                            <th>Trạng thái</th>
                        </tr>
                    </thead>
                    <tbody>
                        {users.map((user) => (
                            <tr key={user.id}>
                                <td>{user.id}</td>
                                <td>{user.firstName} {user.lastName}</td>
                                <td>{user.email}</td>
                                <td>{user.phoneNumber}</td>
                                <td>{user.userType}</td>
                                <td>
                                    <span className={user.enabled ? "text-success" : "text-danger"}>
                                        {user.enabled ? "Hoạt động" : "Bị khóa"}
                                    </span>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </Table>
            ) : (
                isSearching ? null : <div className="text-center mt-4">Vui lòng nhập điều kiện tìm kiếm</div>
            )}

            {users.length === 0 && !isSearching && keyword && (
                <NoDataAvailable dataType={"kết quả tìm kiếm"} />
            )}

        </main>
    );
};

export default UserSearchComponent;
