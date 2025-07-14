import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getAllReviews } from '../../../redux/reviews/reviewsOperations.js';
import { selectReviews, selectIsLoading, selectError } from '../../../redux/reviews/reviewsSelektors.js';
import ReviewForm from '../../review/ReviewForm/ReviewForm.jsx';
import ReviewList from '../../review/ReviewList/ReviewList.jsx';
import Button from '../../shared/Button/Button.jsx';
import s from './OpinionsSection.module.css';
import { useTranslation } from 'react-i18next';
import { FaStar } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';

const OpinionsSection = ({ limit = null }) => {
  const dispatch = useDispatch();
  const { t } = useTranslation();
  const navigate = useNavigate();

  const reviews = useSelector(selectReviews);
  const isLoading = useSelector(selectIsLoading);
  const error = useSelector(selectError);

  useEffect(() => {
    dispatch(getAllReviews());
  }, [dispatch]);

  const totalReviews = reviews.length;
  const averageRating =
    Array.isArray(reviews) && reviews.length > 0
      ? (reviews.reduce((acc, r) => acc + (r.rating || 0), 0) / reviews.length).toFixed(1)
      : 0;

  if (isLoading || !reviews.length) return null;

  return (
    <section className={s.opinieSection}>
      {error && (
        <p className={s.error}>
          {t('errorLoading')} {error}
        </p>
      )}

      <h2 className={s.title}>{t('opinie')}</h2>

      <p className={s.summary}>
        {t('averageRating')}: <strong>{averageRating}</strong>
        <FaStar className={s.summaryStar} /> — <strong>{totalReviews}</strong> {t('reviewsCount')}
      </p>

      {!limit && <ReviewForm />}

      <ReviewList reviews={limit ? reviews.slice(0, limit) : reviews} />

      {limit && reviews.length > limit && (
        <div className={s.loadMore}>
          <Button onClick={() => navigate('/opinion')} label={t('showMoreOpinions')} />
        </div>
      )}
    </section>
  );
};

export default OpinionsSection;
