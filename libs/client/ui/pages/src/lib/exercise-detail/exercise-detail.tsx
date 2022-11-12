import './exercise-detail.scss';
import {
  IonBackButton,
  IonButtons,
  IonContent,
  IonHeader,
  IonIcon,
  IonPage,
  IonText,
  IonTitle,
  IonToolbar,
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
  ExerciseDescriptionType,
} from '@bregenz-bewegt/client/types';
import { tabRoutes } from '@bregenz-bewegt/client-ui-router';
import {
  ActivityTimer,
  DifficultyBadge,
} from '@bregenz-bewegt/client-ui-components';
import { play, timer, stopCircle, close } from 'ionicons/icons';
import { useDefaultErrorToast } from '@bregenz-bewegt/client/common/hooks';
import { exerDescrDisplayTexts } from '@bregenz-bewegt/client/ui/shared/content';
import { StopCircle, TimerStart } from 'iconsax-react';

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

    const handleTimerStop = (time: ActivityTimerResult) => {
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
          <div className="exercise-detail__content__video-wrapper">
            <IonIcon icon={play} />
          </div>
          <div className="exercise-detail__content__content">
            <div className="exercise-detail__content__content__exercise-wrapper">
              <IonText>
                <h2>{park?.exercises && park?.exercises[0].name}</h2>
                {park?.exercises && park?.exercises[0].difficulty && (
                  <DifficultyBadge difficulty={park?.exercises[0].difficulty} />
                )}
              </IonText>
              <IonText>
                {park?.exercises &&
                  Object.keys(park?.exercises[0].description).map((k, i) => {
                    const desc =
                      park?.exercises &&
                      park?.exercises[0].description[
                        k as ExerciseDescriptionType
                      ];
                    return (
                      <div className={k} key={i}>
                        <h2>
                          {exerDescrDisplayTexts[k as ExerciseDescriptionType]}
                        </h2>
                        <p>
                          {k === ExerciseDescriptionType.MUSCLES ? (
                            <ul>
                              {desc?.split(', ').map((li) => (
                                <li>{li}</li>
                              ))}
                            </ul>
                          ) : (
                            desc
                          )}
                        </p>
                      </div>
                    );
                  })}
              </IonText>
            </div>
          </div>
          <ActivityTimer
            className="exercise-detail__content__timer"
            onTimerStart={handleTimerStart}
            onTimerStop={handleTimerStop}
          />
        </IonContent>
      </IonPage>
    );
  })
);
