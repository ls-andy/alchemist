/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_ADSENSE_ENABLED: string
  readonly VITE_ADSENSE_CLIENT_ID: string
  readonly VITE_AD_SLOT_HEADER: string
  readonly VITE_AD_SLOT_SIDEBAR: string
  readonly VITE_AD_SLOT_TOOL_BELOW: string
  readonly VITE_AFDIAN_URL: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
