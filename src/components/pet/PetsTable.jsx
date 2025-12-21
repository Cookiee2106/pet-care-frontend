import React, { useState } from "react";
import DeleteConfirmationModal from "../modals/DeleteConfirmationModal";
import AlertMessage from "../common/AlertMessage";
import AddPetModal from "../modals/AddPetModal";
import {
  Button,
  Table,
  Row,
  Col,
  OverlayTrigger,
  Tooltip,
} from "react-bootstrap";
import { BsPencilFill, BsPlus, BsTrashFill } from "react-icons/bs";
import UseMessageAlerts from "../hooks/UseMessageAlerts";
import EditablePetRow from "./EditablePetRow";
import { updatePet, deletePet, addPet } from "./PetService";
import { Link } from "react-router-dom";

const PetsTable = ({
  pets,
  onPetsUpdate,
  isEditable,
  isPatient,
  appointmentId,
}) => {
  const [editModeId, setEditModeId] = useState(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [petToDelete, setPetToDelete] = useState(null);
  const [showAddModal, setShowAddModal] = useState(false);

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

  const handleEditClick = (petId) => {
    setEditModeId(petId);
  };

  const handleCancel = () => {
    setEditModeId(null);
  };

  const handleShowDeleteModal = (petId) => {
    setPetToDelete(petId);
    setShowDeleteModal(true);
  };

  const handleDeletePet = async () => {
    if (petToDelete) {
      try {
        const response = await deletePet(petToDelete);
        onPetsUpdate(appointmentId);
        setSuccessMessage(response.message);
        setShowDeleteModal(false);
        setShowSuccessAlert(true);
      } catch (error) {
        setErrorMessage(error.message);
        setShowErrorAlert(true);
      }
    }
  };

  const handleSavePetUpdate = async (petId, updatedPet) => {
    try {
      const response = await updatePet(petId, updatedPet);
      onPetsUpdate(appointmentId);
      setSuccessMessage(response.message);
      setEditModeId(null);
      setShowSuccessAlert(true);
    } catch (error) {
      setErrorMessage(error.message);
      setShowErrorAlert(true);
    }
  };

  const handleShowAddPetModal = () => {
    setShowAddModal(true);
  };

  const handleAddPet = async (appointmentId, newPet) => {
    try {
      const response = await addPet(appointmentId, newPet);
      onPetsUpdate(appointmentId);
      setSuccessMessage(response.message);
      setShowAddModal(false);
      setShowSuccessAlert(true);
    } catch (error) {
      setErrorMessage(error.message);
      setShowErrorAlert(true);
    }
  };

  return (
    <section>
      <DeleteConfirmationModal
        show={showDeleteModal}
        onHide={() => setShowDeleteModal(false)}
        onConfirm={handleDeletePet}
        itemToDelete='pet'
      />

      {showAddModal && (
        <AddPetModal
          show={showAddModal}
          onHide={() => setShowAddModal(false)}
          onAddPet={handleAddPet}
          appointmentId={appointmentId}
        />
      )}
      {showErrorAlert && <AlertMessage type='danger' message={errorMessage} />}
      {showSuccessAlert && (
        <AlertMessage type='success' message={successMessage} />
      )}
      <Row>
        <Col>
          <h4>Thú cưng:</h4>
        </Col>
        <Col className='d-flex justify-content-end'>
          <OverlayTrigger
            overlay={
              <Tooltip id={`tooltip-view-${appointmentId}`}>Thêm thú cưng</Tooltip>
            }>
            <Button
              variant='link'
              className='text-info text-decoration-none p-0'
              style={{ border: "none" }}
              onClick={() => handleShowAddPetModal(appointmentId)}
              disabled={!isEditable}>
              <h2>
                {" "}
                <BsPlus />
              </h2>
            </Button>
          </OverlayTrigger>
        </Col>
      </Row>

      <Table striped bordered hover size='sm'>
        <thead>
          <tr>
            <th>Tên thú cưng</th>
            <th>Loại</th>
            <th>Giống</th>
            <th>Màu</th>
            <th>Tuổi</th>
            {isPatient && <th colSpan={3}>Thao tác</th>}
          </tr>
        </thead>
        <tbody>
          {Array.isArray(pets) &&
            pets.map((pet, index) =>
              editModeId === pet.id ? (
                <EditablePetRow
                  key={index}
                  pet={pet}
                  index={index}
                  onSave={handleSavePetUpdate}
                  onCancel={handleCancel}
                />
              ) : (
                <tr key={pet.id}>
                  <td>{pet.name}</td>
                  <td>{pet.type}</td>
                  <td>{pet.breed}</td>
                  <td>{pet.color}</td>
                  <td>{pet.age}</td>

                  {isPatient && (
                    <React.Fragment>
                      <td>
                        <Button
                          className='btn btn-sm btn-warning'
                          disabled={!isEditable}
                          onClick={() => handleEditClick(pet.id)}>
                          <BsPencilFill />
                        </Button>
                      </td>
                      {pets && pets.length > 1 && (
                        <td>
                          <Button
                            className='btn btn-sm btn-danger'
                            disabled={!isEditable}
                            onClick={() => handleShowDeleteModal(pet.id)}>
                            <BsTrashFill />
                          </Button>
                        </td>
                      )}
                    </React.Fragment>
                  )}
                </tr>
              )
            )}
        </tbody>
      </Table>
    </section>
  );
};

export default PetsTable;
