import './park-detail.scss';
import { ExerciseCard } from '@bregenz-bewegt/client-ui-components';
import { tabRoutes } from '@bregenz-bewegt/client-ui-router';
import {
  ExerciseStore,
  parkStore,
  UserStore,
  userStore,
} from '@bregenz-bewegt/client/common/stores';
import { Park } from '@bregenz-bewegt/client/types';
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
import { inject, observer } from 'mobx-react';
import { useEffect, useState } from 'react';
import { RouteComponentProps, useHistory } from 'react-router-dom';
import { Loading } from '../loading/loading';
import { location } from 'ionicons/icons';

interface MatchParams {
  park: string;
}

export interface ParkDetail extends RouteComponentProps<MatchParams> {
  userStore?: UserStore;
  parkStore?: ExerciseStore;
}

export const ParkDetail: React.FC<ParkDetail> = inject(
  userStore.storeKey,
  parkStore.storeKey
)(
  observer(({ userStore, match }) => {
    const history = useHistory();
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [park, setPark] = useState<Park>();

    useEffect(() => {
      const navigateBackToStart = () =>
        history.push(`${tabRoutes.start.route}`);
      const parkId = +match.params.park;

      if (!parkId) {
        navigateBackToStart();
      }

      parkStore.getParkWithExercises(parkId).then((park) => {
        if (!park) return navigateBackToStart();

        setPark(park);
        setIsLoading(false);
      });
    }, [match.params.park]);

    return isLoading ? (
      <Loading />
    ) : (
      <IonPage className="park-detail">
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
        <IonContent fullscreen>
          <div className="park-detail__scroll-wrapper">
            <div className="park-detail__scroll-wrapper__header-wrapper">
              <IonText>
                <h1>{park?.name}</h1>
              </IonText>
              <IonNote>
                <IonIcon icon={location} />
                {park?.address}
              </IonNote>
            </div>
            <div className="park-detail__scroll-wrapper__exercises">
              {park?.exercises &&
                park.exercises.length > 0 &&
                park.exercises.map((exercise) => {
                  return (
                    <ExerciseCard
                      {...exercise}
                      link={`${tabRoutes.start.route}/${park.id}/${exercise.id}`}
                    />
                  );
                })}
            </div>
          </div>
        </IonContent>
      </IonPage>
    );
  })
);
