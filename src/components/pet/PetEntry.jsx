import React from "react";
import PetColorSelector from "./PetColorSelector";
import PetBreedSelector from "./PetBreedSelector";
import PetTypeSelector from "./PetTypeSelector";

import {
  Col,
  Form,
  OverlayTrigger,
  Tooltip,
  Button,
  Row,
} from "react-bootstrap";
import { FaMinus } from "react-icons/fa";

const PetEntry = ({ pet, index, removePet, canRemove, handleInputChange }) => {
  return (
    <fieldset className='field-set mb-4'>
      <legend className='legend'>{`Chi tiết thú cưng #${index + 1}`}</legend>

      <fieldset className='mb-4'>
        <Form.Group as={Row}>
          <Col md={6}>
            <Form.Control
              type='text'
              name='name'
              id={`petName -${index}`}
              value={pet.name}
              placeholder='Nhập tên thú cưng'
              onChange={handleInputChange}
              required
            />
          </Col>
          <Col md={6}>
            <Form.Control
              type='number'
              name='age'
              id='petAge'
              value={pet.age}
              placeholder='Nhập tuổi thú cưng'
              onChange={handleInputChange}
              required
            />
          </Col>
        </Form.Group>
      </fieldset>

      <Form.Group as={Col} className='mb-4'>
        <PetColorSelector value={pet.color} onChange={handleInputChange} />
      </Form.Group>

      <fieldset className='field-set mb-4'>
        <legend className='legend'>Loại và giống thú cưng</legend>
        <Form.Group as={Row} className='mb-2 d-flex'>
          <Col>
            <PetTypeSelector value={pet.type} onChange={handleInputChange} />
          </Col>
          <Col>
            <PetBreedSelector
              petType={pet.type}
              value={pet.breed}
              onChange={handleInputChange}
            />
          </Col>
        </Form.Group>
      </fieldset>

      {canRemove && (
        <div className='d-flex justify-content-end mt-2'>
          <OverlayTrigger overlay={<Tooltip>Xóa thú cưng</Tooltip>}>
            <Button variant='danger' size='sm' onClick={() => removePet(index)}>
              <FaMinus />
            </Button>
          </OverlayTrigger>
        </div>
      )}
    </fieldset>
  );
};

export default PetEntry;
