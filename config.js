// ViLaw API Configuration
const API_CONFIG = {
    // YouTube Data API v3
    youtube: {
        baseUrl: 'https://www.googleapis.com/youtube/v3',
        apiKey: 'YOUR_YOUTUBE_API_KEY', // Thay bằng API key thật
        endpoints: {
            search: '/search',
            videos: '/videos',
            channels: '/channels'
        }
    },
    
    // Facebook Graph API
    facebook: {
        baseUrl: 'https://graph.facebook.com/v18.0',
        accessToken: 'YOUR_FACEBOOK_ACCESS_TOKEN', // Thay bằng access token thật
        endpoints: {
            search: '/search',
            posts: '/posts'
        }
    },
    
    // TikTok Research API (cần đăng ký)
    tiktok: {
        baseUrl: 'https://open.tiktokapis.com/v2',
        accessToken: 'YOUR_TIKTOK_ACCESS_TOKEN',
        endpoints: {
            research: '/research/video/query'
        }
    },
    
    // Twitter API v2
    twitter: {
        baseUrl: 'https://api.twitter.com/2',
        bearerToken: 'YOUR_TWITTER_BEARER_TOKEN',
        endpoints: {
            search: '/tweets/search/recent',
            users: '/users'
        }
    },
    
    // Pháp luật Việt Nam APIs
    vietnamLaw: {
        // API của Cổng thông tin điện tử Chính phủ
        govPortal: 'https://vanban.chinhphu.vn/api',
        // API văn bản pháp luật
        lawDatabase: 'https://thuvienphapluat.vn/api',
        // API tra cứu luật
        lawSearch: 'https://luatvietnam.vn/api'
    },
    
    // AI Services
    ai: {
        // Google Gemini API (primary)
        gemini: {
            baseUrl: 'https://generativelanguage.googleapis.com/v1beta',
            apiKey: process.env.GEMINI_API_KEY || 'YOUR_GEMINI_API_KEY',
            model: 'gemini-pro'
        },

        // Fallback to local AI or mock responses
        fallback: {
            enabled: true,
            useLocalResponses: true
        },
        
    },
    
    // OCR Services
    ocr: {
        // Google Cloud Vision API (recommended for Vietnamese)
        googleVision: {
            baseUrl: 'https://vision.googleapis.com/v1',
            apiKey: 'YOUR_GOOGLE_VISION_API_KEY'
        },
        
        // Tesseract.js (client-side, free)
        tesseract: {
            workerPath: 'https://unpkg.com/tesseract.js@4/dist/worker.min.js',
            corePath: 'https://unpkg.com/tesseract.js-core@4/tesseract-core.wasm.js',
            languages: ['vie', 'eng'] // Vietnamese + English
        },
        
        // Azure Computer Vision (good accuracy)
        azure: {
            baseUrl: 'https://[region].api.cognitive.microsoft.com/vision/v3.2',
            apiKey: 'YOUR_AZURE_VISION_API_KEY',
            region: 'southeastasia'
        },
        
        // AWS Textract (for advanced document analysis)
        aws: {
            region: 'ap-southeast-1',
            accessKey: 'YOUR_AWS_ACCESS_KEY',
            secretKey: 'YOUR_AWS_SECRET_KEY'
        }
    },

    // Google APIs for legal document search
    google: {
        customSearchApiKey: process.env.GOOGLE_CUSTOM_SEARCH_API_KEY || 'YOUR_GOOGLE_CUSTOM_SEARCH_API_KEY',
        customSearchEngineId: process.env.GOOGLE_CUSTOM_SEARCH_ENGINE_ID || 'YOUR_GOOGLE_CUSTOM_SEARCH_ENGINE_ID',
        // Configure custom search to search Vietnamese legal sites
        legalSites: [
            'vanban.chinhphu.vn',
            'thuvienphapluat.vn',
            'quochoi.vn',
            'toaan.gov.vn',
            'moj.gov.vn',
            'mof.gov.vn',
            'molisa.gov.vn'
        ]
    },

    // ViLaw Backend (nếu có)
    vilaw: {
        baseUrl: 'https://api.vilaw.vn/v1',
        apiKey: 'YOUR_VILAW_API_KEY'
    }
};

// Rate limiting configuration
const RATE_LIMITS = {
    youtube: {
        requestsPerDay: 10000,
        requestsPerMinute: 100
    },
    facebook: {
        requestsPerHour: 200
    },
    twitter: {
        requestsPerMonth: 10000
    },
    openai: {
        tokensPerMinute: 40000,
        requestsPerMinute: 200
    }
};

// Error handling configuration
const ERROR_CONFIG = {
    retryAttempts: 3,
    retryDelay: 1000,
    timeoutMs: 30000
};

// Export configuration
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { API_CONFIG, RATE_LIMITS, ERROR_CONFIG };
} else {
    window.API_CONFIG = API_CONFIG;
    window.RATE_LIMITS = RATE_LIMITS;
    window.ERROR_CONFIG = ERROR_CONFIG;
}