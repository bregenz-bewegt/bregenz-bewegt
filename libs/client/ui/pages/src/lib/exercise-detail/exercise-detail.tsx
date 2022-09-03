import './exercise-detail.scss';
import { IonContent, IonPage, IonTitle } from '@ionic/react';
import { Header } from '@bregenz-bewegt/client-ui-components';
import { useEffect, useState } from 'react';
import {
  exerciseStore,
  ExerciseStore,
} from '@bregenz-bewegt/client/common/stores';
import { inject, observer } from 'mobx-react';
import { RouteComponentProps } from 'react-router-dom';
import { Exercise } from '@bregenz-bewegt/client/types';

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

      exerciseStore?.getExercise(exerciseId).then((exercise) => {
        setExercise(exercise);
      });
    }, [match.params.exercise]);

    console.log(exercise);

    return (
      <IonPage className="exercise-detail">
        <Header />
        <IonContent>
          <IonTitle>Test</IonTitle>
        </IonContent>
      </IonPage>
    );
  })
);
