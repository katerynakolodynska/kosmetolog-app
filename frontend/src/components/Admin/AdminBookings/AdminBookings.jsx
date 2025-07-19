import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getAllBookings, deleteBooking, updateBooking } from '../../../redux/bookings/bookingsOperations';
import { getAllServices } from '../../../redux/services/servicesOperations';
import { getAllSpecialists } from '../../../redux/specialists/specialistsOperations';
import { selectBookings, selectBookingsLoading } from '../../../redux/bookings/bookingsSelectors';
import { selectServices } from '../../../redux/services/servicesSelectors';
import { selectSpecialists } from '../../../redux/specialists/specialistsSelectors';
import BookingTable from '../BookingTable/BookingTable';
import BookingFilters from '../BookingFilters/BookingFilters';
import EditBookingModal from '../modal/EditBookingModal/EditBookingModal';
import BookingSection from '../../sections/BookingSection/BookingSection';
import s from './AdminBookings.module.css';

const AdminBookings = () => {
  const dispatch = useDispatch();
  const bookings = useSelector(selectBookings);
  const isLoading = useSelector(selectBookingsLoading);
  const services = useSelector(selectServices);
  const specialists = useSelector(selectSpecialists);

  const [editingBooking, setEditingBooking] = useState(null);
  const [filterDate, setFilterDate] = useState('');
  const [filterType, setFilterType] = useState('today'); // стартово — сьогодні
  const [filterSpecialist, setFilterSpecialist] = useState('');
  const [phoneSearch, setPhoneSearch] = useState('');
  const [showBookingForm, setShowBookingForm] = useState(false);

  useEffect(() => {
    dispatch(getAllBookings());
    dispatch(getAllServices());
    dispatch(getAllSpecialists());
  }, [dispatch]);

  const handleDelete = async (id) => {
    if (window.confirm('Ви дійсно хочете видалити цей запис?')) {
      await dispatch(deleteBooking(id));
    }
  };

  const handleSaveBooking = async (updatedBooking) => {
    await dispatch(updateBooking(updatedBooking));
    dispatch(getAllBookings());
    setEditingBooking(null);
  };

  const clearFilters = () => {
    setFilterDate('');
    setFilterType('today');
    setFilterSpecialist('');
    setPhoneSearch('');
  };

  const today = new Date().toISOString().split('T')[0];

  const filteredBookings = bookings.filter((b) => {
    const matchPhone = phoneSearch ? b.phone.replace(/\s|-/g, '').includes(phoneSearch.replace(/\s|-/g, '')) : true;

    const matchSpec =
      filterSpecialist && (b.specialistId?._id === filterSpecialist || b.specialistId === filterSpecialist);

    let matchDate = true;

    if (filterDate) {
      matchDate = b.date === filterDate;
    } else if (filterType === 'today') {
      matchDate = b.date === today;
    } else if (filterType === 'past') {
      matchDate = b.date < today;
    } else if (filterType === 'upcoming') {
      matchDate = b.date > today;
    } else if (filterType === 'all') {
      matchDate = true;
    }

    return matchPhone && (filterSpecialist ? matchSpec : true) && matchDate;
  });

  return (
    <section className={`${s.section} container`}>
      <h2 className={s.title}>Записи клієнтів</h2>

      <button className={s.createBtn} onClick={() => setShowBookingForm((prev) => !prev)}>
        {showBookingForm ? 'Сховати форму' : 'Новий запис'}
      </button>

      {showBookingForm && (
        <div className={s.bookingForm}>
          <BookingSection isAdmin={true} onSuccess={() => dispatch(getAllBookings())} className={s.bookings} />
        </div>
      )}

      <BookingFilters
        filterDate={filterDate}
        setFilterDate={setFilterDate}
        filterType={filterType}
        setFilterType={setFilterType}
        filterSpecialist={filterSpecialist}
        setFilterSpecialist={setFilterSpecialist}
        phoneSearch={phoneSearch}
        setPhoneSearch={setPhoneSearch}
        specialists={specialists}
        clearFilters={clearFilters}
      />

      <BookingTable
        bookings={filteredBookings}
        services={services}
        onEdit={setEditingBooking}
        onDelete={handleDelete}
        isLoading={isLoading}
      />

      {editingBooking && (
        <EditBookingModal booking={editingBooking} onClose={() => setEditingBooking(null)} onSave={handleSaveBooking} />
      )}
    </section>
  );
};

export default AdminBookings;
