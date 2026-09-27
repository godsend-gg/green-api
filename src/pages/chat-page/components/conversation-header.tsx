type ConversationHeaderProps = {
  chatId: string;
};

const ConversationHeader = ({ chatId }: ConversationHeaderProps) => (
  <header className="conversation__header">
    <span className="avatar">{chatId.slice(-2)}</span>
    <div>
      <strong>{chatId}</strong>
      <small>MAX · через GREEN-API</small>
    </div>
  </header>
);

export default ConversationHeader;
