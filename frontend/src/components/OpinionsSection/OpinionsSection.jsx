import React, { useEffect, useState } from 'react';
import s from './OpinionsSection.module.css';
import { FaStar, FaTimes, FaRegStar } from 'react-icons/fa';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { getAllReviews, createReview } from '../../api/reviews';
import Button from '../Button/Button';

const OpinionsSection = ({ limit = null }) => {
  const { t } = useTranslation();
  const navigate = useNavigate();

  const [rating, setRating] = useState(0);
  const [hover, setHover] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [name, setName] = useState('');
  const [comment, setComment] = useState('');
  const [emailOrPhone, setEmailOrPhone] = useState('');
  const [photos, setPhotos] = useState([]);
  const [previewPhotos, setPreviewPhotos] = useState([]);
  const [successMessage, setSuccessMessage] = useState('');

  const isValidEmail = (value) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);

  const isValidPhone = (value) => /^\+?[0-9\s\-()]{6,20}$/.test(value);

  useEffect(() => {
    const load = async () => {
      const data = await getAllReviews();
      setReviews(data);
    };
    load();
  }, []);

  const totalReviews = reviews.length;
  const averageRating = totalReviews ? (reviews.reduce((acc, r) => acc + r.rating, 0) / totalReviews).toFixed(1) : 0;

  const handlePhotoChange = (e) => {
    const files = Array.from(e.target.files);
    if (photos.length + files.length > 2) return;

    setPhotos((prev) => [...prev, ...files]);

    files.forEach((file) => {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewPhotos((prev) => [...prev, reader.result]);
      };
      reader.readAsDataURL(file);
    });
  };

  const removePhoto = (index) => {
    setPhotos((prev) => prev.filter((_, i) => i !== index));
    setPreviewPhotos((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name || !comment || rating === 0 || !emailOrPhone) return;

    if (!isValidEmail(emailOrPhone) && !isValidPhone(emailOrPhone)) {
      alert(t('invalidPhoneOrEmail'));
      return;
    }

    const formData = new FormData();
    formData.append('name', name);
    formData.append('comment', comment);
    formData.append('rating', rating);
    formData.append('emailOrPhone', emailOrPhone);

    photos.forEach((photo) => {
      formData.append('photos', photo);
    });

    await createReview(formData);

    setName('');
    setComment('');
    setRating(0);
    setEmailOrPhone('');
    setPhotos([]);
    setPreviewPhotos([]);
    setSuccessMessage(t('reviewSuccess'));

    setTimeout(() => setSuccessMessage(''), 4000);
    const updatedReviews = await getAllReviews();
    setReviews(updatedReviews);
  };

  const displayedOpinions = limit ? reviews.slice(0, limit) : reviews;

  return (
    <section className={s.opinieSection}>
      <h2 className={s.title}>{t('opinie')}</h2>
      <p className={s.summary}>
        {t('averageRating')}: <strong>{averageRating}</strong>
        <FaStar className={s.summaryStar} /> — <strong>{totalReviews}</strong> {t('reviewsCount')}
      </p>

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

          <input
            className={s.input}
            type="text"
            placeholder={t('phoneOrEmail')}
            value={emailOrPhone}
            onChange={(e) => setEmailOrPhone(e.target.value)}
          />

          <textarea
            className={s.textarea}
            placeholder={t('yourOpinion')}
            value={comment}
            onChange={(e) => setComment(e.target.value)}
          ></textarea>

          <div className={s.uploadWrapper}>
            <label className={s.customUploadButton}>
              {t('uploadPhoto')}
              <input
                type="file"
                accept="image/*"
                multiple
                className={s.fileInput}
                onChange={handlePhotoChange}
                disabled={photos.length >= 2}
              />
            </label>
          </div>

          <div className={s.preview}>
            {previewPhotos.map((img, i) => (
              <div key={i} className={s.previewItem}>
                <img src={img} alt="preview" />
                <button type="button" className={s.removeBtn} onClick={() => removePhoto(i)}>
                  <FaTimes />
                </button>
              </div>
            ))}
          </div>

          <Button className={s.btn} type="submit" label={t('send')} />
        </form>
      )}
      {successMessage && <p className={s.success}>{successMessage}</p>}

      <div className={s.reviews}>
        {displayedOpinions.map((opinia, idx) => (
          <div key={idx} className={s.reviewCard}>
            <p className={s.name}>{opinia.name}</p>
            <div className={s.starsDisplay}>
              {[...Array(5)].map((_, i) =>
                i < opinia.rating ? (
                  <FaStar key={i} className={s.filledStar} />
                ) : (
                  <FaRegStar key={i} className={s.emptyStar} />
                )
              )}
            </div>
            <p className={s.comment}>{opinia.comment}</p>
            {opinia.photos &&
              opinia.photos.map((photo, i) => <img key={i} src={photo} alt="User" className={s.photo} />)}
          </div>
        ))}
      </div>

      {limit && reviews.length > limit && (
        <div className={s.loadMore}>
          <Button onClick={() => navigate('/opinion')} label={t('showMoreOpinions')} />
        </div>
      )}
    </section>
  );
};

export default OpinionsSection;
