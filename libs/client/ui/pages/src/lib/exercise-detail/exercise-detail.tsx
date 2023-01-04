import './exercise-detail.scss';
import {
  IonContent,
  IonPage,
  useIonToast,
  useIonViewWillEnter,
  useIonViewWillLeave,
} from '@ionic/react';
import { useEffect, useRef, useState } from 'react';
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
import { Park, Activity } from '@bregenz-bewegt/client/types';
import {
  ActivityTimer,
  BackButton,
  DifficultyBadge,
} from '@bregenz-bewegt/client-ui-components';
import { timer, stopCircle, close } from 'ionicons/icons';
import {
  useDefaultErrorToast,
  useIsGuest,
} from '@bregenz-bewegt/client/common/hooks';
import { tabRoutes } from '@bregenz-bewegt/client-ui-router';
import { Loading } from '@bregenz-bewegt/client-ui-pages';

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
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [presentToast] = useIonToast();
    const [presentDefaultErrorToast] = useDefaultErrorToast();
    const [park, setPark] = useState<Park>();
    const [activity, setActivity] = useState<Activity>();
    const [isGuest] = useIsGuest();
    const videoRef = useRef<HTMLVideoElement>(null);

    useEffect(() => {
      const parkId = +match.params.park;
      const exerciseId = +match.params.exercise;
      if (!exerciseId || !parkId) return;

      parkStore?.getParkWithExercise(parkId, exerciseId).then((park) => {
        setPark(park);
        setIsLoading(false);
      });
    }, [match.params.exercise, match.params.park]);

    useEffect(() => {
      videoRef.current?.load();
    }, [park?.exercises ? park.exercises[0].video : undefined]);

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
            message: `+${
              park?.exercises && park.exercises[0].coins
            } B-Bucks erhalten`,
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

    return isLoading ? (
      <Loading />
    ) : (
      <IonPage className="exercise-detail">
        <IonContent className="exercise-detail__content">
          <BackButton defaultRouterLink={tabRoutes.start.route} />
          <div className="exercise-detail__content__video-wrapper">
            <video
              controls={Boolean(park?.exercises && park.exercises[0].video)}
              ref={videoRef}
            >
              {park?.exercises && park.exercises[0].video ? (
                <source src={park.exercises[0].video} type="video/mp4"></source>
              ) : undefined}
            </video>
          </div>
          <div className="exercise-detail__content__exercise-wrapper">
            <h1>{park?.exercises && park?.exercises[0].name}</h1>
            {park?.exercises && park?.exercises[0].difficulty && (
              <DifficultyBadge difficulty={park?.exercises[0].difficulty} />
            )}
            {park?.exercises && park?.exercises[0].coins && (
              <h3>{park?.exercises[0].coins} B-Bucks</h3>
            )}
            {park?.exercises && (
              <>
                <h2>Beschreibung</h2>
                <p>{park?.exercises[0].description}</p>
                {park?.exercises[0].execution && (
                  <>
                    <h2>Ausführung</h2>
                    <p>{park?.exercises[0].execution}</p>
                  </>
                )}
                {park?.exercises[0].muscles && (
                  <>
                    <h2>Verwendete Muskeln</h2>
                    <ul>
                      {park?.exercises[0].muscles
                        .split(',')
                        .map((li) => li.trim())
                        .map((li, i) => (
                          <li key={i}>{li}</li>
                        ))}
                    </ul>
                  </>
                )}
              </>
            )}
          </div>
          <ActivityTimer
            onTimerStart={handleTimerStart}
            onTimerStop={handleTimerStop}
            disabled={isGuest}
          />
        </IonContent>
      </IonPage>
    );
  })
);
