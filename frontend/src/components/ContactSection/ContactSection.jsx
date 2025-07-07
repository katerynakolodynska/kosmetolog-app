import React, { useEffect } from 'react';
import s from './ContactSection.module.css';
import {
  FaPhone,
  FaEnvelope,
  FaInstagram,
  FaFacebookF,
  FaMapMarkerAlt,
  FaClock,
  FaTelegramPlane,
  FaWhatsapp,
  FaViber,
} from 'react-icons/fa';
import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';
import Button from '../Button/Button';
import { fetchContact } from '../../redux/contact/contactOperation';
import { selectContactInfo, selectContactLoading } from '../../redux/contact/contactSelectors';
import { formatWorkingHours } from '../../utils/formatWorkingHours';

const ContactSection = () => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const contact = useSelector(selectContactInfo);
  const loading = useSelector(selectContactLoading);

  useEffect(() => {
    dispatch(fetchContact());
  }, [dispatch]);

  if (loading || !contact) return null;

  return (
    <section className={s.contactSection}>
      <h2 className={s.title}>{t('contact')}</h2>

      <div className={s.grid}>
        <div className={s.infoBlock}>
          <p>
            <FaMapMarkerAlt /> {t('address')}:{' '}
            <a href={contact.mapsLink} target="_blank" rel="noopener noreferrer">
              {contact.address}
            </a>
          </p>
          <p>
            <FaPhone /> {t('phone')}: <a href={`tel:${contact.phone}`}>{contact.phone}</a>
          </p>
          <p>
            <FaEnvelope /> Email: <a href={`mailto:${contact.email}`}>{contact.email}</a>
          </p>

          {Object.entries(contact.socialLinks).map(([key, url]) =>
            url ? (
              <p key={key}>
                {key === 'telegram' && <FaTelegramPlane />}
                {key === 'whatsapp' && <FaWhatsapp />}
                {key === 'viber' && <FaViber />}
                {key === 'instagram' && <FaInstagram />}
                {key === 'facebook' && <FaFacebookF />}
                <a href={url} target="_blank" rel="noreferrer">
                  {' '}
                  {key}{' '}
                </a>
              </p>
            ) : null
          )}

          <p>
            <FaClock /> {t('hours')}:
          </p>
          <ul className={s.hoursList}>
            {formatWorkingHours(contact.workHour).map((line, i) => (
              <li key={i}>{line}</li>
            ))}
          </ul>

          <div className={s.ctaWrapper}>
            <Button label={t('book')} />
          </div>
        </div>
      </div>
    </section>
  );
};

export default ContactSection;
