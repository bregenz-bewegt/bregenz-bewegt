import { IonChip, IonLabel } from '@ionic/react';
import './quick-filter.scss';
import { QuickFilterOption } from './quick-filter-option';
import { Add, CloseCircle } from 'iconsax-react';

export interface QuickFilterProps {
  options: QuickFilterOption[];
  className?: string;
  onChange: (values: QuickFilterOption[]) => void;
  iconSize?: number;
}

export const QuickFilter: React.FC<QuickFilterProps> = ({
  options,
  className,
  onChange,
  iconSize,
}) => {
  return (
    <div className={`quick-filter${className ? ` ${className}` : ''}`}>
      {options?.map((option, i) => {
        return (
          <IonChip
            className="quick-filter__option"
            key={i}
            color={option.active ? 'primary' : 'medium'}
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
            <IonLabel>{option.label}</IonLabel>
            {option.active ? (
              <CloseCircle variant="Bold" size={iconSize ?? 16} />
            ) : (
              <Add variant="Linear" size={iconSize ?? 16} />
            )}
          </IonChip>
        );
      })}
    </div>
  );
};
