// ViLaw Real API Service
class APIService {
    constructor() {
        this.rateLimiter = new Map();
        this.cache = new Map();
        this.cacheTimeout = 5 * 60 * 1000; // 5 minutes
    }

    // Rate limiting helper
    async checkRateLimit(service, limit) {
        const now = Date.now();
        const key = `${service}_${Math.floor(now / 60000)}`; // Per minute
        const current = this.rateLimiter.get(key) || 0;
        
        if (current >= limit) {
            throw new Error(`Rate limit exceeded for ${service}. Please try again later.`);
        }
        
        this.rateLimiter.set(key, current + 1);
        return true;
    }

    // Cache helper
    getCachedData(key) {
        const cached = this.cache.get(key);
        if (cached && Date.now() - cached.timestamp < this.cacheTimeout) {
            return cached.data;
        }
        return null;
    }

    setCachedData(key, data) {
        this.cache.set(key, {
            data,
            timestamp: Date.now()
        });
    }

    // Generic API call with error handling
    async makeAPICall(url, options = {}) {
        try {
            const controller = new AbortController();
            const timeoutId = setTimeout(() => controller.abort(), ERROR_CONFIG.timeoutMs);

            const response = await fetch(url, {
                ...options,
                signal: controller.signal
            });

            clearTimeout(timeoutId);

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            return await response.json();
        } catch (error) {
            console.error('API call failed:', error);
            throw error;
        }
    }

    // YouTube Data API Integration
    async searchYouTube(query, maxResults = 25) {
        const cacheKey = `youtube_${query}_${maxResults}`;
        const cached = this.getCachedData(cacheKey);
        if (cached) return cached;

        try {
            await this.checkRateLimit('youtube', RATE_LIMITS.youtube.requestsPerMinute);

            const params = new URLSearchParams({
                part: 'snippet,statistics',
                q: query,
                type: 'video',
                maxResults: maxResults,
                key: API_CONFIG.youtube.apiKey,
                regionCode: 'VN',
                relevanceLanguage: 'vi'
            });

            const url = `${API_CONFIG.youtube.baseUrl}${API_CONFIG.youtube.endpoints.search}?${params}`;
            const data = await this.makeAPICall(url);

            // Get detailed video statistics
            if (data.items && data.items.length > 0) {
                const videoIds = data.items.map(item => item.id.videoId).join(',');
                const statsUrl = `${API_CONFIG.youtube.baseUrl}${API_CONFIG.youtube.endpoints.videos}?part=statistics,snippet&id=${videoIds}&key=${API_CONFIG.youtube.apiKey}`;
                const statsData = await this.makeAPICall(statsUrl);
                
                // Merge statistics with search results
                data.items = data.items.map(item => {
                    const stats = statsData.items?.find(stat => stat.id === item.id.videoId);
                    return {
                        ...item,
                        statistics: stats?.statistics || {}
                    };
                });
            }

            this.setCachedData(cacheKey, data);
            return data;
        } catch (error) {
            console.error('YouTube API error:', error);
            throw new Error('Không thể lấy dữ liệu từ YouTube. Vui lòng thử lại sau.');
        }
    }

    // Facebook Graph API Integration
    async searchFacebook(query, limit = 25) {
        const cacheKey = `facebook_${query}_${limit}`;
        const cached = this.getCachedData(cacheKey);
        if (cached) return cached;

        try {
            await this.checkRateLimit('facebook', RATE_LIMITS.facebook.requestsPerHour);

            const params = new URLSearchParams({
                q: query,
                type: 'post',
                limit: limit,
                access_token: API_CONFIG.facebook.accessToken,
                fields: 'id,message,created_time,likes.summary(true),comments.summary(true),shares'
            });

            const url = `${API_CONFIG.facebook.baseUrl}${API_CONFIG.facebook.endpoints.search}?${params}`;
            const data = await this.makeAPICall(url);

            this.setCachedData(cacheKey, data);
            return data;
        } catch (error) {
            console.error('Facebook API error:', error);
            throw new Error('Không thể lấy dữ liệu từ Facebook. Vui lòng kiểm tra quyền truy cập.');
        }
    }

