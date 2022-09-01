import { Difficulty } from '@bregenz-bewegt/client/types';
import { render } from '@testing-library/react';

import { DifficultyBadge } from './difficulty-badge';

describe('DifficultyBadge', () => {
  it('should render successfully', () => {
    const { baseElement } = render(
      <DifficultyBadge difficulty={Difficulty.BEGINNER} />
    );
    expect(baseElement).toBeTruthy();
  });
});
