import React, { useEffect, useState } from 'react';
import { getAllReviews, deleteReview } from '../../api/reviews';
import s from './AdminSection.module.css';

const AdminSection = () => {
  const [reviews, setReviews] = useState([]);

  useEffect(() => {
    const load = async () => {
      const data = await getAllReviews();
      setReviews(data);
    };
    load();
  }, []);

  const handleDelete = async (id) => {
    if (!window.confirm('Ви впевнені, що хочете видалити цей відгук?')) return;
    await deleteReview(id);
    setReviews((prev) => prev.filter((review) => review._id !== id));
  };

  return (
    <div className={s.adminPanel}>
      <h2>Адмін панель – Відгуки</h2>
      {reviews.map((review) => (
        <div key={review._id} className={s.reviewCard}>
          <p>
            <strong>{review.name}</strong>: {review.comment}
          </p>
          <button onClick={() => handleDelete(review._id)}>Видалити</button>
        </div>
      ))}
    </div>
  );
};

export default AdminSection;
