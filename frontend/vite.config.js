import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react-swc';

export default defineConfig({
  base: '/scv/',  // nome do seu repo com barras
  plugins: [react()],
});
