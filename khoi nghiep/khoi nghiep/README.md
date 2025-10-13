# 🏛️ ViLaw - Nền tảng Hạ tầng Pháp lý Số Toàn Dân

> **Slogan:** "Mỗi công dân – Một trợ lý pháp lý AI"

## 📋 Tổng quan dự án

ViLaw là nền tảng pháp lý số tích hợp AI, giọng nói, blockchain và dữ liệu mở nhằm dân chủ hóa kiến thức pháp luật cho toàn dân. Không chỉ là chatbot, ViLaw là một hạ tầng pháp lý số đa chức năng.

## ✨ Tính năng chính

### 🤖 Chat AI Pháp lý
- Trợ lý AI thông minh hỏi đáp pháp luật bằng tiếng Việt
- Tích hợp voice recognition (Speech-to-Text) và Text-to-Speech
- Hỗ trợ đa ngôn ngữ và ngữ cảnh pháp lý Việt Nam

### 📄 Soạn thảo Văn bản Thông minh
- Tạo đơn từ, hợp đồng, kiến nghị theo ngữ cảnh
- AI hỗ trợ soạn thảo và kiểm tra tính hợp pháp
- Template đa dạng cho các loại văn bản pháp lý

### 🔍 Tra cứu Luật pháp
- Tìm kiếm và phân tích văn bản pháp luật mới nhất
- Bộ lọc thông minh theo loại văn bản, năm ban hành, trạng thái
- Tích hợp dữ liệu mở từ các nguồn chính thống

### ⚖️ Phân tích Hợp đồng AI
- Phát hiện bẫy và rủi ro trong hợp đồng
- Đánh giá mức độ tuân thủ pháp luật
- Khuyến nghị cải thiện và bổ sung điều khoản

### 📊 Dashboard Chính quyền
- Thống kê và báo cáo hoạt động người dân
- Phân tích xu hướng và điểm nóng pháp lý
- Công cụ quản lý và giám sát hiệu quả

## 🚀 Công nghệ sử dụng

- **Frontend:** Next.js 14, React 18, TypeScript
- **Styling:** Tailwind CSS, Framer Motion
- **Icons:** Lucide React
- **State Management:** Zustand
- **Notifications:** React Hot Toast
- **Deployment:** Vercel (recommended)

## 📦 Cài đặt và chạy

### Yêu cầu hệ thống
- Node.js 18+ 
- npm hoặc yarn

### Bước 1: Clone repository
```bash
git clone <repository-url>
cd vilaw-platform
```

### Bước 2: Cài đặt dependencies
```bash
npm install
# hoặc
yarn install
```

### Bước 3: Chạy ứng dụng
```bash
npm run dev
# hoặc
yarn dev
```

### Bước 4: Truy cập ứng dụng
Mở trình duyệt và truy cập: `http://localhost:3000`

## 🏗️ Cấu trúc dự án

```
vilaw-platform/
├── app/                    # Next.js App Router
│   ├── globals.css        # Global styles
│   ├── layout.tsx         # Root layout
│   ├── page.tsx           # Homepage
│   ├── chat/              # Chat AI page
│   ├── documents/         # Document creation
│   ├── search/            # Law search
│   ├── contract/          # Contract analysis
│   └── dashboard/         # Government dashboard
├── public/                # Static assets
├── package.json           # Dependencies
├── tailwind.config.js     # Tailwind configuration
├── tsconfig.json          # TypeScript configuration
└── README.md             # Project documentation
```

## 🎯 Các trang chính

### 1. Trang chủ (`/`)
- Hero section với giới thiệu ViLaw
- Tính năng nổi bật
- Các gói sản phẩm (Gov, Edu, Pro)
- Voice demo

### 2. Chat AI (`/chat`)
- Giao diện chat hiện đại
- Voice input/output
- Lịch sử chat
- Tải xuống cuộc trò chuyện

### 3. Soạn văn bản (`/documents`)
- Template đa dạng
- AI hỗ trợ soạn thảo
- Quản lý văn bản
- Xuất/nhập file

### 4. Tra cứu luật (`/search`)
- Tìm kiếm thông minh
- Bộ lọc nâng cao
- Trending searches
- Bookmark và download

### 5. Phân tích hợp đồng (`/contract`)
- Upload và phân tích
- Phát hiện rủi ro
- Báo cáo chi tiết
- Mẫu hợp đồng

### 6. Dashboard (`/dashboard`)
- Thống kê real-time
- Báo cáo theo khu vực
- Hoạt động người dùng
- Xuất báo cáo

## 🔧 Tính năng nâng cao

### Voice Integration
- Speech-to-Text cho input
- Text-to-Speech cho output
- Hỗ trợ giọng nói tiếng Việt

### AI Features
- Natural language processing
- Context-aware responses
- Risk analysis
- Document generation

### Security & Privacy
- Data encryption
- User privacy protection
- Compliance with Vietnamese law
- Blockchain integration (planned)

## 📈 Roadmap

### Giai đoạn 1 - MVP (3 tháng)
- ✅ Web platform với core features
- ✅ Chat AI và tra cứu luật
- ✅ Soạn thảo văn bản cơ bản
- 🔄 Voice integration
- 🔄 Mobile app

### Giai đoạn 2 - Expansion (6-12 tháng)
- 🔄 Blockchain integration
- 🔄 Advanced AI features
- 🔄 Government partnerships
- 🔄 Multi-language support

### Giai đoạn 3 - National Scale (12-24 tháng)
- 🔄 White-label solutions
- 🔄 Regional voice training
- 🔄 International expansion
- 🔄 Advanced analytics

## 🤝 Đóng góp

Chúng tôi hoan nghênh mọi đóng góp! Vui lòng:

1. Fork repository
2. Tạo feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to branch (`git push origin feature/AmazingFeature`)
5. Tạo Pull Request

## 📄 License

Dự án này được phát triển cho mục đích giáo dục và nghiên cứu. Vui lòng liên hệ team để thảo luận về việc sử dụng thương mại.

## 📞 Liên hệ

- **Email:** contact@vilaw.vn
- **Website:** https://vilaw.vn
- **GitHub:** https://github.com/vilaw-team

## 🙏 Cảm ơn

Cảm ơn bạn đã quan tâm đến dự án ViLaw! Chúng tôi tin rằng công nghệ AI có thể giúp dân chủ hóa kiến thức pháp luật và tạo ra một xã hội công bằng hơn.

---

**ViLaw Team** - *"Mỗi công dân – Một trợ lý pháp lý AI"* 🏛️ 