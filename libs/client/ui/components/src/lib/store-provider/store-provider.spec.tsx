import { render } from '@testing-library/react';

import StoreProvider from './store-provider';

describe('StoreProvider', () => {
  it('should render successfully', () => {
    const { baseElement } = render(<StoreProvider />);
    expect(baseElement).toBeTruthy();
  });
});
