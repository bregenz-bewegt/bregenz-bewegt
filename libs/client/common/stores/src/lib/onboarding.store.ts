import { action, makeAutoObservable, observable } from 'mobx';
import { Store } from './store';
import { QuickFilterOption } from '@bregenz-bewegt/client-ui-components';

export class OnboardingStore implements Store {
  storeKey = `onboardingStore` as const;
  @observable preferences: QuickFilterOption[];

  constructor() {
    makeAutoObservable(this);
  }

  @action setPreferences(value: QuickFilterOption[]) {
    this.preferences = value;
  }
}

export const onboardingStore = new OnboardingStore();
