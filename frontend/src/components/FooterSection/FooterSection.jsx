import React, { useEffect } from 'react';
import {
  FaPhone,
  FaEnvelope,
  FaMapMarkerAlt,
  FaTelegramPlane,
  FaWhatsapp,
  FaViber,
  FaFacebookF,
  FaInstagram,
} from 'react-icons/fa';
import { useTranslation } from 'react-i18next';
import s from './FooterSection.module.css';
import { Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { fetchContact } from '../../redux/contact/contactOperation';
import { selectContactInfo, selectContactLoading } from '../../redux/contact/contactSelectors';

const FooterSection = () => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const contact = useSelector(selectContactInfo);
  const loading = useSelector(selectContactLoading);

  useEffect(() => {
    dispatch(fetchContact());
  }, [dispatch]);

  if (loading || !contact) return null;

  return (
    <footer className={s.footer}>
      <div className={s.footerGrid}>
        <div className={s.left}>
          <nav className={s.navLinks}>
            <Link to="/">{t('home')}</Link>
            <Link to="/services">{t('services')}</Link>
            <Link to="/gallery">{t('gallery')}</Link>
            <Link to="/opinion">{t('opinie')}</Link>
            <Link to="/booking">{t('booking')}</Link>
            <Link to="/contact">{t('contact')}</Link>
          </nav>
        </div>

        <div className={s.center}>
          <div className={s.contacts}>
            <p className={s.par}>
              <FaMapMarkerAlt /> {t('address')}:{' '}
              <a href={contact.mapsLink} target="_blank" rel="noopener noreferrer">
                {contact.address}
              </a>
            </p>
            <p className={s.par}>
              <FaPhone /> {t('phone')}: <a href={`tel:${contact.phone}`}>{contact.phone}</a>
            </p>
            <p className={s.par}>
              <FaEnvelope /> Email: <a href={`mailto:${contact.email}`}>{contact.email}</a>
            </p>
          </div>
        </div>

        <div className={s.right}>
          <div className={s.logo}>
            <img src="/app.svg" alt="Logo" className={s.logoIcon} />
            <span>Kosmetolog Nataliia</span>
          </div>

          <div className={s.socials}>
            {contact.socialLinks.telegram && (
              <a href={contact.socialLinks.telegram} target="_blank" rel="noreferrer">
                <FaTelegramPlane />
              </a>
            )}
            {contact.socialLinks.whatsapp && (
              <a href={contact.socialLinks.whatsapp} target="_blank" rel="noreferrer">
                <FaWhatsapp />
              </a>
            )}
            {contact.socialLinks.viber && (
              <a href={contact.socialLinks.viber} target="_blank" rel="noreferrer">
                <FaViber />
              </a>
            )}
            {contact.socialLinks.instagram && (
              <a href={contact.socialLinks.instagram} target="_blank" rel="noreferrer">
                <FaInstagram />
              </a>
            )}
            {contact.socialLinks.facebook && (
              <a href={contact.socialLinks.facebook} target="_blank" rel="noreferrer">
                <FaFacebookF />
              </a>
            )}
          </div>
        </div>
      </div>

      <div className={s.bottom}>
        <p>
          &copy; {new Date().getFullYear()} Kosmetolog Nataliia. {t('allRightsReserved')}.
        </p>
      </div>
    </footer>
  );
};

export default FooterSection;
