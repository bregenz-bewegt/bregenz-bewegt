import { IonChip, IonLabel } from '@ionic/react';
import './quick-filter.scss';
import { QuickFilterOption } from './quick-filter-option';
import { Add, CloseCircle } from 'iconsax-react';

export interface QuickFilterProps {
  options: QuickFilterOption[];
  className?: string;
  onChange: (values: QuickFilterOption[]) => void;
  iconSize?: number;
  allButton?: boolean;
}

const allButtonKey = 'ALL';

export const QuickFilter: React.FC<QuickFilterProps> = ({
  options,
  className,
  onChange,
  iconSize,
  allButton,
}) => {
  const every = options?.every((o) => o.active);
  let newOptions = options ? [...options] : null;
  if (allButton) {
    newOptions =
      newOptions?.map(
        (o) =>
          ({
            ...o,
            active: every ? false : o.active,
          } as QuickFilterOption)
      ) ?? null;

    newOptions?.unshift({
      key: allButtonKey,
      label: 'Alle',
      active: !newOptions.some((o) => o.active),
    });
  }
  return (
    <div className={`quick-filter${className ? ` ${className}` : ''}`}>
      {newOptions?.map((option, i) => {
        options = newOptions?.filter((o) => o.key !== allButtonKey) ?? [];
        const none = options.every((o) =>
          o.key === option.key ? o.active : !o.active
        );
        return (
          <IonChip
            className="quick-filter__option"
            key={i}
            color={option.active ? 'primary' : 'medium'}
            style={
              option.color
                ? {
                    color: option.color.font,
                    backgroundColor: option.color.background,
                  }
                : {}
            }
            onClick={() =>
              onChange([
                ...options.map((o) =>
                  option.key === allButtonKey || (allButton && none)
                    ? ({ ...o, active: true } as QuickFilterOption)
                    : o.key === option.key
                    ? ({
                        ...o,
                        active: !o.active,
                      } as QuickFilterOption)
                    : o
                ),
              ])
            }
          >
            <IonLabel>{option.label}</IonLabel>
            {option.key !== allButtonKey ? (
              option.active ? (
                <CloseCircle variant="Bold" size={iconSize ?? 16} />
              ) : !allButton ? (
                <Add variant="Linear" size={iconSize ?? 16} />
              ) : (
                ''
              )
            ) : (
              ''
            )}
          </IonChip>
        );
      })}
    </div>
  );
};
