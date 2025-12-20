import React, { useState } from "react";
import { Modal, Form, Button } from "react-bootstrap";
import DatePicker from "react-datepicker"

const AppointmentUpdateModal = ({
  show,
  handleClose,
  appointment,
  handleUpdate,
}) => {
  const [appointmentDate, setAppointmentDate] = useState(
    new Date(appointment.appointmentDate)
  );
  const [appointmentTime, setAppointmentTime] = useState(
    new Date(`${appointment.appointmentDate}T${appointment.appointmentTime}`)
  );
  const [reason, setReason] = useState(appointment.reason);

  const handleSubmit = () => {
    const updatedAppointment = {
      ...appointment,
      appointmentDate: appointmentDate.toISOString().split("T")[0],
      appointmentTime: appointmentTime
        .toTimeString()
        .split(" ")[0]
        .substring(0, 5),
      reason,
    };
    handleUpdate(updatedAppointment);
  };

  return (
    <Modal show={show} onHide={handleClose}>
      <Modal.Header closeButton>
        <Modal.Title>Cập nhật lịch hẹn</Modal.Title>
      </Modal.Header>

      <Modal.Body>
        <Form>
          <Form.Group controlId='appointmentDate'>
            <Form.Label className=' me-2'>Ngày</Form.Label>
            <DatePicker
              selected={appointmentDate}
              onChange={(date) => setAppointmentDate(date)}
              dateFormat='yyyy-MM-dd'
              className='form-control'
            />
          </Form.Group>

          <Form.Group controlId='appointmentTime' className='mt-4'>
            <Form.Label className=' me-2'>Giờ</Form.Label>
            <DatePicker
              selected={appointmentTime}
              onChange={(time) => setAppointmentTime(time)}
              showTimeSelect
              showTimeSelectOnly
              timeIntervals={30}
              timeCaption='Giờ'
              dateFormat='HH:mm'
              timeFormat='HH:mm'
              className='form-control'
              placeholderText='Chọn giờ'
              required
              minTime={
                appointmentDate &&
                  new Date(appointmentDate).toDateString() === new Date().toDateString()
                  ? (() => {
                    const now = new Date();
                    const eightAM = new Date();
                    eightAM.setHours(8, 0, 0, 0);
                    return now > eightAM ? now : eightAM;
                  })()
                  : (() => {
                    const d = new Date();
                    d.setHours(8, 0, 0, 0);
                    return d;
                  })()
              }
              maxTime={(() => {
                const d = new Date();
                d.setHours(18, 0, 0, 0);
                return d;
              })()}
            />
          </Form.Group>

          <Form.Group controlId='reason' className='mt-2'>
            <Form.Label>Lí do</Form.Label>
            <Form.Control
              as={"textarea"}
              rows={3}
              placeholder='Nhập lí do'
              value={reason}
              onChange={(e) => setReason(e.target.value)}
            />
          </Form.Group>
        </Form>
      </Modal.Body>

      <Modal.Footer>
        <Button variant='secondary' onClick={handleClose}>
          Đóng
        </Button>
        <Button variant='info' onClick={handleSubmit}>
          Lưu
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default AppointmentUpdateModal;
