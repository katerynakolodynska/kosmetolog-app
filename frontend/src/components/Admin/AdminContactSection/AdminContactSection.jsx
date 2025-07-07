import React, { useEffect, useState, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchContact, updateContact, createContact } from '../../../redux/contact/contactOperation';
import { selectContactInfo, selectContactLoading } from '../../../redux/contact/contactSelectors';
import { usePhoneInput } from '../../../hooks/usePhoneInput.js';
import s from './AdminContactSection.module.css';

const weekdays = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
const defaultHours = { open: '09:00', close: '19:00', comment: '' };
const saturdayHours = { open: '10:00', close: '15:00', comment: 'Короткий день' };
const closed = { open: '', close: '', comment: 'Зачинено' };

const generateMapsLink = (address) =>
  `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(address)}`;

const isValidPhone = (value) => /^\+48 \d{3}-\d{3}-\d{3}$/.test(value);

const AdminContactSection = () => {
  const dispatch = useDispatch();
  const contact = useSelector(selectContactInfo);
  const loading = useSelector(selectContactLoading);
  const [formData, setFormData] = useState(null);
  const [phone, handlePhoneChange, setPhone] = usePhoneInput('+48 ');
  const [editMode, setEditMode] = useState(false);
  const [quickHours, setQuickHours] = useState({
    open: '09:00',
    close: '19:00',
    days: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
  });

  const phoneInputRef = useRef(null);

  useEffect(() => {
    dispatch(fetchContact());
  }, [dispatch]);

  useEffect(() => {
    if (contact) {
      setFormData(contact);
      setPhone(contact.phone || '+48 ');
    } else {
      setFormData({
        address: '',
        phone: '',
        email: '',
        mapsLink: '',
        socialLinks: {
          telegram: '',
          whatsapp: '',
          viber: '',
          instagram: '',
          facebook: '',
        },
        workHour: weekdays.map((day) => ({
          date: day,
          ...(day === 'Sunday' ? closed : day === 'Saturday' ? saturdayHours : defaultHours),
        })),
      });
      setPhone('+48 ');
    }
  }, [contact]);

  const handleChange = (field, value) => {
    const updated = { ...formData, [field]: value };
    if (field === 'address') updated.mapsLink = generateMapsLink(value);
    setFormData(updated);
  };

  const handleLinkChange = (platform, value) => {
    setFormData((prev) => ({
      ...prev,
      socialLinks: { ...prev.socialLinks, [platform]: value },
    }));
  };

  const handleWorkHourChange = (index, field, value) => {
    const updated = formData.workHour.map((day, i) => (i === index ? { ...day, [field]: value } : day));
    setFormData((prev) => ({ ...prev, workHour: updated }));
  };

  const applyQuickHours = () => {
    const updated = formData.workHour.map((entry) =>
      quickHours.days.includes(entry.date)
        ? { ...entry, open: quickHours.open, close: quickHours.close, comment: '' }
        : entry
    );
    setFormData((prev) => ({ ...prev, workHour: [...updated] }));
    setEditMode(true);
  };

  const setDayAsClosed = (index) => {
    const updated = formData.workHour.map((day, i) => (i === index ? { ...day, ...closed } : day));
    setFormData((prev) => ({ ...prev, workHour: updated }));
  };

  const handleSubmit = async () => {
    if (!isValidPhone(phone)) {
      alert('Телефон має бути у форматі: +48 123-456-789');
      return;
    }

    const payload = {
      address: formData.address,
      phone: phone.trim(),
      email: formData.email,
      mapsLink: formData.mapsLink,
      socialLinks: { ...formData.socialLinks },
      workHour: formData.workHour.map(({ date, open, close, comment }) => ({
        date,
        open,
        close,
        comment,
      })),
    };

    try {
      if (contact) {
        await dispatch(updateContact(payload)).unwrap();
        alert('Контактна інформація оновлена!');
      } else {
        await dispatch(createContact(payload)).unwrap();
        alert('Контактна інформація створена!');
      }
    } catch (error) {
      console.error('Помилка:', error);
      alert('Не вдалося зберегти контактні дані. Перевірте формат і повторіть.');
    }
  };

  if (!formData || loading) return <p>Завантаження...</p>;

  return (
    <div className={s.container}>
      <h1>Контактна інформація</h1>
      <div className={s.grid}>
        <input
          type="text"
          value={formData.address}
          onChange={(e) => handleChange('address', e.target.value)}
          placeholder="Адреса"
        />
        <input
          type="tel"
          ref={phoneInputRef}
          value={phone}
          onChange={handlePhoneChange}
          placeholder="Телефон +48 123-456-789"
          required
        />
        <input
          type="email"
          value={formData.email}
          onChange={(e) => handleChange('email', e.target.value)}
          placeholder="Email"
        />
        <input
          type="text"
          value={formData.mapsLink}
          disabled
          placeholder="Google Maps посилання (генерується автоматично)"
        />

        <h3>Соцмережі</h3>
        {Object.entries(formData.socialLinks).map(([key, value]) => (
          <input
            key={key}
            type="text"
            value={value}
            onChange={(e) => handleLinkChange(key, e.target.value)}
            placeholder={key}
          />
        ))}

        <h3>Швидке заповнення графіку</h3>
        <div className={s.quickInputGroup}>
          <input
            type="text"
            value={quickHours.open}
            onChange={(e) => setQuickHours((p) => ({ ...p, open: e.target.value }))}
            placeholder="від"
          />
          <input
            type="text"
            value={quickHours.close}
            onChange={(e) => setQuickHours((p) => ({ ...p, close: e.target.value }))}
            placeholder="до"
          />
          <select
            multiple
            value={quickHours.days}
            onChange={(e) =>
              setQuickHours((p) => ({
                ...p,
                days: Array.from(e.target.selectedOptions).map((o) => o.value),
              }))
            }
          >
            {weekdays.map((day) => (
              <option key={day} value={day}>
                {day}
              </option>
            ))}
          </select>
          <button onClick={applyQuickHours} className={s.setDefaultBtn}>
            Застосувати
          </button>
          {!editMode && (
            <button onClick={() => setEditMode(true)} className={s.setDefaultBtn}>
              Редагувати окремо
            </button>
          )}
        </div>

        {editMode && (
          <>
            <h3 className={s.editing}>Індивідуальне редагування</h3>
            {formData.workHour.map((entry, index) => (
              <div key={entry.date} className={s.workHourRow}>
                <strong>{entry.date}</strong>
                <div className={s.inputGroup}>
                  <input
                    type="text"
                    value={entry.open}
                    onChange={(e) => handleWorkHourChange(index, 'open', e.target.value)}
                    placeholder="від"
                  />
                  <input
                    type="text"
                    value={entry.close}
                    onChange={(e) => handleWorkHourChange(index, 'close', e.target.value)}
                    placeholder="до"
                  />
                  <input
                    type="text"
                    value={entry.comment}
                    onChange={(e) => handleWorkHourChange(index, 'comment', e.target.value)}
                    placeholder="коментар"
                  />
                  <button onClick={() => setDayAsClosed(index)} className={s.setDefaultBtn}>
                    Зачинено
                  </button>
                </div>
              </div>
            ))}
          </>
        )}
      </div>

      <button onClick={handleSubmit} className={s.submitBtn}>
        {contact ? 'Оновити' : 'Створити'}
      </button>
    </div>
  );
};

export default AdminContactSection;
