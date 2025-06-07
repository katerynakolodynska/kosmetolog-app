import React, { useState } from 'react';
import s from './OpinionsSection.module.css';
import { FaStar } from 'react-icons/fa';
import { useTranslation } from 'react-i18next';
import { opinionData } from '../opinionData';
import Button from '../Button/Button';
import { useNavigate } from 'react-router-dom';

const OpinionsSection = ({ limit = null }) => {
  const { t } = useTranslation();
  const [rating, setRating] = useState(0);
  const [hover, setHover] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [name, setName] = useState('');
  const [comment, setComment] = useState('');
  const [photo, setPhoto] = useState(null);

  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!name || !comment || rating === 0) return;
    const newReview = { name, comment, rating, photo };
    setReviews([newReview, ...reviews]);
    setName('');
    setComment('');
    setRating(0);
    setPhoto(null);
  };

  const handlePhotoChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPhoto(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const displayedOpinions = limit ? opinionData.slice(0, limit) : opinionData;

  return (
    <section className={s.opinieSection}>
      <h2 className={s.title}>{t('opinie')}</h2>
      {!limit && (
        <form className={s.form} onSubmit={handleSubmit}>
          <div className={s.stars}>
            {[...Array(5)].map((_, i) => {
              const ratingValue = i + 1;
              return (
                <label key={i}>
                  <input
                    type="radio"
                    name="rating"
                    value={ratingValue}
                    onClick={() => setRating(ratingValue)}
                    style={{ display: 'none' }}
                  />
                  <FaStar
                    className={ratingValue <= (hover || rating) ? s.filled : s.empty}
                    onMouseEnter={() => setHover(ratingValue)}
                    onMouseLeave={() => setHover(null)}
                  />
                </label>
              );
            })}
          </div>
          <input
            className={s.input}
            type="text"
            placeholder={t('youName')}
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
          <textarea
            className={s.textarea}
            placeholder={t('yourOpinion')}
            value={comment}
            onChange={(e) => setComment(e.target.value)}
          ></textarea>
          <input className={s.file} type="file" accept="image/*" onChange={handlePhotoChange} />
          <Button type="submit" label={t('send')} />
        </form>
      )}

      <div className={s.reviews}>
        {displayedOpinions.map((opinia) => (
          <div key={opinia.id} className={s.reviewCard}>
            <p className={s.name}>{opinia.name}</p>
            <p className={s.stars}>
              {'★'.repeat(opinia.rating)}
              {'☆'.repeat(5 - opinia.rating)}
            </p>
            <p className={s.comment}>{opinia.comment}</p>
            {opinia.photo && <img src={opinia.photo} alt="User uploaded" className={s.photo} />}
          </div>
        ))}
      </div>

      {limit && opinionData.length > limit && (
        <div className={s.loadMore}>
          <Button onClick={() => navigate('/opinion')} label={t('showMoreOpinions')} className={s.showMoreOpinions} />
        </div>
      )}
    </section>
  );
};

export default OpinionsSection;
