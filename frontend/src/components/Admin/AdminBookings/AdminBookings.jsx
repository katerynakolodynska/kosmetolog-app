import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getAllBookings, deleteBooking, updateBooking } from '../../../redux/bookings/bookingsOperations';
import { getAllServices } from '../../../redux/services/servicesOperations';
import { getAllSpecialists } from '../../../redux/specialists/specialistsOperations';
import { selectBookings, selectBookingsLoading } from '../../../redux/bookings/bookingsSelectors';
import { selectServices } from '../../../redux/services/servicesSelectors';
import { selectSpecialists } from '../../../redux/specialists/specialistsSelectors';
import s from './AdminBookings.module.css';
import { FiEdit2, FiTrash2 } from 'react-icons/fi';
import EditBookingModal from '../EditBookingModal/EditBookingModal';
import BookingForm from '../../BookingForm/BookingForm';
import { usePhoneInput } from '../../../hooks/usePhoneInput';
import BookingSection from '../../BookingSection/BookingSection';

const AdminBookings = () => {
  const dispatch = useDispatch();
  const bookings = useSelector(selectBookings);
  const isLoading = useSelector(selectBookingsLoading);
  const services = useSelector(selectServices);
  const specialists = useSelector(selectSpecialists);
  const [editingBooking, setEditingBooking] = useState(null);

  const [filterDate, setFilterDate] = useState('');
  const [filterSpecialist, setFilterSpecialist] = useState('');
  const [showBookingForm, setShowBookingForm] = useState(false);

  const [selectedService, setSelectedService] = useState('');
  const [selectedSpecialist, setSelectedSpecialist] = useState('');
  const [name, setName] = useState('');
  const [phone, handlePhoneChange] = usePhoneInput();
  const [comment, setComment] = useState('');
  const [formError, setFormError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  useEffect(() => {
    dispatch(getAllBookings());
    dispatch(getAllServices());
    dispatch(getAllSpecialists());
  }, [dispatch]);

  const handleDelete = async (id) => {
    if (window.confirm('Ви дійсно хочете видалити цей запис?')) {
      await dispatch(deleteBooking(id));
    }
  };

  const handleSaveBooking = async (updatedBooking) => {
    await dispatch(updateBooking(updatedBooking));
    dispatch(getAllBookings());
    setEditingBooking(null);
  };

  const handleCreateBooking = async (e) => {
    e.preventDefault();

    if (!selectedService || !name || !phone) {
      setFormError('Заповніть усі обов’язкові поля');
      return;
    }

    const booking = {
      name,
      phone,
      comment,
      service: selectedService,
      specialistId: selectedSpecialist || null,
    };

    try {
      const response = await fetch('/api/bookings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(booking),
      });

      if (!response.ok) throw new Error('Не вдалося створити запис');

      setSuccessMessage('Запис успішно створено');
      setName('');
      setPhone('+48');
      setComment('');
      setSelectedService('');
      setSelectedSpecialist('');
      dispatch(getAllBookings());
    } catch (err) {
      setFormError('Помилка при створенні запису');
    }
  };

  const getServiceName = (id) => {
    const service = services.find((s) => s._id === id);
    return service?.title?.uk || service?.title?.pl || service?.title?.en || '—';
  };

  const filteredBookings = bookings.filter((b) => {
    const matchDate = filterDate ? b.date === filterDate : true;
    const matchSpec =
      filterSpecialist && (b.specialistId?._id === filterSpecialist || b.specialistId === filterSpecialist);
    return matchDate && (filterSpecialist ? matchSpec : true);
  });

  return (
    <section className={s.section}>
      <h2 className={s.title}>Записи клієнтів</h2>
      <button className={s.createBtn} onClick={() => setShowBookingForm((prev) => !prev)}>
        {showBookingForm ? 'Сховати форму' : 'Новий запис'}
      </button>
      {showBookingForm && (
        <div className={s.bookingForm}>
          <BookingSection isAdmin={true} onSuccess={() => dispatch(getAllBookings())} className={s.bookings} />{' '}
        </div>
      )}

      <div className={s.filters}>
        <input
          type="date"
          value={filterDate}
          onChange={(e) => setFilterDate(e.target.value)}
          className={s.filterInput}
        />
        <select
          value={filterSpecialist}
          onChange={(e) => setFilterSpecialist(e.target.value)}
          className={s.filterInput}
        >
          <option value="">Усі спеціалісти</option>
          {specialists.map((spec) => (
            <option key={spec._id} value={spec._id}>
              {spec.name}
            </option>
          ))}
        </select>
        {(filterDate || filterSpecialist) && (
          <button
            className={s.clearBtn}
            onClick={() => {
              setFilterDate('');
              setFilterSpecialist('');
            }}
          >
            Очистити фільтри
          </button>
        )}
      </div>

      {isLoading ? (
        <p>Завантаження...</p>
      ) : filteredBookings.length === 0 ? (
        <p>Записів немає.</p>
      ) : (
        <>
          <div className={s.tableWrapper}>
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
                {filteredBookings.map((b) => (
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
                      <button className={s.iconBtn} onClick={() => setEditingBooking(b)}>
                        <FiEdit2 size={18} />
                      </button>
                      <button className={s.iconBtn} onClick={() => handleDelete(b._id)}>
                        <FiTrash2 size={18} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className={s.cardList}>
            {filteredBookings.map((b) => (
              <div key={b._id} className={s.bookingCard}>
                <p>
                  <strong>Ім’я:</strong> {b.name}
                </p>
                <p>
                  <strong>Телефон:</strong>{' '}
                  <a href={`tel:${b.phone.replace(/\s|-/g, '')}`} className={s.phoneLink}>
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
                <div className={s.cardActions}>
                  <button className={s.iconBtn} onClick={() => setEditingBooking(b)}>
                    <FiEdit2 size={18} />
                  </button>
                  <button className={s.iconBtn} onClick={() => handleDelete(b._id)}>
                    <FiTrash2 size={18} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </>
      )}

      {editingBooking && (
        <EditBookingModal booking={editingBooking} onClose={() => setEditingBooking(null)} onSave={handleSaveBooking} />
      )}
    </section>
  );
};

export default AdminBookings;