    // Twitter API Integration
    async searchTwitter(query, maxResults = 25) {
        const cacheKey = `twitter_${query}_${maxResults}`;
        const cached = this.getCachedData(cacheKey);
        if (cached) return cached;

        try {
            await this.checkRateLimit('twitter', 100); // Twitter has complex rate limits

            const params = new URLSearchParams({
                query: query,
                max_results: maxResults,
                'tweet.fields': 'public_metrics,created_at,author_id',
                'user.fields': 'username,name,verified'
            });

            const url = `${API_CONFIG.twitter.baseUrl}${API_CONFIG.twitter.endpoints.search}?${params}`;
            const data = await this.makeAPICall(url, {
                headers: {
                    'Authorization': `Bearer ${API_CONFIG.twitter.bearerToken}`,
                    'Content-Type': 'application/json'
                }
            });

            this.setCachedData(cacheKey, data);
            return data;
        } catch (error) {
            console.error('Twitter API error:', error);
            throw new Error('Không thể lấy dữ liệu từ Twitter. Vui lòng thử lại sau.');
        }
    }

    // Vietnam Law Database Integration
    async searchVietnameseLaw(query, type = 'all') {
        const cacheKey = `vnlaw_${query}_${type}`;
        const cached = this.getCachedData(cacheKey);
        if (cached) return cached;

        try {
            // Try multiple Vietnamese law databases
            const results = await Promise.allSettled([
                this.searchGovPortal(query),
                this.searchLawLibrary(query),
                this.searchLawVietnam(query)
            ]);

            const combinedResults = {
                documents: [],
                total: 0,
                sources: []
            };

            results.forEach((result, index) => {
                if (result.status === 'fulfilled' && result.value) {
                    combinedResults.documents.push(...(result.value.documents || []));
                    combinedResults.total += result.value.total || 0;
                    combinedResults.sources.push(result.value.source);
                }
            });

            // Remove duplicates and sort by relevance
            combinedResults.documents = this.removeDuplicateLawDocs(combinedResults.documents);
            combinedResults.total = combinedResults.documents.length;

            this.setCachedData(cacheKey, combinedResults);
            return combinedResults;
        } catch (error) {
            console.error('Vietnam Law API error:', error);
            throw new Error('Không thể lấy dữ liệu luật pháp. Vui lòng thử lại sau.');
        }
    }

    // Government Portal API
    async searchGovPortal(query) {
        try {
            const params = new URLSearchParams({
                q: query,
                limit: 20,
                type: 'document'
            });

            const url = `${API_CONFIG.vietnamLaw.govPortal}/search?${params}`;
            const data = await this.makeAPICall(url);

            return {
                documents: data.items?.map(item => ({
                    id: item.id,
                    title: item.title,
                    type: item.document_type,
                    content: item.excerpt,
                    date: item.publish_date,
                    authority: item.issuing_agency,
                    url: item.url,
                    source: 'Cổng thông tin Chính phủ'
                })) || [],
                total: data.total || 0,
                source: 'gov_portal'
            };
        } catch (error) {
            console.error('Gov Portal API error:', error);
            return { documents: [], total: 0, source: 'gov_portal' };
        }
    }

    // Law Library API
    async searchLawLibrary(query) {
        try {
            const params = new URLSearchParams({
                keyword: query,
                limit: 20
            });

            const url = `${API_CONFIG.vietnamLaw.lawDatabase}/search?${params}`;
            const data = await this.makeAPICall(url);

            return {
                documents: data.results?.map(item => ({
                    id: item.id,
                    title: item.title,
                    type: item.type,
                    content: item.summary,
                    date: item.effective_date,
                    authority: item.agency,
                    url: item.link,
                    source: 'Thư viện Pháp luật'
                })) || [],
                total: data.count || 0,
                source: 'law_library'
            };
        } catch (error) {
            console.error('Law Library API error:', error);
            return { documents: [], total: 0, source: 'law_library' };
        }
    }

