import { useAppSelector } from '../../hooks/hooks';
import { selectActiveChatId, selectCurrentMessages } from './store/chat.selectors';
import { selectUserCredentials } from '../login-page/store/user.selectors';
import Aside from './components/aside';
import ConversationHeader from './components/conversation-header';
import EmptyConversation from './components/empty-conversation';
import MessageComposer from './components/message-composer';
import MessageFeed from './components/message-feed';
import useIncomingMessages from './hooks/use-incoming-messages';
import useMessageSender from './hooks/use-message-sender';
import './chat-page.scss';

const ChatPage = () => {
  const activeChatId = useAppSelector(selectActiveChatId);
  const currentMessages = useAppSelector(selectCurrentMessages);
  const credentials = useAppSelector(selectUserCredentials);

  useIncomingMessages(credentials);

  const { isSending, send } = useMessageSender(credentials, activeChatId);

  return (
    <main className="messenger-layout">
      <Aside />
      <section className="conversation" aria-label="Переписка">
        {activeChatId ? (
          <>
            <ConversationHeader chatId={activeChatId} />
            <MessageFeed messages={currentMessages} />
            <MessageComposer isSending={isSending} onSend={send} />
          </>
        ) : (
          <EmptyConversation />
        )}
      </section>
    </main>
  );
};

export default ChatPage;
