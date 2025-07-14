import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import InfiniteScroll from 'react-infinite-scroll-component';
import { useTranslation } from 'react-i18next';
import s from './BeforeAfterGallery.module.css';
import GalleryImage from '../GalleryImage/GalleryImage';
import { fetchBeforeAfter } from '../../../redux/beforeAfter/beforeAfterOperations';
import { selectBeforeAfter } from '../../../redux/beforeAfter/beforeAfterSelectors';
import { getAllServices } from '../../../redux/services/servicesOperations';
import { selectServices } from '../../../redux/services/servicesSelectors';

const ITEMS_PER_PAGE = 6;

const BeforeAfterGallery = () => {
  const { t, i18n } = useTranslation();
  const dispatch = useDispatch();
  const allItems = useSelector(selectBeforeAfter);
  const services = useSelector(selectServices);

  const [visibleItems, setVisibleItems] = useState([]);
  const [hasMore, setHasMore] = useState(true);
  const [initialLoading, setInitialLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      await dispatch(fetchBeforeAfter());
      await dispatch(getAllServices());
      setInitialLoading(false);
    };
    loadData();
  }, [dispatch]);

  useEffect(() => {
    if (allItems.length > 0) {
      setVisibleItems(allItems.slice(0, ITEMS_PER_PAGE));
      setHasMore(allItems.length > ITEMS_PER_PAGE);
    }
  }, [allItems]);

  const fetchMoreData = () => {
    const currentLength = visibleItems.length;
    const nextItems = allItems.slice(currentLength, currentLength + ITEMS_PER_PAGE);
    setTimeout(() => {
      setVisibleItems((prev) => [...prev, ...nextItems]);
      if (visibleItems.length + nextItems.length >= allItems.length) {
        setHasMore(false);
      }
    }, 300);
  };

  const getServiceTitle = (serviceId) => {
    const lang = i18n.language;
    const found = services.find((s) => s._id === serviceId);
    return found?.title?.[lang] || '—';
  };

  return (
    <section className={s.gallerySection}>
      <h2 className={s.title}>
        {t('before')}/{t('after')}
      </h2>

      {initialLoading ? (
        <p className={s.loadingText}>{t('loading')}...</p>
      ) : (
        <InfiniteScroll
          dataLength={visibleItems.length}
          next={fetchMoreData}
          hasMore={hasMore}
          loader={<p className={s.loadingText}>{t('loading')}...</p>}
          endMessage={<p className={s.end}>{t('endMessage')}</p>}
        >
          <div className={s.grid}>
            {visibleItems.map((item) => (
              <div key={item._id} className={s.card}>
                <h3>{getServiceTitle(item.serviceKey)}</h3>
                <div className={s.imageBlock}>
                  <div>
                    <span className={s.label}>{t('before')}</span>
                    <GalleryImage src={item.beforeImg.url} alt="Before" />
                  </div>
                  <div>
                    <span className={s.label}>{t('after')}</span>
                    <GalleryImage src={item.afterImg.url} alt="After" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </InfiniteScroll>
      )}
    </section>
  );
};

export default BeforeAfterGallery;
