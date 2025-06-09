import React, { useState, useEffect } from 'react';
import { FaStar, FaRegStar } from 'react-icons/fa';
import s from './ReviewCard.module.css';

const ReviewCard = ({ review }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [charLimit, setCharLimit] = useState(120);

  useEffect(() => {
    const updateLimit = () => {
      const width = window.innerWidth;
      if (width < 480) setCharLimit(80);
      else if (width < 768) setCharLimit(100);
      else setCharLimit(150);
    };

    updateLimit();
    window.addEventListener('resize', updateLimit);
    return () => window.removeEventListener('resize', updateLimit);
  }, []);

  const isLong = review.comment.length > charLimit;
  const toggleExpand = () => setIsExpanded((prev) => !prev);

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

      <div className={`${s.comment}`}>
        {isExpanded || !isLong ? review.comment : `${review.comment.slice(0, charLimit)}... `}
        {isLong && (
          <button onClick={toggleExpand} className={s.showMore}>
            {isExpanded ? ' mniej' : ' więcej'}
          </button>
        )}
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
