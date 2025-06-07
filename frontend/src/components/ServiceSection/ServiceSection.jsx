import React, { useState } from 'react';
import s from './ServiceSection.module.css';
import { allServices } from '../servicesData';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { CiSearch } from 'react-icons/ci';
import Button from '../Button/Button';

const ServiceSection = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');

  const categories = ['all', 'cleaning', 'massage', 'injection'];
  const filteredServices = allServices.filter((service) => {
    const matchesCategory = selectedCategory === 'all' || service.category === selectedCategory;
    const matchesSearch = t(`servicesList.${service.titleKey}.title`).toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <section className={s.servicesSection}>
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
        {filteredServices.map((service, index) => (
          <div className={s.card} key={index}>
            <h3>{t(`servicesList.${service.titleKey}.title`)}</h3>
            <p>{t(`servicesList.${service.titleKey}.description`)}</p>
            <div className={s.meta}>
              <span>Cena {service.price}</span>
              <span>Czas {service.duration}</span>
            </div>
            <Button serviceKey={service.titleKey} />
          </div>
        ))}
      </div>
    </section>
  );
};

export default ServiceSection;
