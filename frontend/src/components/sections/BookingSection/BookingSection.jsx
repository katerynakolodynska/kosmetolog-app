import React, { useCallback, useEffect, useState } from 'react';
import { format, addDays, startOfWeek, isBefore } from 'date-fns';
import { useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';

import s from './BookingSection.module.css';
import BookingForm from '../../booking/BookingForm/BookingForm';
import WeekNavigation from '../../booking/WeekNavigation/WeekNavigation';
import TimeSelector from '../../booking/TimeSelctor/TimeSelctor';
import WeekDays from '../../booking/WeekDays/WeekDays';
import { usePhoneInput } from '../../../hooks/usePhoneInput';
import Button from '../../shared/Button/Button';

import { createBooking } from '../../../redux/bookings/bookingsOperations';
import { getAllServices } from '../../../redux/services/servicesOperations';
import { getAllSpecialists } from '../../../redux/specialists/specialistsOperations';
import { selectServices } from '../../../redux/services/servicesSelectors';
import { selectSpecialists } from '../../../redux/specialists/specialistsSelectors';
import { fetchContact } from '../../../redux/contact/contactOperation';
import { selectContactInfo } from '../../../redux/contact/contactSelectors';
import { fetchBusyTimes } from '../../../api/busyTimesApi';

const generateTimes = () => {
  const times = [];
  for (let h = 9; h <= 18; h++) {
    times.push(`${String(h).padStart(2, '0')}:00`);
  }
  return times;
};

const getInitialWeekStart = () => {
  const now = new Date();
  const todayDay = now.getDay();
  const futureTimes = generateTimes().filter((time) => {
    const [h, m] = time.split(':').map(Number);
    const t = new Date();
    t.setHours(h, m, 0, 0);
    return t > now;
  });
  const isSaturdayEvening = todayDay === 6 && futureTimes.length === 0;
  return isSaturdayEvening ? startOfWeek(addDays(now, 7), { weekStartsOn: 1 }) : startOfWeek(now, { weekStartsOn: 1 });
};

const BookingSection = () => {
  const { t } = useTranslation();
  const location = useLocation();
  const dispatch = useDispatch();

  const queryParams = new URLSearchParams(location.search);
  const preselectedService = queryParams.get('service');

  const services = useSelector(selectServices);
  const specialists = useSelector(selectSpecialists);
  const contact = useSelector(selectContactInfo);

  const [isLoaded, setIsLoaded] = useState(false);
  const [hasAnimated, setHasAnimated] = useState(false);
  const [selectedService, setSelectedService] = useState('');
  const [selectedSpecialist, setSelectedSpecialist] = useState('');
  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedTime, setSelectedTime] = useState('');
  const [availableTimes, setAvailableTimes] = useState([]);
  const [busyTimes, setBusyTimes] = useState([]);
  const [currentWeekStart, setCurrentWeekStart] = useState(getInitialWeekStart);

  const [name, setName] = useState('');
  const [comment, setComment] = useState('');
  const [formError, setFormError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [phone, handlePhoneChange, setPhone] = usePhoneInput('+48');

  useEffect(() => {
    const loadData = async () => {
      await dispatch(getAllServices());
      await dispatch(getAllSpecialists());
      await dispatch(fetchContact());
      setAvailableTimes(generateTimes());
      setIsLoaded(true);
      setTimeout(() => {
        setHasAnimated(true);
      }, 100);
    };
    loadData();
  }, [dispatch]);

  useEffect(() => {
    if (preselectedService && services.length > 0) {
      const exists = services.find((s) => s._id === preselectedService);
      if (exists) {
        setSelectedService(preselectedService);
      }
    }
  }, [preselectedService, services]);

  const getWeekDays = useCallback((startDate) => {
    return Array.from({ length: 7 }, (_, i) => addDays(startDate, i));
  }, []);
  const weekDays = getWeekDays(currentWeekStart);

  const nextWeek = () => setCurrentWeekStart((prev) => addDays(prev, 7));
  const prevWeek = () => {
    const today = new Date();
    const prev = addDays(currentWeekStart, -7);
    if (!isBefore(prev, startOfWeek(today, { weekStartsOn: 1 }))) {
      setCurrentWeekStart(prev);
    }
  };

  useEffect(() => {
    const loadBusyTimes = async () => {
      if (selectedDate) {
        try {
          const times = await fetchBusyTimes(selectedDate);
          setBusyTimes(times);
        } catch (err) {
          console.error('Помилка завантаження зайнятих годин:', err);
        }
      }
    };
    loadBusyTimes();
  }, [selectedDate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormError('');
    setSuccessMessage('');

    if (!selectedService || !selectedDate || !selectedTime || !name || !phone) {
      setFormError(t('pleaseFillAllRequiredFields'));
      return;
    }

    if (!/\+48 \d{3}-\d{3}-\d{3}/.test(phone)) {
      setFormError(t('pleaseEnterValidPhoneNumber'));
      return;
    }

    const body = {
      name,
      phone,
      service: selectedService,
      date: selectedDate,
      time: selectedTime,
      comment,
      specialistId: selectedSpecialist,
    };

    const res = await dispatch(createBooking(body));

    if (res.meta.requestStatus === 'rejected') {
      const errorKey = res.payload;
      const translatedError = t(errorKey) || t('bookingError');
      setFormError(translatedError);
      return;
    }

    setSuccessMessage(t('bookingConfirmedSuccess'));
    setTimeout(() => setSuccessMessage(''), 4000);

    setSelectedService('');
    setSelectedSpecialist('');
    setSelectedDate(null);
    setSelectedTime('');
    setName('');
    setPhone('+48 ');
    setComment('');
    setBusyTimes([]);
  };

  if (!isLoaded || !services.length || !specialists.length || !contact) return null;

  return (
    <section
      className={`${s.booking} container ${hasAnimated ? s.animated : ''}`}
      style={{ visibility: isLoaded ? 'visible' : 'hidden' }}
    >
      <h2 className={s.heading}>{t('booking')}</h2>

      <form className={s.formWrapper} onSubmit={handleSubmit}>
        <BookingForm
          selectedService={selectedService}
          setSelectedService={setSelectedService}
          selectedSpecialist={selectedSpecialist}
          setSelectedSpecialist={setSelectedSpecialist}
          selectedDate={selectedDate}
          selectedTime={selectedTime}
          name={name}
          setName={setName}
          phone={phone}
          setPhone={setPhone}
          comment={comment}
          setComment={setComment}
          handlePhoneChange={handlePhoneChange}
          formError={formError}
          successMessage={successMessage}
          services={services}
          specialists={specialists}
          bookings={busyTimes.map((b) => ({
            date: b.date,
            time: b.time,
            specialist: String(b.specialistId),
          }))}
        />

        <WeekNavigation currentWeekStart={currentWeekStart} onPrevWeek={prevWeek} onNextWeek={nextWeek} />

        <WeekDays
          weekDays={weekDays}
          availableTimes={availableTimes}
          selectedDate={selectedDate}
          setSelectedDate={setSelectedDate}
          setSelectedTime={setSelectedTime}
          setFormError={setFormError}
          contact={contact}
          selectedSpecialist={selectedSpecialist}
          specialists={specialists}
        />

        {selectedDate && (
          <TimeSelector
            selectedDate={selectedDate}
            availableTimes={availableTimes}
            selectedTime={selectedTime}
            setSelectedTime={setSelectedTime}
            setFormError={setFormError}
            busyTimes={busyTimes}
            selectedSpecialist={selectedSpecialist}
            specialists={specialists}
            contact={contact}
          />
        )}

        <div className={s.buttonWrapper}>
          <Button type="submit" label={t('confirm')} />
        </div>
      </form>
    </section>
  );
};

export default BookingSection;
