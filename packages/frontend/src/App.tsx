import React from 'react';
import { GlobalStyle } from './components/GlobalStyle';
import { ThemeProvider } from 'styled-components';
import { theme } from './theme';
import { AuthProvider } from './contexts/AuthenticationContext';
import { BrowserRouter } from 'react-router-dom';
import Router from './pages/routes/Router';
import { library } from '@fortawesome/fontawesome-svg-core';
import { fab } from '@fortawesome/free-brands-svg-icons';
import { icons } from './icons';

library.add(fab, ...icons);

export const App = () => {
  return (
    <BrowserRouter>
      <ThemeProvider theme={theme}>
        <AuthProvider>
          <GlobalStyle />
          <Router />
        </AuthProvider>
      </ThemeProvider>
    </BrowserRouter>
  );
};
