import './activity-timer.scss';
import {
  DndContext,
  DragEndEvent,
  DragStartEvent,
  MouseSensor,
  TouchSensor,
  useDraggable,
  useDroppable,
  useSensor,
  useSensors,
} from '@dnd-kit/core';
import { restrictToParentElement } from '@dnd-kit/modifiers';
import { ActivityStore } from '@bregenz-bewegt/client/common/stores';
import { ReactNode, useState } from 'react';
import { IonIcon, IonText } from '@ionic/react';
import {
  timer,
  stopCircle,
  chevronForward,
  chevronBack,
  lockClosed,
} from 'ionicons/icons';
import { useStopwatch } from 'react-timer-hook';
import moment from 'moment';

const handleId = 'handle' as const;
const lockingSectionId = 'locking-section' as const;

export interface ActivityTimerProps {
  onTimerStart: () => void;
  onTimerStop: (time: {
    seconds: number;
    minutes: number;
    hours: number;
  }) => void;
  disabled?: boolean;
  activityStore?: ActivityStore;
}

export const ActivityTimer: React.FC<ActivityTimerProps> = ({
  onTimerStart,
  onTimerStop,
  disabled,
  activityStore,
}) => {
  const [isLocked, setIsLocked] = useState<boolean>(false);
  const sensors = useSensors(useSensor(TouchSensor), useSensor(MouseSensor));
  const stopwatch = useStopwatch({
    autoStart: false,
    offsetTimestamp: new Date(),
  });

  const handleDragStart = (e: DragStartEvent) => {
    //
  };
  const handleDragEnd = (e: DragEndEvent) => {
    if (isLocked) {
      setIsLocked(false);
      stopwatch.reset();
      onTimerStop({
        seconds: stopwatch.seconds,
        minutes: stopwatch.minutes,
        hours: stopwatch.hours,
      });
      return;
    }
    if (e.over && e.over.id === lockingSectionId) {
      setIsLocked(true);
      stopwatch.start();
      onTimerStart();
      return;
    }
  };

  return (
    <div className="activity-timer">
      <DndContext
        sensors={sensors}
        onDragStart={handleDragStart}
        onDragEnd={handleDragEnd}
        modifiers={[restrictToParentElement]}
      >
        <div className="activity-timer__sliding-restrictor">
          {!isLocked && <Handle icon={timer} />}
          {isLocked ? (
            <div className="activity-timer__time">
              <IonText>
                {moment({
                  seconds: stopwatch.seconds,
                  minutes: stopwatch.minutes,
                  hours: stopwatch.hours,
                }).format('HH:mm:ss')}
              </IonText>
            </div>
          ) : (
            <div className="activity-timer__arrows">
              {new Array(3)
                .fill(null)
                .map((_, i) =>
                  isLocked ? (
                    <IonIcon key={`arrow-pulse-${i}`} icon={chevronBack} />
                  ) : (
                    <IonIcon key={`arrow-pulse-${i}`} icon={chevronForward} />
                  )
                )}
            </div>
          )}
          <div className="activity-timer__info">
            <IonText>
              {isLocked ? 'Halten um zu beenden' : 'Übung starten'}
            </IonText>
          </div>
          <LockingSection>
            {isLocked ? <Handle icon={stopCircle} /> : null}
          </LockingSection>
        </div>
      </DndContext>
    </div>
  );
};

interface HandleProps {
  icon: string;
  disabled?: ActivityTimerProps['disabled'];
}

const Handle: React.FC<HandleProps> = ({ icon, disabled }) => {
  const { setNodeRef, transform, listeners, attributes, isDragging } =
    useDraggable({
      id: handleId,
      disabled,
    });
  const style = {
    transition: 'transform 0.5s',
    ...(isDragging && { transition: undefined }),
    ...(transform && {
      transform: `${
        transform && `translate3d(${transform.x}px, ${transform.y}px, 0)`
      }${isDragging && ` scale(.9)`}`,
    }),
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className="activity-timer__handle"
      {...listeners}
      {...attributes}
    >
      <IonIcon icon={disabled ? lockClosed : icon} />
    </div>
  );
};

interface LockingSectionProps {
  children: ReactNode;
}

const LockingSection: React.FC<LockingSectionProps> = ({ children }) => {
  const { setNodeRef } = useDroppable({
    id: lockingSectionId,
  });

  return (
    <div ref={setNodeRef} className="activity-timer__locking-section">
      {children}
    </div>
  );
};
