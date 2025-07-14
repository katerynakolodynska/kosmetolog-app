import React from 'react';
import s from './BookingTable.module.css';
import { FiEdit2, FiTrash2 } from 'react-icons/fi';

const BookingTable = ({ bookings, onEdit, onDelete, services }) => {
  if (!bookings.length) return <p className={s.noData}>Записів немає.</p>;

  const getServiceName = (id) => {
    const service = services.find((s) => s._id === id);
    return service?.title?.uk || service?.title?.pl || service?.title?.en || '—';
  };

  return (
    <div className={s.wrapper}>
      <table className={s.table}>
        <thead>
          <tr>
            <th>Ім’я</th>
            <th>Телефон</th>
            <th>Послуга</th>
            <th>Спеціаліст</th>
            <th>Дата</th>
            <th>Час</th>
            <th>Коментар</th>
            <th>Дії</th>
          </tr>
        </thead>
        <tbody>
          {bookings.map((b) => (
            <tr key={b._id}>
              <td>{b.name}</td>
              <td>
                <a href={`tel:${b.phone.replace(/\s|-/g, '')}`} className={s.phoneLink}>
                  {b.phone}
                </a>
              </td>
              <td>{getServiceName(b.service)}</td>
              <td>{b.specialistId?.name || '—'}</td>
              <td>{b.date}</td>
              <td>{b.time}</td>
              <td>{b.comment || '—'}</td>
              <td>
                <button className={s.iconBtn} onClick={() => onEdit(b)}>
                  <FiEdit2 size={18} />
                </button>
                <button className={s.iconBtn} onClick={() => onDelete(b._id)}>
                  <FiTrash2 size={18} />
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <div className={s.cardList}>
        {bookings.map((b) => (
          <div key={b._id} className={s.card}>
            <p>
              <strong>Ім’я:</strong> {b.name}
            </p>
            <p>
              <strong>Телефон:</strong>{' '}
              <a href={`tel:${b.phone}`} className={s.phoneLink}>
                {b.phone}
              </a>
            </p>
            <p>
              <strong>Послуга:</strong> {getServiceName(b.service)}
            </p>
            <p>
              <strong>Спеціаліст:</strong> {b.specialistId?.name || '—'}
            </p>
            <p>
              <strong>Дата:</strong> {b.date}
            </p>
            <p>
              <strong>Час:</strong> {b.time}
            </p>
            <p>
              <strong>Коментар:</strong> {b.comment || '—'}
            </p>
            <div className={s.actions}>
              <button className={s.iconBtn} onClick={() => onEdit(b)}>
                <FiEdit2 size={18} />
              </button>
              <button className={s.iconBtn} onClick={() => onDelete(b._id)}>
                <FiTrash2 size={18} />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default BookingTable;
