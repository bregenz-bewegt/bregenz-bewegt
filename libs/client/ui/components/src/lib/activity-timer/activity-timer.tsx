import './activity-timer.scss';
import {
  DndContext,
  DragEndEvent,
  MouseSensor,
  TouchSensor,
  useDraggable,
  useDroppable,
  useSensor,
  useSensors,
} from '@dnd-kit/core';
import { restrictToParentElement } from '@dnd-kit/modifiers';
import { ReactNode, useState } from 'react';
import { IonIcon, IonText } from '@ionic/react';
import { chevronForward, chevronBack } from 'ionicons/icons';
import { useStopwatch, useTimer } from 'react-timer-hook';
import moment from 'moment';
import { StopCircle, Lock1, Timer1 } from 'iconsax-react';

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
}

export const ActivityTimer: React.FC<ActivityTimerProps> = ({
  onTimerStart,
  onTimerStop,
  disabled,
}) => {
  const [isLocked, setIsLocked] = useState<boolean>(false);
  const [isHoldingAfterStop, setIsHoldingAfterStop] = useState<boolean>(false);
  const [isHoldingBeforeStop, setIsHoldingBeforeStop] =
    useState<boolean>(false);
  const sensors = useSensors(useSensor(TouchSensor), useSensor(MouseSensor));
  const stopwatch = useStopwatch({
    autoStart: false,
    offsetTimestamp: new Date(),
  });

  const handleHoldTimerFinished = () => {
    setIsLocked(false);
    setIsHoldingAfterStop(true);
    setIsHoldingBeforeStop(false);
    stopwatch.reset();
    onTimerStop({
      seconds: stopwatch.seconds,
      minutes: stopwatch.minutes,
      hours: stopwatch.hours,
    });
  };

  const getHoldExpiry = () => {
    const time = new Date();
    time.setSeconds(new Date().getSeconds() + 1);
    return time;
  };

  const holdTimer = useTimer({
    autoStart: false,
    expiryTimestamp: getHoldExpiry(),
    onExpire: handleHoldTimerFinished,
  });

  const handleDragStart = () => {
    if (isLocked) {
      holdTimer.restart(getHoldExpiry());
      setIsHoldingBeforeStop(true);
    }
  };

  const handleDragEnd = (e: DragEndEvent) => {
    if (isHoldingAfterStop) {
      setIsHoldingAfterStop(false);
    } else if (!isLocked && e.over && e.over.id === lockingSectionId) {
      setIsLocked(true);
      stopwatch.start();
      onTimerStart();
    }
  };

  return (
    <div className="activity-timer">
      <div
        className={`activity-timer__animation ${
          isHoldingBeforeStop ? 'active' : ''
        }`}
      ></div>
      <div
        className={`activity-timer__animation ${
          isHoldingBeforeStop ? 'active' : ''
        }`}
      ></div>
      <div
        className={`activity-timer__animation ${
          isHoldingBeforeStop ? 'active' : ''
        }`}
      ></div>

      <DndContext
        sensors={sensors}
        onDragEnd={handleDragEnd}
        onDragStart={handleDragStart}
        modifiers={[restrictToParentElement]}
      >
        <div
          className={`activity-timer__sliding-restrictor ${
            isHoldingBeforeStop ? 'active' : ''
          }`}
        >
          {!isLocked && (
            <Handle
              disabled={disabled}
              started={false}
              isHoldingBeforeStop={isHoldingBeforeStop}
              isHoldingAfterStop={isHoldingAfterStop}
            />
          )}
          {isLocked ? (
            <div className="activity-timer__time">
              <IonText>
                {moment({
                  seconds: stopwatch.seconds,
                  minutes: stopwatch.minutes,
                  hours: stopwatch.hours,
                }).format('mm:ss')}
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
              {disabled
                ? 'Übung gesperrt'
                : isLocked
                ? 'Halten um zu beenden'
                : 'Übung starten'}
            </IonText>
          </div>
          <LockingSection>
            {isLocked ? (
              <Handle
                disabled={disabled}
                started={true}
                isHoldingBeforeStop={isHoldingBeforeStop}
                isHoldingAfterStop={isHoldingAfterStop}
              />
            ) : null}
          </LockingSection>
        </div>
      </DndContext>
    </div>
  );
};

interface HandleProps {
  started: boolean;
  disabled?: ActivityTimerProps['disabled'];
  isHoldingBeforeStop: boolean;
  isHoldingAfterStop: boolean;
}

const Handle: React.FC<HandleProps> = ({
  started,
  disabled,
  isHoldingBeforeStop,
  isHoldingAfterStop,
}) => {
  const { setNodeRef, transform, listeners, attributes, isDragging } =
    useDraggable({
      id: handleId,
      disabled,
    });

  const style = {
    ...(!isDragging && {
      transition: 'transform 0.5s',
    }),
    ...(transform && {
      transform: `${transform && `translateX(${transform.x}px)`}${
        isDragging && ` scale(.9)`
      }`,
    }),
  };

  return (
    <div
      ref={setNodeRef}
      style={isHoldingAfterStop ? {} : style}
      className={`activity-timer__handle ${
        isHoldingBeforeStop ? 'active' : ''
      } ${isHoldingAfterStop ? 'stopped' : ''}`}
      {...listeners}
      {...attributes}
    >
      {disabled ? (
        <Lock1 size={32} variant="Bold" color="white" />
      ) : started ? (
        <StopCircle size={32} variant="Bold" color="white" />
      ) : (
        <Timer1 size={32} variant="Bold" color="white" />
      )}
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
