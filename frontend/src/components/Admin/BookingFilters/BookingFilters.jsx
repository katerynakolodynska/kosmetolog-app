import React from 'react';
import s from './BookingFilters.module.css';

const BookingFilters = ({
  filterDate,
  filterSpecialist,
  filterType,
  phoneSearch,
  specialists,
  setFilterDate,
  setFilterSpecialist,
  setFilterType,
  setPhoneSearch,
  clearFilters,
}) => {
  const handleDateChange = (e) => {
    setFilterDate(e.target.value);
    setFilterType('');
  };

  const handleTypeChange = (e) => {
    setFilterType(e.target.value);
    setFilterDate('');
  };

  return (
    <div className={s.filtersWrapper}>
      <input type="date" value={filterDate} onChange={handleDateChange} className={s.input} />

      <select value={filterSpecialist} onChange={(e) => setFilterSpecialist(e.target.value)} className={s.input}>
        <option value="">Усі спеціалісти</option>
        {specialists.map((spec) => (
          <option key={spec._id} value={spec._id}>
            {spec.name}
          </option>
        ))}
      </select>

      <select value={filterType} onChange={handleTypeChange} className={s.input}>
        <option value="">Фільтр по даті</option>
        <option value="today">Сьогодні</option>
        <option value="upcoming">Майбутні</option>
        <option value="past">Минулі</option>
        <option value="all">Усі</option>
      </select>

      <input
        type="text"
        placeholder="Пошук за телефоном"
        value={phoneSearch}
        onChange={(e) => setPhoneSearch(e.target.value)}
        className={s.input}
      />

      <button className={s.clearBtn} onClick={clearFilters}>
        Очистити фільтри
      </button>
    </div>
  );
};

export default BookingFilters;
