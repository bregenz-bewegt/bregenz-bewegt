import { ColorTheme } from '@bregenz-bewegt/client/types';

export const themeDisplayTexts: { [K in ColorTheme]: string } = {
  [ColorTheme.Light]: 'Hell',
  [ColorTheme.Dark]: 'Dunkel',
  [ColorTheme.System]: 'System',
};
