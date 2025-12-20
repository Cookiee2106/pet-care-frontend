import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import {
  BsEyeFill,
  BsLockFill,
  BsPencilFill,
  BsPlusSquareFill,
  BsTrashFill,
  BsUnlockFill,
  BsSearch,
  BsArrowRepeat
} from "react-icons/bs";
import { Table, OverlayTrigger, Tooltip, Row, Col, Form, Button, InputGroup } from "react-bootstrap";
import UseMessageAlerts from "../hooks/UseMessageAlerts";
import AlertMessage from "../common/AlertMessage";
import DeleteConfirmationModal from "../modals/DeleteConfirmationModal";
import { getVeterinarians } from "../veterinarian/VeterinarianService";
import { deleteUser, updateUser, searchUsers } from "../user/UserService";
import { lockUserAccount, unLockUserAccount } from "../user/UserService";
import VetEditableRows from "../veterinarian/VetEditableRows";
import UserFilter from "../user/UserFilter";
import Paginator from "../common/Paginator";
import NoDataAvailable from "../common/NoDataAvailable";

const VeterinarianComponent = () => {
  const [veterinarians, setVeterinarians] = useState([]);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [vetToDelete, setVetToDelete] = useState(null);
  const [editVetId, setEditVetId] = useState(null);
  const [filteredVets, setFilteredVets] = useState([]);
  const [selectedSpecialization, setSelectedSpecialization] = useState("");
  const [searchKeyword, setSearchKeyword] = useState("");
  const [isSearching, setIsSearching] = useState(false);

  const [currentPage, setCurrentPage] = useState(1);
  const [vetsPerPage] = useState(10);

  const indexOfLastVet = currentPage * vetsPerPage;
  const indexOfFirstVet = indexOfLastVet - vetsPerPage;
  const currentVets = filteredVets.slice(indexOfFirstVet, indexOfLastVet);

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

  const fetchVeterinarians = () => {
    getVeterinarians()
      .then((data) => {
        setVeterinarians(data.data);
        setFilteredVets(data.data);
      })
      .catch((error) => {
        setErrorMessage(error.message);
        setShowErrorAlert(true);
      });
  };

  useEffect(() => {
    fetchVeterinarians();
  }, []);

  const handleDeleteAccount = async () => {
    if (vetToDelete) {
      try {
        const response = await deleteUser(vetToDelete);
        setSuccessMessage(response.message);
        setShowDeleteModal(false);
        setShowSuccessAlert(true);
        fetchVeterinarians();
      } catch (error) {
        setErrorMessage(error.message);
        setShowErrorAlert(true);
      }
    }
  };
  const handleShowDeleteModal = (vetId) => {
    setVetToDelete(vetId);
    setShowDeleteModal(true);
  };

  // Function to toggle lock/unlock user account
  const handleToggleAccountLock = async (vet) => {
    try {
      let response;
      if (vet.enabled) {
        response = await lockUserAccount(vet.id);
      } else {
        response = await unLockUserAccount(vet.id);
      }
      // Optimistically update the UI to reflect the new 'enabled' state
      setVeterinarians(
        veterinarians.map((theVet) =>
          theVet.id === vet.id
            ? { ...theVet, enabled: !theVet.enabled }
            : theVet
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

  const handleCancelClick = () => {
    setEditVetId(null);
  };

  const handleEditClick = (vetId) => {
    setEditVetId(vetId);
  };

  const handleSaveUpdate = async (vetId, editedVet) => {
    try {
      const response = await updateUser(editedVet, vetId);

      setVeterinarians((prevVets) =>
        prevVets.map((vet) =>
          vet.id === vetId ? { ...vet, ...editedVet } : vet
        )
      );

      setEditVetId(null);
      setSuccessMessage(response.message);
      setShowSuccessAlert(true);
    } catch (error) {
      setErrorMessage(error.message);
      setShowErrorAlert(true);
    }
  };

  const handleSearch = async (e) => {
    e?.preventDefault();
    if (!searchKeyword.trim()) return;

    setIsSearching(true);
    try {
      const result = await searchUsers(searchKeyword, "VET");
      // Result from API is { message, data: [...] } or just data depending on return
      // Based on previous interaction it was data.data
      setVeterinarians(result.data || []);
      setFilteredVets(result.data || []);
      setSelectedSpecialization(""); // Reset filter when searching
      setShowErrorAlert(false);
    } catch (error) {
      setErrorMessage(error.message);
      setShowErrorAlert(true);
      setVeterinarians([]);
    } finally {
      setIsSearching(false);
    }
  };

  const handleClearSearch = () => {
    setSearchKeyword("");
    fetchVeterinarians();
    setSelectedSpecialization("");
  };

  useEffect(() => {
    let filtered = veterinarians;
    if (selectedSpecialization) {
      filtered = filtered.filter(
        (vet) => vet.specialization === selectedSpecialization
      );
    }
    setFilteredVets(filtered);
  }, [selectedSpecialization, veterinarians]);

  useEffect(() => {
    if (currentPage > 1 && filteredVets.length > 0) {
      const maxPage = Math.ceil(filteredVets.length / vetsPerPage);
      if (currentPage > maxPage) {
        setCurrentPage(maxPage);
      }
    }
  }, [filteredVets, currentPage, vetsPerPage]);

  // Here extract the specializations from the veterinarin list.
  const specializations = Array.from(
    new Set(veterinarians.map((vet) => vet.specialization))
  );

  const handleClearFilters = () => {
    setSelectedSpecialization("");
  };

  return (
    <main className='mt-2'>
      {currentVets && currentVets.length > 0 ? (
        <React.Fragment>
          <DeleteConfirmationModal
            show={showDeleteModal}
            onHide={() => setShowDeleteModal(false)}
            onConfirm={handleDeleteAccount}
            itemToDelete='veterinarian'
          />

          <h5>Danh sách bác sĩ thú y</h5>

          <Row>
            <Col>
              {showErrorAlert && (
                <AlertMessage type='danger' message={errorMessage} />
              )}
              {showSuccessAlert && (
                <AlertMessage type='success' message={successMessage} />
              )}
            </Col>
            <Col>
              {" "}
              <div className='d-flex justify-content-end'>
                <Link to={"/register-user"}>
                  {" "}
                  <BsPlusSquareFill />
                </Link>
              </div>
            </Col>
          </Row>

          <Row className='mb-4 align-items-center'>
            <Col md={6} className="mb-2 mb-md-0">
              <UserFilter
                values={specializations}
                selectedValue={selectedSpecialization}
                onSelectedValue={setSelectedSpecialization}
                onClearFilters={handleClearFilters}
                label={"Chuyên khoa"}
              />
            </Col>
            <Col md={6}>
              <InputGroup>
                <Form.Control
                  placeholder="Tìm kiếm theo tên hoặc email..."
                  value={searchKeyword}
                  onChange={(e) => setSearchKeyword(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleSearch(e)}
                />
                <Button variant="outline-primary" onClick={handleSearch} disabled={isSearching}>
                  <BsSearch />
                </Button>
                {/* Only show clear button if searching or keyword exists */}
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
                <th>Họ</th>
                <th>Tên</th>
                <th>Email</th>
                <th>Số điện thoại</th>
                <th>Giới tính</th>
                <th>Chuyên khoa</th>
                <th>Ngày đăng ký</th>
                <th colSpan={4}>Thao tác</th>
              </tr>
            </thead>
            <tbody>
              {currentVets.map((vet, index) =>
                editVetId === vet.id ? (
                  <VetEditableRows
                    key={vet.id}
                    vet={vet}
                    onSave={handleSaveUpdate}
                    onCancel={handleCancelClick}
                  />
                ) : (
                  <tr key={vet.id}>
                    <td>Bác sĩ {vet.firstName}</td>
                    <td>{vet.lastName}</td>
                    <td>{vet.email}</td>
                    <td>{vet.phoneNumber}</td>
                    <td>{vet.gender}</td>
                    <td>{vet.specialization}</td>
                    <td>{vet.createdAt}</td>
                    <td>
                      <OverlayTrigger
                        overlay={
                          <Tooltip id={`tooltip-view-${index}`}>
                            Xem thông tin chi tiết
                          </Tooltip>
                        }>
                        <Link
                          to={`/user-dashboard/${vet.id}/my-dashboard`}
                          className='text-info'>
                          <BsEyeFill />
                        </Link>
                      </OverlayTrigger>
                    </td>
                    <td>
                      <OverlayTrigger
                        overlay={
                          <Tooltip id={`tooltip-view-${index}`}>
                            Chỉnh sửa thông tin
                          </Tooltip>
                        }>
                        <Link to={"#"} className='text-warning'>
                          <BsPencilFill
                            onClick={() => handleEditClick(vet.id)}
                          />
                        </Link>
                      </OverlayTrigger>
                    </td>

                    <td>
                      <OverlayTrigger
                        overlay={
                          <Tooltip id={`tooltip-view-${index}`}>
                            {vet.enabled ? "Khóa" : "Unlock"} tài khoản
                          </Tooltip>
                        }>
                        <span
                          onClick={() => handleToggleAccountLock(vet)}
                          style={{ cursor: "pointer" }}>
                          {vet.enabled ? <BsUnlockFill /> : <BsLockFill />}
                        </span>
                      </OverlayTrigger>
                    </td>

                    <td>
                      <OverlayTrigger
                        overlay={
                          <Tooltip id={`tooltip-view-${index}`}>
                            xóa tài khoản
                          </Tooltip>
                        }>
                        <Link
                          to={"#"}
                          className='text-danger'
                          onClick={() => handleShowDeleteModal(vet.id)}>
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
            paginate={setCurrentPage}
            currentPage={currentPage}
            itemsPerPage={vetsPerPage}
            totalItems={filteredVets.length}
          />
        </React.Fragment>
      ) : (
        <NoDataAvailable dataType={"bác sĩ thú y"} />
      )}
    </main>
  );
};

export default VeterinarianComponent;
