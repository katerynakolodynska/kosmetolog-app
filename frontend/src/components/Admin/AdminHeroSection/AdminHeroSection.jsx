import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import s from './AdminHeroSection.module.css';
import { fetchHero, createHero, updateHero } from '../../../redux/hero/heroOperations';
import { selectHeroData, selectHeroLoading } from '../../../redux/hero/heroSelectors';
import Button from '../../shared/Button/Button';

const initialText = { uk: '', pl: '', en: '' };

const AdminHeroSection = () => {
  const dispatch = useDispatch();
  const hero = useSelector(selectHeroData);
  const loading = useSelector(selectHeroLoading);

  const [formData, setFormData] = useState({
    introText: initialText,
    aboutText: initialText,
    specialistIntro: initialText,
    images: [],
  });

  const [previewImages, setPreviewImages] = useState([]);
  const [newImages, setNewImages] = useState([]);

  useEffect(() => {
    dispatch(fetchHero());
  }, [dispatch]);

  useEffect(() => {
    if (hero) {
      setFormData(hero);
      setPreviewImages(hero.images || []);
    }
  }, [hero]);

  const handleTextChange = (field, lang, value) => {
    setFormData((prev) => ({
      ...prev,
      [field]: { ...prev[field], [lang]: value },
    }));
  };

  const handleImageUpload = (e) => {
    const files = Array.from(e.target.files);
    if (files.length + previewImages.length > 4) {
      alert('Можна лише 4 фото. Спочатку видаліть зайві.');
      return;
    }

    setNewImages((prev) => [...prev, ...files]);
    const previews = files.map((file) => URL.createObjectURL(file));
    setPreviewImages((prev) => [...prev, ...previews.map((url) => ({ url }))]);
  };

  const handleRemoveImage = (index) => {
    const updatedPreviews = [...previewImages];
    updatedPreviews.splice(index, 1);
    setPreviewImages(updatedPreviews);

    const updatedImages = [...formData.images];
    updatedImages.splice(index, 1);
    setFormData((prev) => ({ ...prev, images: updatedImages }));
  };

  const handleSubmit = async () => {
    if (previewImages.length !== 4) {
      alert('Потрібно 4 зображення.');
      return;
    }

    const fd = new FormData();
    fd.append('introText', JSON.stringify(formData.introText));
    fd.append('aboutText', JSON.stringify(formData.aboutText));
    fd.append('specialistIntro', JSON.stringify(formData.specialistIntro));
    newImages.forEach((file) => fd.append('images', file));

    try {
      if (hero) {
        await dispatch(updateHero(fd)).unwrap();
        alert('Дані оновлено');
      } else {
        await dispatch(createHero(fd)).unwrap();
        alert('Секцію створено');
      }
    } catch (err) {
      alert('Помилка: ' + err.message);
    }
  };

  return (
    <section className={s.container}>
      <h2 className={s.title}>Hero Section</h2>

      <div className={s.sectionGroup}>
        <h3>Вітальний текст </h3>
        <div className={s.inputGroup}>
          {['uk', 'pl', 'en'].map((lang) => (
            <input
              key={lang}
              type="text"
              placeholder={`Вітальний текст (${lang})`}
              value={formData.introText[lang] || ''}
              onChange={(e) => handleTextChange('introText', lang, e.target.value)}
            />
          ))}
        </div>
      </div>

      <div className={s.sectionGroup}>
        <h3>Про салон </h3>
        <div className={s.inputGroup}>
          {['uk', 'pl', 'en'].map((lang) => (
            <input
              key={lang}
              type="text"
              placeholder={`Про салон (${lang})`}
              value={formData.aboutText[lang] || ''}
              onChange={(e) => handleTextChange('aboutText', lang, e.target.value)}
            />
          ))}
        </div>
      </div>

      <div className={s.sectionGroup}>
        <h3>Опис власника </h3>
        <div className={s.inputGroup}>
          {['uk', 'pl', 'en'].map((lang) => (
            <input
              key={lang}
              type="text"
              placeholder={`Опис власника (${lang})`}
              value={formData.specialistIntro[lang] || ''}
              onChange={(e) => handleTextChange('specialistIntro', lang, e.target.value)}
            />
          ))}
        </div>
      </div>

      <div className={s.sectionGroup}>
        <h3>Зображення салону (4 шт):</h3>
        <input type="file" accept="image/*" multiple onChange={handleImageUpload} />
        <div className={s.previewGroup}>
          {previewImages.map((img, index) => (
            <div key={index} className={s.previewItem}>
              <img src={img.url} alt={`image-${index}`} className={s.previewImage} />
              <button className={s.deleteBtn} onClick={() => handleRemoveImage(index)}>
                Видалити
              </button>
            </div>
          ))}
        </div>
      </div>

      <div className={s.actions}>
        <Button label={hero ? 'Оновити' : 'Створити'} onClick={handleSubmit} />
      </div>
    </section>
  );
};

export default AdminHeroSection;
