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
  const handleMarkup = <Handle />;

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
          {!isLocked ? (
            <DragOverlay
              modifiers={[restrictToParentElement]}
              dropAnimation={{
                duration: 500,
                easing: 'cubic-bezier(0.18, 0.67, 0.6, 1.22)',
              }}
              transition={!isSliding ? 'transform 250ms ease' : undefined}
            >
              {handleMarkup}
            </DragOverlay>
          ) : null}
          <LockingSection>{isLocked ? handleMarkup : null}</LockingSection>
        </div>
      </DndContext>
    </div>
  );
};

const Handle: React.FC = () => {
  const { setNodeRef, transform, listeners, attributes } = useDraggable({
    id: handleId,
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
    id: lockingSectionId,
  });

  return (
    <div ref={setNodeRef} className="activity-slider__locking-section">
      {children}
    </div>
  );
};
