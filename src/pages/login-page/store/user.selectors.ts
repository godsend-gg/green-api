import { createSelector } from '@reduxjs/toolkit';
import type { RootState } from '../../../store';

const selectUserState = (state: RootState) => state.userSlice;

export const selectIsAuth = (state: RootState) => selectUserState(state).isAuth;
export const selectUserData = (state: RootState) => selectUserState(state).userData;

export const selectUserCredentials = createSelector([selectUserData], ({ apiUrl, id, token }) =>
  apiUrl && id && token ? { apiUrl, id, token } : null,
);
