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
  locationStore,
  LocationStore,
  ParkStore,
  parkStore,
  tabStore,
  TabStore,
} from '@bregenz-bewegt/client/common/stores';
import { inject, observer } from 'mobx-react';
import { RouteComponentProps } from 'react-router-dom';
import { Park, Activity, Coordinates } from '@bregenz-bewegt/client/types';
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
  locationStore?: LocationStore;
}

export const ExerciseDetail: React.FC<ExerciseDetailProps> = inject(
  parkStore.storeKey,
  tabStore.storeKey,
  activityStore.storeKey,
  locationStore.storeKey
)(
  observer(({ parkStore, tabStore, activityStore, locationStore, match }) => {
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [presentToast] = useIonToast();
    const [presentDefaultErrorToast] = useDefaultErrorToast();
    const [park, setPark] = useState<Park>();
    const [activity, setActivity] = useState<Activity>();
    const [isGuest] = useIsGuest();
    const [isLocationValid, setIsLocationValid] = useState<boolean>(false);
    const videoRef = useRef<HTMLVideoElement>(null);

    const checkLocation = async (coordinates?: Coordinates) => {
      const location = await locationStore?.getLocation();
      if (!location?.coords || !coordinates) return setIsLocationValid(false);

      // Disable location check for presentation
      // const isValid = locationStore?.isLocationWithinRadius(
      //   location.coords,
      //   {
      //     latitude: coordinates.latitude,
      //     longitude: coordinates.longitude,
      //   },
      //   coordinates?.toleranceRadius
      // );
      const isValid = true;
      console.log(isValid);

      setIsLocationValid(isValid || false);
    };

    useEffect(() => {
      const parkId = +match.params.park;
      const exerciseId = +match.params.exercise;
      if (!exerciseId || !parkId) return;

      parkStore?.getParkWithExercise(parkId, exerciseId).then((park) => {
        setPark(park);
        checkLocation(park?.coordinates);
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
        ?.startActivity({
          parkId: park?.id ?? -1,
          exerciseId: park?.exercises ? park?.exercises[0].id : -1,
        })
        .then((activity) => {
          setActivity(activity);
          presentToast({
            message: 'Übung gestartet',
            icon: timer,
            duration: 3000,
            position: 'bottom',
            mode: 'ios',
            color: 'primary',
            buttons: [{ icon: close, role: 'cancel' }],
            cssClass: 'exercise-toast--start',
          });
        })
        .catch(() => presentDefaultErrorToast());
    };

    const handleTimerStop = () => {
      activityStore
        ?.endActivity({ activityId: activity?.id ?? '' })
        .then(() => {
          presentToast({
            message:
              park?.exercises && park.exercises[0].coins
                ? `+${park.exercises[0].coins} B-Bucks erhalten`
                : 'Übung beendet',
            icon: stopCircle,
            duration: 3000,
            position: 'bottom',
            mode: 'ios',
            color: 'primary',
            buttons: [{ icon: close, role: 'cancel' }],
            cssClass: 'exercise-toast--end',
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
                    <h2>Beanspruchte Muskeln</h2>
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
            isGuest={isGuest}
            isLocationValid={isLocationValid}
          />
        </IonContent>
      </IonPage>
    );
  })
);
