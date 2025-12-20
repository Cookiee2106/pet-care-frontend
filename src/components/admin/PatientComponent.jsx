import React, { useState, useEffect } from "react";
import { Table, OverlayTrigger, Tooltip, Row, Col, Form, Button, InputGroup } from "react-bootstrap";
import { Link } from "react-router-dom";
import {
  BsEyeFill,
  BsLockFill,
  BsPencilFill,
  BsTrashFill,
  BsUnlockFill,
  BsSearch,
  BsArrowRepeat
} from "react-icons/bs";
import AlertMessage from "../common/AlertMessage";
import UseMessageAlerts from "../hooks/UseMessageAlerts";
import { getPatients } from "../patient/PatientService";
import { deleteUser, updateUser, lockUserAccount, unLockUserAccount, searchUsers } from "../user/UserService";
import UserFilter from "../user/UserFilter";
import Paginator from "../common/Paginator";
import NoDataAvailable from "../common/NoDataAvailable";
import DeleteConfirmationModal from "../modals/DeleteConfirmationModal";
import PatientEditableRows from "../patient/PatientEditableRows";

const PatientComponent = () => {
  const [patients, setPatients] = useState([]);
  const [filteredPatients, setFilteredPatients] = useState([]);
  const [selectedEmail, setSelectedEmail] = useState("");
  const [searchKeyword, setSearchKeyword] = useState("");
  const [isSearching, setIsSearching] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [patientsPerPage] = useState(10);

  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [patientToDelete, setPatientToDelete] = useState(null);
  const [editPatientId, setEditPatientId] = useState(null);

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

  // start pagination
  const indexOfLastPatient = currentPage * patientsPerPage;
  const indexOfFirstPatient = indexOfLastPatient - patientsPerPage;
  const currentPatients = filteredPatients.slice(
    indexOfFirstPatient,
    indexOfLastPatient
  );
  // end pagination

  const fetchPatients = async () => {
    try {
      const response = await getPatients();
      setPatients(response.data);
      setFilteredPatients(response.data);
    } catch (error) {
      setErrorMessage(error.message);
      setShowErrorAlert(true);
    }
  };

  useEffect(() => {
    fetchPatients();
  }, []);

  const handleSearch = async (e) => {
    e?.preventDefault();
    if (!searchKeyword.trim()) return;

    setIsSearching(true);
    try {
      const result = await searchUsers(searchKeyword, "PATIENT");
      setPatients(result.data || []);
      setFilteredPatients(result.data || []);
      setSelectedEmail(""); // Reset filter
      setShowErrorAlert(false);
    } catch (error) {
      setErrorMessage(error.message);
      setShowErrorAlert(true);
      setPatients([]);
    } finally {
      setIsSearching(false);
    }
  };

  const handleClearSearch = () => {
    setSearchKeyword("");
    fetchPatients();
    setSelectedEmail("");
  };

  useEffect(() => {
    let filtered = patients;
    if (selectedEmail) {
      filtered = filtered.filter((patient) => patient.email === selectedEmail);
    }
    setFilteredPatients(filtered);
  }, [selectedEmail, patients]);

  useEffect(() => {
    if (currentPage > 1 && filteredPatients.length > 0) {
      const maxPage = Math.ceil(filteredPatients.length / patientsPerPage);
      if (currentPage > maxPage) {
        setCurrentPage(maxPage);
      }
    }
  }, [filteredPatients, currentPage, patientsPerPage]);

  // Here we are extracting all patients email from the current patient.
  const emails = Array.from(new Set(patients.map((p) => p.email)));

  const handleClearFilters = () => {
    setSelectedEmail("");
  };

  const handleShowDeleteModal = (userId) => {
    setPatientToDelete(userId);
    setShowDeleteModal(true);
  };

  const handleDeleteAccount = async () => {
    if (patientToDelete) {
      try {
        const response = await deleteUser(patientToDelete);
        setSuccessMessage(response.message);
        setShowDeleteModal(false);
        setShowSuccessAlert(true);
        fetchPatients();
      } catch (error) {
        setErrorMessage(error.message);
        setShowErrorAlert(true);
      }
    }
  };

  const handleToggleAccountLock = async (patient) => {
    try {
      let response;
      if (patient.enabled) {
        response = await lockUserAccount(patient.id);
      } else {
        response = await unLockUserAccount(patient.id);
      }
      // Optimistically update the UI
      setPatients(
        patients.map((thePatient) =>
          thePatient.id === patient.id
            ? { ...thePatient, enabled: !thePatient.enabled }
            : thePatient
        )
      );
      setSuccessMessage(response.message);
      setShowErrorAlert(false);
      setShowSuccessAlert(true);
    } catch (error) {
      console.error("Error : ", error);
      setErrorMessage(error.response.data.message);
      setShowSuccessAlert(false);
      setShowErrorAlert(true);
    }
  };

  const handleEditClick = (patientId) => {
    setEditPatientId(patientId);
  };

  const handleCancelClick = () => {
    setEditPatientId(null);
  };

  const handleSaveUpdate = async (patientId, editedPatient) => {
    try {
      const response = await updateUser(editedPatient, patientId);
      setPatients((prevPatients) =>
        prevPatients.map((patient) =>
          patient.id === patientId ? { ...patient, ...editedPatient } : patient
        )
      );
      setEditPatientId(null);
      setSuccessMessage(response.message);
      setShowSuccessAlert(true);
    } catch (error) {
      setErrorMessage(error.message);
      setShowErrorAlert(true);
    }
  };

  return (
    <main>
      <DeleteConfirmationModal
        show={showDeleteModal}
        onHide={() => setShowDeleteModal(false)}
        onConfirm={handleDeleteAccount}
        itemToDelete='patient account'
      />

      {currentPatients && currentPatients.length > 0 ? (
        <React.Fragment>
          <h5 className="mb-4">Danh sách chủ thú cưng</h5>
          <Row>
            <Col>
              {showErrorAlert && (
                <AlertMessage type='danger' message={errorMessage} />
              )}
              {showSuccessAlert && (
                <AlertMessage type='success' message={successMessage} />
              )}
            </Col>
          </Row>

          <Row className="mb-4 align-items-center">
            <Col md={5}>
              <UserFilter
                values={emails}
                selectedValue={selectedEmail}
                onSelectedValue={setSelectedEmail}
                onClearFilters={handleClearFilters}
                label={"email"}
              />
            </Col>
            <Col md={7}>
              <InputGroup className="mb-2">
                <Form.Control
                  placeholder="Tìm kiếm theo tên hoặc email..."
                  value={searchKeyword}
                  onChange={(e) => setSearchKeyword(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleSearch(e)}
                />
                <Button variant="outline-primary" onClick={handleSearch} disabled={isSearching}>
                  <BsSearch />
                </Button>
                {(searchKeyword || isSearching) && (
                  <Button variant="outline-secondary" onClick={handleClearSearch}>
                    <BsArrowRepeat />
                  </Button>
                )}
              </InputGroup>
            </Col>
          </Row>

          <Table bordered hover striped>
            <thead>
              <tr>
                <th>ID</th>
                <th>Họ</th>
                <th>Tên</th>
                <th>Email</th>
                <th>Số điện thoại</th>
                <th>Giới tính</th>
                <th>Ngày đăng ký</th>
                <th colSpan={4}>Thao tác</th>
              </tr>
            </thead>

            <tbody>
              {currentPatients.map((patient, index) =>
                editPatientId === patient.id ? (
                  <PatientEditableRows
                    key={patient.id}
                    patient={patient}
                    onSave={handleSaveUpdate}
                    onCancel={handleCancelClick}
                  />
                ) : (
                  <tr key={index}>
                    <td>{patient.id}</td>
                    <td>{patient.firstName}</td>
                    <td>{patient.lastName}</td>
                    <td>{patient.email}</td>
                    <td>{patient.phoneNumber}</td>
                    <td>{patient.gender}</td>
                    <td>{patient.createdAt}</td>
                    <td>
                      <OverlayTrigger
                        overlay={
                          <Tooltip id={`tooltip-view-${index}`}>
                            Xem thông tin chi tiết
                          </Tooltip>
                        }>
                        <Link
                          to={`/user-dashboard/${patient.id}/my-dashboard`}
                          className='text-info'>
                          <BsEyeFill />
                        </Link>
                      </OverlayTrigger>
                    </td>

                    <td>
                      <OverlayTrigger
                        overlay={
                          <Tooltip id={`tooltip-edit-${index}`}>
                            Chỉnh sửa thông tin
                          </Tooltip>
                        }>
                        <Link to={"#"} className='text-warning'>
                          <BsPencilFill
                            onClick={() => handleEditClick(patient.id)}
                          />
                        </Link>
                      </OverlayTrigger>
                    </td>

                    <td>
                      <OverlayTrigger
                        overlay={
                          <Tooltip id={`tooltip-lock-${index}`}>
                            {patient.enabled ? "Khóa" : "Mở khóa"} tài khoản
                          </Tooltip>
                        }>
                        <span
                          onClick={() => handleToggleAccountLock(patient)}
                          style={{ cursor: "pointer", color: patient.enabled ? "green" : "red" }}>
                          {patient.enabled ? <BsUnlockFill /> : <BsLockFill />}
                        </span>
                      </OverlayTrigger>
                    </td>

                    <td>
                      <OverlayTrigger
                        overlay={
                          <Tooltip id={`tooltip-delete-${index}`}>
                            Xóa tài khoản
                          </Tooltip>
                        }>
                        <Link
                          to={"#"}
                          className='text-danger'
                          onClick={() => handleShowDeleteModal(patient.id)}>
                          <BsTrashFill />
                        </Link>
                      </OverlayTrigger>
                    </td>

                  </tr>
                )
              )}
            </tbody>
          </Table>
          <Paginator
            currentPage={currentPage}
            totalItems={filteredPatients.length}
            paginate={setCurrentPage}
            itemsPerPage={patientsPerPage}
          />
        </React.Fragment>
      ) : (
        <NoDataAvailable dataType={"bệnh nhân"} />
      )}
    </main>
  );
};

export default PatientComponent;
