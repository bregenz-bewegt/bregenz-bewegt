import './park-detail.scss';
import {
  BackButton,
  ExerciseCard,
  QuickFilter,
  QuickFilterOption,
} from '@bregenz-bewegt/client-ui-components';
import { tabRoutes } from '@bregenz-bewegt/client-ui-router';
import {
  ExerciseStore,
  parkStore,
  userStore,
  UserStore,
} from '@bregenz-bewegt/client/common/stores';
import {
  DifficultyType,
  Park,
  Exercise,
  Role,
} from '@bregenz-bewegt/client/types';
import {
  IonContent,
  IonNote,
  IonPage,
  IonRouterLink,
  IonText,
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

        if (userStore.user?.role === Role.USER) {
          userStore
            ?.fetchPreferences()
            .then((p) =>
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
            )
            .catch(() => {
              enableAllFilters(parkNew);
            });
        } else {
          enableAllFilters(parkNew);
        }

        setIsLoading(false);
      });
    }, [match.params.park]);

    const handleFilterChange = (
      enabledFilters: QuickFilterOption[],
      p?: Park
    ) => {
      setQuickFilters(enabledFilters);
      setExercises(
        (p ?? park)?.exercises?.filter(
          (e) =>
            enabledFilters.find(
              (qf) => (qf.key as DifficultyType) === e.difficulty
            )?.active
        )
      );
    };

    const enableAllFilters = (p: Park) => {
      handleFilterChange(
        Object.values(DifficultyType).map(
          (d) =>
            ({
              key: d,
              label: difficultyDisplayTexts[d],
              active: true,
            } as QuickFilterOption)
        ),
        p
      );
    };

    return isLoading ? (
      <Loading />
    ) : (
      <IonPage className="park-detail">
        <IonContent className="park-detail__content">
          <BackButton />
          <img
            src={park?.image}
            alt={'Bild des Spielplatzes ' + park?.name}
            className="park-detail__content__main-img"
          />
          <img
            src={park?.image}
            alt={'Bild des Spielplatzes ' + park?.name}
            className="park-detail__content__correction-img"
          />
          <div className="park-detail__content__placeholder"></div>
          <div className="park-detail__content__header-wrapper">
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
              className={`park-detail__content__header-wrapper__quick-filters`}
            />
          </div>
          <div className="park-detail__content__exercises">
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
