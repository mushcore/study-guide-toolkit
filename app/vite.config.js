import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  base: '/study-guides/',
  plugins: [react()],
  server: {
    fs: {
      // Allow loading sibling content/_dist bundles that live one dir up.
      allow: ['..'],
    },
  },
});
