import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { updateBooking } from '../../../redux/bookings/bookingsOperations';
import { selectServices } from '../../../redux/services/servicesSelectors';
import { selectSpecialists } from '../../../redux/specialists/specialistsSelectors';
import { selectBookings } from '../../../redux/bookings/bookingsSelectors';
import UniversalModal from '../UniversalModal/UniversalModal';
import s from './EditBookingModal.module.css';

const EditBookingModal = ({ booking, onClose, onSave }) => {
  const dispatch = useDispatch();
  const services = useSelector(selectServices);
  const specialists = useSelector(selectSpecialists);
  const bookings = useSelector(selectBookings);

  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    service: '',
    specialistId: '',
    date: '',
    time: '',
    comment: '',
  });

  const [error, setError] = useState('');

  useEffect(() => {
    if (booking) {
      setFormData({
        name: booking.name || '',
        phone: booking.phone || '',
        service: booking.service || '',
        specialistId: booking.specialistId?._id || booking.specialistId || '',
        date: booking.date || '',
        time: booking.time || '',
        comment: booking.comment || '',
      });
    }
  }, [booking]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.service || !formData.date || !formData.time) {
      setError('Будь ласка, заповніть усі обов’язкові поля');
      return;
    }

    const isBusy = bookings.some(
      (b) =>
        b._id !== booking._id &&
        b.date === formData.date &&
        b.time === formData.time &&
        (b.specialistId?._id || b.specialistId) === formData.specialistId
    );

    if (isBusy) {
      setError('Цей спеціаліст вже зайнятий у вказаний час');
      return;
    }

    const payload = {
      id: booking._id,
      body: {
        service: formData.service,
        specialistId: formData.specialistId || null,
        date: formData.date,
        time: formData.time,
        comment: formData.comment,
      },
    };

    await dispatch(updateBooking(payload));
    onSave?.();
  };

  return (
    <UniversalModal title="Редагувати запис" onClose={onClose}>
      <form className={s.form} onSubmit={handleSubmit}>
        {error && <p className={s.error}>{error}</p>}

        <label>
          Ім’я
          <input type="text" name="name" value={formData.name} disabled />
        </label>

        <label>
          Телефон
          <input type="tel" name="phone" value={formData.phone} disabled />
        </label>

        <label>
          Послуга
          <select name="service" value={formData.service} onChange={handleChange} required>
            <option value="">Оберіть послугу</option>
            {services.map((s) => (
              <option key={s._id} value={s._id}>
                {s.title?.uk || s.title?.pl || s.title?.en}
              </option>
            ))}
          </select>
        </label>

        <label>
          Спеціаліст
          <select name="specialistId" value={formData.specialistId} onChange={handleChange}>
            <option value="">—</option>
            {specialists.map((spec) => (
              <option key={spec._id} value={spec._id}>
                {spec.name}
              </option>
            ))}
          </select>
        </label>

        <label>
          Дата
          <input type="date" name="date" value={formData.date} onChange={handleChange} required />
        </label>

        <label>
          Час
          <input type="time" name="time" value={formData.time} onChange={handleChange} required />
        </label>

        <label>
          Коментар
          <textarea name="comment" value={formData.comment} onChange={handleChange} />
        </label>

        <div className={s.actions}>
          <button type="submit" className={s.saveBtn}>
            Зберегти
          </button>
          <button type="button" className={s.cancelBtn} onClick={onClose}>
            Скасувати
          </button>
        </div>
      </form>
    </UniversalModal>
  );
};

export default EditBookingModal;
