import { createSelector } from '@reduxjs/toolkit';
import type { RootState } from '../../../store';
import { chatAdapter, messageAdapter } from './chat-slice';

const selectChatState = (state: RootState) => state.chatSlice;

const selectChatsState = (state: RootState) => selectChatState(state).chats;
const selectMessagesState = (state: RootState) => selectChatState(state).messages;

export const selectActiveChatId = (state: RootState) => selectChatState(state).activeChatId;

export const chatSelectors = chatAdapter.getSelectors<RootState>(selectChatsState);
export const messageSelectors = messageAdapter.getSelectors<RootState>(selectMessagesState);

export const selectChatIds = chatSelectors.selectIds;
export const selectHasChats = (state: RootState) => chatSelectors.selectTotal(state) > 0;

export const selectCurrentMessages = createSelector(
  [messageSelectors.selectAll, selectActiveChatId],
  (messages, activeChatId) =>
    activeChatId ? messages.filter((message) => message.chatId === activeChatId) : [],
);
