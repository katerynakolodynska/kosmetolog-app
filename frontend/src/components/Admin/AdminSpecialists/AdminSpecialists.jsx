import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  getAllSpecialists,
  deleteSpecialist,
  toggleSpecialistStatus,
} from '../../../redux/specialists/specialistsOperations.js';
import { selectSpecialists, selectSpecialistsLoading } from '../../../redux/specialists/specialistsSelectors.js';
import SpecialistForm from '../modal/SpecialistForm/SpecialistForm.jsx';
import { getSpecialistStatus } from '../../../utils/getSpecialistStatus.js';
import s from './AdminSpecialists.module.css';

const AdminSpecialists = () => {
  const dispatch = useDispatch();
  const specialists = useSelector(selectSpecialists);
  const isLoading = useSelector(selectSpecialistsLoading);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [specialistToEdit, setSpecialistToEdit] = useState(null);

  useEffect(() => {
    dispatch(getAllSpecialists());
  }, [dispatch]);

  const handleEdit = (specialist) => {
    setSpecialistToEdit(specialist);
    setIsFormOpen(true);
  };

  const handleDelete = (id) => {
    if (window.confirm('Ви впевнені, що хочете видалити спеціаліста?')) {
      dispatch(deleteSpecialist(id));
    }
  };

  const handleAddNew = () => {
    setSpecialistToEdit(null);
    setIsFormOpen(true);
  };

  const handleToggleActive = (id, isActive) => {
    dispatch(toggleSpecialistStatus({ id, isActive: !isActive }));
  };

  return (
    <div className={s.container}>
      <h1 className={s.title}>Управління спеціалістами</h1>
      <button onClick={handleAddNew} className={s.addBtn}>
        + Додати спеціаліста
      </button>

      {isFormOpen && (
        <div className={s.formOverlay} onClick={() => setIsFormOpen(false)}>
          <div className={s.formWrapper} onClick={(e) => e.stopPropagation()}>
            <button className={s.closeBtn} onClick={() => setIsFormOpen(false)}>
              ×
            </button>
            <SpecialistForm
              specialistToEdit={specialistToEdit}
              onClose={() => setIsFormOpen(false)}
              onSaveSuccess={() => dispatch(getAllSpecialists())}
            />
          </div>
        </div>
      )}

      {isLoading ? (
        <p>Завантаження...</p>
      ) : (
        <ul className={s.list}>
          {specialists.map((spec) => (
            <li key={spec._id} className={s.card}>
              {spec.photo && <img src={spec.photo} alt={spec.name} className={s.photo} />}
              <div className={s.info}>
                <h3>{spec.name}</h3>
                <p>
                  <strong>Телефон: {''}</strong>{' '}
                  <a href={`tel:${spec.phone}`} className={s.phoneLink}>
                    {spec.phone}
                  </a>
                </p>
                <p>
                  <strong>Категорії: </strong>
                  {spec.categories?.join(', ') || '—'}
                </p>
                <p>
                  <strong>Опис (PL):</strong> {spec.description?.pl || '—'}
                </p>
                <p>
                  <strong>Опис (UA):</strong> {spec.description?.uk || '—'}
                </p>
                <p>
                  <strong>Опис (EN):</strong> {spec.description?.en || '—'}
                </p>

                <p>Графік: {Array.isArray(spec.availability) ? spec.availability.join(', ') : '—'}</p>

                <label className={s.switchLabel}>
                  <input
                    type="checkbox"
                    checked={spec.isActive}
                    onChange={() => handleToggleActive(spec._id, spec.isActive)}
                  />
                  <p>
                    <strong>Статус:</strong> {getSpecialistStatus(spec)}
                  </p>
                </label>
              </div>
              <div className={s.actions}>
                <button onClick={() => handleEdit(spec)}>Редагувати</button>
                <button onClick={() => handleDelete(spec._id)}>Видалити</button>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default AdminSpecialists;
