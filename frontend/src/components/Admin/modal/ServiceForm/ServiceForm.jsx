import { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { createService, updateService, getAllServices } from '../../../../redux/services/servicesOperations.js';
import { getAllSpecialists } from '../../../../redux/specialists/specialistsOperations.js';
import UniversalModal from '../UniversalModal/UniversalModal.jsx';
import s from './ServiceForm.module.css';

const initialTranslation = { pl: '', uk: '', en: '' };
const categories = ['cleaning', 'massage', 'injection'];

const ServiceForm = ({ onClose, serviceToEdit = null }) => {
  const dispatch = useDispatch();
  const [title, setTitle] = useState(initialTranslation);
  const [description, setDescription] = useState(initialTranslation);
  const [price, setPrice] = useState('');
  const [duration, setDuration] = useState('');
  const [category, setCategory] = useState('');
  const [selectedSpecialists, setSelectedSpecialists] = useState([]);
  const [specialists, setSpecialists] = useState([]);

  useEffect(() => {
    dispatch(getAllSpecialists()).unwrap().then(setSpecialists).catch(console.error);
  }, [dispatch]);

  useEffect(() => {
    if (serviceToEdit) {
      const clean = ({ _id, ...rest }) => rest;
      setTitle(clean(serviceToEdit.title || initialTranslation));
      setDescription(clean(serviceToEdit.description || initialTranslation));
      setPrice(serviceToEdit.price?.toString() || '');
      setDuration(serviceToEdit.duration?.toString() || '');
      setCategory(serviceToEdit.category || '');

      const ids = Array.isArray(serviceToEdit.specialists) ? serviceToEdit.specialists.map((s) => s._id) : [];
      setSelectedSpecialists(ids);
    }
  }, [serviceToEdit]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const clean = ({ _id, ...rest }) => rest;

    const body = {
      title: clean(title),
      description: clean(description),
      price: Number(price),
      duration: Number(duration),
      category,
      specialists: selectedSpecialists,
    };

    try {
      if (serviceToEdit) {
        await dispatch(updateService({ id: serviceToEdit._id, body })).unwrap();
      } else {
        await dispatch(createService(body)).unwrap();
      }

      await dispatch(getAllServices());
      handleClose();
    } catch (error) {
      console.error(error);
      alert('Помилка при збереженні послуги');
    }
  };

  const handleClose = () => {
    setTitle(initialTranslation);
    setDescription(initialTranslation);
    setPrice('');
    setDuration('');
    setCategory('');
    setSelectedSpecialists([]);
    onClose?.();
  };

  const handleTranslationChange = (field, lang, value) => {
    const updater = field === 'title' ? setTitle : setDescription;
    updater((prev) => ({ ...prev, [lang]: value }));
  };

  const handleCheckboxChange = (id) => {
    setSelectedSpecialists((prev) => (prev.includes(id) ? prev.filter((s) => s !== id) : [...prev, id]));
  };

  const filteredSpecialists = category ? specialists.filter((s) => s.categories.includes(category)) : specialists;

  return (
    <UniversalModal title={serviceToEdit ? 'Редагувати послугу' : 'Нова послуга'} onClose={handleClose}>
      <form onSubmit={handleSubmit} className={s.formContainer}>
        <div className={s.formGroup}>
          <label>Назва (PL / UA / EN)</label>
          {['pl', 'uk', 'en'].map((lang) => (
            <input
              key={lang}
              type="text"
              placeholder={`Назва (${lang})`}
              value={title[lang]}
              onChange={(e) => handleTranslationChange('title', lang, e.target.value)}
              required
            />
          ))}
        </div>

        <div className={s.formGroup}>
          <label>Опис (PL / UA / EN)</label>
          {['pl', 'uk', 'en'].map((lang) => (
            <textarea
              key={lang}
              placeholder={`Опис (${lang})`}
              value={description[lang]}
              onChange={(e) => handleTranslationChange('description', lang, e.target.value)}
              required
            />
          ))}
        </div>

        <div className={s.formGroup}>
          <label>Ціна (злоті)</label>
          <input type="number" min="0" value={price} onChange={(e) => setPrice(e.target.value)} required />
        </div>

        <div className={s.formGroup}>
          <label>Тривалість (хв)</label>
          <input type="number" min="1" value={duration} onChange={(e) => setDuration(e.target.value)} required />
        </div>

        <div className={s.formGroup}>
          <label>Категорія</label>
          <select value={category} onChange={(e) => setCategory(e.target.value)} required>
            <option value="">Оберіть категорію</option>
            {categories.map((cat) => (
              <option key={cat} value={cat}>
                {cat}
              </option>
            ))}
          </select>
        </div>

        <div className={s.formGroup}>
          <label>Спеціалісти</label>
          <div className={s.checkboxGroup}>
            {filteredSpecialists.map((spec) => (
              <label key={spec._id}>
                <input
                  type="checkbox"
                  value={spec._id}
                  checked={selectedSpecialists.includes(spec._id)}
                  onChange={() => handleCheckboxChange(spec._id)}
                />
                {spec.name}
              </label>
            ))}
          </div>
        </div>

        <div className={s.formActions}>
          <button type="submit">{serviceToEdit ? 'Зберегти' : 'Додати'}</button>
          <button type="button" onClick={handleClose}>
            Скасувати
          </button>
        </div>
      </form>
    </UniversalModal>
  );
};

export default ServiceForm;
