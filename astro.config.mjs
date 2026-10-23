import { defineConfig } from 'astro/config';
import { inMemoryDbPlugin } from './src/server/in-memory-db-plugin.js';

export default defineConfig({
  server: {
    port: 4321,
    host: true
  },
  vite: {
    plugins: [inMemoryDbPlugin()]
  }
});
