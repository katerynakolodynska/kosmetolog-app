import { useState } from 'react';

export function usePhoneInput(initial = '+48') {
  const [phone, setPhone] = useState(initial);

  const handlePhoneChange = (e) => {
    let value = e.target.value;
    if (!value.startsWith('+48')) value = '+48';
    let digits = value.replace(/\D/g, '').slice(2, 11);
    let formatted = '+48';
    if (digits.length > 0) formatted += ' ' + digits.slice(0, 3);
    if (digits.length > 3) formatted += '-' + digits.slice(3, 6);
    if (digits.length > 6) formatted += '-' + digits.slice(6, 9);
    setPhone(formatted);
  };

  return [phone, handlePhoneChange, setPhone];
}
