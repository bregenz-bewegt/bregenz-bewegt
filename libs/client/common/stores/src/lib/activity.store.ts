import { Store } from './store';
import { makeAutoObservable } from 'mobx';
import { http } from '@bregenz-bewegt/client/common/http';
import { EndActivityDto, StartActivityDto } from '@bregenz-bewegt/shared/types';
import { Activity } from '@bregenz-bewegt/client/types';

export class ActivityStore implements Store {
  storeKey = 'activityStore' as const;

  constructor() {
    makeAutoObservable(this);
  }

  async startActivity(dto: StartActivityDto): Promise<Activity> {
    const { data } = await http.post('/activity/start', dto);
    return data;
  }

  async endActivity(dto: EndActivityDto): Promise<Activity> {
    const { data } = await http.post('/activity/end', dto);
    return data;
  }
}

export const activityStore = new ActivityStore();
