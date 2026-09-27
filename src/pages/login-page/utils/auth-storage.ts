import { Credentials } from '../../../api/green-api-service';

const USER_KEY = 'green-api:credentials';

export const setLocalStorageUserData = (userData: Credentials) => {
  localStorage.setItem(USER_KEY, JSON.stringify(userData));
};

export const getLocalStorageUserData = (): Credentials | null => {
  try {
    const userData = localStorage.getItem(USER_KEY);
    if (!userData) return null;
    const parsed: unknown = JSON.parse(userData);
    if (
      typeof parsed === 'object' &&
      parsed !== null &&
      'id' in parsed &&
      'token' in parsed &&
      typeof parsed.id === 'string' &&
      typeof parsed.token === 'string'
    ) {
      const apiUrl =
        'apiUrl' in parsed && typeof parsed.apiUrl === 'string'
          ? parsed.apiUrl
          : 'https://api.green-api.com';
      return { id: parsed.id, token: parsed.token, apiUrl };
    }
  } catch {
    localStorage.removeItem(USER_KEY);
  }
  return null;
};

export const removeLocalStorageData = () => {
  localStorage.removeItem(USER_KEY);
};
