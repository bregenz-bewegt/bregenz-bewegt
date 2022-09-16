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
import { IonIcon } from '@ionic/react';
import { timer, stopCircle, chevronForward } from 'ionicons/icons';

const handleId = 'handle' as const;
const lockingSectionId = 'locking-section' as const;

export interface ActivityTimerProps {
  onTimerStart?: () => void;
  onTimerStop?: () => void;
  activityStore?: ActivityStore;
}

export const ActivityTimer: React.FC<ActivityTimerProps> = ({
  activityStore,
}) => {
  const [isLocked, setIsLocked] = useState<boolean>(false);
  const sensors = useSensors(useSensor(TouchSensor), useSensor(MouseSensor));

  const handleDragStart = (e: DragStartEvent) => {
    //
  };
  const handleDragEnd = (e: DragEndEvent) => {
    if (isLocked) return setIsLocked(false);
    if (e.over && e.over.id === lockingSectionId) {
      return setIsLocked(true);
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
          <div className="activity-timer__arrows">
            {new Array(3).fill(null).map((_, i) => (
              <IonIcon key={`arrow-pulse-${i}`} icon={chevronForward} />
            ))}
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
}

const Handle: React.FC<HandleProps> = ({ icon }) => {
  const { setNodeRef, transform, listeners, attributes, isDragging } =
    useDraggable({
      id: handleId,
    });
  const style = {
    transition: 'transform 0.5s',
    ...(isDragging && { transition: undefined }),
    ...(transform && {
      transform: `translate3d(${transform.x}px, ${transform.y}px, 0)`,
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
      <IonIcon icon={icon} />
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
