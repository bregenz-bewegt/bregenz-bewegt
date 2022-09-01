import './park-detail.scss';
import { ExerciseCard, Header } from '@bregenz-bewegt/client-ui-components';
import { tabRoutes } from '@bregenz-bewegt/client-ui-router';
import {
  ParkStore,
  parkStore,
  UserStore,
  userStore,
} from '@bregenz-bewegt/client/common/stores';
import { Park } from '@bregenz-bewegt/client/types';
import {
  IonBackButton,
  IonContent,
  IonIcon,
  IonNote,
  IonPage,
  IonText,
  IonTitle,
} from '@ionic/react';
import { inject, observer } from 'mobx-react';
import { useEffect, useState } from 'react';
import { RouteComponentProps, useHistory } from 'react-router-dom';
import { Loading } from '../loading/loading';
import { location } from 'ionicons/icons';

interface MatchParams {
  id: string;
}

export interface ParkDetail extends RouteComponentProps<MatchParams> {
  userStore?: UserStore;
  parkStore?: ParkStore;
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
      parkStore.getParkWithExercises(+match.params.id).then((park) => {
        setPark(park);
        setIsLoading(false);
      });
    }, [match.params]);

    console.log(park);

    return isLoading ? (
      <Loading />
    ) : (
      <IonPage className="park-detail">
        <Header />
        <IonContent fullscreen>
          <div className="park-detail__scroll-wrapper">
            <div className="park-detail__scroll-wrapper__header-wrapper">
              <IonBackButton
                color="primary"
                mode="ios"
                defaultHref={tabRoutes.start.route}
                text="Zurück"
              />
              <IonTitle>
                <h1>{park?.name}</h1>
              </IonTitle>
              <IonNote>
                <IonIcon icon={location} />
                {park?.address}
              </IonNote>
            </div>
            <div className="park-detail__scroll-wrapper__exercises">
              {park?.exercises &&
                park.exercises.length > 0 &&
                park.exercises.map((exercise) => {
                  return <ExerciseCard {...exercise} link={`#`} />;
                })}
            </div>
          </div>
        </IonContent>
      </IonPage>
    );
  })
);
