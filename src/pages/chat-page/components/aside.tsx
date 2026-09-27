import { FiLogOut, FiMessageSquare } from 'react-icons/fi';
import { useNavigate } from 'react-router-dom';
import Form from './new-chat-form';
import './aside.scss';
import { useAppDispatch, useAppSelector } from '../../../hooks/hooks';
import { removeAuth } from '../../login-page/store/user-slice';
import { removeLocalStorageData } from '../../login-page/utils/auth-storage';
import routes from '../../../utils/routes';
import { resetChats, setActiveChat } from '../store/chat-slice';
import { selectActiveChatId, selectChatIds } from '../store/chat.selectors';

const displayChatId = (chatId: string) => chatId.replace(/@.+$/, '');

const Aside = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const chatIds = useAppSelector(selectChatIds);
  const activeChatId = useAppSelector(selectActiveChatId);

  const logout = () => {
    removeLocalStorageData();
    dispatch(removeAuth());
    dispatch(resetChats());
    navigate(routes.loginPagePath(), { replace: true });
  };

  return (
    <aside className="sidebar" aria-label="Список чатов">
      <header className="sidebar__header">
        <div className="sidebar__brand">
          <span>M</span>
          <strong>MAX chat</strong>
        </div>
        <button className="icon-button" type="button" onClick={logout} aria-label="Выйти">
          <FiLogOut aria-hidden="true" />
        </button>
      </header>
      <Form />
      <div className="chat-list">
        {chatIds.length === 0 ? (
          <div className="chat-list__empty">
            <FiMessageSquare aria-hidden="true" /> <span>Создайте первый чат</span>
          </div>
        ) : (
          chatIds.map((chatId) => (
            <button
              className={`chat-list__item ${activeChatId === chatId ? 'chat-list__item--active' : ''}`}
              type="button"
              onClick={() => dispatch(setActiveChat(chatId))}
              key={chatId}
            >
              <span className="avatar">{displayChatId(chatId).slice(-2)}</span>
              <span>{displayChatId(chatId)}</span>
            </button>
          ))
        )}
      </div>
    </aside>
  );
};

export default Aside;
