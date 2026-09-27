import { ReactElement, useEffect } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import routes from './utils/routes';
import ChatPage from './pages/chat-page/chat-page';
import LoginPage from './pages/login-page/login-page';
import { getLocalStorageUserData } from './pages/login-page/utils/auth-storage';
import { useAppDispatch } from './hooks/hooks';
import { setAuth } from './pages/login-page/store/user-slice';

const PrivateRoute = ({ children }: { children: React.ReactNode }): ReactElement | null => {
  const dispatch = useAppDispatch();
  const userData = getLocalStorageUserData();

  useEffect(() => {
    if (userData) dispatch(setAuth(userData));
  }, [dispatch, userData]);

  if (!userData) {
    return <Navigate to={routes.loginPagePath()} />;
  }

  return children as ReactElement;
};

const App = () => (
  <>
    <Routes>
      <Route
        path={routes.defaultPath()}
        element={
          <PrivateRoute>
            <ChatPage />
          </PrivateRoute>
        }
      />
      <Route path={routes.loginPagePath()} element={<LoginPage />} />
      <Route path="*" element={<Navigate to={routes.defaultPath()} />} />
    </Routes>
    <ToastContainer />
  </>
);

export default App;
