import React from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from '../Sidebar/Sidebar';
import s from './AdminSection.module.css';

const AdminSection = () => {
  return (
    <section className={s.adminLayout}>
      <Sidebar />
      <div className={s.adminContent}>
        <Outlet />
      </div>
    </section>
  );
};

export default AdminSection;
