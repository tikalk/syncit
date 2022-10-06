import { render } from '@testing-library/react';

import CoreHooks from './core-hooks';

describe('CoreHooks', () => {
  it('should render successfully', () => {
    const { baseElement } = render(<CoreHooks />);
    expect(baseElement).toBeTruthy();
  });
});
