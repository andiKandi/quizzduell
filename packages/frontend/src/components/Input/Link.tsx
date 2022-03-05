import { Link } from 'react-router-dom';
import styled from 'styled-components';

export const StyledLink = styled(Link)`
  text-decoration: none;
  text-align: center;
  padding: 15px;
  color: ${(props) => props.theme.colors.primary};
`;
