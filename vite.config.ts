import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'
import svgr from "vite-plugin-svgr";
// https://vitejs.dev/config/
export default defineConfig({
  server: { host: true },
  plugins: [react(), svgr()],
  // define: {
  //   'process.env': {}
  // }
})
