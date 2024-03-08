import { defineConfig, loadEnv } from "vite";
import vue from "@vitejs/plugin-vue";
import { resolve } from "path";
import AutoImport from "unplugin-auto-import/vite"; // 自动引入vue的函数
import VueSetupExtend from "vite-plugin-vue-setup-extend"; // setup 可以设置name
import { visualizer } from "rollup-plugin-visualizer";

// 当前时间字符串格式，用于拼接成文件名
function getNowStr() {
  const now = new Date();
  // 格式示例：'2023-09-25__09_00_00'
  const [year, month, day, hour, minute, second] = [
    now.getFullYear().toString(),
    [
      now.getMonth() + 1,
      now.getDate(),
      now.getHours(),
      now.getMinutes(),
      now.getSeconds(),
    ].map((val) => val.toString().padStart(2, "0")),
  ].flat();
  return `${[year, month, day].join("-")}__${[hour, minute, second].join("_")}`;
}

const isProdEnv = mode => mode === 'prod'

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), "");
  console.log({mode})
  return {
    plugins: [
      vue(),
      VueSetupExtend(),
      AutoImport({
        imports: ["vue", "vue-router"],
        dirs: ["src/compositions"],
        dts: "src/types/auto-import.d.ts",
      }),
      visualizer({
        open: true, // 注意这里要设置为true，否则无效
        gzipSize: true, // 分析图生成的文件名
        brotliSize: true, // 收集 brotli 大小并将其显示
        filename: "stats.html", // 分析图生成的文件名
      }),
    ],
    resolve: {
      // 别名
      alias: {
        "@": resolve(__dirname, "src"),
        "@views": resolve(__dirname, "src/views/"),
        "@types": resolve(__dirname, "src/types/"),
        "@img": resolve(__dirname, "src/assets/images"),
        "@stores": resolve(__dirname, "src/stores"),
        "@hooks": resolve(__dirname, "src/hooks"),
        "@utils": resolve(__dirname, "src/utils/"),
        "@router": resolve(__dirname, "src/router"),
        // "@consts": resolve(__dirname, "src/consts"),
      },
      extensions: ["mjs", ".js", ".ts", ".jsx", ".tsx", ".json"], // 忽略后缀
    },
    build: {
      // 打包输出目录
      // 如只填 dist， 请移步package.json修改一下命令
      outDir: `dist/${env.VITE_BUILD_OUTDIRNAME}`,
      // 是否需要显示map文件
      sourcemap: isProdEnv(mode),
      // chunk大小警告的限制(KB)
      chunkSizeWarningLimit: 2 ** 10 * 1,
      rollupOptions: {
        output: {
          // 入口文件名
          entryFileNames(chunkInfo) {
            return `assets/entry-${
              chunkInfo.type
            }-[name]-[hash]-${getNowStr()}.js`;
          },
          // 块文件名
          chunkFileNames(chunkInfo) {
            return `assets/${chunkInfo.type}-[name]-[hash]-${getNowStr()}.js`;
          },
          // 资源文件名，css、图片等
          assetFileNames(chunkInfo) {
            return `assets/${
              chunkInfo.type
            }-[name]-[hash]-${getNowStr()}.[ext]`;
          },
          // 分割打包
          manualChunks(id) {
            if (id.includes("node_modules")) {
              const path = id.toString().split("node_modules/")[1];
              return `node_modules-${path.split("/")[0].toString()}`;
            }
          },
        },
      },
      commonjsOptions: {
        requireReturnsDefault: "namespace", // 要求ES模块返回其名称空间，但插件不添加标记，从而创建更高效的代码
      },
      target: ["es2015"],
      polyfillDynamicImport: true,
      minify: true,
      brotliSize: false,
      terserOptions: {
        compress: {
          drop_console: isProdEnv(mode), // 删除所有 console
          drop_debugger: isProdEnv(mode), // 删除 debugger
        },
      },
    },
    server: {
      hmr: true,
      host: "0.0.0.0",
      port: parseInt(env.VITE_SERVER_PORT),
      strictPort: true,
      proxy: {
        "/api": {
          target: "",
          changeOrigin: true,
          rewrite: (path) => path.replace(/^\/api/, ""),
        },
      },
    },
    preview: {
      port: 5000
    }
  };
});
