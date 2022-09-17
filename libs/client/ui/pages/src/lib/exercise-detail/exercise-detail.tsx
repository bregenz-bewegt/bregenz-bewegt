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
} from '@ionic/react';
import { useEffect, useState } from 'react';
import {
  ParkStore,
  parkStore,
  tabStore,
  TabStore,
} from '@bregenz-bewegt/client/common/stores';
import { inject, observer } from 'mobx-react';
import { RouteComponentProps } from 'react-router-dom';
import {
  Exercise,
  Park,
  ActivityTimerResult,
} from '@bregenz-bewegt/client/types';
import { tabRoutes } from '@bregenz-bewegt/client-ui-router';
import { location } from 'ionicons/icons';
import {
  ActivityTimer,
  DifficultyBadge,
} from '@bregenz-bewegt/client-ui-components';
import { play } from 'ionicons/icons';
import { useStopwatch } from 'react-timer-hook';

interface MatchParams {
  park: string;
  exercise: string;
}

export interface ExerciseDetailProps extends RouteComponentProps<MatchParams> {
  parkWithExercise: Park & {
    exercises: Exercise[];
  };
  parkStore?: ParkStore;
  tabStore?: TabStore;
}

export const ExerciseDetail: React.FC<ExerciseDetailProps> = inject(
  parkStore.storeKey,
  tabStore.storeKey
)(
  observer(({ parkStore, tabStore, match }) => {
    const [park, setPark] = useState<
      Park & {
        exercises: Exercise[];
      }
    >();

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
      console.log('start timer');
    };

    const handleTimerStop = (time: ActivityTimerResult) => {
      console.log(time);
    };

    return (
      <IonPage className="exercise-detail">
        {/* <Header /> */}
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
