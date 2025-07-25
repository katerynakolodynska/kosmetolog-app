import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getAllServices } from '../../../redux/services/servicesOperations';
import { selectServices, selectServicesLoading } from '../../../redux/services/servicesSelectors';
import { useTranslation } from 'react-i18next';
import { CiSearch } from 'react-icons/ci';
import Button from '../../shared/Button/Button';
import s from './ServiceSection.module.css';

const categories = ['all', 'cleaning', 'massage', 'injection'];

const ServiceSection = () => {
  const dispatch = useDispatch();
  const services = useSelector(selectServices);
  const isLoading = useSelector(selectServicesLoading);
  const { i18n, t } = useTranslation();

  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    dispatch(getAllServices());
  }, [dispatch]);

  const currentLang = i18n.language;

  const filteredServices = services.filter((service) => {
    const title = service.title?.[currentLang]?.toLowerCase() || '';
    const description = service.description?.[currentLang]?.toLowerCase() || '';
    const matchesCategory = selectedCategory === 'all' || service.category === selectedCategory;
    const matchesSearch = title.includes(searchQuery.toLowerCase()) || description.includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  if (isLoading || !services.length) return null;

  return (
    <section className={`${s.servicesSection} container`}>
      <h2 className={s.title}>{t('servicesTitle')}</h2>

      <div className={s.controls}>
        <div className={s.searchContainer}>
          <CiSearch className={s.searchIcon} />
          <input
            type="text"
            placeholder={t('search')}
            className={s.searchInput}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        <div className={s.filters}>
          {categories.map((category) => (
            <button
              key={category}
              onClick={() => setSelectedCategory(category)}
              className={`${s.filterBtn} ${selectedCategory === category ? s.active : ''}`}
            >
              {t(`filters.${category}`)}
            </button>
          ))}
        </div>
      </div>

      <div className={s.grid}>
        {filteredServices.map((service, idx) => (
          <div className={s.card} key={service._id} style={{ animationDelay: `${idx * 0.1}s` }}>
            <h3>{service.title?.[currentLang]}</h3>
            <p>{service.description?.[currentLang]}</p>
            <div className={s.meta}>
              <span>
                {t('price')} {service.price} zł
              </span>
              <span>
                {t('duration')} {service.duration} min
              </span>
            </div>
            <Button serviceId={service._id} />
          </div>
        ))}
      </div>
    </section>
  );
};

export default ServiceSection;
