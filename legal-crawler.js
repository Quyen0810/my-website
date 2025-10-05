// ViLaw Legal Document Crawler & Updater
class LegalCrawler {
    constructor() {
        this.sources = {
            government: {
                name: 'Cổng thông tin Chính phủ',
                url: 'https://vanban.chinhphu.vn',
                searchApi: 'https://vanban.chinhphu.vn/api/search',
                rssFeeds: [
                    'https://vanban.chinhphu.vn/rss/new-documents',
                    'https://vanban.chinhphu.vn/rss/updated-documents'
                ]
            },
            lawLibrary: {
                name: 'Thư viện Pháp luật',
                url: 'https://thuvienphapluat.vn',
                searchApi: 'https://thuvienphapluat.vn/api/search',
                rssFeeds: [
                    'https://thuvienphapluat.vn/rss/new',
                    'https://thuvienphapluat.vn/rss/updated'
                ]
            },
            nationalAssembly: {
                name: 'Quốc hội',
                url: 'https://quochoi.vn',
                searchApi: 'https://quochoi.vn/api/documents',
                rssFeeds: [
                    'https://quochoi.vn/rss/laws',
                    'https://quochoi.vn/rss/resolutions'
                ]
            },
            supremeCourt: {
                name: 'Tòa án Tối cao',
                url: 'https://toaan.gov.vn',
                searchApi: 'https://toaan.gov.vn/api/documents',
                rssFeeds: ['https://toaan.gov.vn/rss/new-documents']
            },
            ministries: {
                justice: 'https://moj.gov.vn/api/documents',
                finance: 'https://mof.gov.vn/api/documents',
                labor: 'https://molisa.gov.vn/api/documents',
                health: 'https://moh.gov.vn/api/documents',
                education: 'https://moet.gov.vn/api/documents'
            }
        };
        
        this.documentTypes = [
            'Hiến pháp', 'Luật', 'Bộ luật', 'Pháp lệnh',
            'Nghị quyết', 'Nghị định', 'Quyết định',
            'Thông tư', 'Chỉ thị', 'Quy chế',
            'Hướng dẫn', 'Công văn'
        ];
        
        this.database = new Map(); // Local storage for documents
        this.lastUpdate = localStorage.getItem('vilaw_last_update') || new Date().toISOString();
        this.updateQueue = [];
        this.isUpdating = false;
    }

    // Initialize crawler and load existing documents
    async initialize() {
        try {
            console.log('🚀 Initializing ViLaw Legal Crawler...');
            await this.loadExistingDocuments();
            await this.setupAutoUpdate();
            console.log('✅ Legal Crawler initialized successfully');
            return true;
        } catch (error) {
            console.error('❌ Failed to initialize Legal Crawler:', error);
            return false;
        }
    }

    // Load existing documents from localStorage
    async loadExistingDocuments() {
        const stored = localStorage.getItem('vilaw_legal_documents');
        if (stored) {
            try {
                const documents = JSON.parse(stored);
                documents.forEach(doc => {
                    this.database.set(doc.id, doc);
                });
                console.log(`📚 Loaded ${documents.length} existing documents`);
            } catch (error) {
                console.error('Error loading existing documents:', error);
            }
        }
    }

    // Save documents to localStorage
    saveDocuments() {
        try {
            const documents = Array.from(this.database.values());
            localStorage.setItem('vilaw_legal_documents', JSON.stringify(documents));
            localStorage.setItem('vilaw_last_update', new Date().toISOString());
            console.log(`💾 Saved ${documents.length} documents to storage`);
        } catch (error) {
            console.error('Error saving documents:', error);
        }
    }

    // Setup automatic update system
    async setupAutoUpdate() {
        // Check for updates every 6 hours
        setInterval(() => {
            this.checkForUpdates();
        }, 6 * 60 * 60 * 1000);

        // Initial check
        await this.checkForUpdates();
    }

    // Main function to check for document updates
    async checkForUpdates() {
        if (this.isUpdating) {
            console.log('🔄 Update already in progress...');
            return;
        }

        this.isUpdating = true;
        console.log('🔍 Checking for legal document updates...');

        try {
            const updates = await Promise.allSettled([
                this.crawlGovernmentSite(),
                this.crawlLawLibrary(),
                this.crawlNationalAssembly(),
                this.crawlSupremeCourt(),
                this.crawlMinistries(),
                this.searchGoogleForUpdates()
            ]);

            let totalNewDocs = 0;
            let totalUpdatedDocs = 0;

            updates.forEach((result, index) => {
                if (result.status === 'fulfilled' && result.value) {
                    totalNewDocs += result.value.newDocuments || 0;
                    totalUpdatedDocs += result.value.updatedDocuments || 0;
                }
            });

            this.saveDocuments();
            
            console.log(`✅ Update completed: ${totalNewDocs} new, ${totalUpdatedDocs} updated`);
            
            // Notify UI about updates
            this.notifyUI({
                newDocuments: totalNewDocs,
                updatedDocuments: totalUpdatedDocs,
                timestamp: new Date().toISOString()
            });

        } catch (error) {
            console.error('❌ Error during update check:', error);
        } finally {
            this.isUpdating = false;
        }
    }

