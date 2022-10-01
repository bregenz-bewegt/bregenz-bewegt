import { action, makeAutoObservable, observable } from 'mobx';
import { Store } from './store';
import { QuickFilterOption } from '@bregenz-bewegt/client-ui-components';
import { difficultyDisplayTexts } from '@bregenz-bewegt/client/ui/shared/content';

export class OnboardingStore implements Store {
  storeKey = `onboardingStore` as const;
  @observable preferences: QuickFilterOption[] = Object.values(
    difficultyDisplayTexts
  ).map(
    (text, i) =>
      ({
        key: i,
        label: text,
        active: false,
      } as QuickFilterOption)
  );

  constructor() {
    makeAutoObservable(this);
  }

  @action setPreferences(value: QuickFilterOption[]) {
    this.preferences = value;
  }
}

export const onboardingStore = new OnboardingStore();
