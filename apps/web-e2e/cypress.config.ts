import { defineConfig } from 'cypress';
import { nxE2EPreset } from '@nrwl/cypress/plugins/cypress-preset';

export default defineConfig({
  projectId: '43soy4',
  e2e: nxE2EPreset(__dirname),
});
