import i18n from '../i18n';

export const getSpecialistStatus = (spec) => {
  const now = new Date();
  const { t } = i18n;

  if (spec.vacation?.isOnVacation && spec.vacation.from && spec.vacation.to) {
    const from = new Date(spec.vacation.from);
    const to = new Date(spec.vacation.to);
    if (now >= from && now <= to) return t('status.vacationUntil', { date: to.toLocaleDateString() });
  }

  if (spec.sickLeave?.isOnSickLeave && spec.sickLeave.from && spec.sickLeave.to) {
    const from = new Date(spec.sickLeave.from);
    const to = new Date(spec.sickLeave.to);
    if (now >= from && now <= to) return t('status.sickUntil', { date: to.toLocaleDateString() });
  }

  return spec.isActive ? t('status.active') : t('status.blocked');
};
