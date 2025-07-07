import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getAllServices, deleteService } from '../../../redux/services/servicesOperations';
import { getAllSpecialists } from '../../../redux/specialists/specialistsOperations';
import { selectServices } from '../../../redux/services/servicesSelectors';
import ServiceForm from '../ServiceForm/ServiceForm';
import s from './AdminServices.module.css';

const categories = ['all', 'cleaning', 'massage', 'injection'];

const AdminServices = () => {
  const dispatch = useDispatch();
  const services = useSelector(selectServices);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [serviceToEdit, setServiceToEdit] = useState(null);
  const [specialists, setSpecialists] = useState([]);

  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedSpecialist, setSelectedSpecialist] = useState('all');

  useEffect(() => {
    dispatch(getAllServices());
    dispatch(getAllSpecialists()).unwrap().then(setSpecialists).catch(console.error);
  }, [dispatch]);

  const handleAddNew = () => {
    setServiceToEdit(null);
    setIsFormOpen(true);
  };

  const handleEdit = (service) => {
    setServiceToEdit(service);
    setIsFormOpen(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Ви впевнені, що хочете видалити послугу?')) {
      await dispatch(deleteService(id));
      await dispatch(getAllServices()); // 🟢 оновлення після видалення
    }
  };

  const handleFormClose = async () => {
    setIsFormOpen(false);
    setServiceToEdit(null);
    await dispatch(getAllServices()); // 🟢 оновлення після редагування/створення
  };

  // 🔎 Фільтрація
  const filteredServices = services.filter((service) => {
    const byCategory = selectedCategory === 'all' || service.category === selectedCategory;
    const bySpecialist =
      selectedSpecialist === 'all' ||
      (Array.isArray(service.specialists) && service.specialists.some((s) => s?._id === selectedSpecialist));
    return byCategory && bySpecialist;
  });

  return (
    <div className={s.container}>
      <h1 className={s.title}>Управління послугами</h1>

      <div className={s.filters}>
        <select value={selectedCategory} onChange={(e) => setSelectedCategory(e.target.value)}>
          <option value="all">Усі категорії</option>
          {categories
            .filter((cat) => cat !== 'all')
            .map((cat) => (
              <option key={cat} value={cat}>
                {cat}
              </option>
            ))}
        </select>

        <select value={selectedSpecialist} onChange={(e) => setSelectedSpecialist(e.target.value)}>
          <option value="all">Усі спеціалісти</option>
          {specialists.map((spec) => (
            <option key={spec._id} value={spec._id}>
              {spec.name}
            </option>
          ))}
        </select>

        <button onClick={handleAddNew} className={s.addBtn}>
          + Додати послугу
        </button>
      </div>

      {isFormOpen && (
        <div className={s.formOverlay} onClick={handleFormClose}>
          <div className={s.formWrapper} onClick={(e) => e.stopPropagation()}>
            <button className={s.closeBtn} onClick={handleFormClose}>
              ×
            </button>
            <ServiceForm onClose={handleFormClose} onSaveSuccess={handleFormClose} serviceToEdit={serviceToEdit} />
          </div>
        </div>
      )}

      <ul className={s.list}>
        {filteredServices.map((service) => (
          <li key={service._id} className={s.card}>
            <h3>{service.title?.pl}</h3>
            <p>
              <strong>Опис:</strong> {service.description?.pl}
            </p>
            <p>
              <strong>Ціна:</strong> {service.price} zł
            </p>
            <p>
              <strong>Тривалість:</strong> {service.duration} хв
            </p>
            <p>
              <strong>Категорія:</strong> {service.category || '—'}
            </p>
            <p>
              <strong>Спеціалісти:</strong>{' '}
              {Array.isArray(service.specialists) && service.specialists.length > 0
                ? service.specialists
                    .map((s) => s?.name)
                    .filter(Boolean)
                    .join(', ')
                : '—'}
            </p>

            <div className={s.actions}>
              <button onClick={() => handleEdit(service)}>Редагувати</button>
              <button onClick={() => handleDelete(service._id)}>Видалити</button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default AdminServices;
