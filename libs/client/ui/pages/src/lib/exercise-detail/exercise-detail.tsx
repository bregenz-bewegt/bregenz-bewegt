import './exercise-detail.scss';
import {
  IonBackButton,
  IonButtons,
  IonContent,
  IonHeader,
  IonIcon,
  IonNote,
  IonPage,
  IonText,
  IonTitle,
  IonToolbar,
  useIonToast,
} from '@ionic/react';
import { useEffect, useState } from 'react';
import {
  ActivityStore,
  activityStore,
  ParkStore,
  parkStore,
  tabStore,
  TabStore,
} from '@bregenz-bewegt/client/common/stores';
import { inject, observer } from 'mobx-react';
import { RouteComponentProps } from 'react-router-dom';
import { Park, ActivityTimerResult } from '@bregenz-bewegt/client/types';
import { tabRoutes } from '@bregenz-bewegt/client-ui-router';
import { location } from 'ionicons/icons';
import {
  ActivityTimer,
  DifficultyBadge,
} from '@bregenz-bewegt/client-ui-components';
import { play, timer, stopCircle } from 'ionicons/icons';

interface MatchParams {
  park: string;
  exercise: string;
}

export interface ExerciseDetailProps extends RouteComponentProps<MatchParams> {
  parkStore?: ParkStore;
  tabStore?: TabStore;
  activityStore?: ActivityStore;
}

export const ExerciseDetail: React.FC<ExerciseDetailProps> = inject(
  parkStore.storeKey,
  tabStore.storeKey,
  activityStore.storeKey
)(
  observer(({ parkStore, tabStore, match }) => {
    const [presentToast] = useIonToast();
    const [park, setPark] = useState<Required<Park>>();

    useEffect(() => {
      const parkId = +match.params.park;
      const exerciseId = +match.params.exercise;
      if (!exerciseId || !parkId) return;

      parkStore?.getParkWithExercise(parkId, exerciseId).then((park) => {
        setPark(park);
      });
    }, [match.params.exercise, match.params.park]);

    useEffect(() => {
      tabStore?.setIsShown(false);
      return () => tabStore?.setIsShown(true);
    }, []);

    const handleTimerStart = () => {
      activityStore.startActivity().then(() => {
        presentToast({
          message: 'Übung gestartet',
          icon: timer,
          duration: 2000,
          position: 'top',
          mode: 'ios',
          color: 'primary',
        });
      });
    };

    const handleTimerStop = (time: ActivityTimerResult) => {
      activityStore.endActivity().then(() => {
        presentToast({
          message: 'Übung beendet',
          icon: stopCircle,
          duration: 2000,
          position: 'top',
          mode: 'ios',
          color: 'primary',
        });
      });
    };

    return (
      <IonPage className="exercise-detail">
        <IonHeader mode="ios">
          <IonToolbar>
            <IonButtons>
              <IonBackButton
                color="primary"
                defaultHref={tabRoutes.start.route}
                text="Zurück"
              />
            </IonButtons>
            <IonTitle>{park?.name}</IonTitle>
          </IonToolbar>
        </IonHeader>
        <IonContent className="exercise-detail__content">
          <div className="exercise-detail__content__flex-wrapper">
            <div className="exercise-detail__content__video-wrapper">
              <IonIcon icon={play} />
            </div>
            <div className="exercise-detail__content__content">
              <div className="exercise-detail__content__content__park-wrapper">
                <IonText>
                  <h1>{park?.name}</h1>
                </IonText>
                <IonNote className="exercise-detail__content__content__location">
                  <IonIcon icon={location} />
                  {park?.address}
                </IonNote>
              </div>
              <div className="exercise-detail__content__content__exercise-wrapper">
                <IonText>
                  <h2>{park?.exercises[0].name}</h2>
                  {park?.exercises[0].difficulty && (
                    <DifficultyBadge
                      difficulty={park?.exercises[0].difficulty}
                    />
                  )}
                </IonText>
                <IonText>
                  <p>{park?.exercises[0].description}</p>
                </IonText>
              </div>
            </div>
            <div className="exercise-detail__content__timer">
              <ActivityTimer
                onTimerStart={handleTimerStart}
                onTimerStop={handleTimerStop}
              />
            </div>
          </div>
        </IonContent>
      </IonPage>
    );
  })
);
