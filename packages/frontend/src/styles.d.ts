// tslint:disable-next-line:no-submodule-imports
import {} from 'styled-components/cssprop';
import 'styled-components';
declare module 'styled-components' {
  export interface DefaultTheme {
    colors: {
      backgroundColor: string;
      fontColor: string;
      secondaryFontColor: string;
      shadowColor: string;
      listBackgroundColor: string;
      primary: string;
      danger: string;
    };
    sizes: {
      borderRadius_5: string;
      margin_5: string;
    };
    wholePage: {
      headerHeight: string;
      footerHeight: string;
      maxWidth: string;
    };
  }
}
