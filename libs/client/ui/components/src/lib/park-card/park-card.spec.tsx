import { render } from '@testing-library/react';

import ParkCard from './park-card';

describe('ParkCard', () => {
  it('should render successfully', () => {
    const { baseElement } = render(<ParkCard />);
    expect(baseElement).toBeTruthy();
  });
});
