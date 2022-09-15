import './activity-slider.scss';
import {
  DndContext,
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

const activitySliderHandleId = 'handle' as const;

export interface ActivitySliderProps {
  activityStore?: ActivityStore;
}

export const ActivitySlider: React.FC<ActivitySliderProps> = ({
  activityStore,
}) => {
  const [isLocked, setIsLocked] = useState<boolean>(false);
  const sensors = useSensors(useSensor(TouchSensor), useSensor(MouseSensor));

  const handleMarkup = <Handle />;

  return (
    <div className="activity-slider">
      <DndContext
        sensors={sensors}
        modifiers={[restrictToParentElement]}
        onDragEnd={(e) => {
          if (e.over && e.over.id === activitySliderHandleId) {
            setIsLocked(true);
          }
        }}
      >
        <div className="activity-slider__sliding-restrictor">
          {!isLocked && handleMarkup}
          <LockingSection>{isLocked && handleMarkup}</LockingSection>
        </div>
      </DndContext>
    </div>
  );
};

const Handle: React.FC = () => {
  const { setNodeRef, transform, listeners, attributes } = useDraggable({
    id: activitySliderHandleId,
  });
  const style = transform
    ? {
        transform: `translate3d(${transform.x}px, ${transform.y}px, 0)`,
      }
    : undefined;

  return (
    <div
      ref={setNodeRef}
      style={style}
      className="activity-slider__handle"
      {...listeners}
      {...attributes}
    ></div>
  );
};

interface LockingSectionProps {
  children: ReactNode;
}

const LockingSection: React.FC<LockingSectionProps> = ({ children }) => {
  const { setNodeRef } = useDroppable({
    id: 'locking-section',
  });

  return (
    <div ref={setNodeRef} className="activity-slider__locking-section">
      {children}
    </div>
  );
};
