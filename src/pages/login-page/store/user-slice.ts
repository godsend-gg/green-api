import { createSlice, PayloadAction } from '@reduxjs/toolkit';

type UserState = {
  isAuth: boolean;
  userData: {
    apiUrl: string | null;
    id: string | null;
    token: string | null;
  };
};

type AuthPayload = {
  apiUrl: null | string;
  id: null | string;
  token: null | string;
};

const initialState: UserState = {
  isAuth: false,
  userData: {
    apiUrl: null,
    id: null,
    token: null,
  },
};

const userSlice = createSlice({
  name: 'users',
  initialState,
  reducers: {
    setAuth(state, { payload }: PayloadAction<AuthPayload>) {
      const { apiUrl, id, token } = payload;
      state.userData.apiUrl = apiUrl;
      state.userData.id = id;
      state.userData.token = token;
      state.isAuth = true;
    },
    removeAuth(state) {
      state.userData.apiUrl = null;
      state.userData.id = null;
      state.userData.token = null;
      state.isAuth = false;
    },
  },
});

export const { setAuth, removeAuth } = userSlice.actions;
export default userSlice.reducer;
