import { toast } from 'react-toastify';
import {
  Credentials,
  getGreenApiErrorMessage,
  useSendMessageMutation,
} from '../../../api/green-api-service';
import { useAppDispatch } from '../../../hooks/hooks';
import { addMessage, updateMessageStatus } from '../store/chat-slice';

const useMessageSender = (credentials: Credentials | null, activeChatId: string | null) => {
  const dispatch = useAppDispatch();
  const [sendMessage, { isLoading: isSending }] = useSendMessageMutation();

  const send = async (message: string) => {
    if (!activeChatId || !credentials || isSending) return;

    const localId = crypto.randomUUID();
    dispatch(
      addMessage({
        id: localId,
        chatId: activeChatId,
        direction: 'outgoing',
        text: message,
        createdAt: new Date().toISOString(),
        status: 'sending',
      }),
    );

    try {
      const response = await sendMessage({
        ...credentials,
        chatId: activeChatId,
        message,
      }).unwrap();
      if (!response.idMessage) {
        throw new Error('GREEN-API не вернул id сообщения');
      }

      dispatch(updateMessageStatus({ id: localId, status: 'sent' }));
    } catch (error) {
      dispatch(updateMessageStatus({ id: localId, status: 'failed' }));
      toast.error(getGreenApiErrorMessage(error));
    }
  };

  return { isSending, send };
};

export default useMessageSender;
