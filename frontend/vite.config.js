import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react-swc';

export default defineConfig({
  base: '/selective-collection-control/',  // nome do seu repo com barras
  plugins: [react()],
});
