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
      "Đã hủy": rootStyle.getPropertyValue("--color-cancelled"),
      "Chờ duyệt": rootStyle.getPropertyValue(
        "--color-waiting-for-approval"
      ),
      "Chờ xử lý": rootStyle.getPropertyValue("--color-pending"),
      "Đã duyệt": rootStyle.getPropertyValue("--color-approved"),
      default: rootStyle.getPropertyValue("--color-default"),
    });
  }, []);
  return colors;
};

export default useColorMapping;
