import { ColorTheme } from '@bregenz-bewegt/client/types';
import { action, makeAutoObservable, observable } from 'mobx';
import { Store } from './store';

export class ThemeStore implements Store {
  storeKey = `themeStore` as const;
  @observable theme: ColorTheme = ColorTheme.System;

  constructor() {
    makeAutoObservable(this);
    this.load();
  }

  private load() {
    window.document.body.classList.toggle(
      'dark',
      [ColorTheme.Dark, ColorTheme.System].includes(this.theme)
    );
  }

  @action setTheme(value: ColorTheme) {
    this.theme = value;
    this.load();
  }
}

export const themeStore = new ThemeStore();
