import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useInfiniteScroll } from '../../../hooks/useInfiniteScroll';
import { useTranslation } from 'react-i18next';
import s from './BeforeAfterGallery.module.css';
import GalleryImage from '../GalleryImage/GalleryImage';
import { fetchBeforeAfter } from '../../../redux/beforeAfter/beforeAfterOperations';
import { selectBeforeAfter } from '../../../redux/beforeAfter/beforeAfterSelectors';
import { getAllServices } from '../../../redux/services/servicesOperations';
import { selectServices } from '../../../redux/services/servicesSelectors';

const getItemsPerPage = () => {
  const width = window.innerWidth;
  if (width < 480) return 3; // Mobile
  if (width < 600) return 6;
  if (width < 1024) return 9;
  return 12;
};

const BeforeAfterGallery = () => {
  const { t, i18n } = useTranslation();
  const dispatch = useDispatch();
  const allItems = useSelector(selectBeforeAfter);
  const services = useSelector(selectServices);

  const [visibleItems, setVisibleItems] = useState([]);
  const [hasMore, setHasMore] = useState(true);
  const [loading, setLoading] = useState(true);
  const [itemsPerPage, setItemsPerPage] = useState(getItemsPerPage());

  useEffect(() => {
    const handleResize = () => setItemsPerPage(getItemsPerPage());
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    const loadData = async () => {
      await Promise.all([dispatch(fetchBeforeAfter()), dispatch(getAllServices())]);
      setLoading(false);
    };
    loadData();
  }, [dispatch]);

  useEffect(() => {
    if (!loading && allItems.length > 0) {
      const initial = allItems.slice(0, itemsPerPage);
      setVisibleItems(initial);
      setHasMore(initial.length < allItems.length);
    }
  }, [allItems, loading, itemsPerPage]);

  const fetchMoreData = () => {
    const currentLength = visibleItems.length;
    const nextItems = allItems.slice(currentLength, currentLength + itemsPerPage);
    setVisibleItems([...visibleItems, ...nextItems]);
    setHasMore(currentLength + nextItems.length < allItems.length);
  };

  const bottomRef = useInfiniteScroll(fetchMoreData, hasMore, loading);

  const getServiceTitle = (serviceId) => {
    const lang = i18n.language;
    const service = services.find((s) => s._id === serviceId);
    return service?.title?.[lang] || '—';
  };

  return (
    <section className={`${s.gallerySection} container`}>
      <h2 className={s.title}>
        {t('before')}/{t('after')}
      </h2>

      {loading ? (
        <p className={s.loadingText}>{t('loading')}...</p>
      ) : (
        <>
          <div className={s.grid}>
            {visibleItems.map((item, idx) => (
              <div key={item._id} className={s.card} style={{ animationDelay: `${idx * 0.05}s` }}>
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
          {hasMore && (
            <div ref={bottomRef} className={s.loadMoreWrapper}>
              <p className={s.loadingText}>{t('loading')}...</p>
            </div>
          )}
        </>
      )}
    </section>
  );
};

export default BeforeAfterGallery;
