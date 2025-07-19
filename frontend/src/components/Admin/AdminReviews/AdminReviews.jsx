import React from 'react';
import s from './AdminReviews.module.css';
import { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { getAllReviews, deleteReview } from '../../../redux/reviews/reviewsOperations';
import { data } from 'react-router-dom';
import ExpandableText from '../../shared/ExpandableText/ExpandableText';
import ImageModal from '../../gallery/ImageModal/ImageModal';

const AdminReviews = () => {
  const dispatch = useDispatch();
  const [reviews, setReviews] = useState([]);
  const [error, setError] = useState(null);
  const [modalImage, setModalImage] = useState(null);

  useEffect(() => {
    dispatch(getAllReviews())
      .unwrap()

      .then((data) => {
        const sorted = [...data].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
        setReviews(sorted);
      })
      .catch(() => setError('Не вдалося завантажити відгуки'));
  }, [dispatch]);

  const handleDelete = async (id) => {
    if (window.confirm('Ви впевнені, що хочете видалити цей відгук?')) {
      try {
        await dispatch(deleteReview(id)).unwrap();
        setReviews(reviews.filter((review) => review._id !== id));
      } catch (err) {
        setError('Не вдалося видалити відгук');
      }
    }
  };

  return (
    <section className={`${s.reviewsContainer} container`}>
      <h1 className={s.title}>Відгуки</h1>
      {error && <p className={s.error}>{error}</p>}
      <table className={s.reviewsTable}>
        <thead>
          <tr>
            <th>Ім'я</th>
            <th>Телефон</th>
            <th>Рейтинг</th>
            <th>Відгук</th>
            <th>Фото</th>
            <th>Дата</th>
            <th>Дія</th>
          </tr>
        </thead>
        <tbody>
          {reviews.map((review) => (
            <tr key={review._id}>
              <td data-label="Ім'я">{review.name}</td>
              <td data-label="Телефон">
                {review.phone ? (
                  <a href={`tel:${review.phone}`} className={s.phoneLink}>
                    {review.phone}
                  </a>
                ) : (
                  '-'
                )}
              </td>
              <td data-label="Рейтинг">{review.rating}</td>
              <td data-label="Відгук">
                <ExpandableText text={review.comment} small="mniej" large="więcej" initialLimit={130} />
              </td>

              <td data-label="Фото" className={s.photosCell}>
                {Array.isArray(review.photos) && review.photos.length > 0 ? (
                  <div className={s.photoGrid}>
                    {review.photos.map((photo, index) => (
                      <img
                        key={index}
                        src={photo}
                        alt={`Фото ${index + 1}`}
                        className={s.photo}
                        onClick={() => setModalImage(photo)}
                        style={{ cursor: 'pointer' }}
                      />
                    ))}
                  </div>
                ) : (
                  <span>-</span>
                )}
              </td>
              <td data-label="Дата">
                {new Date(review.createdAt).toLocaleDateString('pl-PL', {
                  year: 'numeric',
                  month: '2-digit',
                  day: '2-digit',
                })}
              </td>
              <td data-label="Дія">
                <button onClick={() => handleDelete(review._id)} className={s.deleteButton}>
                  Видалити
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {modalImage && <ImageModal src={modalImage} alt="Збільшене фото" onClose={() => setModalImage(null)} />}

      {reviews.length === 0 && <p className={s.noReviews}>Немає відгуків</p>}
    </section>
  );
};

export default AdminReviews;
