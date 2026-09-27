import { skipToken } from '@reduxjs/toolkit/query';
import { useEffect, useRef } from 'react';
import {
  ApiNotification,
  Credentials,
  getGreenApiErrorMessage,
  useDeleteNotificationMutation,
  useReceiveNotificationQuery,
} from '../../../api/green-api-service';
import { useAppDispatch } from '../../../hooks/hooks';
import { addMessage, ensureChat } from '../store/chat-slice';

const extractIncomingMessage = (notification: ApiNotification) => {
  const body = notification.body;
  const chatId = body.senderData?.chatId || body.senderData?.sender;
  const messageData = body.messageData;
  const text =
    messageData?.textMessageData?.textMessage || messageData?.extendedTextMessageData?.text;

  return chatId && text ? { chatId, text } : null;
};

const useIncomingMessages = (credentials: Credentials | null) => {
  const dispatch = useAppDispatch();
  const processedReceiptsRef = useRef(new Set<number>());
  const { data: notification, error: notificationError } = useReceiveNotificationQuery(
    credentials ?? skipToken,
    { pollingInterval: 6000, refetchOnFocus: true },
  );
  const [deleteNotification] = useDeleteNotificationMutation();

  useEffect(() => {
    if (!notification || !credentials || processedReceiptsRef.current.has(notification.receiptId)) {
      return;
    }

    processedReceiptsRef.current.add(notification.receiptId);

    const processNotification = async () => {
      try {
        const incoming = extractIncomingMessage(notification);
        if (incoming) {
          dispatch(ensureChat(incoming.chatId));
          dispatch(
            addMessage({
              id: `in-${notification.receiptId}`,
              chatId: incoming.chatId,
              direction: 'incoming',
              text: incoming.text,
              createdAt: new Date().toISOString(),
            }),
          );
        }

        await deleteNotification({ ...credentials, receiptId: notification.receiptId }).unwrap();
      } catch (error) {
        processedReceiptsRef.current.delete(notification.receiptId);
        console.warn('Polling GREEN-API failed:', getGreenApiErrorMessage(error));
      }
    };

    void processNotification();
  }, [credentials, deleteNotification, dispatch, notification]);

  useEffect(() => {
    if (notificationError) {
      console.warn('Polling GREEN-API failed:', getGreenApiErrorMessage(notificationError));
    }
  }, [notificationError]);
};

export default useIncomingMessages;
