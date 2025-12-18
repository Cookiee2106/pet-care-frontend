import React, { useState, useEffect } from "react";
import { ResponsiveContainer, Tooltip, PieChart, Pie, Cell } from "recharts";
import { getAggregatedUsersAccountByActiveStatus } from "../user/UserService";
import NoDataAvailable from "../common/NoDataAvailable";

const AccountChart = () => {
  const [accountData, setAccountData] = useState([]);
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    const getAccountActivity = async () => {
      try {
        const response = await getAggregatedUsersAccountByActiveStatus();
        const accountActivity = response.data;

        // Transform the backend data into the desired format
        const transformedData = Object.entries(accountActivity).flatMap(
          ([status, counts]) => [
            {
              name: "Chủ thú cưng đang hoạt động",
              value: status === "Enabled" ? counts.PATIENT : 0,
              color: "#d26161",
            },
            {
              name: "Chủ thú cưng ngưng hoạt động",
              value: status === "Enabled" ? 0 : counts.PATIENT,
              color: "#926262",
            },
            {
              name: "Bác sĩ thú y hoạt động",
              value: status === "Enabled" ? counts.VET : 0,
              color: "#2f6a32",
            },
            {
              name: "Bác sĩ thú y không hoạt động",
              value: status === "Enabled" ? 0 : counts.VET,
              color: "#557a56",
            },
          ]
        );
        setAccountData(transformedData);
      } catch (error) {
        setErrorMessage(error.message);
      }
    };

    getAccountActivity();
  }, []);

  return (
    <section>
      {accountData && accountData.length > 0 ? (
        <React.Fragment>
          <h5 className='mt-4 chart-title'>Hoạt động tài khoản</h5>
          <ResponsiveContainer width='80%' height={400}>
            <PieChart>
              <Pie
                data={accountData}
                dataKey='value'
                nameKey='name'
                outerRadius={110}
                fill='#8884d8'
                label>
                {accountData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </React.Fragment>
      ) : (
        <NoDataAvailable dataType={" dữ liệu tài khoản "} message={errorMessage} />
      )}
    </section>
  );
};

export default AccountChart;
