import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react-swc';

export default defineConfig({
  base: '/Sis_Controle_Coleta_Seletiva/',  // nome do seu repo com barras
  plugins: [react()],
});
