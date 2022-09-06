import { IonButton } from '@ionic/react';
import './quick-filter.scss';

export interface QuickFilterProps {
  options?: string[];
}

export const QuickFilter: React.FC<QuickFilterProps> = ({ options }) => {
  return (
    <div className="quick-filter">
      {options?.map((option, i) => {
        return <IonButton size="small">{option}</IonButton>;
      })}
    </div>
  );
};
