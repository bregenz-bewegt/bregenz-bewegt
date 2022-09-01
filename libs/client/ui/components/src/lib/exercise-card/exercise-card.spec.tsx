import { Difficulty } from '@bregenz-bewegt/client/types';
import { render } from '@testing-library/react';
import { ExerciseCard } from './exercise-card';

describe('DifficultyBadge', () => {
  it('should render successfully', () => {
    const { baseElement } = render(
      <ExerciseCard
        link={'#'}
        id={0}
        name={'test'}
        description={'some description'}
        video={'not-defined'}
        points={0}
        difficulty={Difficulty.BEGINNER}
      />
    );
    expect(baseElement).toBeTruthy();
  });
});
