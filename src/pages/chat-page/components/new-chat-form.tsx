import { FormEvent, useState } from 'react';
import { FiPlus } from 'react-icons/fi';
import { toast } from 'react-toastify';
import { useAppDispatch } from '../../../hooks/hooks';
import { addChat } from '../store/chat-slice';

const Form = () => {
  const dispatch = useAppDispatch();
  const [phoneNumber, setPhoneNumber] = useState('');

  const submit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const chatId = phoneNumber.replace(/\D/g, '');
    if (chatId.length < 5) {
      toast.error('Введите номер в международном формате, минимум 5 цифр.');
      return;
    }
    dispatch(addChat(chatId));
    setPhoneNumber('');
  };

  return (
    <form className="new-chat-form" onSubmit={submit}>
      <label htmlFor="phoneNumber">Новый чат</label>
      <div className="new-chat-form__row">
        <input
          id="phoneNumber"
          type="tel"
          value={phoneNumber}
          onChange={(event) => setPhoneNumber(event.target.value)}
          inputMode="tel"
          placeholder="Номер получателя"
          aria-describedby="phone-help"
        />
        <button type="submit" aria-label="Создать чат">
          <FiPlus aria-hidden="true" />
        </button>
      </div>
      <small id="phone-help">Только цифры, с кодом страны</small>
    </form>
  );
};

export default Form;
