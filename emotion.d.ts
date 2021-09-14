import { CrawlerTheme } from './theme';

declare module '@emotion/react' {
  export interface Theme extends CrawlerTheme {}
}
