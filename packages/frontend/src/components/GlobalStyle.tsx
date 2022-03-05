import { createGlobalStyle } from 'styled-components';

export const GlobalStyle = createGlobalStyle`
    *{
        box-sizing:border-box;
    }

    body,html {
        color:${(props) => props.theme.colors.fontColor};
        background-color:${(props) => props.theme.colors.backgroundColor};
        font-family:'Arial',sans-serif;
        margin:0;
        padding:0;
        height: 100%;
        width: 100%;
    }
    .apexcharts-menu{
      background-color: #27293d!important;
      border: 0;
    }
`;
