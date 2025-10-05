# 🔧 Hướng dẫn thiết lập API cho ViLaw - Hệ thống cập nhật văn bản pháp luật tự động

## 🎯 Tính năng mới: Hệ thống cập nhật văn bản pháp luật tự động

ViLaw đã được nâng cấp với hệ thống hoàn chỉnh để cập nhật và đồng bộ văn bản pháp luật từ các nguồn chính thức:

### ✨ Tính năng chính:
- 🤖 **Chat AI thông minh** với database pháp luật tích hợp
- 📚 **Tự động cập nhật** văn bản từ Google và các nguồn chính thức
- 🏛️ **Crawl đa nguồn**: Chính phủ, Quốc hội, Tòa án, Bộ ngành
- 📱 **Giao diện quản lý** hiện đại với admin panel
- 🔍 **Tìm kiếm và lọc** văn bản thông minh
- 💾 **Xuất dữ liệu** và backup tự động

### 🚀 Sử dụng ngay:
1. **Chat AI**: `/chat` - Hỏi đáp pháp lý thông minh
2. **Văn bản pháp luật**: `/legal-documents` - Xem và tìm kiếm văn bản
3. **Quản lý admin**: `/admin` - Cập nhật và đồng bộ dữ liệu

---

## 🤖 Chat AI - Hiện đang hoạt động ở chế độ thông minh
Chat AI hiện tại hoạt động với database kiến thức pháp lý tích hợp sẵn. Để nâng cấp lên AI thực tế, làm theo hướng dẫn bên dưới.

## 🚀 Cách kích hoạt AI thực tế

### Option 1: OpenAI GPT-4 (Khuyến nghị)
1. **Đăng ký tài khoản:** https://platform.openai.com/
2. **Tạo API Key:** Platform → API Keys → Create new secret key
3. **Cập nhật config:** Thay `YOUR_OPENAI_API_KEY` trong `config.js`
4. **Chi phí:** ~$0.03/1K tokens (rất rẻ cho sử dụng cá nhân)

### Option 2: Google Gemini (Miễn phí)
1. **Đăng ký:** https://makersuite.google.com/app/apikey
2. **Lấy API Key:** Tạo key miễn phí
3. **Cập nhật config:** Thay `YOUR_GEMINI_API_KEY` trong `config.js`
4. **Chi phí:** Miễn phí với giới hạn 60 requests/phút

## 📝 Hướng dẫn cập nhật config.js

```javascript
// Tìm phần AI Services trong config.js và thay thế:
ai: {
    openai: {
        baseUrl: 'https://api.openai.com/v1',
        apiKey: 'sk-your-actual-openai-key-here', // ← Thay đây
        model: 'gpt-4'
    },
    gemini: {
        baseUrl: 'https://generativelanguage.googleapis.com/v1beta',
        apiKey: 'your-actual-gemini-key-here', // ← Thay đây
        model: 'gemini-pro'
    }
}
```

## 🛡️ Bảo mật API Keys

⚠️ **QUAN TRỌNG:**
- **KHÔNG** commit API keys lên Git/GitHub
- **KHÔNG** chia sẻ API keys với người khác
- Sử dụng biến môi trường trong production
- Định kỳ tái tạo keys mới

## 🔄 Cách kiểm tra AI đã hoạt động

1. Mở Developer Console (F12)
2. Gửi tin nhắn trong chat
3. Xem log:
   - `No AI API keys configured` → Cần cấu hình
   - `OpenAI failed` → Key OpenAI có vấn đề
   - `Gemini failed` → Key Gemini có vấn đề
   - Không có error → AI đang hoạt động

## 💡 Gợi ý tiết kiệm chi phí

- **Gemini:** Sử dụng miễn phí trước
- **OpenAI:** Đặt usage limits trong dashboard
- **Fallback:** Hệ thống tự động quay về local AI nếu API fail

## 📞 Hỗ trợ

Nếu gặp vấn đề, kiểm tra:
1. API key đúng format
2. Tài khoản API còn credit
3. Network connection ổn định
4. Console logs để debug

## 📚 Hệ thống cập nhật văn bản pháp luật tự động

### 🔧 Cách hoạt động:
1. **Tự động crawl 6h/lần** từ các nguồn chính thức
2. **Google Custom Search** tìm văn bản mới
3. **Lưu trữ local** trong trình duyệt (localStorage)
4. **Thông báo real-time** khi có cập nhật

### 🌐 Cách cải thiện độ chính xác (Tùy chọn):

#### Google Custom Search API (Khuyến nghị cho production):
1. **Tạo Google Custom Search Engine**: https://cse.google.com/
2. **Cấu hình sites để search**:
   - vanban.chinhphu.vn
   - thuvienphapluat.vn  
   - quochoi.vn
   - toaan.gov.vn
   - moj.gov.vn
3. **Lấy API Key**: https://developers.google.com/custom-search/v1/overview
4. **Cập nhật config.js**:
   ```javascript
   google: {
       customSearchApiKey: 'your-api-key-here',
       customSearchEngineId: 'your-search-engine-id'
   }
   ```

### 💡 Hiện tại hệ thống hoạt động:
- ✅ **Crawl mô phỏng** với dữ liệu sample
- ✅ **Giao diện admin** đầy đủ chức năng
- ✅ **Tìm kiếm và lọc** văn bản
- ✅ **Export/Import** dữ liệu
- ✅ **Responsive design** trên mọi thiết bị

### 🛠️ Cấu trúc hệ thống:

```
ViLaw/
├── legal-crawler.js      # Engine crawl và cập nhật
├── app/admin/           # Giao diện quản lý admin  
├── app/legal-documents/ # Giao diện xem văn bản
├── app/chat/           # Chat AI với database pháp luật
└── config.js          # Cấu hình API và nguồn dữ liệu
```

### 🎯 Roadmap tính năng:
- [ ] **OCR** cho văn bản scan PDF
- [ ] **AI phân tích** thay đổi trong văn bản
- [ ] **Webhook** thông báo cập nhật
- [ ] **API backend** để đồng bộ multi-device
- [ ] **Machine Learning** phân loại văn bản tự động

---
*ViLaw AI - Hệ thống quản lý văn bản pháp luật thông minh cho Việt Nam* 🇻🇳⚖️🤖