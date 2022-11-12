import './park-detail.scss';
import {
  ExerciseCard,
  QuickFilter,
  QuickFilterOption,
  TransitionBlock,
} from '@bregenz-bewegt/client-ui-components';
import { tabRoutes } from '@bregenz-bewegt/client-ui-router';
import {
  ExerciseStore,
  parkStore,
  userStore,
  UserStore,
} from '@bregenz-bewegt/client/common/stores';
import { DifficultyType, Park, Exercise } from '@bregenz-bewegt/client/types';
import {
  IonBackButton,
  IonButtons,
  IonContent,
  IonHeader,
  IonNote,
  IonPage,
  IonRouterLink,
  IonSkeletonText,
  IonText,
  IonTitle,
  IonToolbar,
} from '@ionic/react';
import { inject, observer } from 'mobx-react';
import { useEffect, useState } from 'react';
import { RouteComponentProps, useHistory } from 'react-router-dom';
import { Loading } from '../loading/loading';
import { Location } from 'iconsax-react';
import { difficultyDisplayTexts } from '@bregenz-bewegt/client/ui/shared/content';

interface MatchParams {
  park: string;
}

export interface ParkDetail extends RouteComponentProps<MatchParams> {
  parkStore?: ExerciseStore;
  userStore?: UserStore;
}

export const ParkDetail: React.FC<ParkDetail> = inject(
  parkStore.storeKey,
  userStore.storeKey
)(
  observer(({ match }) => {
    const history = useHistory();
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [park, setPark] = useState<Park>();
    const [exercises, setExercises] = useState<Exercise[]>();
    const [quickFilters, setQuickFilters] = useState<QuickFilterOption[]>();

    useEffect(() => {
      const navigateBackToStart = () =>
        history.push(`${tabRoutes.start.route}`);
      const parkId = +match.params.park;

      if (!parkId) {
        return navigateBackToStart();
      }

      parkStore.getParkWithExercises(parkId).then((parkNew) => {
        if (!parkNew) return navigateBackToStart();

        setPark(parkNew);
        setExercises(parkNew.exercises);

        userStore?.fetchPreferences().then((p) =>
          handleFilterChange(
            Object.values(DifficultyType).map(
              (d) =>
                ({
                  key: d,
                  label: difficultyDisplayTexts[d],
                  active: p.difficulties?.includes(d),
                } as QuickFilterOption)
            ),
            parkNew
          )
        );

        setIsLoading(false);
      });
    }, [match.params.park]);

    const handleFilterChange = (v: QuickFilterOption[], p?: Park) => {
      setQuickFilters(v);
      setExercises(
        (p ?? park)?.exercises?.filter(
          (e) =>
            v.find((qf) => (qf.key as DifficultyType) === e.difficulty)?.active
        )
      );
    };

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
        <IonContent fullscreen scrollY={false}>
          <div className="park-detail__header-wrapper">
            <img
              src={park?.image}
              alt={'Bild des Spielplatzes ' + park?.name}
            />
            <IonText>
              <h1>{park?.name}</h1>
            </IonText>
            <IonNote>
              <IonRouterLink
                color={'dark'}
                href={
                  'https://www.google.com/maps/search/?api=1&query=' +
                  encodeURIComponent(park?.address ?? '')
                }
                target="_blank"
              >
                <Location variant="Bold" size={16} />
                {park?.address}
              </IonRouterLink>
            </IonNote>
            <QuickFilter
              options={quickFilters ?? []}
              onChange={(v) => handleFilterChange(v)}
              className={`park-detail__header-wrapper__quick-filters`}
            />
          </div>
          <div className="park-detail__exercises">
            <TransitionBlock />
            {exercises &&
              park?.id &&
              exercises.map((e) => {
                return (
                  <ExerciseCard
                    {...e}
                    link={`${tabRoutes.start.route}/${park?.id}/${e.id}`}
                  />
                );
              })}
          </div>
        </IonContent>
      </IonPage>
    );
  })
);
