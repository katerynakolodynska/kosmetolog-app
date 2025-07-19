import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  fetchNotifications,
  createNotification,
  sendNotification,
} from '../../../redux/notifications/notificationsOperations';
import { selectNotifications, selectNotificationsLoading } from '../../../redux/notifications/notificationsSelectors';
import s from './AdminNotifications.module.css';

const AdminNotifications = () => {
  const dispatch = useDispatch();
  const notifications = useSelector(selectNotifications);
  const isLoading = useSelector(selectNotificationsLoading);

  const [title, setTitle] = useState('');
  const [text, setText] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  useEffect(() => {
    dispatch(fetchNotifications());
  }, [dispatch]);

  const handleCreate = async (e) => {
    e.preventDefault();
    if (!title.trim() || !text.trim()) return;

    const newNotification = { title, text };
    const res = await dispatch(createNotification(newNotification));
    if (res.meta.requestStatus === 'fulfilled') {
      setSuccessMessage('Повідомлення створено!');
      setTitle('');
      setText('');
      dispatch(fetchNotifications());
    }
  };

  const handleSend = async (id) => {
    const res = await dispatch(sendNotification(id));
    if (res.meta.requestStatus === 'fulfilled') {
      setSuccessMessage('Розіслано клієнтам!');
    }
  };

  return (
    <section className={`${s.section} container`}>
      <h2 className={s.title}>Сповіщення</h2>

      <form onSubmit={handleCreate} className={s.form}>
        <input type="text" value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Заголовок" required />
        <textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Текст сповіщення"
          required
        ></textarea>
        <button type="submit">Створити</button>
        {successMessage && <p className={s.success}>{successMessage}</p>}
      </form>

      <div className={s.list}>
        {isLoading ? (
          <p>Завантаження...</p>
        ) : notifications.length === 0 ? (
          <p>Немає сповіщень.</p>
        ) : (
          notifications.map((n) => (
            <div key={n._id} className={s.item}>
              <h4>{n.title}</h4>
              <p>{n.text}</p>
              <button onClick={() => handleSend(n._id)}>Розіслати</button>
            </div>
          ))
        )}
      </div>
    </section>
  );
};

export default AdminNotifications;
