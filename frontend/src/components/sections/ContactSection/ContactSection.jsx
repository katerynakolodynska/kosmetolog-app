import React, { useEffect, useState } from 'react';
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
import Button from '../../shared/Button/Button';
import { fetchContact } from '../../../redux/contact/contactOperation';
import { selectContactInfo } from '../../../redux/contact/contactSelectors';
import { formatWorkingHours } from '../../../utils/formatWorkingHours';

const ContactSection = () => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const contact = useSelector(selectContactInfo);

  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    const load = async () => {
      await dispatch(fetchContact());
      setIsLoaded(true);
    };
    load();
  }, [dispatch]);

  if (!isLoaded || !contact) return null;

  return (
    <section className={`${s.contactSection} container`}>
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

          <div className={s.socialGrid}>
            {Object.entries(contact.socialLinks).map(([key, url]) =>
              url ? (
                <a
                  key={key}
                  href={url}
                  target="_blank"
                  rel="noreferrer"
                  className={`${s.socialItem} ${s[key]}`}
                  aria-label={key}
                >
                  {key === 'telegram' && <FaTelegramPlane />}
                  {key === 'whatsapp' && <FaWhatsapp />}
                  {key === 'viber' && <FaViber />}
                  {key === 'instagram' && <FaInstagram />}
                  {key === 'facebook' && <FaFacebookF />}
                </a>
              ) : null
            )}
          </div>

          <div className={s.work}>
            <p>
              <FaClock /> {t('hours')}:
            </p>
            <ul className={s.hoursList}>
              {formatWorkingHours(contact.workHour).map((line, i) => (
                <li key={i}>{line}</li>
              ))}
            </ul>
          </div>
          <p className={s.questionText}>{t('haveQuestions')}</p>
          <div className={s.ctaWrapper}>
            <Button label={t('book')} />
          </div>
        </div>
      </div>
    </section>
  );
};

export default ContactSection;
