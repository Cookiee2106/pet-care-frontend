import React, { useState, useEffect } from "react";
import {
  ResponsiveContainer,
  LineChart,
  Line,
  CartesianGrid,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
} from "recharts";
import { getAggregateUsersByMonthAndType } from "../user/UserService";
import NoDataAvailable from "../common/NoDataAvailable";

const RegistrationChart = () => {
  const [userData, setUserData] = useState([]);
  const [errorMessage, setErrorMessage] = useState(null);

  useEffect(() => {
    const getUsers = async () => {
      try {
        const response = await getAggregateUsersByMonthAndType();
        const userData = response.data;
        console.log("Dữ liệu người dùng tại đây :", userData);

        const monthMap = {
          "JANUARY": "Tháng 1", "FEBRUARY": "Tháng 2", "MARCH": "Tháng 3", "APRIL": "Tháng 4", "MAY": "Tháng 5", "JUNE": "Tháng 6",
          "JULY": "Tháng 7", "AUGUST": "Tháng 8", "SEPTEMBER": "Tháng 9", "OCTOBER": "Tháng 10", "NOVEMBER": "Tháng 11", "DECEMBER": "Tháng 12"
        };

        //Transform the backend data into the desired format
        const transformedData = Object.entries(userData).map(
          ([month, counts]) => {
            return {
              name: monthMap[month] || month,
              "Bác sĩ thú y": counts.VET || 0,
              "Chủ thú cưng": counts.PATIENT || 0,
            };
          }
        );
        setUserData(transformedData);
      } catch (error) {
        console.log("Thông báo lỗi : ", error);
        setErrorMessage(error.message);
      }
    };
    getUsers();
  }, []);

  return (
    <section>
      {userData && userData.length > 0 ? (
        <React.Fragment>
          {" "}
          <ResponsiveContainer width='60%' height={400}>
            <h5 className='chart-title mb-5'>Tổng quan đăng ký</h5>
            <BarChart data={userData}>
              <XAxis dataKey='name' angle={-50} textAnchor='end' height={60} />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey={"Bác sĩ thú y"} fill='#2f6a32' />
              <Bar dataKey={"Chủ thú cưng"} fill='#d26161' />
            </BarChart>
          </ResponsiveContainer>
        </React.Fragment>
      ) : (
        <NoDataAvailable
          dataType={"đăng ký người dùng"}
          message={errorMessage}
        />
      )}
    </section>
  );
};

export default RegistrationChart;
