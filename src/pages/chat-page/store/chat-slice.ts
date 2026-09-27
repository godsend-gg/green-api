import { createEntityAdapter, createSlice, EntityState, PayloadAction } from '@reduxjs/toolkit';

export type Chat = { id: string; updatedAt: string };

export type ChatMessage = {
  id: string;
  chatId: string;
  direction: 'incoming' | 'outgoing';
  text: string;
  createdAt: string;
  status?: 'sending' | 'sent' | 'failed';
};

export const chatAdapter = createEntityAdapter<Chat>({
  sortComparer: (first, second) => second.updatedAt.localeCompare(first.updatedAt),
});

export const messageAdapter = createEntityAdapter<ChatMessage>({
  sortComparer: (first, second) => first.createdAt.localeCompare(second.createdAt),
});

type ChatState = {
  chats: EntityState<Chat, string>;
  messages: EntityState<ChatMessage, string>;
  activeChatId: string | null;
};

const initialState: ChatState = {
  chats: chatAdapter.getInitialState(),
  messages: messageAdapter.getInitialState(),
  activeChatId: null,
};

const chatSlice = createSlice({
  name: 'chat',
  initialState,
  reducers: {
    addChat(state, { payload }: PayloadAction<string>) {
      chatAdapter.upsertOne(state.chats, { id: payload, updatedAt: new Date().toISOString() });
      state.activeChatId = payload;
    },
    ensureChat(state, { payload }: PayloadAction<string>) {
      chatAdapter.upsertOne(state.chats, { id: payload, updatedAt: new Date().toISOString() });
    },
    setActiveChat(state, { payload }: PayloadAction<string>) {
      state.activeChatId = payload;
    },
    addMessage(state, { payload }: PayloadAction<ChatMessage>) {
      messageAdapter.addOne(state.messages, payload);
      chatAdapter.upsertOne(state.chats, { id: payload.chatId, updatedAt: payload.createdAt });
    },
    updateMessageStatus(state, { payload }: PayloadAction<Pick<ChatMessage, 'id' | 'status'>>) {
      messageAdapter.updateOne(state.messages, {
        id: payload.id,
        changes: { status: payload.status },
      });
    },
    resetChats: () => initialState,
  },
});

export const {
  addChat,
  ensureChat,
  setActiveChat,
  addMessage,
  updateMessageStatus,
  resetChats,
} = chatSlice.actions;
export default chatSlice.reducer;