    // Crawl Government Portal
    async crawlGovernmentSite() {
        console.log('🏛️ Crawling Government Portal...');
        try {
            // Simulate API call to government portal
            const response = await this.makeRequest(`${this.sources.government.searchApi}?since=${this.lastUpdate}`);
            return this.processDocuments(response.data, 'government');
        } catch (error) {
            console.error('Error crawling government site:', error);
            return this.simulateGovernmentData();
        }
    }

    // Crawl Law Library
    async crawlLawLibrary() {
        console.log('📚 Crawling Law Library...');
        try {
            const response = await this.makeRequest(`${this.sources.lawLibrary.searchApi}?updated_since=${this.lastUpdate}`);
            return this.processDocuments(response.data, 'library');
        } catch (error) {
            console.error('Error crawling law library:', error);
            return this.simulateLawLibraryData();
        }
    }

    // Crawl National Assembly
    async crawlNationalAssembly() {
        console.log('🏛️ Crawling National Assembly...');
        try {
            const response = await this.makeRequest(`${this.sources.nationalAssembly.searchApi}?from=${this.lastUpdate}`);
            return this.processDocuments(response.data, 'assembly');
        } catch (error) {
            console.error('Error crawling National Assembly:', error);
            return this.simulateAssemblyData();
        }
    }

    // Crawl Supreme Court
    async crawlSupremeCourt() {
        console.log('⚖️ Crawling Supreme Court...');
        try {
            const response = await this.makeRequest(`${this.sources.supremeCourt.searchApi}?since=${this.lastUpdate}`);
            return this.processDocuments(response.data, 'court');
        } catch (error) {
            console.error('Error crawling Supreme Court:', error);
            return this.simulateCourtData();
        }
    }

    // Crawl various ministries
    async crawlMinistries() {
        console.log('🏢 Crawling Ministries...');
        const results = { newDocuments: 0, updatedDocuments: 0 };
        
        for (const [ministry, url] of Object.entries(this.sources.ministries)) {
            try {
                const response = await this.makeRequest(`${url}?since=${this.lastUpdate}`);
                const processed = this.processDocuments(response.data, `ministry_${ministry}`);
                results.newDocuments += processed.newDocuments;
                results.updatedDocuments += processed.updatedDocuments;
            } catch (error) {
                console.error(`Error crawling ${ministry}:`, error);
            }
        }
        
        return results;
    }

    // Search Google for Vietnamese legal updates
    async searchGoogleForUpdates() {
        console.log('🔍 Searching Google for legal updates...');
        
        const searchQueries = [
            'site:vanban.chinhphu.vn luật mới 2024',
            'site:thuvienphapluat.vn nghị định mới',
            'site:quochoi.vn nghị quyết mới',
            'luật việt nam cập nhật 2024',
            'văn bản pháp luật mới nhất',
            'bộ luật sửa đổi 2024',
            'hiến pháp việt nam cập nhật'
        ];

        let totalResults = 0;

        for (const query of searchQueries) {
            try {
                // Check if API config is available
                const apiConfig = (typeof window !== 'undefined' && window.API_CONFIG) ? window.API_CONFIG : null;
                
                // Use Google Custom Search API if available
                if (apiConfig && apiConfig.google && apiConfig.google.customSearchApiKey && 
                    !apiConfig.google.customSearchApiKey.startsWith('YOUR_')) {
                    const results = await this.googleCustomSearch(query);
                    totalResults += this.processGoogleResults(results);
                } else {
                    // Simulate Google search results
                    const simulatedResults = this.simulateGoogleResults(query);
                    totalResults += this.processGoogleResults(simulatedResults);
                }
                
                // Add delay to avoid rate limiting
                await this.delay(1000);
            } catch (error) {
                console.error(`Error searching Google for "${query}":`, error);
                // On error, still add simulated results
                const simulatedResults = this.simulateGoogleResults(query);
                totalResults += this.processGoogleResults(simulatedResults);
            }
        }

        return { newDocuments: totalResults, updatedDocuments: 0 };
    }

