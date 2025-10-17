'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { 
  FileText, 
  Download, 
  Copy, 
  Save, 
  Wand2, 
  ArrowLeft,
  Plus,
  Edit,
  Trash2,
  Eye,
  CheckCircle,
  AlertCircle,
  Clock,
  Upload,
  Bot,
  Type,
  Share2
} from 'lucide-react'
import Link from 'next/link'
import toast from 'react-hot-toast'

interface DocumentTemplate {
  id: string
  name: string
  category: string
  description: string
  content: string
}

interface Document {
  id: string
  title: string
  type: string
  content: string
  status: 'draft' | 'completed'
  createdAt: Date
  updatedAt: Date
}

export default function DocumentsPage() {
  const [selectedTemplate, setSelectedTemplate] = useState<DocumentTemplate | null>(null)
  const [currentDocument, setCurrentDocument] = useState<Document | null>(null)
  const [isGenerating, setIsGenerating] = useState(false)
  const [activeTab, setActiveTab] = useState<'templates' | 'documents'>('templates')

  const templates: DocumentTemplate[] = [
    {
      id: '1',
      name: 'Đơn khiếu nại',
      category: 'Khiếu nại',
      description: 'Mẫu đơn khiếu nại hành chính',
      content: `Kính gửi: [Tên cơ quan có thẩm quyền]

Tôi là: [Họ và tên]
Sinh năm: [Năm sinh]
CMND/CCCD: [Số CMND/CCCD]
Địa chỉ: [Địa chỉ hiện tại]
Số điện thoại: [Số điện thoại]

NỘI DUNG KHIẾU NẠI

1. Quyết định hành chính, hành vi hành chính bị khiếu nại:
[Ghi rõ quyết định, hành vi bị khiếu nại]

2. Nội dung khiếu nại:
[Trình bày chi tiết lý do khiếu nại]

3. Yêu cầu của người khiếu nại:
[Ghi rõ yêu cầu cụ thể]

Tôi cam đoan những thông tin trên là đúng sự thật và chịu trách nhiệm trước pháp luật về nội dung khiếu nại.

[Địa điểm], ngày [ngày] tháng [tháng] năm [năm]

Người khiếu nại
(Ký và ghi rõ họ tên)`
    },
    {
      id: '2',
      name: 'Hợp đồng thuê nhà',
      category: 'Hợp đồng',
      description: 'Mẫu hợp đồng thuê nhà cơ bản',
      content: `HỢP ĐỒNG THUÊ NHÀ

Số: [Số hợp đồng]

Căn cứ vào Bộ luật Dân sự số 91/2015/QH13;
Căn cứ vào Luật Nhà ở số 65/2014/QH13;
Căn cứ vào nhu cầu và khả năng của các bên;

Hôm nay, ngày [ngày] tháng [tháng] năm [năm], tại [địa điểm], chúng tôi gồm:

BÊN CHO THUÊ (Bên A):
Họ và tên: [Họ và tên]
CMND/CCCD: [Số CMND/CCCD]
Địa chỉ: [Địa chỉ]
Số điện thoại: [Số điện thoại]

BÊN THUÊ (Bên B):
Họ và tên: [Họ và tên]
CMND/CCCD: [Số CMND/CCCD]
Địa chỉ: [Địa chỉ]
Số điện thoại: [Số điện thoại]

Hai bên thống nhất ký kết hợp đồng thuê nhà với các điều khoản sau:

ĐIỀU 1: ĐỐI TƯỢNG HỢP ĐỒNG
Bên A cho bên B thuê căn nhà tại địa chỉ: [Địa chỉ nhà]
Diện tích: [Diện tích] m²
Số phòng: [Số phòng]

ĐIỀU 2: THỜI HẠN THUÊ
Thời hạn thuê: [Số tháng] tháng
Từ ngày: [Ngày bắt đầu]
Đến ngày: [Ngày kết thúc]

ĐIỀU 3: GIÁ THUÊ VÀ PHƯƠNG THỨC THANH TOÁN
Giá thuê: [Số tiền] VNĐ/tháng
Phương thức thanh toán: [Ghi rõ phương thức]

ĐIỀU 4: QUYỀN VÀ NGHĨA VỤ CỦA CÁC BÊN
[Ghi rõ quyền và nghĩa vụ của từng bên]

ĐIỀU 5: ĐIỀU KHOẢN CHUNG
[Ghi rõ các điều khoản khác]

Hợp đồng này có hiệu lực từ ngày ký và được lập thành [số] bản, mỗi bên giữ [số] bản có giá trị pháp lý như nhau.

Đại diện bên cho thuê Đại diện bên thuê
(Ký và ghi rõ họ tên) (Ký và ghi rõ họ tên)`
    },
    {
      id: '3',
      name: 'Đơn xin việc',
      category: 'Đơn từ',
      description: 'Mẫu đơn xin việc chuyên nghiệp',
      content: `ĐƠN XIN VIỆC

Kính gửi: [Tên công ty/đơn vị]
Địa chỉ: [Địa chỉ công ty]

Tôi là: [Họ và tên]
Sinh năm: [Năm sinh]
CMND/CCCD: [Số CMND/CCCD]
Địa chỉ: [Địa chỉ hiện tại]
Số điện thoại: [Số điện thoại]
Email: [Email]

Tôi viết đơn này để xin ứng tuyển vào vị trí: [Tên vị trí]

LÝ LỊCH TRÍCH NGANG

1. Học vấn:
- Trường: [Tên trường]
- Chuyên ngành: [Chuyên ngành]
- Bằng cấp: [Bằng cấp]
- Năm tốt nghiệp: [Năm tốt nghiệp]

2. Kinh nghiệm làm việc:
[Liệt kê kinh nghiệm làm việc]

3. Kỹ năng:
[Liệt kê các kỹ năng]

4. Thành tích:
[Liệt kê các thành tích đạt được]

LÝ DO ỨNG TUYỂN
[Trình bày lý do muốn làm việc tại công ty]

Tôi cam đoan những thông tin trên là đúng sự thật và sẵn sàng cung cấp thêm thông tin khi cần thiết.

[Địa điểm], ngày [ngày] tháng [tháng] năm [năm]

Người xin việc
(Ký và ghi rõ họ tên)`
    },
    {
      id: '4',
      name: 'Đơn tố cáo',
      category: 'Tố cáo',
      description: 'Mẫu đơn tố cáo hành vi vi phạm pháp luật',
      content: `ĐƠN TỐ CÁO

Kính gửi: [Tên cơ quan có thẩm quyền]

Tôi là: [Họ và tên]
Sinh năm: [Năm sinh]
CMND/CCCD: [Số CMND/CCCD]
Địa chỉ: [Địa chỉ hiện tại]
Số điện thoại: [Số điện thoại]

NỘI DUNG TỐ CÁO

1. Thông tin người bị tố cáo:
Họ và tên: [Họ và tên]
Địa chỉ: [Địa chỉ]
Chức vụ: [Chức vụ] (nếu có)

2. Hành vi vi phạm:
[Trình bày chi tiết hành vi vi phạm pháp luật]

3. Thời gian, địa điểm xảy ra:
Thời gian: [Thời gian]
Địa điểm: [Địa điểm]

4. Chứng cứ:
[Liệt kê các chứng cứ có được]

5. Yêu cầu:
[Ghi rõ yêu cầu xử lý]

Tôi cam đoan những thông tin trên là đúng sự thật và chịu trách nhiệm trước pháp luật về nội dung tố cáo.

[Địa điểm], ngày [ngày] tháng [tháng] năm [năm]

Người tố cáo
(Ký và ghi rõ họ tên)`
    }
  ]

  const documents: Document[] = [
    {
      id: '1',
      title: 'Đơn khiếu nại - Công ty ABC',
      type: 'Khiếu nại',
      content: 'Nội dung đơn khiếu nại...',
      status: 'completed',
      createdAt: new Date('2024-01-15'),
      updatedAt: new Date('2024-01-15')
    },
    {
      id: '2',
      title: 'Hợp đồng thuê nhà - Nguyễn Văn A',
      type: 'Hợp đồng',
      content: 'Nội dung hợp đồng...',
      status: 'draft',
      createdAt: new Date('2024-01-10'),
      updatedAt: new Date('2024-01-12')
    }
  ]

  const handleTemplateSelect = (template: DocumentTemplate) => {
    setSelectedTemplate(template)
    setCurrentDocument({
      id: Date.now().toString(),
      title: `Bản thảo - ${template.name}`,
      type: template.category,
      content: template.content,
      status: 'draft',
      createdAt: new Date(),
      updatedAt: new Date()
    })
  }

  const handleGenerateWithAI = async () => {
    if (!selectedTemplate) return
    
    setIsGenerating(true)
    toast.success('AI đang tạo văn bản...')
    
    // Simulate AI generation
    setTimeout(() => {
      const enhancedContent = `${selectedTemplate.content}\n\n--- PHẦN BỔ SUNG TỪ AI ---\n\nLưu ý quan trọng:\n• Văn bản này tuân thủ quy định pháp luật hiện hành\n• Cần bổ sung thông tin cụ thể theo tình huống thực tế\n• Nên tham khảo ý kiến luật sư trước khi sử dụng\n• Giữ lại bản gốc và bản sao có công chứng`
      
      setCurrentDocument(prev => prev ? {
        ...prev,
        content: enhancedContent,
        updatedAt: new Date()
      } : null)
      
      setIsGenerating(false)
      toast.success('Đã tạo văn bản với AI!')
    }, 2000)
  }

  const handleSave = () => {
    if (!currentDocument) return
    toast.success('Đã lưu văn bản!')
  }

  const handleDownload = () => {
    if (!currentDocument) return
    
    const blob = new Blob([currentDocument.content], { type: 'text/plain' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `${currentDocument.title}.txt`
    a.click()
    URL.revokeObjectURL(url)
    toast.success('Đã tải xuống văn bản!')
  }

  const handleCopy = () => {
    if (!currentDocument) return
    navigator.clipboard.writeText(currentDocument.content)
    toast.success('Đã sao chép vào clipboard!')
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 via-accent-50 to-primary-100">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 px-4 py-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <Link href="/" className="text-primary-600 hover:text-primary-700">
              <ArrowLeft className="w-5 h-5" />
            </Link>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Soạn thảo Văn bản</h1>
              <p className="text-sm text-gray-500">AI-powered document drafting và legal templates</p>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <button
              onClick={handleSave}
              disabled={!currentDocument?.title.trim() || !currentDocument?.content.trim()}
              className="btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
              title="Lưu văn bản"
            >
              <Save className="w-4 h-4 mr-2" />
              Lưu
            </button>
            <button
              onClick={handleDownload}
              className="btn-secondary"
              title="Xuất văn bản"
            >
              <Download className="w-4 h-4 mr-2" />
              Xuất
            </button>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto p-6">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Templates Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Mẫu văn bản</h2>
              
              <div className="space-y-3">
                {templates.map((template) => (
                  <button
                    key={template.id}
                    onClick={() => handleTemplateSelect(template)}
                    className="w-full text-left p-3 rounded-lg border border-gray-200 hover:border-primary-300 hover:bg-primary-50 transition-colors"
                  >
                    <div className="flex items-center space-x-3">
                      <div className="w-8 h-8 bg-primary-100 rounded-lg flex items-center justify-center">
                        <FileText className="w-4 h-4 text-primary-600" />
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-900">{template.name}</p>
                        <p className="text-xs text-gray-500">{template.category}</p>
                      </div>
                    </div>
                  </button>
                ))}
              </div>

              <div className="mt-6 pt-6 border-t border-gray-200">
                <h3 className="text-sm font-medium text-gray-900 mb-3">Thao tác nhanh</h3>
                <div className="space-y-2">
                  <button
                    onClick={() => handleTemplateSelect({
                      id: 'new',
                      name: 'Văn bản mới',
                      category: 'Khác',
                      description: 'Tạo văn bản mới từ đầu',
                      content: ''
                    })}
                    className="w-full flex items-center space-x-2 p-2 rounded-lg text-gray-600 hover:bg-gray-100"
                  >
                    <Plus className="w-4 h-4" />
                    <span className="text-sm">Văn bản mới</span>
                  </button>
                  <button
                    onClick={() => alert('Chức năng nhập văn bản chưa được triển khai')}
                    className="w-full flex items-center space-x-2 p-2 rounded-lg text-gray-600 hover:bg-gray-100"
                  >
                    <Upload className="w-4 h-4" />
                    <span className="text-sm">Nhập văn bản</span>
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Document Editor */}
          <div className="lg:col-span-3">
            <div className="bg-white rounded-xl shadow-sm border border-gray-200">
              <div className="p-6 border-b border-gray-200">
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Tiêu đề văn bản
                    </label>
                    <input
                      type="text"
                      value={currentDocument?.title || ''}
                      onChange={(e) => setCurrentDocument(prev => prev ? {
                        ...prev,
                        title: e.target.value,
                        updatedAt: new Date()
                      } : null)}
                      placeholder="Nhập tiêu đề văn bản..."
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                    />
                  </div>

                  <div className="flex items-center space-x-4">
                    <div className="flex-1">
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Loại văn bản
                      </label>
                      <select
                        value={currentDocument?.type || ''}
                        onChange={(e) => setCurrentDocument(prev => prev ? {
                          ...prev,
                          type: e.target.value,
                          updatedAt: new Date()
                        } : null)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                        aria-label="Chọn loại văn bản"
                      >
                        <option value="">Chọn loại văn bản</option>
                        <option value="Khiếu nại">Khiếu nại</option>
                        <option value="Hợp đồng">Hợp đồng</option>
                        <option value="Đơn từ">Đơn từ</option>
                        <option value="Tố cáo">Tố cáo</option>
                        <option value="Khác">Khác</option>
                      </select>
                    </div>
                    <div className="flex-1">
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Cơ quan ban hành
                      </label>
                      <input
                        type="text"
                        value={currentDocument?.title || ''}
                        onChange={(e) => setCurrentDocument(prev => prev ? {
                          ...prev,
                          title: e.target.value,
                          updatedAt: new Date()
                        } : null)}
                        placeholder="Nhập cơ quan ban hành..."
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                      />
                    </div>
                  </div>
                </div>
              </div>

              <div className="p-6">
                <div className="mb-4">
                  <div className="flex items-center justify-between mb-2">
                    <label className="block text-sm font-medium text-gray-700">
                      Nội dung văn bản
                    </label>
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => setIsGenerating(!isGenerating)}
                        className={`p-2 rounded-lg ${isGenerating ? 'bg-primary-100 text-primary-600' : 'text-gray-600 hover:bg-gray-100'}`}
                        title="Bật/tắt AI hỗ trợ"
                      >
                        <Wand2 className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => alert('Chức năng định dạng văn bản chưa được triển khai')}
                        className="p-2 rounded-lg text-gray-600 hover:bg-gray-100"
                        title="Định dạng văn bản"
                      >
                        <Type className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                  
                  <textarea
                    value={currentDocument?.content || ''}
                    onChange={(e) => setCurrentDocument(prev => prev ? {
                      ...prev,
                      content: e.target.value,
                      updatedAt: new Date()
                    } : null)}
                    placeholder="Nhập nội dung văn bản... AI sẽ hỗ trợ soạn thảo và kiểm tra pháp lý"
                    rows={20}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 resize-none font-mono text-sm"
                  />
                </div>

                {isGenerating && (
                  <div className="mt-4 p-4 bg-blue-50 rounded-lg">
                    <div className="flex items-center space-x-2 mb-2">
                      <Wand2 className="w-4 h-4 text-blue-600" />
                      <span className="text-sm font-medium text-blue-900">AI Hỗ trợ</span>
                    </div>
                    <div className="space-y-2">
                      <div className="flex items-center space-x-2">
                        <CheckCircle className="w-4 h-4 text-green-600" />
                        <span className="text-sm text-gray-700">Kiểm tra cú pháp và ngữ pháp</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <CheckCircle className="w-4 h-4 text-green-600" />
                        <span className="text-sm text-gray-700">Đề xuất cải thiện nội dung</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <CheckCircle className="w-4 h-4 text-green-600" />
                        <span className="text-sm text-gray-700">Kiểm tra tuân thủ pháp luật</span>
                      </div>
                    </div>
                  </div>
                )}

                <div className="mt-6 flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <span className="text-sm text-gray-500">
                      {currentDocument?.content?.length || 0} ký tự
                    </span>
                    <span className="text-sm text-gray-500">
                      {currentDocument?.content?.split('\n').length || 0} dòng
                    </span>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() => alert('Chức năng xem trước chưa được triển khai')}
                      className="btn-secondary"
                      title="Xem trước"
                    >
                      <Eye className="w-4 h-4 mr-2" />
                      Xem trước
                    </button>
                    <button
                      onClick={() => alert('Chức năng chia sẻ chưa được triển khai')}
                      className="btn-accent"
                      title="Chia sẻ"
                    >
                      <Share2 className="w-4 h-4 mr-2" />
                      Chia sẻ
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
} 