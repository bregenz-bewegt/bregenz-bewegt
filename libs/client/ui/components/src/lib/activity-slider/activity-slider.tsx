import './activity-slider.scss';
import { DndContext, useDraggable, useDroppable } from '@dnd-kit/core';

/* eslint-disable-next-line */
export interface ActivitySliderProps {}

export const ActivitySlider: React.FC<ActivitySliderProps> = (
  props: ActivitySliderProps
) => {
  return (
    <div className="activity-slider">
      <DndContext>
        <Handle />
        <LockingSection />
      </DndContext>
    </div>
  );
};

const Handle: React.FC = () => {
  const { setNodeRef, transform } = useDraggable({
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
    ></div>
  );
};

const LockingSection: React.FC = () => {
  const { setNodeRef } = useDroppable({
    id: 'locking-section',
  });

  return (
    <div ref={setNodeRef} className="activity-slider__locking-section">
      <div></div>
    </div>
  );
};
