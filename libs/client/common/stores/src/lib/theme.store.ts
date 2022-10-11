import { ColorTheme } from '@bregenz-bewegt/client/types';
import { action, makeAutoObservable, observable } from 'mobx';
import { Store } from './store';

export class ThemeStore implements Store {
  storeKey = `themeStore` as const;
  @observable theme: ColorTheme = ColorTheme.System;
  private darkMediaQueryList = window.matchMedia(
    '(prefers-color-scheme: dark)'
  );

  constructor() {
    makeAutoObservable(this);
    this.load(
      this.theme === ColorTheme.System
        ? this.darkMediaQueryList.matches
          ? ColorTheme.Dark
          : ColorTheme.Light
        : this.theme
    );

    window
      .matchMedia('(prefers-color-scheme: dark)')
      .addEventListener('change', (e) => {
        this.theme === ColorTheme.System &&
          this.load(e.matches ? ColorTheme.Dark : ColorTheme.Light);
      });
  }

  private load(theme: Exclude<ColorTheme, ColorTheme.System>) {
    window.document.body.classList.toggle('dark', theme === ColorTheme.Dark);
  }

  @action setTheme(value: ColorTheme) {
    this.theme = value;
    this.load(
      value === ColorTheme.System
        ? this.darkMediaQueryList.matches
          ? ColorTheme.Dark
          : ColorTheme.Light
        : value
    );
  }
}

export const themeStore = new ThemeStore();
