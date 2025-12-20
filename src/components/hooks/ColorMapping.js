import { useEffect, useState } from "react";

const useColorMapping = () => {
  const [colors, setColors] = useState({});

  useEffect(() => {
    const rootStyle = getComputedStyle(document.documentElement);
    setColors({
      "Đang diễn ra": rootStyle.getPropertyValue("--color-on-going"),
      "Sắp tới": rootStyle.getPropertyValue("--color-up-coming"),
      "Hoàn thành": rootStyle.getPropertyValue("--color-completed"),
      "Không được duyệt": rootStyle.getPropertyValue("--color-not-approved"),
      "Bác sĩ thú y": "#2f6a32",
      "Chủ thú cưng": "#d26161",
      "Đã hoàn thành": "#000000",
      "Đã xác nhận": "#236ec9",
      "Đã hủy": "#b01e1e",
      "Chờ xác nhận": "#e3b320",
      "Chưa hoàn thành": "#ffff00",
      "Chờ xử lý": rootStyle.getPropertyValue("--color-pending"),
      "Đã duyệt": rootStyle.getPropertyValue("--color-approved"),
      default: rootStyle.getPropertyValue("--color-default"),
    });
  }, []);
  return colors;
};

export default useColorMapping;
