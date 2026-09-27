import { createApi, fetchBaseQuery, FetchBaseQueryError } from '@reduxjs/toolkit/query/react';

const DEFAULT_API_URL = 'https://api.green-api.com';

export type Credentials = { apiUrl: string; id: string; token: string };

export type ApiNotification = {
  receiptId: number;
  body: {
    typeWebhook?: string;
    senderData?: { sender?: string; chatId?: string };
    messageData?: {
      typeMessage?: string;
      textMessageData?: { textMessage?: string };
      extendedTextMessageData?: { text?: string };
    };
  };
};

type StateResponse = { stateInstance: string };
type SendMessageResponse = { idMessage: string };
type DeleteNotificationArgs = Credentials & { receiptId: number };
type SendMessageArgs = Credentials & { chatId: string; message: string };

const endpoint = (method: string, { apiUrl, id, token }: Credentials, receiptId?: number) =>
  [apiUrl.replace(/\/+$/, '') || DEFAULT_API_URL, `waInstance${id}`, method, token, receiptId]
    .filter((part) => part !== undefined)
    .join('/');

const baseQuery = fetchBaseQuery({ baseUrl: '' });

export const greenApiService = createApi({
  reducerPath: 'greenApi',
  baseQuery,
  endpoints: (builder) => ({
    getState: builder.query<string, Credentials>({
      queryFn: async (credentials, api, extraOptions) => {
        const result = await baseQuery(
          { url: endpoint('getStateInstance', credentials) },
          api,
          extraOptions,
        );
        if (result.error) return { error: result.error };

        return { data: (result.data as StateResponse).stateInstance };
      },
    }),
    sendMessage: builder.mutation<SendMessageResponse, SendMessageArgs>({
      queryFn: async ({ chatId, message, ...credentials }, api, extraOptions) => {
        const result = await baseQuery(
          { url: endpoint('sendMessage', credentials), method: 'POST', body: { chatId, message } },
          api,
          extraOptions,
        );
        if (result.error) return { error: result.error };

        return { data: result.data as SendMessageResponse };
      },
    }),
    receiveNotification: builder.query<ApiNotification | null, Credentials>({
      queryFn: async (credentials, api, extraOptions) => {
        const result = await baseQuery(
          {
            url: endpoint('receiveNotification', credentials),
            params: { receiveTimeout: 5 },
          },
          api,
          extraOptions,
        );
        if (result.error) return { error: result.error };

        return { data: result.data as ApiNotification | null };
      },
    }),
    deleteNotification: builder.mutation<void, DeleteNotificationArgs>({
      queryFn: async ({ receiptId, ...credentials }, api, extraOptions) => {
        const result = await baseQuery(
          { url: endpoint('deleteNotification', credentials, receiptId), method: 'DELETE' },
          api,
          extraOptions,
        );
        if (result.error) return { error: result.error };

        return { data: undefined };
      },
    }),
  }),
});

type GreenApiErrorBody = { message?: string; error?: string };

const isFetchBaseQueryError = (error: unknown): error is FetchBaseQueryError =>
  typeof error === 'object' && error !== null && 'status' in error;

export const getGreenApiErrorMessage = (error: unknown) => {
  if (isFetchBaseQueryError(error)) {
    const data = error.data as GreenApiErrorBody | undefined;
    const fetchError =
      'error' in error && typeof error.error === 'string' ? error.error : undefined;
    return data?.message || data?.error || fetchError || 'Не удалось выполнить запрос к GREEN-API';
  }
  return error instanceof Error ? error.message : 'Неизвестная ошибка';
};

export const {
  useDeleteNotificationMutation,
  useLazyGetStateQuery,
  useReceiveNotificationQuery,
  useSendMessageMutation,
} = greenApiService;
