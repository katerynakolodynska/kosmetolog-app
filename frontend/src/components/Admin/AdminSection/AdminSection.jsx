import React from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from '../Sidebar/Sidebar';
import s from './AdminSection.module.css';

const AdminSection = () => {
  return (
    <div className={s.adminLayout}>
      <Sidebar />
      <div className={s.adminContent}>
        <Outlet />
      </div>
    </div>
  );
};

export default AdminSection;
