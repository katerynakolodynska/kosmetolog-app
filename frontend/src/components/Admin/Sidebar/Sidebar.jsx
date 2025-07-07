import React, { useState, useRef, useEffect } from 'react';
import s from './Sidebar.module.css';
import { NavLink, useNavigate, useLocation } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { logoutAdmin } from '../../../redux/admin/adminSlice';
import { FaBars, FaTimes } from 'react-icons/fa';
import { useClickOutside } from '../../../hooks/useClickOutside';

const Sidebar = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);
  const sidebarRef = useRef(null);
  const location = useLocation();

  useClickOutside(sidebarRef, () => setIsOpen(false), isOpen);

  useEffect(() => {
    setIsOpen(false);
  }, [location.pathname]);

  const handleLogout = () => {
    dispatch(logoutAdmin());
    navigate('/admin-login');
  };

  const toggleSidebar = () => {
    setIsOpen((prev) => !prev);
  };

  return (
    <>
      {!isOpen && (
        <button className={s.burgerBtn} onClick={toggleSidebar}>
          <FaBars />
        </button>
      )}

      <nav ref={sidebarRef} className={`${s.sidebar} ${isOpen ? s.open : ''}`}>
        <button className={s.closeBtn} onClick={toggleSidebar}>
          <FaTimes />
        </button>
        <h2 className={s.sidebarTitle}>Адмін-панель</h2>
        <ul>
          <li>
            <NavLink to="/admin/reviews">Відгуки</NavLink>
          </li>
          <li>
            <NavLink to="/admin/bookings">Записи</NavLink>
          </li>
          <li>
            <NavLink to="/admin/services-admin">Послуги</NavLink>
          </li>
          <li>
            <NavLink to="/admin/specialists">Спеціалісти</NavLink>
          </li>
          <li>
            <NavLink to="/admin/schedule">Графік</NavLink>
          </li>
          <li>
            <NavLink to="/admin/gallery-admin">Галерея</NavLink>
          </li>
          <li>
            <NavLink to="/admin/settings">Налаштування</NavLink>
          </li>
        </ul>
        <button className={s.logoutButton} onClick={handleLogout}>
          Вийти
        </button>
      </nav>
    </>
  );
};

export default Sidebar;
