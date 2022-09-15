import './activity-slider.scss';
import {
  DndContext,
  DragOverlay,
  MouseSensor,
  TouchSensor,
  useDraggable,
  useDroppable,
  useSensor,
  useSensors,
} from '@dnd-kit/core';
import { restrictToParentElement } from '@dnd-kit/modifiers';
import { ActivityStore } from '@bregenz-bewegt/client/common/stores';

export interface ActivitySliderProps {
  activityStore?: ActivityStore;
}

export const ActivitySlider: React.FC<ActivitySliderProps> = ({
  activityStore,
}) => {
  const sensors = useSensors(useSensor(TouchSensor), useSensor(MouseSensor));

  return (
    <div className="activity-slider">
      <DndContext sensors={sensors} modifiers={[restrictToParentElement]}>
        <DragOverlay transition={'transform 250ms ease'}>
          <div className="activity-slider__sliding-restrictor">
            <Handle />
            <LockingSection />
          </div>
        </DragOverlay>
      </DndContext>
    </div>
  );
};

const Handle: React.FC = () => {
  const { setNodeRef, transform, listeners, attributes } = useDraggable({
    id: 'draggable',
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

const LockingSection: React.FC = () => {
  const { setNodeRef } = useDroppable({
    id: 'locking-section',
  });

  return (
    <div ref={setNodeRef} className="activity-slider__locking-section"></div>
  );
};
