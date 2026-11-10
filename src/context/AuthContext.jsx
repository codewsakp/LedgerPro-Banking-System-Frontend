
import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState
} from 'react';

import { bankingService } from '../services/bankingService.js';

const AuthContext = createContext(null);

const readUser = () => {
  try {
    return JSON.parse(localStorage.getItem('ledgerpro_user') || 'null');
  } catch {
    return null;
  }
};

export function AuthProvider({ children }) {
  const [token, setToken] = useState(
    localStorage.getItem('ledgerpro_token')
  );

  const [user, setUser] = useState(readUser);

  const persist = useCallback((nextToken, nextUser) => {
    if (nextToken) {
      localStorage.setItem('ledgerpro_token', nextToken);
      setToken(nextToken);
    }

    if (nextUser) {
      localStorage.setItem('ledgerpro_user', JSON.stringify(nextUser));
      setUser(nextUser);
    }
  }, []);

  const login = useCallback(async (credentials) => {
    const { data } = await bankingService.login(credentials);

    const jwt = data?.responseMessage;

    if (
      !jwt ||
      typeof jwt !== 'string' ||
      jwt.split('.').length !== 3
    ) {
      throw new Error('Login response did not contain a valid authentication token.');
    }

    const account = data?.accountInfo;

    // Account details must come from the backend database.
    if (!account?.accountNumber) {
      throw new Error(
        'Login succeeded, but account information was not returned. Please check the backend login response.'
      );
    }

    const nextUser = {
      email: credentials.email,
      accountNumber: account.accountNumber,
      accountName: account.accountName || credentials.email,
      accountBalance: account.accountBalance ?? 0
    };

    persist(jwt, nextUser);

    return data;
  }, [persist]);

  const register = useCallback(async (payload) => {
    const { data } = await bankingService.register(payload);

    const info = data?.accountInfo || {};

    const nextUser = {
      firstName: payload.firstName,
      lastName: payload.lastName,
      email: payload.email,
      phoneNumber: payload.phoneNumber,
      accountNumber: info.accountNumber || '',
      accountName:
        info.accountName ||
        `${payload.firstName} ${payload.lastName}`,
      accountBalance: info.accountBalance ?? 0
    };

    // Registration stores the profile but does not create a login token.
    persist(null, nextUser);

    return data;
  }, [persist]);

  const logout = useCallback(() => {
    localStorage.removeItem('ledgerpro_token');
    localStorage.removeItem('ledgerpro_user');

    setToken(null);
    setUser(null);
  }, []);

  const updateUser = useCallback((patch) => {
    setUser((currentUser) => {
      const nextUser = {
        ...currentUser,
        ...patch
      };

      localStorage.setItem(
        'ledgerpro_user',
        JSON.stringify(nextUser)
      );

      return nextUser;
    });
  }, []);

  const value = useMemo(() => ({
    token,
    user,
    login,
    register,
    logout,
    updateUser
  }), [token, user, login, register, logout, updateUser]);

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
