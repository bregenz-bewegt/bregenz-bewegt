import { IonButton } from '@ionic/react';
import './quick-filter.scss';

export interface QuickFilterProps {
  options: string[];
  className?: string;
}

export const QuickFilter: React.FC<QuickFilterProps> = ({
  options,
  className,
}) => {
  return (
    <div className={`quick-filter${className ? ` ${className}` : ''}`}>
      {options?.map((option, i) => {
        return <IonButton size="small">{option}</IonButton>;
      })}
    </div>
  );
};
