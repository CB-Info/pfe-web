import 'styled-components';
import { Theme } from './theme'; // Importez votre interface de thème

declare module 'styled-components' {
  export interface DefaultTheme extends Theme {} // Étendez DefaultTheme
}