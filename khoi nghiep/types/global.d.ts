// Global type declarations for ViLaw

declare global {
  interface Window {
    apiService: any
    legalCrawler: any
    API_CONFIG: any
    RATE_LIMITS: any
    ERROR_CONFIG: any
  }
}

export {}

// Allow importing image assets
declare module '*.jpg' {
  const content: import('next/image').StaticImageData
  export default content
}