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
  exerciseStore,
  ExerciseStore,
} from '@bregenz-bewegt/client/common/stores';
import { inject, observer } from 'mobx-react';
import { RouteComponentProps } from 'react-router-dom';
import { Exercise } from '@bregenz-bewegt/client/types';
import { tabRoutes } from '@bregenz-bewegt/client-ui-router';
import { location } from 'ionicons/icons';

interface MatchParams {
  exercise: string;
}

export interface ExerciseDetailProps extends RouteComponentProps<MatchParams> {
  exerciseStore?: ExerciseStore;
}

export const ExerciseDetail: React.FC<ExerciseDetailProps> = inject(
  exerciseStore.storeKey
)(
  observer(({ exerciseStore, match }) => {
    const [exercise, setExercise] = useState<Exercise>();
    const [isLoadingExercises, setIsLoadingExercises] = useState<boolean>(true);

    useEffect(() => {
      const exerciseId = +match.params.exercise;
      if (!exerciseId) return;

      exerciseStore?.getExerciseWithPark(exerciseId).then((exercise) => {
        setExercise(exercise);
        setIsLoadingExercises(false);
      });
    }, [match.params.exercise]);

    console.log(exercise);

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
            <IonTitle>{exercise?.name}</IonTitle>
          </IonToolbar>
        </IonHeader>
        <IonContent className="exercise-detail__content">
          <div className="exercise-detail__content__video-wrapper"></div>
          <div className="exercise-detail__content__content">
            <IonText>
              <h1>{exercise?.name}</h1>
            </IonText>
            <IonNote>
              <IonIcon icon={location} />
              {exercise?.name}
            </IonNote>
            <IonText>
              <h1>{exercise?.name}</h1>
            </IonText>
            <IonNote>
              {/* <IonIcon icon={location} /> */}
              {exercise?.name}
            </IonNote>
          </div>
        </IonContent>
      </IonPage>
    );
  })
);
