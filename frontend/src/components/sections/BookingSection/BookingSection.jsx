import React, { useCallback, useEffect, useState } from 'react';
import { addDays, startOfWeek, isBefore } from 'date-fns';
import { useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';

import s from './BookingSection.module.css';
import BookingForm from '../../booking/BookingForm/BookingForm';
import WeekNavigation from '../../booking/WeekNavigation/WeekNavigation';
import TimeSelector from '../../booking/TimeSelctor/TimeSelctor';
import WeekDays from '../../booking/WeekDays/WeekDays';
import Button from '../../shared/Button/Button';

import { createBooking } from '../../../redux/bookings/bookingsOperations';
import { selectServices } from '../../../redux/services/servicesSelectors';
import { selectSpecialists } from '../../../redux/specialists/specialistsSelectors';
import { selectContactInfo } from '../../../redux/contact/contactSelectors';
import { usePhoneInput } from '../../../hooks/usePhoneInput';
import { fetchBusyTimes } from '../../../api/busyTimesApi';
import { getOccupiedSlots } from '../../../utils/getOccupiedSlots';

const generateTimes = (endHour = 19, duration = 50) => {
  const times = [];
  const maxStart = endHour * 60 - duration;

  for (let h = 9; h <= 18; h++) {
    ['00', '30'].forEach((m) => {
      const totalMinutes = h * 60 + Number(m);
      if (totalMinutes + duration <= endHour * 60) {
        times.push(`${String(h).padStart(2, '0')}:${m}`);
      }
    });
  }
  return times;
};

const getInitialWeekStart = () => {
  const now = new Date();
  const today = now.getDay();
  const futureSlots = generateTimes().filter((time) => {
    const [h, m] = time.split(':').map(Number);
    const date = new Date();
    date.setHours(h, m, 0, 0);
    return date > now;
  });

  const isSaturdayEvening = today === 6 && futureSlots.length === 0;
  return startOfWeek(addDays(now, isSaturdayEvening ? 7 : 0), { weekStartsOn: 1 });
};

const BookingSection = () => {
  const { t } = useTranslation();
  const location = useLocation();
  const dispatch = useDispatch();

  const query = new URLSearchParams(location.search);
  const preselectedService = query.get('service');

  const services = useSelector(selectServices);
  const specialists = useSelector(selectSpecialists);
  const contact = useSelector(selectContactInfo);

  const [selectedService, setSelectedService] = useState('');
  const [selectedSpecialist, setSelectedSpecialist] = useState('');
  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedTime, setSelectedTime] = useState('');
  const [busyTimes, setBusyTimes] = useState([]);
  const [currentWeekStart, setCurrentWeekStart] = useState(getInitialWeekStart);

  const [name, setName] = useState('');
  const [comment, setComment] = useState('');
  const [formError, setFormError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [phone, handlePhoneChange, setPhone] = usePhoneInput('+48');

  const selectedServiceObj = services.find((s) => s._id === selectedService);
  const occupiedSlots = getOccupiedSlots(selectedServiceObj?.duration || 60);
  const availableTimes = generateTimes(19, selectedServiceObj?.duration || 60);

  useEffect(() => {
    if (preselectedService && services.length) {
      const found = services.find((s) => s._id === preselectedService);
      if (found) setSelectedService(preselectedService);
    }
  }, [preselectedService, services]);

  const weekDays = useCallback(
    () => Array.from({ length: 7 }, (_, i) => addDays(currentWeekStart, i)),
    [currentWeekStart]
  )();

  const nextWeek = () => setCurrentWeekStart(addDays(currentWeekStart, 7));
  const prevWeek = () => {
    const prev = addDays(currentWeekStart, -7);
    if (!isBefore(prev, startOfWeek(new Date(), { weekStartsOn: 1 }))) {
      setCurrentWeekStart(prev);
    }
  };

  useEffect(() => {
    if (!selectedDate) return;
    const fetchData = async () => {
      try {
        const times = await fetchBusyTimes(selectedDate);
        setBusyTimes(times);
      } catch (err) {
        console.error('Failed to fetch busy times:', err);
      }
    };
    fetchData();
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

    const result = await dispatch(
      createBooking({
        name,
        phone,
        service: selectedService,
        date: selectedDate,
        time: selectedTime,
        comment,
        specialistId: selectedSpecialist,
        occupiedSlots,
      })
    );

    if (result.meta.requestStatus === 'rejected') {
      const translated = t(result.payload) || t('bookingError');
      setFormError(translated);
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

  return (
    <section className={`${s.booking} container ${s.animated}`}>
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
          setFormError={setFormError}
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
