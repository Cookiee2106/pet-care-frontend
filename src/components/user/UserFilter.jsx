import React from "react";
import { Button, InputGroup, Form } from "react-bootstrap";

const UserFilter = ({
  label,
  values = [],
  selectedValue,
  onSelectedValue,
  onClearFilters,
}) => {
  return (
    <InputGroup className='mb-2'>
      <InputGroup.Text>Lọc theo {label}</InputGroup.Text>
      <Form.Select
        className='form-control'
        value={selectedValue}
        onChange={(e) => onSelectedValue(e.target.value)}>
        <option value=''>...Chọn {label.toLowerCase()}...</option>
        {values.map((value, index) => (
          <option key={index} value={value}>
            {value}
          </option>
        ))}
      </Form.Select>
      <Button variant='secondary' onClick={onClearFilters}>
        Đặt lại bộ lọc
      </Button>
    </InputGroup>
  );
};

export default UserFilter;
