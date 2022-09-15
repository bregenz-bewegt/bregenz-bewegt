import './activity-slider.scss';
import {
  DndContext,
  DragEndEvent,
  DragOverlay,
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

const handleId = 'handle' as const;
const lockingSectionId = 'locking-section' as const;

export interface ActivitySliderProps {
  activityStore?: ActivityStore;
}

export const ActivitySlider: React.FC<ActivitySliderProps> = ({
  activityStore,
}) => {
  const [isLocked, setIsLocked] = useState<boolean>(false);
  const [isSliding, setIsSliding] = useState<boolean>(false);
  const sensors = useSensors(useSensor(TouchSensor), useSensor(MouseSensor));

  const handleDragStart = (e: DragStartEvent) => {
    setIsSliding(true);
  };
  const handleDragEnd = (e: DragEndEvent) => {
    setIsSliding(true);

    if (isLocked) return setIsLocked(false);
    if (e.over && e.over.id === lockingSectionId) {
      return setIsLocked(true);
    }
  };

  return (
    <div className="activity-slider">
      <DndContext
        sensors={sensors}
        onDragStart={handleDragStart}
        onDragEnd={handleDragEnd}
        modifiers={[restrictToParentElement]}
      >
        <div className="activity-slider__sliding-restrictor">
          <Handle />
          <LockingSection>{isLocked ? <Handle /> : null}</LockingSection>
        </div>
      </DndContext>
    </div>
  );
};

interface HandleProps {
  isSliding?: boolean;
}

const Handle: React.FC<HandleProps> = ({ isSliding }) => {
  const { setNodeRef, transform, listeners, attributes } = useDraggable({
    id: handleId,
  });
  const style = transform
    ? {
        transform: `translate3d(${transform.x}px, ${transform.y}px, 0)`,
        ...(!isSliding && { transition: 'transform 250ms ease' }),
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
    id: lockingSectionId,
  });

  return (
    <div ref={setNodeRef} className={`activity-slider__locking-section`}>
      {children}
    </div>
  );
};
