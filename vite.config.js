import {defineConfig} from "vite";

export default defineConfig({
  //config options
  base: "/KWS-EX-02/",
  server: {
    proxy: {
      "/KWS-EX-02/api": "http://localhost:3000",
    }
  }
});