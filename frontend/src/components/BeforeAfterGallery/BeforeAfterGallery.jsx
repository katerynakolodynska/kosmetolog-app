import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import InfiniteScroll from 'react-infinite-scroll-component';
import s from './BeforeAfterGallery.module.css';
import { beforeAfterData } from '../beforeAfter';
import GalleryImage from '../GalleryImage/GalleryImage';

const ITEMS_PER_PAGE = 6;

const BeforeAfterGallery = () => {
  const { t } = useTranslation();
  const [visibleItems, setVisibleItems] = useState(beforeAfterData.slice(0, ITEMS_PER_PAGE));

  const fetchMoreData = () => {
    const currentLength = visibleItems.length;
    const nextItems = beforeAfterData.slice(currentLength, currentLength + ITEMS_PER_PAGE);
    setTimeout(() => {
      setVisibleItems((prev) => [...prev, ...nextItems]);
    }, 500);
  };

  return (
    <section className={s.gallerySection}>
      <h2 className={s.title}>
        {t('before')}/{t('after')}
      </h2>

      <InfiniteScroll
        dataLength={visibleItems.length}
        next={fetchMoreData}
        hasMore={visibleItems.length < beforeAfterData.length}
        loader={<p className={s.loading}>Завантаження...</p>}
        endMessage={<p className={s.end}>Ви переглянули всі процедури 💅</p>}
      >
        <div className={s.grid}>
          {visibleItems.map((item) => (
            <div key={item.id} className={s.card}>
              <h3>{t(`servicesList.${item.serviceKey}.title`)}</h3>
              <div className={s.imageBlock}>
                <div>
                  <span className={s.label}>{t('before')}</span>
                  <GalleryImage src={item.beforeImg} alt="Before" />
                </div>
                <div>
                  <span className={s.label}>{t('after')}</span>
                  <GalleryImage src={item.afterImg} alt="After" />
                </div>
              </div>
            </div>
          ))}
        </div>
      </InfiniteScroll>
    </section>
  );
};

export default BeforeAfterGallery;
