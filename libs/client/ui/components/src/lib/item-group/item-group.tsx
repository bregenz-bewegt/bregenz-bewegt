import { IonItemGroup } from '@ionic/react';
import { ReactNode } from 'react';
import './item-group.scss';

export interface ItemGroupProps {
  children: ReactNode;
}

export const ItemGroup = ({ children }: ItemGroupProps) => {
  return <IonItemGroup className="item-group">{children}</IonItemGroup>;
};
