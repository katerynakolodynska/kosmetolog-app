import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { loginAdmin } from '../../../redux/admin/adminOperations';
import { selectAdminError, selectAdminLoading } from '../../../redux/admin/adminSelectors';
import s from './AdminLogin.module.css';

const AdminLogin = () => {
  const [login, setLogin] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const error = useSelector(selectAdminError);
  const loading = useSelector(selectAdminLoading);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const result = await dispatch(loginAdmin({ login, password }));
    if (result.meta.requestStatus === 'fulfilled') {
      navigate('/admin');
    }
  };

  return (
    <form onSubmit={handleSubmit} className={s.loginForm}>
      <h2 className={s.title}>🔐 Вхід для адміністратора</h2>
      <input value={login} onChange={(e) => setLogin(e.target.value)} placeholder="Логін" className={s.input} />
      <input
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        placeholder="Пароль"
        className={s.input}
      />
      <button type="submit" disabled={loading} className={s.loginBtn}>
        {loading ? 'Зачекайте...' : 'Увійти'}
      </button>
      {error && <p className={s.error}>{error}</p>}
    </form>
  );
};

export default AdminLogin;
