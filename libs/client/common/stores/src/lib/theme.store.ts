import { storage } from '@bregenz-bewegt/client/common/storage';
import { ColorTheme } from '@bregenz-bewegt/client/types';
import { makeAutoObservable } from 'mobx';
import { Store } from './store';

export class ThemeStore implements Store {
  storeKey = `themeStore` as const;
  defaultTheme: ColorTheme = ColorTheme.System;
  private themeKey = 'theme' as const;
  private darkMediaQueryList = window!.matchMedia(
    '(prefers-color-scheme: dark)'
  );

  constructor() {
    makeAutoObservable(this);
    this.getTheme((theme) => {
      this.load(
        theme === ColorTheme.System
          ? this.darkMediaQueryList.matches
            ? ColorTheme.Dark
            : ColorTheme.Light
          : theme
      );
    });

    window
      .matchMedia('(prefers-color-scheme: dark)')
      .addEventListener('change', (e) => {
        this.getTheme((theme) => {
          theme === ColorTheme.System &&
            this.load(e.matches ? ColorTheme.Dark : ColorTheme.Light);
        });
      });
  }

  getTheme(callback: (theme: ColorTheme) => void) {
    storage.get(this.themeKey).then((theme: ColorTheme) => {
      if (!theme) {
        storage.set(this.themeKey, this.defaultTheme);
        callback(this.defaultTheme);
        return;
      }

      callback(theme);
    });
  }

  setTheme(value: ColorTheme) {
    storage.set(this.themeKey, value).then((value) => {
      this.load(
        value === ColorTheme.System
          ? this.darkMediaQueryList.matches
            ? ColorTheme.Dark
            : ColorTheme.Light
          : value
      );
    });
  }

  private load(theme: Exclude<ColorTheme, ColorTheme.System>) {
    window.document.body.classList.toggle('dark', theme === ColorTheme.Dark);
  }
}

export const themeStore = new ThemeStore();
