/// <reference types="vite/client" />
interface ImportMetaEnv {
  // 在这里声明你的环境变量
  readonly VITE_API_URL: string
}
interface ImportMeta {
  readonly env: ImportMetaEnv
}
