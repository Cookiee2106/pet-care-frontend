import React from "react";
import {
  BsFillHospitalFill,
  BsGrid1X2Fill,
  BsX,
  BsPeopleFill,
  BsSearch,
} from "react-icons/bs";

const AdminDashboardSidebar = ({
  openSidebarToggle,
  OpenSidebar,
  onNavigate,
  activeTab,
}) => {

  return (
    <aside
      id='sidebar'
      className={openSidebarToggle ? "sidebar-responsive" : ""}>
      <div className='sidebar-title'>
        <div className='sidebar-brand'>
          <BsFillHospitalFill className='icon-header' /> Pet Care
        </div>
        <span className='icon icon-close' onClick={OpenSidebar}>
          <BsX />
        </span>
      </div>

      <ul className="sidebar-list">
        <li
          className={`sidebar-list-item ${activeTab === "overview" ? "active" : ""
            }`}
          onClick={() => onNavigate("overview")}>
          <a href='#'>
            <BsGrid1X2Fill className='icon' /> Tổng quan hoạt động
          </a>
        </li>

        <li
          className={`sidebar-list-item ${activeTab === "veterinarians" ? "active" : ""
            }`}
          onClick={() => onNavigate("veterinarians")}>
          <a href='#'>
            <BsPeopleFill className='icon' /> Bác sĩ thú y
          </a>
        </li>

        <li
          className={`sidebar-list-item ${activeTab === "patients" ? "active" : ""
            }`}
          onClick={() => onNavigate("patients")}>
          <a href='#'>
            <BsPeopleFill className='icon' /> Thông tin chủ thú cưng
          </a>
        </li>

        <li
          className={`sidebar-list-item ${activeTab === "search-users" ? "active" : ""
            }`}
          onClick={() => onNavigate("search-users")}>
          <a href='#'>
            <BsSearch className='icon' /> Tra cứu người dùng
          </a>
        </li>
      </ul>
    </aside>
  );
};

export default AdminDashboardSidebar;
