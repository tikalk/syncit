import { getGreeting } from '../support/app.po';

describe('web', () => {
  beforeEach(() => cy.visit('/auth/login'));

  it('should render the title of the login', () => {
    getGreeting().should('contain', 'Sign in to your account');
  });
});
