import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import s from './AdminBeforeAfter.module.css';
import { useTranslation } from 'react-i18next';
import GalleryImage from '../../GalleryImage/GalleryImage';
import BeforeAfterModal from '../BeforeAfterModal/BeforeAfterModal';
import { fetchBeforeAfter, deleteBeforeAfter } from '../../../redux/beforeAfter/beforeAfterOperations';
import { selectBeforeAfter } from '../../../redux/beforeAfter/beforeAfterSelectors';
import { selectServices } from '../../../redux/services/servicesSelectors';
import { getAllServices } from '../../../redux/services/servicesOperations';

const AdminBeforeAfter = () => {
  const { t, i18n } = useTranslation();
  const dispatch = useDispatch();
  const items = useSelector(selectBeforeAfter);
  const services = useSelector(selectServices);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState(null);

  useEffect(() => {
    dispatch(fetchBeforeAfter());
    dispatch(getAllServices());
  }, [dispatch]);

  const handleDelete = (id) => {
    if (window.confirm(t('areYouSureDelete'))) {
      dispatch(deleteBeforeAfter(id));
    }
  };

  const handleEdit = (item) => {
    setEditingItem(item);
    setIsModalOpen(true);
  };

  const getServiceTitle = (key) => {
    const lang = i18n.language;
    const match = services.find((s) => s._id === key);
    return match?.title?.[lang] || key;
  };

  return (
    <section className={s.adminSection}>
      <div className={s.headerRow}>
        <h2>
          {t('before')}/{t('after')} Gallery
        </h2>
        <button
          className={s.addBtn}
          onClick={() => {
            setEditingItem(null);
            setIsModalOpen(true);
          }}
        >
          + {t('add')}
        </button>
      </div>

      <div className={s.grid}>
        {items.map((item) => (
          <div key={item._id} className={s.card}>
            <h4>{getServiceTitle(item.serviceKey)}</h4>
            <div className={s.imageBlock}>
              <GalleryImage src={item.beforeImg.url} alt="before" />
              <GalleryImage src={item.afterImg.url} alt="after" />
            </div>
            <div className={s.actions}>
              <button onClick={() => handleEdit(item)}>{t('edit')}</button>
              <button onClick={() => handleDelete(item._id)}>{t('delete')}</button>
            </div>
          </div>
        ))}
      </div>

      {isModalOpen && (
        <BeforeAfterModal
          onClose={() => setIsModalOpen(false)}
          editingItem={editingItem}
          onSuccess={() => dispatch(fetchBeforeAfter())}
        />
      )}
    </section>
  );
};

export default AdminBeforeAfter;