    // Law Vietnam API
    async searchLawVietnam(query) {
        try {
            const params = new URLSearchParams({
                q: query,
                page_size: 20
            });

            const url = `${API_CONFIG.vietnamLaw.lawSearch}/documents?${params}`;
            const data = await this.makeAPICall(url);

            return {
                documents: data.data?.map(item => ({
                    id: item.document_id,
                    title: item.document_title,
                    type: item.document_type,
                    content: item.abstract,
                    date: item.issue_date,
                    authority: item.issuing_body,
                    url: item.document_url,
                    source: 'Luật Việt Nam'
                })) || [],
                total: data.total || 0,
                source: 'law_vietnam'
            };
        } catch (error) {
            console.error('Law Vietnam API error:', error);
            return { documents: [], total: 0, source: 'law_vietnam' };
        }
    }

    // AI Integration for Chat
    async chatWithAI(message, language = 'vi') {
        try {
            // Prefer local Gemini RAG server (gemini-1.py) if available
            try {
                const rag = await this.chatWithLocalGemini(message);
                if (rag && rag.response) return rag;
            } catch (e) {
                console.warn('Local Gemini server not available:', e?.message || e);
            }

            // Cloud Gemini (Generative Language API)
            const hasGemini = API_CONFIG.ai.gemini.apiKey &&
                             API_CONFIG.ai.gemini.apiKey !== 'YOUR_GEMINI_API_KEY' &&
                             !API_CONFIG.ai.gemini.apiKey.startsWith('YOUR_');
            if (hasGemini) {
                try {
                    return await this.chatWithGemini(message, language);
                } catch (geminiError) {
                    console.warn('Gemini failed:', geminiError);
                }
            }

            // Fallback to enhanced local responses
            console.log('No Gemini API configured, using enhanced local responses');
            return this.getEnhancedLocalResponse(message, language);

        } catch (error) {
            console.error('All AI services failed:', error);
            return this.getEnhancedLocalResponse(message, language);
        }
    }

