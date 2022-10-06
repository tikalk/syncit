import { render } from '@testing-library/react';

import CoreStore from './core-store';

describe('CoreStore', () => {
  it('should render successfully', () => {
    const { baseElement } = render(<CoreStore />);
    expect(baseElement).toBeTruthy();
  });
});
