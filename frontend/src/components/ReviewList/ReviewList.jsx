import React from 'react';
import ReviewCard from '../ReviewCard/ReviewCard.jsx';
import s from './ReviewList.module.css';

const ReviewList = ({ reviews = [] }) => {
  return (
    <div className={s.list}>
      {reviews.map((review) => (
        <ReviewCard key={review._id} review={review} />
      ))}
    </div>
  );
};

export default ReviewList;
