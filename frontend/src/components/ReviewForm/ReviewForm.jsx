import React, { useState, useRef, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { createReview, getAllReviews } from '../../redux/reviews/reviewsOperations.js';
import s from './ReviewForm.module.css';
import { FaStar, FaTimes } from 'react-icons/fa';
import { useTranslation } from 'react-i18next';

const ReviewForm = () => {
  const { t } = useTranslation();
  const dispatch = useDispatch();

  const [rating, setRating] = useState(0);
  const [hover, setHover] = useState(null);
  const [name, setName] = useState('');
  const [comment, setComment] = useState('');
  const [phone, setPhone] = useState('+48');
  const [photos, setPhotos] = useState([]);
  const [previewPhotos, setPreviewPhotos] = useState([]);

  const phoneInputRef = useRef(null);
  useEffect(() => {
    if (phoneInputRef.current) {
      phoneInputRef.current.setSelectionRange(phone.length, phone.length);
    }
  }, [phone]);

  const handlePhoneChange = (e) => {
    const input = e.target.value;

    if (!input.startsWith('+48')) return;

    const digits = input.replace(/\D/g, '').slice(2, 11);
    const formatted =
      '+48 ' +
      digits.slice(0, 3) +
      (digits.length > 3 ? '-' + digits.slice(3, 6) : '') +
      (digits.length > 6 ? '-' + digits.slice(6) : '');
    setPhone(formatted);
  };

  const isValidPhone = (value) => /^\+?[0-9\s\-()]{6,20}$/.test(value);

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
    if (!name || rating === 0 || !isValidPhone(phone)) {
      alert(t('invalidPhoneOrEmail'));
      return;
    }

    const formData = new FormData();
    formData.append('name', name);
    formData.append('comment', comment);
    formData.append('rating', rating);
    formData.append('phone', phone.trim);
    photos.forEach((photo) => formData.append('photos', photo));

    await dispatch(createReview(formData));
    await dispatch(getAllReviews());

    setName('');
    setComment('');
    setRating(0);
    setPhone('+48');
    setPhotos([]);
    setPreviewPhotos([]);
  };

  return (
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
        type="text"
        className={s.input}
        placeholder={t('youName')}
        value={name}
        onChange={(e) => setName(e.target.value)}
      />
      <input
        type="text"
        ref={phoneInputRef}
        className={s.input}
        placeholder={t('phone')}
        value={phone}
        // placeholder="+48 123-456-789"
        required
        pattern="\+48 \d{3}-\d{3}-\d{3}"
        onChange={handlePhoneChange}
      />
      <textarea
        className={s.textarea}
        placeholder={t('yourOpinion')}
        value={comment}
        onChange={(e) => setComment(e.target.value)}
      />

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

      <button type="submit" className={s.btn}>
        {t('send')}
      </button>
    </form>
  );
};

export default ReviewForm;
