import { ColorTheme } from '@bregenz-bewegt/client/types';
import { action, makeAutoObservable, observable } from 'mobx';
import { Store } from './store';

export class ThemeStore implements Store {
  storeKey = `themeStore` as const;
  @observable theme: ColorTheme = ColorTheme.System;

  constructor() {
    makeAutoObservable(this);
  }

  private enableTheme() {}

  @action setTheme(value: ColorTheme) {
    this.theme = value;
  }
}

export const themeStore = new ThemeStore();
