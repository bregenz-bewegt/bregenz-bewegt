import { makeAutoObservable } from 'mobx';
import { Store } from './store';
import { QuickFilterOption } from '@bregenz-bewegt/client-ui-components';
import { storage } from '@bregenz-bewegt/client/common/storage';

export class OnboardingStore implements Store {
  storeKey = `onboardingStore` as const;
  private preferenceKey = 'preferences' as const;

  constructor() {
    makeAutoObservable(this);
  }

  getPreferences(callback: (preferences: QuickFilterOption[]) => void): void {
    storage.get(this.preferenceKey).then((preferences: QuickFilterOption[]) => {
      callback(preferences ?? null);
    });
  }

  setPreferences(preferences: QuickFilterOption[] | null): void {
    preferences
      ? storage.set(this.preferenceKey, preferences)
      : storage.remove(this.preferenceKey);
  }
}

export const onboardingStore = new OnboardingStore();
