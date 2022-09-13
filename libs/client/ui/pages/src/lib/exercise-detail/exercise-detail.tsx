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
import { ParkStore, parkStore } from '@bregenz-bewegt/client/common/stores';
import { inject, observer } from 'mobx-react';
import { RouteComponentProps } from 'react-router-dom';
import { Difficulty, Exercise, Park } from '@bregenz-bewegt/client/types';
import { tabRoutes } from '@bregenz-bewegt/client-ui-router';
import { location } from 'ionicons/icons';
import { DifficultyBadge } from '@bregenz-bewegt/client-ui-components';

interface MatchParams {
  park: string;
  exercise: string;
}

export interface ExerciseDetailProps extends RouteComponentProps<MatchParams> {
  parkWithExercise: Park & {
    exercises: Exercise[];
  };
  parkStore?: ParkStore;
}

export const ExerciseDetail: React.FC<ExerciseDetailProps> = inject(
  parkStore.storeKey
)(
  observer(({ parkStore, match }) => {
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

    console.log(park);

    return (
      <IonPage className="exercise-detail">
        {/* <Header /> */}
        <IonHeader>
          <IonToolbar>
            <IonButtons>
              <IonBackButton
                color="primary"
                mode="ios"
                defaultHref={tabRoutes.start.route}
                text="Zurück"
              />
            </IonButtons>
            <IonTitle>{park?.name}</IonTitle>
          </IonToolbar>
        </IonHeader>
        <IonContent className="exercise-detail__content">
          <div className="exercise-detail__content__video-wrapper"></div>
          <div className="exercise-detail__content__content">
            <IonText>
              <h1>{park?.name}</h1>
            </IonText>
            <IonNote className="exercise-detail__content__content__location">
              <IonIcon icon={location} />
              {park?.address}
            </IonNote>
            <IonText>
              <h2>{park?.exercises[0].name}</h2>
              {park?.exercises[0].difficulty && (
                <DifficultyBadge difficulty={park?.exercises[0].difficulty} />
              )}
            </IonText>
          </div>
        </IonContent>
      </IonPage>
    );
  })
);
