import { FormEvent, useState } from 'react';
import { FiSend } from 'react-icons/fi';

type MessageComposerProps = {
  isSending: boolean;
  onSend: (message: string) => Promise<void>;
};

const MessageComposer = ({ isSending, onSend }: MessageComposerProps) => {
  const [text, setText] = useState('');

  const submit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const message = text.trim();
    if (!message || isSending) return;

    setText('');
    await onSend(message);
  };

  return (
    <form className="composer" onSubmit={submit}>
      <input
        value={text}
        onChange={(event) => setText(event.target.value)}
        maxLength={4000}
        placeholder="Сообщение"
        aria-label="Текст сообщения"
      />
      <button type="submit" disabled={!text.trim() || isSending} aria-label="Отправить сообщение">
        <FiSend aria-hidden="true" />
      </button>
    </form>
  );
};

export default MessageComposer;
