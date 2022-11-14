import './exercise-detail.scss';
import {
  IonContent,
  IonIcon,
  IonNote,
  IonPage,
  IonText,
  useIonToast,
  useIonViewWillEnter,
  useIonViewWillLeave,
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
import {
  Park,
  ActivityTimerResult,
  Activity,
} from '@bregenz-bewegt/client/types';
import { location } from 'ionicons/icons';
import {
  ActivityTimer,
  BackButton,
  DifficultyBadge,
} from '@bregenz-bewegt/client-ui-components';
import { play, timer, stopCircle, close } from 'ionicons/icons';
import { useDefaultErrorToast } from '@bregenz-bewegt/client/common/hooks';

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
    const [presentDefaultErrorToast] = useDefaultErrorToast();
    const [park, setPark] = useState<Park>();
    const [activity, setActivity] = useState<Activity>();

    useEffect(() => {
      const parkId = +match.params.park;
      const exerciseId = +match.params.exercise;
      if (!exerciseId || !parkId) return;

      parkStore?.getParkWithExercise(parkId, exerciseId).then((park) => {
        setPark(park);
      });
    }, [match.params.exercise, match.params.park]);

    useIonViewWillEnter(() => {
      tabStore?.setIsShown(false);
    }, []);

    useIonViewWillLeave(() => {
      tabStore?.setIsShown(true);
    }, []);

    const handleTimerStart = () => {
      activityStore
        .startActivity({
          parkId: park?.id ?? -1,
          exerciseId: park?.exercises ? park?.exercises[0].id : -1,
        })
        .then((activity) => {
          setActivity(activity);
          presentToast({
            message: 'Übung gestartet',
            icon: timer,
            duration: 2000,
            position: 'top',
            mode: 'ios',
            color: 'primary',
            buttons: [{ icon: close, role: 'cancel' }],
          });
        })
        .catch(() => presentDefaultErrorToast());
    };

    const handleTimerStop = () => {
      activityStore
        .endActivity({ activityId: activity?.id ?? '' })
        .then(() => {
          presentToast({
            message: 'Übung beendet',
            icon: stopCircle,
            duration: 2000,
            position: 'top',
            mode: 'ios',
            color: 'primary',
            buttons: [{ icon: close, role: 'cancel' }],
          });
        })
        .catch(() => presentDefaultErrorToast());
    };

    return (
      <IonPage className="exercise-detail">
        <IonContent className="exercise-detail__content">
          <BackButton />
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
                  <h2>{park?.exercises && park?.exercises[0].name}</h2>
                  {park?.exercises && park?.exercises[0].difficulty && (
                    <DifficultyBadge
                      difficulty={park?.exercises[0].difficulty}
                    />
                  )}
                </IonText>
                <IonText>
                  <p>{park?.exercises && park?.exercises[0].description}</p>
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
