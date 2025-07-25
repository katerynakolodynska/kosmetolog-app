export const isSpecialistUnavailableOnDate = (spec, date) => {
  if (!spec) return false;
  if (!spec.isActive) return true;
  return isSpecialistOnVacationOrSickLeave(spec, date);
};

export const isSpecialistOnVacationOrSickLeave = (spec, date) => {
  if (!spec) return false;
  const day = new Date(date);
  day.setHours(0, 0, 0, 0);

  const parse = (d) => new Date(new Date(d).setHours(0, 0, 0, 0));

  const isOnVacation =
    spec.vacation?.isOnVacation && day >= parse(spec.vacation.from) && day <= parse(spec.vacation.to);

  const isOnSickLeave =
    spec.sickLeave?.isOnSickLeave && day >= parse(spec.sickLeave.from) && day <= parse(spec.sickLeave.to);

  return isOnVacation || isOnSickLeave;
};

import i18n from '../i18n';

export const getSpecialistStatus = (spec) => {
  const now = new Date();
  const { t } = i18n;

  const formatDate = (d) =>
    new Intl.DateTimeFormat(i18n.language, { day: '2-digit', month: '2-digit', year: 'numeric' }).format(new Date(d));

  if (spec.vacation?.isOnVacation && now >= new Date(spec.vacation.from) && now <= new Date(spec.vacation.to)) {
    return t('status.vacationUntil', { date: formatDate(spec.vacation.to) });
  }

  if (spec.sickLeave?.isOnSickLeave && now >= new Date(spec.sickLeave.from) && now <= new Date(spec.sickLeave.to)) {
    return t('status.sickUntil', { date: formatDate(spec.sickLeave.to) });
  }

  return spec.isActive ? t('status.active') : t('status.blocked');
};
