import React, { useState } from "react";
import { Modal, Form, Button } from "react-bootstrap";

const AddItemModal = ({ show, handleClose, handleSave, itemLabel }) => {
  const [itemValue, setItemValue] = useState("");

  const handleSaveItem = () => {
    handleSave(itemValue);
    setItemValue("");
    handleClose();
    };
    
    const handleInputChange = (e) => {
        setItemValue(e.target.value);
    };

  return (
    <Modal show={show} onHide={handleClose}>
      <Modal.Header closeButton>
        <Modal.Title>Thêm {itemLabel}</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form>
          <Form.Group className="mb-3">
            <Form.Label>{itemLabel} thú cưng </Form.Label>
            <Form.Control
              type='text'
              placeholder={`Nhập tên ${itemLabel.toLowerCase()}`}
              value={itemValue}
              onChange={handleInputChange}/>
          </Form.Group>
        </Form>

        <Modal.Footer>
          <Button variant='secondary' onClick={handleSaveItem}>
            Thêm
          </Button>
          <Button variant='danger' onClick={handleClose}>
            Đóng
          </Button>
        </Modal.Footer>
      </Modal.Body>
    </Modal>
  );
};

export default AddItemModal;
