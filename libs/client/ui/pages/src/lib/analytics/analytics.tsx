import { Header } from '@bregenz-bewegt/client-ui-components';
import {
  activityStore,
  ActivityStore,
} from '@bregenz-bewegt/client/common/stores';
import { difficultyDisplayTexts } from '@bregenz-bewegt/client/ui/shared/content';
import { IonContent, IonPage, IonText } from '@ionic/react';
import { inject, observer } from 'mobx-react';
import { useEffect, useState } from 'react';
import './analytics.scss';

export interface AnalyticsProps {
  activityStore?: ActivityStore;
}

export const Analytics: React.FC<AnalyticsProps> = inject(
  activityStore.storeKey
)(
  observer(({ activityStore }) => {
    return (
      <IonPage className="analytics">
        <Header />
        <IonContent className="analytics__content" fullscreen>
          <IonText className="analytics__content__title">
            <h2>Statistik</h2>
          </IonText>
          <IonText>
            <h2>Aktivitäts Verlauf</h2>
            <ul>
              {activityStore?.activities &&
                activityStore?.activities.length > 0 &&
                activityStore?.activities.map((a) => {
                  let seconds;
                  if (a.endedAt && a.startedAt) {
                    const diff = a.endedAt.getTime() - a.startedAt.getTime();
                    const hours = Math.floor(diff / 1000 / 60 / 60);
                    const minutes = Math.floor((diff - hours) / 1000 / 60);
                    seconds = Math.floor((diff - hours - minutes) / 1000);
                  }
                  return (
                    <li>
                      {a.exercise.name} | {a.exercise.coins} B-Bucks |{' '}
                      {a.park.name} |{' '}
                      {difficultyDisplayTexts[a.exercise.difficulty]} |{' '}
                      {seconds ?? -1}
                    </li>
                  );
                })}
            </ul>
          </IonText>
        </IonContent>
      </IonPage>
    );
  })
);