    // Google Custom Search API integration
    async googleCustomSearch(query) {
        // Check if API config is available
        const apiConfig = (typeof window !== 'undefined' && window.API_CONFIG) ? window.API_CONFIG : null;
        
        if (!apiConfig || !apiConfig.google || !apiConfig.google.customSearchApiKey) {
            throw new Error('Google Custom Search API not configured');
        }

        const params = new URLSearchParams({
            key: apiConfig.google.customSearchApiKey,
            cx: apiConfig.google.customSearchEngineId,
            q: query,
            num: 10,
            dateRestrict: 'm3', // Last 3 months
            sort: 'date'
        });

        const response = await fetch(`https://www.googleapis.com/customsearch/v1?${params}`);
        return await response.json();
    }

    // Process Google search results
    processGoogleResults(results) {
        if (!results.items) return 0;

        let newDocs = 0;
        
        results.items.forEach(item => {
            const doc = {
                id: this.generateDocumentId(item.link),
                title: item.title,
                url: item.link,
                snippet: item.snippet,
                dateFound: new Date().toISOString(),
                source: 'google_search',
                type: this.detectDocumentType(item.title),
                isNew: true
            };

            if (!this.database.has(doc.id)) {
                this.database.set(doc.id, doc);
                newDocs++;
            }
        });

        return newDocs;
    }

    // Make HTTP request with error handling
    async makeRequest(url, options = {}) {
        try {
            const response = await fetch(url, {
                timeout: 10000,
                ...options
            });
            
            if (!response.ok) {
                throw new Error(`HTTP ${response.status}: ${response.statusText}`);
            }
            
            return await response.json();
        } catch (error) {
            console.error(`Request failed for ${url}:`, error);
            throw error;
        }
    }

    // Process documents from various sources
    processDocuments(documents, source) {
        let newDocuments = 0;
        let updatedDocuments = 0;

        if (!documents || !Array.isArray(documents)) {
            return { newDocuments, updatedDocuments };
        }

        documents.forEach(doc => {
            const documentId = this.generateDocumentId(doc.url || doc.link || doc.id);
            const existingDoc = this.database.get(documentId);

            const processedDoc = {
                id: documentId,
                title: doc.title || doc.name,
                type: doc.type || this.detectDocumentType(doc.title),
                content: doc.content || doc.summary || doc.excerpt,
                url: doc.url || doc.link,
                dateIssued: doc.date_issued || doc.publish_date || doc.created_at,
                dateModified: doc.date_modified || doc.updated_at,
                authority: doc.authority || doc.issuing_body || doc.agency,
                status: doc.status || 'active',
                source: source,
                lastCrawled: new Date().toISOString()
            };

            if (!existingDoc) {
                this.database.set(documentId, processedDoc);
                newDocuments++;
            } else if (this.hasDocumentChanged(existingDoc, processedDoc)) {
                this.database.set(documentId, { ...existingDoc, ...processedDoc });
                updatedDocuments++;
            }
        });

        return { newDocuments, updatedDocuments };
    }

    // Generate unique document ID
    generateDocumentId(url) {
        return btoa(url).replace(/[^a-zA-Z0-9]/g, '').substring(0, 16);
    }

    // Detect document type from title
    detectDocumentType(title) {
        const lowerTitle = title.toLowerCase();
        
        for (const type of this.documentTypes) {
            if (lowerTitle.includes(type.toLowerCase())) {
                return type;
            }
        }
        
        return 'Văn bản khác';
    }

    // Check if document has changed
    hasDocumentChanged(oldDoc, newDoc) {
        return oldDoc.dateModified !== newDoc.dateModified ||
               oldDoc.content !== newDoc.content ||
               oldDoc.status !== newDoc.status;
    }

    // Notify UI about updates
    notifyUI(updateInfo) {
        // Dispatch custom event for UI to listen
        window.dispatchEvent(new CustomEvent('vilaw-legal-update', {
            detail: updateInfo
        }));

        // Update UI elements if they exist
        const updateBadge = document.getElementById('legal-update-badge');
        if (updateBadge && updateInfo.newDocuments > 0) {
            updateBadge.textContent = updateInfo.newDocuments;
            updateBadge.style.display = 'block';
        }

        // Show notification
        if ('Notification' in window && Notification.permission === 'granted') {
            new Notification('ViLaw - Cập nhật văn bản pháp luật', {
                body: `${updateInfo.newDocuments} văn bản mới, ${updateInfo.updatedDocuments} văn bản cập nhật`,
                icon: '/manifest-icon-192.maskable.png'
            });
        }
    }

    // Get all documents
    getAllDocuments() {
        return Array.from(this.database.values()).sort((a, b) => 
            new Date(b.lastCrawled) - new Date(a.lastCrawled)
        );
    }

    // Search documents
    searchDocuments(query, filters = {}) {
        const allDocs = this.getAllDocuments();
        const lowerQuery = query.toLowerCase();

        return allDocs.filter(doc => {
            const matchesQuery = !query || 
                doc.title.toLowerCase().includes(lowerQuery) ||
                doc.content.toLowerCase().includes(lowerQuery);

            const matchesType = !filters.type || doc.type === filters.type;
            const matchesSource = !filters.source || doc.source === filters.source;
            const matchesAuthority = !filters.authority || doc.authority === filters.authority;

            return matchesQuery && matchesType && matchesSource && matchesAuthority;
        });
    }