    // Local Gemini RAG service (from gemini-1.py FastAPI)
    async chatWithLocalGemini(message) {
        const url = (window.GEMINI_LOCAL_URL || 'http://localhost:7861') + '/answer'
        const res = await fetch(url, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ question: message })
        })
        if (!res.ok) throw new Error('Local Gemini HTTP error ' + res.status)
        const data = await res.json()
        return {
            response: data.answer || '',
            confidence: 0.8,
            sources: ['Local Gemini RAG']
        }
    }

    // Enhanced local AI responses
    getEnhancedLocalResponse(message, language = 'vi') {
        const responses = this.generateEnhancedAIResponse(message);
        return {
            response: responses,
            confidence: 0.7,
            sources: ['ViLaw Knowledge Base'],
            isLocal: true
        };
    }

    // Generate enhanced local AI responses
    generateEnhancedAIResponse(userInput) {
        const lowerInput = userInput.toLowerCase();
        
        // Luật Lao động
        if (lowerInput.includes('sa thải') || lowerInput.includes('đuổi việc') || lowerInput.includes('thôi việc')) {
            return `**📋 Quyền lợi khi bị sa thải theo Bộ luật Lao động 2019:**

🔹 **Thông báo trước:**
   • Người sử dụng lao động phải thông báo trước ít nhất 45 ngày
   • Nếu không thông báo: được bồi thường tương đương thời gian chưa thông báo

🔹 **Trợ cấp thôi việc:**
   • 1/2 tháng lương cho mỗi năm làm việc
   • Tối thiểu 1 tháng lương cho người làm việc từ 12 tháng trở lên

🔹 **Bồi thường sa thải trái phép:**
   • Ít nhất 2 tháng lương
   • Có thể yêu cầu phục hồi công việc

📞 **Liên hệ:** Sở Lao động - Thương binh và Xã hội để được hỗ trợ pháp lý.`;
        }
        
        // Hợp đồng
        if (lowerInput.includes('hợp đồng') || lowerInput.includes('contract')) {
            return `**📝 Hướng dẫn về Hợp đồng theo Bộ luật Dân sự 2015:**

🔹 **Các yếu tố cơ bản:**
   • Danh tính, địa chỉ các bên
   • Nội dung thỏa thuận cụ thể
   • Quyền và nghĩa vụ của mỗi bên
   • Thời hạn thực hiện

🔹 **Lưu ý quan trọng:**
   • Đọc kỹ trước khi ký
   • Kiểm tra năng lực pháp lý của các bên
   • Lưu giữ bản gốc
   • Chú ý điều khoản phạt vi phạm

⚖️ **Các loại hợp đồng phổ biến:** Mua bán, thuê mướn, dịch vụ, xây dựng, lao động.

💡 Bạn có thể sử dụng tính năng "Phân tích hợp đồng" để kiểm tra chi tiết.`;
        }
        
        // Đất đai
        if (lowerInput.includes('đất đai') || lowerInput.includes('nhà đất') || lowerInput.includes('sổ đỏ')) {
            return `**🏠 Quyền sở hữu đất đai theo Luật Đất đai 2013:**

🔹 **Quyền sở hữu:**
   • Chỉ công dân Việt Nam được sở hữu đất
   • Người nước ngoài: thuê tối đa 50 năm

🔹 **Giấy chứng nhận (Sổ đỏ):**
   • Là căn cứ pháp lý duy nhất
   • Cần thiết cho mọi giao dịch
   • Phải đăng ký biến động khi chuyển nhượng

🔹 **Chuyển nhượng:**
   • Phải qua công chứng
   • Nộp thuế chuyển nhượng
   • Đăng ký tại Văn phòng đăng ký đất đai

⚠️ **Lưu ý:** Kiểm tra pháp lý kỹ càng trước khi giao dịch.`;
        }

        // Doanh nghiệp
        if (lowerInput.includes('doanh nghiệp') || lowerInput.includes('công ty') || lowerInput.includes('kinh doanh')) {
            return `**🏢 Hướng dẫn thành lập doanh nghiệp theo Luật Doanh nghiệp 2020:**

🔹 **Các loại hình:**
   • Công ty TNHH (1 thành viên, 2+ thành viên)
   • Công ty cổ phần
   • Doanh nghiệp tư nhân
   • Công ty hợp danh

🔹 **Thủ tục thành lập:**
   1. Đặt tên công ty (kiểm tra trùng lặp)
   2. Nộp hồ sơ đăng ký kinh doanh
   3. Nhận giấy phép kinh doanh
   4. Khắc dấu, mở tài khoản ngân hàng

📋 **Thời gian:** 15-20 ngày làm việc
💰 **Chi phí:** 300,000 - 500,000 VNĐ lệ phí nhà nước`;
        }

        // Hôn nhân gia đình
        if (lowerInput.includes('hôn nhân') || lowerInput.includes('ly hôn') || lowerInput.includes('gia đình')) {
            return `**👨‍👩‍👧‍👦 Luật Hôn nhân và Gia đình 2014:**

🔹 **Điều kiện kết hôn:**
   • Nam từ 20 tuổi, nữ từ 18 tuổi
   • Tự nguyện, không bị cấm kết hôn
   • Đăng ký kết hôn tại UBND

🔹 **Ly hôn:**
   • Thỏa thuận: đăng ký tại UBND
   • Tranh chấp: khởi kiện tại Tòa án
   • Chia tài sản theo thỏa thuận hoặc pháp luật

🔹 **Quyền nuôi con:**
   • Ưu tiên lợi ích của trẻ em
   • Có thể thỏa thuận hoặc Tòa án quyết định
   • Cả hai bố mẹ đều có nghĩa vụ nuôi dưỡng`;
        }

        // Bảo hiểm xã hội
        if (lowerInput.includes('bảo hiểm') || lowerInput.includes('bhxh') || lowerInput.includes('lương hưu')) {
            return `**🛡️ Bảo hiểm Xã hội theo Luật BHXH 2014:**

🔹 **Các chế độ:**
   • Ốm đau: 75% lương
   • Thai sản: 100% lương (6 tháng)
   • Tai nạn lao động: 75-100% lương
   • Lương hưu: từ 45% lương

🔹 **Điều kiện hưởng lương hưu:**
   • Nam: 60 tuổi, nữ: 55 tuổi
   • Đóng BHXH ít nhất 20 năm

🔹 **Mức đóng:**
   • Người lao động: 8%
   • Doanh nghiệp: 17.5%
   • Nhà nước: 1%`;
        }

        // Tội phạm
        if (lowerInput.includes('tội phạm') || lowerInput.includes('hình sự') || lowerInput.includes('bị tố cáo')) {
            return `**⚖️ Luật Hình sự 2017 - Quyền của người bị tố giác, khởi tố:**

🔹 **Quyền cơ bản:**
   • Được biết lý do bị khởi tố
   • Được có luật sư bào chữa
   • Được giữ im lặng
   • Được kháng cáo quyết định

🔹 **Các giai đoạn:**
   1. Tố giác, tin báo tội phạm
   2. Khởi tố vụ án
   3. Điều tra
   4. Truy tố
   5. Xét xử

⚠️ **Quan trọng:** Liên hệ luật sư ngay khi bị khởi tố để được bảo vệ quyền lợi.`;
        }

        // Mặc định
        return `**🤖 Xin chào! Tôi là trợ lý AI pháp lý ViLaw.**

Tôi nhận thấy bạn đang quan tâm đến: "${userInput}"

**📚 Các lĩnh vực tôi có thể hỗ trợ:**
• **Luật Lao động:** Sa thải, hợp đồng lao động, lương, phúc lợi
• **Luật Dân sự:** Hợp đồng, mua bán, thuê mướn, bồi thường
• **Luật Đất đai:** Sở hữu, chuyển nhượng, thủ tục
• **Luật Doanh nghiệp:** Thành lập, giải thể, biến động
• **Luật Hôn nhân Gia đình:** Kết hôn, ly hôn, nuôi con
• **Luật Hình sự:** Quyền của bị cáo, thủ tục tố tụng

**💡 Gợi ý câu hỏi:**
- "Tôi bị sa thải trái phép thì làm sao?"
- "Làm thế nào để kiểm tra hợp đồng?"
- "Thủ tục chuyển nhượng đất đai như thế nào?"

Hãy đặt câu hỏi cụ thể để tôi có thể hỗ trợ bạn tốt nhất! 🙂`;
    }

    // OpenAI Integration
    async chatWithOpenAI(message, language = 'vi') {
        const systemPrompt = language === 'vi' 
            ? 'Bạn là trợ lý pháp lý AI chuyên về luật pháp Việt Nam. Hãy trả lời chính xác, hữu ích và dễ hiểu.'
            : 'You are a legal AI assistant specializing in Vietnamese law. Provide accurate, helpful, and easy-to-understand answers.';

        const response = await this.makeAPICall(`${API_CONFIG.ai.openai.baseUrl}/chat/completions`, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${API_CONFIG.ai.openai.apiKey}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                model: API_CONFIG.ai.openai.model,
                messages: [
                    { role: 'system', content: systemPrompt },
                    { role: 'user', content: message }
                ],
                max_tokens: 1000,
                temperature: 0.7
            })
        });

        return {
            response: response.choices[0].message.content,
            confidence: 0.9,
            sources: ['OpenAI GPT-4'],
            tokens_used: response.usage.total_tokens
        };
    }

    // Google Gemini Integration
    async chatWithGemini(message, language = 'vi') {
        const prompt = language === 'vi'
            ? `Bạn là trợ lý pháp lý AI. Trả lời câu hỏi sau về luật pháp Việt Nam: ${message}`
            : `You are a legal AI assistant. Answer this question about Vietnamese law: ${message}`;

        const response = await this.makeAPICall(
            `${API_CONFIG.ai.gemini.baseUrl}/models/${API_CONFIG.ai.gemini.model}:generateContent?key=${API_CONFIG.ai.gemini.apiKey}`,
            {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    contents: [{
                        parts: [{ text: prompt }]
                    }]
                })
            }
        );

        return {
            response: response.candidates[0].content.parts[0].text,
            confidence: 0.85,
            sources: ['Google Gemini'],
            safety_ratings: response.candidates[0].safetyRatings
        };
    }

    // Contract Analysis with AI
    async analyzeContract(contractText) {
        const prompt = `Phân tích hợp đồng sau đây và đưa ra nhận xét về các rủi ro pháp lý, điều khoản thiếu sót, và đề xuất cải thiện:

${contractText}

Hãy cấu trúc phản hồi theo format JSON với các trường: risks, missing_clauses, suggestions, overall_score (1-100).`;

        try {
            const aiResponse = await this.chatWithAI(prompt, 'vi');
            
            // Parse AI response and structure it
            let analysisResult;
            try {
                analysisResult = JSON.parse(aiResponse.response);
            } catch (parseError) {
                // If AI doesn't return valid JSON, create structured response
                analysisResult = this.parseContractAnalysis(aiResponse.response);
            }

            return {
                ...analysisResult,
                confidence: aiResponse.confidence,
                processed_at: new Date().toISOString()
            };
        } catch (error) {
            console.error('Contract analysis error:', error);
            throw new Error('Không thể phân tích hợp đồng. Vui lòng thử lại sau.');
        }
    }

    // Helper function to parse unstructured AI response
    parseContractAnalysis(responseText) {
        return {
            risks: [
                {
                    title: 'Phân tích từ AI',
                    level: 'medium',
                    description: responseText.substring(0, 200) + '...'
                }
            ],
            missing_clauses: ['Phân tích chi tiết trong phản hồi AI'],
            suggestions: ['Xem phản hồi đầy đủ từ AI để biết chi tiết'],
            overall_score: 75
        };
    }

    // Remove duplicate law documents
    removeDuplicateLawDocs(docs) {
        const seen = new Set();
        return docs.filter(doc => {
            const key = `${doc.title}_${doc.authority}`;
            if (seen.has(key)) {
                return false;
            }
            seen.add(key);
            return true;
        });
    }

    // OCR Text Recognition
    async recognizeText(imageData, language = 'vie') {
        try {
            // Try Google Vision first, then fallback to Tesseract.js
            try {
                return await this.recognizeWithGoogleVision(imageData, language);
            } catch (googleError) {
                console.warn('Google Vision failed, trying Tesseract:', googleError);
                return await this.recognizeWithTesseract(imageData, language);
            }
        } catch (error) {
            console.error('All OCR services failed:', error);
            throw new Error('Không thể nhận dạng văn bản. Vui lòng thử lại sau.');
        }
    }

    // Google Cloud Vision OCR
    async recognizeWithGoogleVision(imageData, language = 'vie') {
        if (!API_CONFIG.ocr.googleVision.apiKey || API_CONFIG.ocr.googleVision.apiKey === 'YOUR_GOOGLE_VISION_API_KEY') {
            throw new Error('Google Vision API key not configured');
        }

        const base64Image = await this.convertToBase64(imageData);
        
        const requestBody = {
            requests: [{
                image: {
                    content: base64Image
                },
                features: [{
                    type: 'TEXT_DETECTION',
                    maxResults: 1
                }],
                imageContext: {
                    languageHints: [language === 'vie' ? 'vi' : 'en']
                }
            }]
        };

        const response = await this.makeAPICall(
            `${API_CONFIG.ocr.googleVision.baseUrl}/images:annotate?key=${API_CONFIG.ocr.googleVision.apiKey}`,
            {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(requestBody)
            }
        );

        if (response.responses && response.responses[0] && response.responses[0].fullTextAnnotation) {
            const textAnnotation = response.responses[0].fullTextAnnotation;
            return {
                text: textAnnotation.text,
                confidence: this.calculateAverageConfidence(textAnnotation.pages),
                service: 'Google Vision',
                language: language,
                blocks: textAnnotation.pages?.[0]?.blocks || []
            };
        } else {
            throw new Error('No text found in image');
        }
    }

    // Tesseract.js OCR (client-side)
    async recognizeWithTesseract(imageData, language = 'vie') {
        // Load Tesseract.js dynamically
        if (!window.Tesseract) {
            await this.loadTesseract();
        }

        const langCode = language === 'vie' ? 'vie+eng' : 'eng';
        
        try {
            const result = await window.Tesseract.recognize(
                imageData,
                langCode,
                {
                    logger: m => {
                        if (m.status === 'recognizing text') {
                            // Update progress if needed
                            console.log(`OCR Progress: ${Math.round(m.progress * 100)}%`);
                        }
                    }
                }
            );

            return {
                text: result.data.text,
                confidence: result.data.confidence / 100,
                service: 'Tesseract.js',
                language: language,
                words: result.data.words || [],
                lines: result.data.lines || []
            };
        } catch (error) {
            console.error('Tesseract OCR error:', error);
            throw new Error('Client-side OCR failed');
        }
    }

    // Load Tesseract.js library
    async loadTesseract() {
        return new Promise((resolve, reject) => {
            if (window.Tesseract) {
                resolve();
                return;
            }

            const script = document.createElement('script');
            script.src = 'https://unpkg.com/tesseract.js@4/dist/tesseract.min.js';
            script.onload = () => {
                // Initialize Tesseract worker
                console.log('Tesseract.js loaded successfully');
                resolve();
            };
            script.onerror = () => {
                reject(new Error('Failed to load Tesseract.js'));
            };
            document.head.appendChild(script);
        });
    }

    // Convert image to base64
    async convertToBase64(imageData) {
        if (typeof imageData === 'string' && imageData.startsWith('data:')) {
            // Already base64 data URL
            return imageData.split(',')[1];
        }
        
        if (imageData instanceof File || imageData instanceof Blob) {
            return new Promise((resolve, reject) => {
                const reader = new FileReader();
                reader.onload = () => {
                    const result = reader.result;
                    resolve(result.split(',')[1]); // Remove data:image/...;base64, prefix
                };
                reader.onerror = reject;
                reader.readAsDataURL(imageData);
            });
        }
        
        if (imageData instanceof HTMLCanvasElement) {
            const dataURL = imageData.toDataURL('image/jpeg', 0.8);
            return dataURL.split(',')[1];
        }
        
        throw new Error('Unsupported image data format');
    }

    // Calculate average confidence from Google Vision response
    calculateAverageConfidence(pages) {
        if (!pages || pages.length === 0) return 0.8; // Default confidence
        
        let totalConfidence = 0;
        let wordCount = 0;
        
        pages.forEach(page => {
            page.blocks?.forEach(block => {
                block.paragraphs?.forEach(paragraph => {
                    paragraph.words?.forEach(word => {
                        if (word.confidence) {
                            totalConfidence += word.confidence;
                            wordCount++;
                        }
                    });
                });
            });
        });
        
        return wordCount > 0 ? totalConfidence / wordCount : 0.8;
    }

    // Analyze recognized text for legal content
    async analyzeRecognizedText(text) {
        try {
            // Use AI to analyze the recognized text
            const analysisPrompt = `Phân tích văn bản pháp lý sau đây và xác định:
1. Loại tài liệu (hợp đồng, đơn từ, luật, v.v.)
2. Các từ khóa pháp lý quan trọng
3. Luật liên quan có thể áp dụng

Văn bản: "${text}"

Trả lời dưới dạng JSON với format:
{
    "documentType": "loại tài liệu",
    "keywords": ["từ khóa 1", "từ khóa 2"],
    "relatedLaws": [{"title": "tên luật", "relevance": "lý do liên quan"}]
}`;

            const aiResponse = await this.chatWithAI(analysisPrompt, 'vi');
            
            try {
                const analysis = JSON.parse(aiResponse.response);
                return analysis;
            } catch (parseError) {
                // If AI doesn't return valid JSON, create basic analysis
                return this.createBasicTextAnalysis(text);
            }
        } catch (error) {
            console.error('Text analysis error:', error);
            return this.createBasicTextAnalysis(text);
        }
    }

    // Create basic text analysis when AI fails
    createBasicTextAnalysis(text) {
        const lowerText = text.toLowerCase();
        
        // Detect document type
        let documentType = 'Tài liệu không xác định';
        if (lowerText.includes('hợp đồng')) {
            documentType = 'Hợp đồng';
        } else if (lowerText.includes('đơn')) {
            documentType = 'Đơn từ';
        } else if (lowerText.includes('luật') || lowerText.includes('nghị định')) {
            documentType = 'Văn bản pháp luật';
        } else if (lowerText.includes('biên bản')) {
            documentType = 'Biên bản';
        }

        // Extract keywords
        const legalKeywords = [];
        const keywords = [
            'hợp đồng', 'bên a', 'bên b', 'thỏa thuận', 'điều khoản',
            'trách nhiệm', 'nghĩa vụ', 'quyền lợi', 'bồi thường', 'vi phạm',
            'tranh chấp', 'chấm dứt', 'hiệu lực', 'ký kết', 'thực hiện'
        ];
        
        keywords.forEach(keyword => {
            if (lowerText.includes(keyword)) {
                legalKeywords.push(keyword);
            }
        });

        // Related laws (basic)
        const relatedLaws = [];
        if (lowerText.includes('lao động')) {
            relatedLaws.push({
                title: 'Bộ luật Lao động 2019',
                relevance: 'Quy định về quan hệ lao động'
            });
        }
        if (lowerText.includes('dân sự') || lowerText.includes('hợp đồng')) {
            relatedLaws.push({
                title: 'Bộ luật Dân sự 2015',
                relevance: 'Quy định về hợp đồng và giao dịch dân sự'
            });
        }

        return {
            documentType,
            keywords: legalKeywords,
            relatedLaws
        };
    }

    // Health check for all APIs
    async healthCheck() {
        const services = ['youtube', 'facebook', 'twitter', 'openai'];
        const results = {};

        for (const service of services) {
            try {
                await this.checkServiceHealth(service);
                results[service] = 'healthy';
            } catch (error) {
                results[service] = 'unhealthy';
                console.warn(`${service} health check failed:`, error.message);
            }
        }

        return results;
    }

    async checkServiceHealth(service) {
        // Simple health checks for each service
        const healthEndpoints = {
            youtube: `${API_CONFIG.youtube.baseUrl}/search?part=snippet&q=test&key=${API_CONFIG.youtube.apiKey}&maxResults=1`,
            openai: `${API_CONFIG.ai.openai.baseUrl}/models`
        };

        if (healthEndpoints[service]) {
            await this.makeAPICall(healthEndpoints[service], {
                headers: service === 'openai' ? {
                    'Authorization': `Bearer ${API_CONFIG.ai.openai.apiKey}`
                } : {}
            });
        }
    }
}

// Export the service
const apiService = new APIService();

if (typeof module !== 'undefined' && module.exports) {
    module.exports = apiService;
} else {
    window.apiService = apiService;
}

import { ethers } from 'ethers';

// Connect to Ethereum mainnet
const provider = new ethers.JsonRpcProvider('https://mainnet.infura.io/v3/df8716592db443e5b71a83b58cb2e191');

// Or connect to a wallet (MetaMask)
const browserProvider = new ethers.BrowserProvider(window.ethereum);

// Create from private key (example – do not commit private keys)
// const wallet = new ethers.Wallet('YOUR_PRIVATE_KEY', mainnetProvider);

// Or connect to MetaMask
const signer = await browserProvider.getSigner();

async function sendETH(toAddress, amount) {
    const tx = await signer.sendTransaction({
      to: toAddress,
      value: ethers.parseEther(amount) // Convert ETH to wei
    });
    
    await tx.wait(); // Wait for confirmation
    console.log('Transaction hash:', tx.hash);
  }