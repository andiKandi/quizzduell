import React from 'react';
// tslint:disable-next-line: no-submodule-imports
import styled, { css } from 'styled-components/macro';
import { theme } from '../theme';

export const MaxWidthCSS = css`
  max-width: ${theme.wholePage.maxWidth}
  margin: auto;
`;

const Main = styled.main`
  min-height: calc(100vh - ${theme.wholePage.footerHeight});
  padding: 0 25px;
  ${MaxWidthCSS}
`;

const Footer = styled.footer`
  height: ${theme.wholePage.footerHeight};
  padding: 0 25px;
  ${MaxWidthCSS};
`;

export const UnauthenticatedLayout: React.FC = ({ children }) => {
  return (
    <>
      <Main>{children}</Main>
      <Footer>© 2021 QuizzDuell</Footer>
    </>
  );
};
