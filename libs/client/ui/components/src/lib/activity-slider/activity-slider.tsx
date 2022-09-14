import './activity-slider.scss';

/* eslint-disable-next-line */
export interface ActivitySliderProps {}

export const ActivitySlider: React.FC<ActivitySliderProps> = (
  props: ActivitySliderProps
) => {
  return (
    <div className="activity-slider">
      <div className="activity-slider__handle"></div>
    </div>
  );
};
