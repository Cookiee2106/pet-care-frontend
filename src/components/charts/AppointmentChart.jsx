import React, { useState, useEffect } from "react";
import CustomPieChart from "./CustomPieChart";
import { getAppointmentsSummary } from "../appointment/AppointmentService";
import NoDataAvailable from "../common/NoDataAvailable";

const AppointmentChart = () => {
  const [appointmentData, setAppointmentData] = useState([]);
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    const getAppointmentsInfo = async () => {
      try {
        const response = await getAppointmentsSummary();
        // Translate status keys to Vietnamese
        const statusMap = {
          "completed": "Đã hoàn thành",
          "cancelled": "Đã hủy",
          "approved": "Đã xác nhận",
          "waiting-for-approval": "Chờ xác nhận",
          "not-completed": "Chưa hoàn thành"
        };
        const translatedData = response.data.map(item => ({
          ...item,
          name: statusMap[item.name.toLowerCase()] || item.name
        }));
        setAppointmentData(translatedData);
        console.log("yeeeeeeeeeh", translatedData);
      } catch (error) {
        setErrorMessage(error.message);
      }
    };
    getAppointmentsInfo();
  }, []);
  return (
    <section>
      {appointmentData && appointmentData.length > 0 ? (
        <React.Fragment>
          <h5 className='mb-4 chart-title'>Tổng quan lịch hẹn</h5>
          <CustomPieChart data={appointmentData} />
        </React.Fragment>
      ) : (
        <NoDataAvailable
          dataType={" dữ liệu lịch hẹn "}
          message={errorMessage}
        />
      )}
    </section>
  );
};

export default AppointmentChart;
