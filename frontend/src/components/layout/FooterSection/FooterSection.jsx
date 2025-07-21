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
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { fetchContact } from '../../../redux/contact/contactOperation';
import { selectContactInfo, selectContactLoading } from '../../../redux/contact/contactSelectors';
import s from './FooterSection.module.css';

const FooterSection = ({ pageReady = true }) => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const contact = useSelector(selectContactInfo);
  const loading = useSelector(selectContactLoading);

  useEffect(() => {
    dispatch(fetchContact());
  }, [dispatch]);

  if (loading || !contact) return null;

  const { address, phone, email, mapsLink, socialLinks = {} } = contact;

  return (
    <footer className={`${s.footer} ${!pageReady ? s.hidden : ''}`}>
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
            <p>
              <FaMapMarkerAlt /> {t('address')}:{' '}
              <a href={mapsLink} target="_blank" rel="noopener noreferrer">
                {address}
              </a>
            </p>
            <p>
              <FaPhone /> {t('phone')}: <a href={`tel:${phone}`}>{phone}</a>
            </p>
            <p>
              <FaEnvelope /> Email: <a href={`mailto:${email}`}>{email}</a>
            </p>
          </div>
        </div>

        <div className={s.right}>
          <div className={s.logo}>
            <img src="/app.svg" alt="Logo" className={s.logoIcon} />
            <span>Kosmetolog Nataliia</span>
          </div>

          <div className={s.socials}>
            {socialLinks.telegram && (
              <a href={socialLinks.telegram} target="_blank" rel="noreferrer">
                <FaTelegramPlane />
              </a>
            )}
            {socialLinks.whatsapp && (
              <a href={socialLinks.whatsapp} target="_blank" rel="noreferrer">
                <FaWhatsapp />
              </a>
            )}
            {socialLinks.viber && (
              <a href={socialLinks.viber} target="_blank" rel="noreferrer">
                <FaViber />
              </a>
            )}
            {socialLinks.instagram && (
              <a href={socialLinks.instagram} target="_blank" rel="noreferrer">
                <FaInstagram />
              </a>
            )}
            {socialLinks.facebook && (
              <a href={socialLinks.facebook} target="_blank" rel="noreferrer">
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
