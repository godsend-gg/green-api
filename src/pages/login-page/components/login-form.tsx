import { FormEvent, useEffect, useRef, useState } from 'react';
import { FiAlertCircle, FiArrowRight } from 'react-icons/fi';
import { useNavigate } from 'react-router-dom';
import {
  Credentials,
  getGreenApiErrorMessage,
  useLazyGetStateQuery,
} from '../../../api/green-api-service';
import { useAppDispatch } from '../../../hooks/hooks';
import { setAuth } from '../store/user-slice';
import { setLocalStorageUserData } from '../utils/auth-storage';
import routes from '../../../utils/routes';

const LoginForm = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const apiUrlRef = useRef<HTMLInputElement>(null);
  const idRef = useRef<HTMLInputElement>(null);
  const tokenRef = useRef<HTMLInputElement>(null);
  const [authError, setAuthError] = useState<string | null>(null);
  const [getState, { isFetching: isSubmitting }] = useLazyGetStateQuery();

  useEffect(() => idRef.current?.focus(), []);

  const signIn = async (credentials: Credentials) => {
    setAuthError(null);

    try {
      const state = await getState(credentials).unwrap();
      if (state !== 'authorized') {
        setAuthError(
          `Инстанс не авторизован (${state}). Проверьте его статус в личном кабинете GREEN-API.`,
        );
        return;
      }

      setLocalStorageUserData(credentials);
      dispatch(setAuth(credentials));
      navigate(routes.defaultPath());
    } catch (error) {
      setAuthError(`${getGreenApiErrorMessage(error)}. Проверьте idInstance и apiTokenInstance.`);
    }
  };

  const submit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const apiUrl = apiUrlRef.current?.value.trim() || '';
    const id = idRef.current?.value.trim() || '';
    const token = tokenRef.current?.value.trim() || '';
    if (!apiUrl || !id || !token) return;

    try {
      await signIn({ apiUrl: new URL(apiUrl).origin, id, token });
    } catch {
      setAuthError('Введите корректный адрес API, например https://3100.api.green-api.com.');
    }
  };

  return (
    <form className="login-form" onSubmit={submit}>
      <label htmlFor="api-url">apiUrl</label>
      <input
        id="api-url"
        ref={apiUrlRef}
        defaultValue="https://api.green-api.com"
        onInput={() => setAuthError(null)}
        type="url"
        autoComplete="url"
        placeholder="https://3100.api.green-api.com"
        className={authError ? 'login-form__input--error' : ''}
        required
      />
      <label htmlFor="instance-id">idInstance</label>
      <input
        id="instance-id"
        ref={idRef}
        onInput={() => setAuthError(null)}
        autoComplete="username"
        inputMode="numeric"
        placeholder="Например, 1101000001"
        className={authError ? 'login-form__input--error' : ''}
        required
      />
      <label htmlFor="instance-token">apiTokenInstance</label>
      <input
        id="instance-token"
        ref={tokenRef}
        onInput={() => setAuthError(null)}
        type="password"
        autoComplete="current-password"
        placeholder="Введите токен"
        className={authError ? 'login-form__input--error' : ''}
        required
      />
      {authError && (
        <div className="login-form__error" role="alert" aria-live="assertive">
          <FiAlertCircle aria-hidden="true" />
          <span>{authError}</span>
        </div>
      )}
      <button className="primary-button" type="submit" disabled={isSubmitting}>
        {isSubmitting ? 'Проверяем доступ…' : 'Продолжить'} <FiArrowRight aria-hidden="true" />
      </button>
    </form>
  );
};

export default LoginForm;
