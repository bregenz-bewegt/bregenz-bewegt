import { IonButton } from '@ionic/react';
import './quick-filter.scss';

export type QuickFilterOption = {
  key: string | number;
  label: string;
  active: boolean;
};

export interface QuickFilterProps {
  options: QuickFilterOption[];
  className?: string;
}

export const QuickFilter: React.FC<QuickFilterProps> = ({
  options,
  className,
}) => {
  return (
    <div className={`quick-filter${className ? ` ${className}` : ''}`}>
      {options?.map((option, i) => {
        return (
          <IonButton
            className="quick-filter__option"
            size="small"
            color={option.active ? 'primary' : 'secondary'}
          >
            {option.label}
          </IonButton>
        );
      })}
    </div>
  );
};
