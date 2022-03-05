import React, { useState } from 'react';
import { io, Socket } from 'socket.io-client';
// tslint:disable-next-line:no-submodule-imports
import { DefaultEventsMap } from 'socket.io-client/build/typed-events';
export type LoginOptions = {
  email: string;
  password: string;
};

export type LoginResponse = {
  status: 'ok';
  data: string;
};

export type RegisterOptions = {
  email: string;
  password: string;
  name: string;
};

export type JWTTokenData = {
  id: number;
  name: string;
  email: string;
  iat: string;
  exp: string;
};

export type AuthContext = {
  token: string | null;
  actions: {
    getSocket: () => Socket<DefaultEventsMap, DefaultEventsMap> | null;
    login: (options: LoginOptions) => Promise<void>;
    register: (options: RegisterOptions) => Promise<void>;
    getTokenData: () => JWTTokenData | null;
    logout: () => void;
  };
};

export const initialAuthContext = {
  actions: {
    getSocket: () => null,
    getTokenData: () => null,
    login: async () => undefined,
    logout: () => undefined,
    register: async () => undefined,
  },
  token: null,
};

export const authContext = React.createContext<AuthContext>(initialAuthContext);

export const AuthProvider: React.FC = ({ children }) => {
  const [token, setToken] = useState<string | null>(window.localStorage.getItem('auth-token'));
  const socket = io();

  const login = async (values: LoginOptions) => {
    const loginRequest = await fetch('/api/user/token', {
      body: JSON.stringify(values),
      headers: {
        'Content-Type': 'application/json',
      },
      method: 'POST',
    });

    if (loginRequest.status === 200) {
      const { data } = await loginRequest.json();
      setToken(data);
      window.localStorage.setItem('auth-token', data);
    } else {
      throw new Error('user does not exist or the password is wrong');
    }
  };

  const register = async (values: RegisterOptions) => {
    const registerRequest = await fetch('/api/user', {
      body: JSON.stringify(values),
      headers: {
        'Content-Type': 'application/json',
      },
      method: 'POST',
    });

    if (registerRequest.status === 200) {
      await registerRequest.json();
      await login({ email: values.email, password: values.password });
    } else {
      throw new Error('Error while registering');
    }
  };
  const getTokenData = () => {
    if (token) {
      return JSON.parse(atob(token.split('.')[1]));
    }
    return null;
  };

  const getSocket = () => {
    return socket;
  };
  const logout = () => {
    setToken(null);
    window.localStorage.removeItem('auth-token');
  };
  return (
    <authContext.Provider
      value={{
        actions: {
          getSocket,
          getTokenData,
          login,
          logout,
          register,
        },
        token,
      }}
    >
      {children}
    </authContext.Provider>
  );
};
