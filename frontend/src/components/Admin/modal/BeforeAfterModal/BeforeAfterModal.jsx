import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import UniversalModal from '../UniversalModal/UniversalModal';
import { createBeforeAfter, updateBeforeAfter } from '../../../../redux/beforeAfter/beforeAfterOperations';
import { getAllServices } from '../../../../redux/services/servicesOperations';
import { selectServices } from '../../../../redux/services/servicesSelectors';
import s from './BeforeAfterModal.module.css';

const categories = ['cleaning', 'massage', 'injection'];

const BeforeAfterModal = ({ onClose, editingItem = null, onSuccess }) => {
  const dispatch = useDispatch();
  const services = useSelector(selectServices);

  const [selectedCategory, setSelectedCategory] = useState('');
  const [selectedService, setSelectedService] = useState('');
  const [beforeFile, setBeforeFile] = useState(null);
  const [afterFile, setAfterFile] = useState(null);
  const [keepBefore, setKeepBefore] = useState(true);
  const [keepAfter, setKeepAfter] = useState(true);
  const [existingBefore, setExistingBefore] = useState(null);
  const [existingAfter, setExistingAfter] = useState(null);

  useEffect(() => {
    dispatch(getAllServices());
  }, [dispatch]);

  useEffect(() => {
    if (!editingItem || !services.length) return;

    const matchedService = services.find((s) => s._id === editingItem.serviceKey);
    if (matchedService) {
      setSelectedService(matchedService._id);
      setSelectedCategory(matchedService.category);
    }

    setExistingBefore(editingItem.beforeImg?.url || null);
    setExistingAfter(editingItem.afterImg?.url || null);
    setKeepBefore(!!editingItem.beforeImg?.url);
    setKeepAfter(!!editingItem.afterImg?.url);
  }, [editingItem, services]);

  const filteredServices = services.filter((s) => s.category === selectedCategory);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!selectedService) return;

    const formData = new FormData();
    formData.append('serviceKey', selectedService);

    if (editingItem) {
      if (!keepBefore && !beforeFile) {
        alert('Завантаж нове фото ДО або залиш старе');
        return;
      }
      if (!keepAfter && !afterFile) {
        alert('Завантаж нове фото ПІСЛЯ або залиш старе');
        return;
      }
    }

    if (beforeFile) formData.append('before', beforeFile);
    if (afterFile) formData.append('after', afterFile);

    try {
      if (editingItem) {
        await dispatch(updateBeforeAfter({ id: editingItem._id, data: formData })).unwrap();
      } else {
        await dispatch(createBeforeAfter(formData)).unwrap();
      }
      if (onSuccess) onSuccess();
      onClose();
    } catch (err) {
      alert('Помилка при збереженні.');
    }
  };

  return (
    <UniversalModal title={editingItem ? 'Редагувати фото до/після' : 'Додати фото до/після'} onClose={onClose}>
      <form className={s.modalForm} onSubmit={handleSubmit}>
        <label>Категорія</label>
        <select value={selectedCategory} onChange={(e) => setSelectedCategory(e.target.value)} required>
          <option value="" disabled>
            Оберіть категорію
          </option>
          {categories.map((cat) => (
            <option key={cat} value={cat}>
              {cat}
            </option>
          ))}
        </select>

        <label>Послуга</label>
        <select
          value={selectedService}
          onChange={(e) => setSelectedService(e.target.value)}
          disabled={!selectedCategory}
          required
        >
          <option value="" disabled>
            Оберіть послугу
          </option>
          {filteredServices.map((s) => (
            <option key={s._id} value={s._id}>
              {s.title?.pl}
            </option>
          ))}
        </select>

        <label>Фото ДО</label>
        {existingBefore && keepBefore && !beforeFile && (
          <div className={s.previewBlock}>
            <img src={existingBefore} alt="before" className={s.preview} />
            <button type="button" className={s.deletePreview} onClick={() => setKeepBefore(false)}>
              Видалити
            </button>
          </div>
        )}
        <input
          type="file"
          accept="image/*"
          onChange={(e) => setBeforeFile(e.target.files[0])}
          required={!keepBefore && !beforeFile}
        />

        <label>Фото ПІСЛЯ</label>
        {existingAfter && keepAfter && !afterFile && (
          <div className={s.previewBlock}>
            <img src={existingAfter} alt="after" className={s.preview} />
            <button type="button" className={s.deletePreview} onClick={() => setKeepAfter(false)}>
              Видалити
            </button>
          </div>
        )}
        <input
          type="file"
          accept="image/*"
          onChange={(e) => setAfterFile(e.target.files[0])}
          required={!keepAfter && !afterFile}
        />

        <button type="submit" className={s.submitBtn}>
          {editingItem ? 'Оновити' : 'Завантажити'}
        </button>
      </form>
    </UniversalModal>
  );
};

export default BeforeAfterModal;
