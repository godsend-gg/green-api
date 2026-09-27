import { FiLock } from 'react-icons/fi';
import LoginForm from './components/login-form';
import './login-page.scss';

const LoginPage = () => (
  <main className="login-page">
    <section className="login-card" aria-labelledby="login-title">
      <div className="brand-mark">M</div>
      <p className="eyebrow">GREEN-API · MAX</p>
      <h1 id="login-title">Ваши сообщения — в одном окне</h1>
      <p className="login-card__hint">Введите реквизиты инстанса из личного кабинета GREEN-API.</p>
      <LoginForm />
      <p className="security-note">
        <FiLock aria-hidden="true" /> Данные хранятся только в вашем браузере.
      </p>
    </section>
  </main>
);

export default LoginPage;
