import { useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import {
  createSpecialist,
  updateSpecialist,
  getAllSpecialists,
} from '../../../redux/specialists/specialistsOperations.js';
import { usePhoneInput } from '../../../hooks/usePhoneInput';
import s from './SpecialistForm.module.css';
import UniversalModal from '../UniversalModal/UniversalModal.jsx';

const initialDescription = { pl: '', uk: '', en: '' };
const categoriesList = ['cleaning', 'massage', 'injection'];

const SpecialistForm = ({ onClose, specialistToEdit = null, onSaveSuccess }) => {
  const dispatch = useDispatch();
  const [phone, handlePhoneChange, setPhone] = usePhoneInput();
  const [preview, setPreview] = useState(null);
  const [removePhoto, setRemovePhoto] = useState(false);

  const [formData, setFormData] = useState({
    name: '',
    categories: [],
    availability: '',
    description: initialDescription,
    photo: null,
    isActive: true,
    vacation: { from: '', to: '' },
    sickLeave: { from: '', to: '' },
  });

  useEffect(() => {
    if (specialistToEdit) {
      setFormData({
        name: specialistToEdit.name || '',
        categories: specialistToEdit.categories || [],
        availability: specialistToEdit.availability?.join(', ') || '',
        description: specialistToEdit.description || initialDescription,
        photo: null,
        isActive: specialistToEdit.isActive ?? true,
        vacation: {
          from: specialistToEdit.vacation?.from?.slice(0, 10) || '',
          to: specialistToEdit.vacation?.to?.slice(0, 10) || '',
        },
        sickLeave: {
          from: specialistToEdit.sickLeave?.from?.slice(0, 10) || '',
          to: specialistToEdit.sickLeave?.to?.slice(0, 10) || '',
        },
      });
      setPhone(specialistToEdit.phone || '+48');
      setPreview(specialistToEdit.photo || null);
    } else {
      setFormData({
        name: '',
        categories: [],
        availability: '',
        description: initialDescription,
        photo: null,
        isActive: true,
        vacation: { from: '', to: '' },
        sickLeave: { from: '', to: '' },
      });
      setPhone('+48');
      setPreview(null);
    }
    setRemovePhoto(false);
  }, [specialistToEdit, setPhone]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name.startsWith('description.')) {
      const lang = name.split('.')[1];
      setFormData((prev) => ({
        ...prev,
        description: { ...prev.description, [lang]: value },
      }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleCheckboxChange = (e) => {
    const { value, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      categories: checked ? [...prev.categories, value] : prev.categories.filter((c) => c !== value),
    }));
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData((prev) => ({ ...prev, photo: file }));
      setPreview(URL.createObjectURL(file));
      setRemovePhoto(false);
    }
  };

  const handleRemovePhoto = () => {
    setFormData((prev) => ({ ...prev, photo: null }));
    setPreview(null);
    setRemovePhoto(true);
  };

  const handleToggleActive = (e) => {
    setFormData((prev) => ({ ...prev, isActive: e.target.checked }));
  };

  const handleDateChange = (section, field, value) => {
    setFormData((prev) => ({
      ...prev,
      [section]: { ...prev[section], [field]: value },
    }));
  };

  const formatDateRange = (from, to, flagName) => ({
    [flagName]: Boolean(from && to),
    from: from || null,
    to: to || null,
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.categories.length) {
      alert('Оберіть хоча б одну категорію');
      return;
    }

    const fd = new FormData();
    fd.append('name', formData.name);
    fd.append('phone', phone);
    fd.append('categories', JSON.stringify(formData.categories));
    fd.append(
      'availability',
      JSON.stringify(
        formData.availability
          .split(',')
          .map((s) => s.trim())
          .filter(Boolean)
      )
    );
    fd.append('isActive', formData.isActive);
    fd.append('description', JSON.stringify(formData.description));
    fd.append(
      'vacation',
      JSON.stringify(formatDateRange(formData.vacation.from, formData.vacation.to, 'isOnVacation'))
    );
    fd.append(
      'sickLeave',
      JSON.stringify(formatDateRange(formData.sickLeave.from, formData.sickLeave.to, 'isOnSickLeave'))
    );

    if (formData.photo) fd.append('photo', formData.photo);
    if (removePhoto) fd.append('removePhoto', 'true');

    try {
      if (specialistToEdit) {
        await dispatch(updateSpecialist({ id: specialistToEdit._id, body: fd })).unwrap();
      } else {
        await dispatch(createSpecialist(fd)).unwrap();
      }

      if (onSaveSuccess) onSaveSuccess();
      await dispatch(getAllSpecialists());
      onClose();
    } catch (err) {
      console.error('❌ Error saving specialist:', err);
      alert('Помилка при збереженні спеціаліста');
    }
  };

  return (
    <UniversalModal title={specialistToEdit ? 'Редагувати спеціаліста' : 'Новий спеціаліст'} onClose={onClose}>
      <form onSubmit={handleSubmit} className={s.formContainer}>
        <div className={s.formGroup}>
          <label>Ім’я</label>
          <input name="name" value={formData.name} onChange={handleChange} required />
        </div>

        <div className={s.formGroup}>
          <label>Телефон</label>
          <input name="phone" value={phone} onChange={handlePhoneChange} required />
        </div>

        <div className={s.formGroup}>
          <label>Категорії послуг</label>
          <div className={s.checkboxGroup}>
            {categoriesList.map((cat) => (
              <label key={cat}>
                <input
                  type="checkbox"
                  value={cat}
                  checked={formData.categories.includes(cat)}
                  onChange={handleCheckboxChange}
                />
                {cat}
              </label>
            ))}
          </div>
        </div>

        <div className={s.formGroup}>
          <label>Графік роботи (через кому)</label>
          <input name="availability" value={formData.availability} onChange={handleChange} required />
        </div>

        <div className={s.formGroup}>
          <label>Опис (PL)</label>
          <input name="description.pl" value={formData.description.pl} onChange={handleChange} />
        </div>
        <div className={s.formGroup}>
          <label>Опис (UA)</label>
          <input name="description.uk" value={formData.description.uk} onChange={handleChange} />
        </div>
        <div className={s.formGroup}>
          <label>Опис (EN)</label>
          <input name="description.en" value={formData.description.en} onChange={handleChange} />
        </div>

        <div className={s.formGroup}>
          <label>Фото спеціаліста</label>
          <input type="file" accept="image/*" onChange={handleFileChange} />
          {preview && (
            <div className={s.previewBlock}>
              <img src={preview} alt="Фото спеціаліста" className={s.previewImage} />
              <button type="button" onClick={handleRemovePhoto} className={s.deletePhotoBtn}>
                Видалити фото
              </button>
            </div>
          )}
        </div>

        <div className={s.formGroup}>
          <label>Відпустка</label>
          <input
            type="date"
            value={formData.vacation.from}
            onChange={(e) => handleDateChange('vacation', 'from', e.target.value)}
          />
          <input
            type="date"
            value={formData.vacation.to}
            onChange={(e) => handleDateChange('vacation', 'to', e.target.value)}
          />
        </div>

        <div className={s.formGroup}>
          <label>Лікарняний</label>
          <input
            type="date"
            value={formData.sickLeave.from}
            onChange={(e) => handleDateChange('sickLeave', 'from', e.target.value)}
          />
          <input
            type="date"
            value={formData.sickLeave.to}
            onChange={(e) => handleDateChange('sickLeave', 'to', e.target.value)}
          />
        </div>

        <div className={s.formGroup}>
          <label className={s.switchLabel}>
            <input
              type="checkbox"
              checked={formData.isActive}
              onChange={handleToggleActive}
              className={s.switchInput}
            />
            <span>{formData.isActive ? 'Активний' : 'Заблокований'}</span>
          </label>
        </div>

        <div className={s.formActions}>
          <button type="submit">{specialistToEdit ? 'Зберегти' : 'Додати'}</button>
          <button type="button" onClick={onClose}>
            Скасувати
          </button>
        </div>
      </form>
    </UniversalModal>
  );
};

export default SpecialistForm;
