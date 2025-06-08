import React from 'react';
import { FaStar, FaRegStar } from 'react-icons/fa';
import s from './ReviewCard.module.css';

const ReviewCard = ({ review }) => {
  return (
    <div className={s.card}>
      <div className={s.parag}>
        <p className={s.name}>{review.name}</p>
        <div className={s.starsDisplay}>
          {[...Array(5)].map((_, i) =>
            i < review.rating ? (
              <FaStar key={i} className={s.filledStar} />
            ) : (
              <FaRegStar key={i} className={s.emptyStar} />
            )
          )}
        </div>
        <p className={s.comment}>{review.comment}</p>
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
