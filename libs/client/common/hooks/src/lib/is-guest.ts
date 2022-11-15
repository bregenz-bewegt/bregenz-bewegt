import { Role } from '@bregenz-bewegt/client/types';
import { userStore } from '@bregenz-bewegt/client/common/stores';

export function useIsGuest(): [boolean] {
  return [userStore?.user?.role === Role.GUEST];
}