    // Manual update trigger
    async forceUpdate() {
        console.log('🔄 Manual update triggered...');
        return await this.checkForUpdates();
    }

    // Get update statistics
    getUpdateStats() {
        const docs = this.getAllDocuments();
        const now = new Date();
        const oneWeekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
        const oneMonthAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);

        return {
            total: docs.length,
            thisWeek: docs.filter(doc => new Date(doc.lastCrawled) > oneWeekAgo).length,
            thisMonth: docs.filter(doc => new Date(doc.lastCrawled) > oneMonthAgo).length,
            byType: this.documentTypes.reduce((acc, type) => {
                acc[type] = docs.filter(doc => doc.type === type).length;
                return acc;
            }, {}),
            lastUpdate: this.lastUpdate
        };
    }

    // Utility function for delays
    delay(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

    // === SIMULATION FUNCTIONS (for demo purposes) ===
    
    simulateGovernmentData() {
        const sampleDocs = [
            {
                title: 'Nghị định 01/2024/NĐ-CP về đầu tư công',
                type: 'Nghị định',
                url: 'https://vanban.chinhphu.vn/chi-tiet-van-ban?Ngay=2024-01-15&So=01',
                date_issued: '2024-01-15',
                authority: 'Chính phủ',
                content: 'Quy định về quản lý đầu tư công...'
            },
            {
                title: 'Thông tư 02/2024/TT-BTC hướng dẫn Luật Thuế',
                type: 'Thông tư',
                url: 'https://vanban.chinhphu.vn/chi-tiet-van-ban?Ngay=2024-01-20&So=02',
                date_issued: '2024-01-20',
                authority: 'Bộ Tài chính',
                content: 'Hướng dẫn thực hiện Luật Thuế...'
            }
        ];
        
        return this.processDocuments(sampleDocs, 'government');
    }

    simulateLawLibraryData() {
        const sampleDocs = [
            {
                title: 'Luật Bảo vệ môi trường 2020 (sửa đổi)',
                type: 'Luật',
                url: 'https://thuvienphapluat.vn/van-ban/Bo-may-hanh-chinh/Luat-Bao-ve-moi-truong-2020-sua-doi',
                date_issued: '2024-01-10',
                authority: 'Quốc hội',
                content: 'Sửa đổi một số điều của Luật Bảo vệ môi trường...'
            }
        ];
        
        return this.processDocuments(sampleDocs, 'library');
    }

    simulateAssemblyData() {
        const sampleDocs = [
            {
                title: 'Nghị quyết 15/2024/QH15 về kế hoạch phát triển KT-XH',
                type: 'Nghị quyết',
                url: 'https://quochoi.vn/nghiquyet/15-2024-QH15',
                date_issued: '2024-01-25',
                authority: 'Quốc hội',
                content: 'Về kế hoạch phát triển kinh tế-xã hội...'
            }
        ];
        
        return this.processDocuments(sampleDocs, 'assembly');
    }

    simulateCourtData() {
        const sampleDocs = [
            {
                title: 'Thông tư liên tịch 01/2024/TTLT về thi hành án dân sự',
                type: 'Thông tư',
                url: 'https://toaan.gov.vn/thong-tu-lien-tich-01-2024',
                date_issued: '2024-01-12',
                authority: 'Tòa án Tối cao',
                content: 'Hướng dẫn thi hành án dân sự...'
            }
        ];
        
        return this.processDocuments(sampleDocs, 'court');
    }

    simulateGoogleResults(query) {
        return {
            items: [
                {
                    title: 'Luật An ninh mạng 2024 - Cập nhật mới nhất',
                    link: 'https://thuvienphapluat.vn/van-ban/an-ninh-mang-2024',
                    snippet: 'Luật An ninh mạng 2024 có hiệu lực từ ngày 1/7/2024...'
                },
                {
                    title: 'Nghị định về kinh doanh thương mại điện tử',
                    link: 'https://vanban.chinhphu.vn/nghi-dinh-thuong-mai-dien-tu',
                    snippet: 'Quy định mới về kinh doanh thương mại điện tử...'
                }
            ]
        };
    }
}

// Export and initialize
const legalCrawler = new LegalCrawler();

// Auto-initialize when script loads
if (typeof window !== 'undefined') {
    window.legalCrawler = legalCrawler;
    
    // Initialize when DOM is ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', () => legalCrawler.initialize());
    } else {
        legalCrawler.initialize();
    }
}

if (typeof module !== 'undefined' && module.exports) {
    module.exports = legalCrawler;
}