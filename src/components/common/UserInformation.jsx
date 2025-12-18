import React from 'react'

const UserInformation = ({userType, appointment}) => {
  return (
    <div className='mt-2 mb-2' style={{ backgroundColor: "whiteSmoke" }}>
      <h5>Thông tin {userType === "VET" ? "chủ thú cưng " : "bác sĩ thú y "}</h5>
      {userType === "VET" ? (
        <React.Fragment>
          <p className='text-info'>
            Mã lịch hẹn: {appointment.appointmentNo}
          </p>
          <p>
            Họ và tên: {appointment.patient.firstName} {appointment.patient.lastName}
          </p>
          <p>Email: {appointment.patient.email}</p>
          <p className='text-info'>
            Số điện thoại: {appointment.patient.phoneNumber}
          </p>
        </React.Fragment>
      ) : (
        <React.Fragment>
          <p className='text-info'>
            Mã lịch hẹn: {appointment.appointmentNo}
          </p>
          <p>
            Họ và tên: Bác sĩ {appointment.veterinarian.firstName}{" "}
            {appointment.veterinarian.lastName}
          </p>
          <p className='text-info'>
            Chuyên khoa: {appointment.veterinarian.specialization}
          </p>
          <p>Email: {appointment.veterinarian.email}</p>
          <p className='text-info'>
            Số điện thoại: {appointment.veterinarian.phoneNumber}
          </p>
        </React.Fragment>
      )}
    </div>
  );
}

export default UserInformation
