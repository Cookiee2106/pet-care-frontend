import React, { useState } from "react";
import { BsCheck, BsX } from "react-icons/bs";
import VetSpecializationSelector from "./VetSpecializationSelector";
import { Button, Form } from "react-bootstrap";

const VetEditableRows = ({ vet, onSave, onCancel }) => {
  const [editedVet, setEditedVet] = useState(vet);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    if (name === "phoneNumber") {
      if (!/^\d*$/.test(value)) return;
      if (value.length > 10) return;
    }
    setEditedVet((prevState) => ({ ...prevState, [name]: value }));
  };

  const handleSave = () => {
    if (editedVet.phoneNumber.length !== 10) {
      alert("Số điện thoại phải đủ 10 chữ số.");
      return;
    }
    onSave(vet.id, editedVet, onCancel);
  };

  return (
    <tr>
      <td>
        <Form.Control
          type='text'
          name='firstName'
          value={editedVet.firstName}
          onChange={handleInputChange}
        />
      </td>
      <td>
        <Form.Control
          type='text'
          name='lastName'
          value={editedVet.lastName}
          onChange={handleInputChange}
        />
      </td>

      <td>
        <Form.Control
          type='email'
          name='email'
          value={editedVet.email}
          onChange={handleInputChange}
        />
      </td>
      <td>
        <Form.Control
          type='text'
          name='phoneNumber'
          value={editedVet.phoneNumber}
          onChange={handleInputChange}
        />
      </td>

      <td>
        <Form.Control
          as='select'
          name='gender'
          value={editedVet.gender}
          onChange={handleInputChange}>
          <option value=''>Chọn giới tính</option>
          <option value='Male'>Nam</option>
          <option value='Female'>Nữ</option>
        </Form.Control>
      </td>

      <td>
        <VetSpecializationSelector
          value={editedVet.specialization}
          onChange={handleInputChange}
        />
      </td>

      <td>{vet.createdAt}</td>

      <td colSpan={4}>
        <Button
          variant='success'
          size='sm'
          onClick={handleSave}
          className='me-2'>
          <BsCheck />
        </Button>

        <Button variant='secondary' size='sm' onClick={onCancel}>
          <BsX />
        </Button>
      </td>
    </tr>
  );
};

export default VetEditableRows;
