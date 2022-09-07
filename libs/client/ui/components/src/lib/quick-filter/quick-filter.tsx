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
                ...options.map((o) =>
                  o.key === option.key
                    ? ({ ...o, active: !o.active } as QuickFilterOption)
                    : o
                ),
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