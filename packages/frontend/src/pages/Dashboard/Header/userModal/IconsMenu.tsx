import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React, { FC } from 'react';
import styled from 'styled-components';
import { icons } from '../../../../icons';

const IconElement = styled.div`
  display: flex;
  flex-wrap: wrap;
  justify-content: space-evenly;
`;

interface IIconMenuProps {
  handleChangePlayerIcon: (iconName: string) => void;
  closeModal(): any;
}

export const IconsMenu: FC<IIconMenuProps> = ({ handleChangePlayerIcon, closeModal }) => {
  return (
    <IconElement>
      {icons.map((icon) => (
        <FontAwesomeIcon
          key={icon.iconName}
          onClick={() => {
            handleChangePlayerIcon(icon.iconName);
            closeModal();
          }}
          size="3x"
          fixedWidth={false}
          color="black"
          icon={icon}
          style={{ margin: '10px', cursor: 'pointer' }}
        />
      ))}
    </IconElement>
  );
};
