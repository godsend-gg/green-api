import { useEffect, useRef } from 'react';
import { FiCheck, FiCheckCircle } from 'react-icons/fi';
import { ChatMessage } from '../store/chat-slice';

type MessageFeedProps = {
  messages: ChatMessage[];
};

const MessageStatus = ({ status }: Pick<ChatMessage, 'status'>) =>
  status === 'sent' ? (
    <FiCheckCircle aria-label="Отправлено" />
  ) : (
    <FiCheck aria-label={status === 'failed' ? 'Ошибка отправки' : 'Отправляется'} />
  );

const MessageFeed = ({ messages }: MessageFeedProps) => {
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages.length]);

  return (
    <div className="message-feed">
      {messages.length === 0 && <p className="message-feed__empty">Напишите первое сообщение</p>}
      {messages.map((message) => (
        <article className={`message message--${message.direction}`} key={message.id}>
          <span>{message.text}</span>
          {message.direction === 'outgoing' && (
            <i>
              <MessageStatus status={message.status} />
            </i>
          )}
        </article>
      ))}
      <div ref={bottomRef} />
    </div>
  );
};

export default MessageFeed;
