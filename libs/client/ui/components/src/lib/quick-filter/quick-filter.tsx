import { IonButton, IonIcon } from '@ionic/react';
import { useState } from 'react';
import './quick-filter.scss';
import { close } from 'ionicons/icons';

export type QuickFilterOption = {
  key: string | number;
  label: string;
  active: boolean;
};

export interface QuickFilterProps {
  options: QuickFilterOption[];
  className?: string;
  onChange: (values: QuickFilterOption[]) => void;
}

export const QuickFilter: React.FC<QuickFilterProps> = ({
  options,
  className,
  onChange,
}) => {
  const [selection, setSelection] = useState<QuickFilterOption[]>(options);

  return (
    <div className={`quick-filter${className ? ` ${className}` : ''}`}>
      {options?.map((option, i) => {
        return (
          <IonButton
            className="quick-filter__option"
            size="small"
            color={option.active ? 'primary' : 'secondary'}
            onClick={() =>
              onChange([
                ...options.filter((o) => o.key !== option.key),
                { ...options[i], active: !options[i].active },
              ])
            }
          >
            {option.label} {option.active && <IonIcon icon={close} />}
          </IonButton>
        );
      })}
    </div>
  );
};
