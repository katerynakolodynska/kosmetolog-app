import React, { useState, useEffect } from 'react';
import { FaStar, FaRegStar } from 'react-icons/fa';
import s from './ReviewCard.module.css';
import ExpandableText from '../../shared/ExpandableText/ExpandableText';

const ReviewCard = ({ review }) => {
  const date = new Date(review.createdAt || Date.now());
  const formattedDate = date.toLocaleDateString('pl-PL', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  });

  return (
    <div className={s.card}>
      <div className={s.header}>
        <div className={s.stars}>
          {[...Array(5)].map((_, i) =>
            i < review.rating ? (
              <FaStar key={i} className={s.filledStar} />
            ) : (
              <FaRegStar key={i} className={s.emptyStar} />
            )
          )}
        </div>
        <span className={s.date}>{formattedDate}</span>
      </div>

      <p className={s.name}>{review.name}</p>

      <div className={s.comment}>
        <ExpandableText text={review.comment} small=" mniej" large=" więcej" initialLimit={250} />
      </div>

      <div className={s.photos}>
        {review.photos?.map((photo, i) => (
          <img key={i} src={photo} alt="Review" className={s.photo} />
        ))}
      </div>
    </div>
  );
};

export default ReviewCard;
