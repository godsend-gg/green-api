import { configureStore } from '@reduxjs/toolkit';
import userSlice from '../pages/login-page/store/user-slice';
import chatSlice from '../pages/chat-page/store/chat-slice';
import { greenApiService } from '../api/green-api-service';

const store = configureStore({
  reducer: {
    userSlice,
    chatSlice,
    [greenApiService.reducerPath]: greenApiService.reducer,
  },
  middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat(greenApiService.middleware),
});

export default store;

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
