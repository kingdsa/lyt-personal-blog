import vue from "@vitejs/plugin-vue";
import { resolve } from "path";
import AutoImport from "unplugin-auto-import/vite";
import Components from "unplugin-vue-components/vite";
import { NaiveUiResolver } from "unplugin-vue-components/resolvers";
import { loadEnv, defineConfig } from "vite";
const pathSrc = resolve(__dirname, "src");
// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd());
  console.log("env:", mode);

  const apiProxyRewriteReg = new RegExp(`^${env.VITE_PROXY_API}`);

  return {
    resolve: {
      alias: {
        "@": pathSrc,
      },
    },
    base: "./",
    server: {
      open: false, //启动项目自动弹出浏览器
      port: 4002, //启动端口
      proxy: {
        [env.VITE_PROXY_API]: {
          target: env.VITE_APP_API_URL,
          changeOrigin: true,
          rewrite: (path) => path.replace(apiProxyRewriteReg, ""),
        },
      },
    },

    plugins: [
      vue(),
      AutoImport({
        imports: [
          "vue",
          {
            "naive-ui": [
              "useDialog",
              "NLayout",
              "useMessage",
              "useNotification",
              "useLoadingBar",
            ],
          },
        ],
      }),
      Components({
        resolvers: [NaiveUiResolver()],
      }),
    ],
  };
});
