import { Store } from './store';
import { makeAutoObservable } from 'mobx';
import { http } from '@bregenz-bewegt/client/common/http';
import {
  EndActivityDto,
  StartActivityDto,
  ActivityPaginationQueryDto,
} from '@bregenz-bewegt/shared/types';
import { Activity, ActivityChartData } from '@bregenz-bewegt/client/types';

export class ActivityStore implements Store {
  storeKey = 'activityStore' as const;

  constructor() {
    makeAutoObservable(this);
  }

  async getActivities(params: ActivityPaginationQueryDto): Promise<Activity[]> {
    const { data } = await http.get(`/activity`, { params });
    return data;
  }

  async getTimespans(): Promise<number[]> {
    const { data } = await http.get('/activity/timespans');
    return data;
  }

  async getChartData(month: number): Promise<ActivityChartData> {
    const { data } = await http.get('/activity/chartdata/' + month);
    return data;
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
