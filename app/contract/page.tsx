'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  FileText, 
  Upload, 
  AlertTriangle, 
  CheckCircle, 
  XCircle,
  ArrowLeft,
  Download,
  Copy,
  Share2,
  Eye,
  EyeOff,
  Shield,
  TrendingUp,
  TrendingDown,
  Info,
  Zap,
  Camera,
  Image,
  FileImage,
  X,
  RotateCcw,
  Search,
  Crown,
  Award,
  Lock,
  AlertCircle
} from 'lucide-react'
import Link from 'next/link'
import toast from 'react-hot-toast'
import { useAuth } from '@/lib/auth/AuthProvider'

interface RiskAnalysis {
  level: 'low' | 'medium' | 'high' | 'critical'
  category: string
  title: string
  description: string
  recommendation: string
  impact: string
}

interface ContractAnalysis {
  overallRisk: 'low' | 'medium' | 'high' | 'critical'
  riskScore: number
  risks: RiskAnalysis[]
  summary: string
  recommendations: string[]
  complianceScore: number
}

// Giới hạn số lần phân tích hợp đồng theo gói user
const ANALYSIS_LIMITS = {
  normal: 5,
  pro: 50,
  admin: Infinity,
} as const

// Lưu trữ lịch sử phân tích trong localStorage
const getAnalysisHistoryKey = (userId: string) => `vilaw_contract_analysis_${userId}`
const getAnalysisCountKey = (userId: string) => `vilaw_contract_analysis_count_${userId}`

// Lấy user level từ email hoặc metadata
const getUserLevel = (email?: string): 'normal' | 'pro' | 'admin' => {
  if (!email) return 'normal'
  if (email.includes('admin') || email.includes('@vilaw.com')) return 'admin'
  if (email.includes('pro')) return 'pro'
  return 'normal'
}

export default function ContractPage() {
  const router = useRouter()
  const { user, loading } = useAuth()
  const [contractText, setContractText] = useState('')
  const [contractType, setContractType] = useState('')
  const [contractContent, setContractContent] = useState('')
  const [uploadedFile, setUploadedFile] = useState<File | null>(null)
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [analysis, setAnalysis] = useState<any>(null)
  const [scanMode, setScanMode] = useState<'text' | 'image'>('text')
  const [imagePreview, setImagePreview] = useState<string | null>(null)
  const [isScanning, setIsScanning] = useState(false)
  const [analysisCount, setAnalysisCount] = useState(0)
  const [userLevel, setUserLevel] = useState<'normal' | 'pro' | 'admin'>('normal')
  const [isLimitReached, setIsLimitReached] = useState(false)

  // Kiểm tra đăng nhập và redirect nếu chưa đăng nhập
  useEffect(() => {
    if (!loading && !user) {
      const currentPath = window.location.pathname
      router.push(`/supabase-login?redirect=${encodeURIComponent(currentPath)}`)
      toast.error('Vui lòng đăng nhập để sử dụng Phân tích Hợp đồng')
    }
  }, [user, loading, router])

  // Lấy user level khi user đăng nhập
  useEffect(() => {
    if (user) {
      const level = getUserLevel(user.email)
      setUserLevel(level)
    }
  }, [user])

  // Tải số lượng phân tích đã sử dụng khi user đăng nhập
  useEffect(() => {
    if (user && !loading) {
      const userId = user.id
      const countKey = getAnalysisCountKey(userId)

      try {
        const savedCount = localStorage.getItem(countKey)
        if (savedCount) {
          const count = parseInt(savedCount, 10)
          if (!isNaN(count)) {
            setAnalysisCount(count)
            checkLimitReached(count, getUserLevel(user.email))
          }
        }
      } catch (error) {
        console.error('Error loading analysis count:', error)
      }
    }
  }, [user, loading])

  // Kiểm tra giới hạn
  const checkLimitReached = (count: number, level: 'normal' | 'pro' | 'admin') => {
    const limit = ANALYSIS_LIMITS[level]
    if (limit !== Infinity && count >= limit) {
      setIsLimitReached(true)
      return true
    }
    setIsLimitReached(false)
    return false
  }

  // Lưu số lượng phân tích
  const saveAnalysisCount = (userId: string, count: number) => {
    try {
      const countKey = getAnalysisCountKey(userId)
      localStorage.setItem(countKey, count.toString())
    } catch (error) {
      console.error('Error saving analysis count:', error)
    }
  }

  // Lưu lịch sử phân tích vào localStorage
  const saveAnalysisHistory = (userId: string, analysisData: any, contractText: string) => {
    try {
      const historyKey = getAnalysisHistoryKey(userId)
      const existingHistory = localStorage.getItem(historyKey)
      const history = existingHistory ? JSON.parse(existingHistory) : []
      
      const newEntry = {
        id: Date.now().toString(),
        timestamp: new Date().toISOString(),
        contractText: contractText.substring(0, 200), // Lưu preview
        analysis: analysisData,
      }
      
      history.unshift(newEntry) // Thêm vào đầu
      // Giữ tối đa 50 bản ghi
      if (history.length > 50) {
        history.pop()
      }
      
      localStorage.setItem(historyKey, JSON.stringify(history))
    } catch (error) {
      console.error('Error saving analysis history:', error)
    }
  }

  const sampleContracts = [
    {
      name: 'Hợp đồng thuê nhà',
      content: `HỢP ĐỒNG THUÊ NHÀ

Số: HD001/2024

BÊN CHO THUÊ (Bên A):
Họ và tên: Nguyễn Văn A
CMND: 123456789
Địa chỉ: 123 Đường ABC, Quận 1, TP.HCM
Số điện thoại: 0901234567

BÊN THUÊ (Bên B):
Họ và tên: Trần Thị B
CMND: 987654321
Địa chỉ: 456 Đường XYZ, Quận 2, TP.HCM
Số điện thoại: 0987654321

ĐIỀU 1: ĐỐI TƯỢNG HỢP ĐỒNG
Bên A cho bên B thuê căn nhà tại địa chỉ: 789 Đường DEF, Quận 3, TP.HCM
Diện tích: 50m²
Số phòng: 2 phòng ngủ, 1 phòng khách, 1 nhà bếp, 1 nhà vệ sinh

ĐIỀU 2: THỜI HẠN THUÊ
Thời hạn thuê: 12 tháng
Từ ngày: 01/01/2024
Đến ngày: 31/12/2024

ĐIỀU 3: GIÁ THUÊ VÀ PHƯƠNG THỨC THANH TOÁN
Giá thuê: 8.000.000 VNĐ/tháng
Phương thức thanh toán: Chuyển khoản vào tài khoản ngân hàng
Thời hạn thanh toán: Trước ngày 05 hàng tháng

ĐIỀU 4: QUYỀN VÀ NGHĨA VỤ CỦA CÁC BÊN
4.1. Quyền và nghĩa vụ của bên A:
- Bàn giao nhà cho thuê đúng thời hạn
- Bảo trì, sửa chữa các hư hỏng do chất lượng công trình
- Không được đuổi người thuê trái phép

4.2. Quyền và nghĩa vụ của bên B:
- Sử dụng nhà đúng mục đích
- Bảo quản nhà và tài sản
- Thanh toán tiền thuê đúng hạn
- Trả lại nhà khi hết hạn hợp đồng

ĐIỀU 5: ĐIỀU KHOẢN CHUNG
- Hợp đồng này có hiệu lực từ ngày ký
- Mọi tranh chấp sẽ được giải quyết tại tòa án có thẩm quyền
- Hợp đồng được lập thành 2 bản, mỗi bên giữ 1 bản

TP.HCM, ngày 01/01/2024

Bên A Bên B
(Ký và ghi rõ họ tên) (Ký và ghi rõ họ tên)`
    },
    {
      name: 'Hợp đồng lao động',
      content: `HỢP ĐỒNG LAO ĐỘNG

Số: HĐLĐ001/2024

NGƯỜI SỬ DỤNG LAO ĐỘNG (Bên A):
Tên công ty: Công ty TNHH ABC
Địa chỉ: 123 Đường ABC, Quận 1, TP.HCM
Mã số thuế: 0123456789
Đại diện: Nguyễn Văn A - Giám đốc

NGƯỜI LAO ĐỘNG (Bên B):
Họ và tên: Trần Thị B
CMND: 987654321
Địa chỉ: 456 Đường XYZ, Quận 2, TP.HCM
Số điện thoại: 0987654321

ĐIỀU 1: CÔNG VIỆC VÀ ĐỊA ĐIỂM LÀM VIỆC
- Vị trí công việc: Nhân viên kinh doanh
- Địa điểm làm việc: 123 Đường ABC, Quận 1, TP.HCM
- Thời gian làm việc: 8 giờ/ngày, 5 ngày/tuần

ĐIỀU 2: THỜI HẠN HỢP ĐỒNG
- Loại hợp đồng: Hợp đồng thử việc
- Thời hạn: 2 tháng
- Từ ngày: 01/01/2024
- Đến ngày: 29/02/2024

ĐIỀU 3: TIỀN LƯƠNG VÀ PHỤ CẤP
- Mức lương: 8.000.000 VNĐ/tháng
- Hình thức trả lương: Chuyển khoản
- Thời gian trả lương: Ngày 05 hàng tháng

ĐIỀU 4: THỜI GIỜ LÀM VIỆC, NGHỈ NGƠI
- Thời gian làm việc: 8 giờ/ngày, từ 8h00 đến 17h00
- Nghỉ trưa: 1 giờ (12h00 - 13h00)
- Nghỉ cuối tuần: Thứ 7, Chủ nhật

ĐIỀU 5: BẢO HIỂM XÃ HỘI, BẢO HIỂM Y TẾ
- Thực hiện đầy đủ theo quy định pháp luật
- Công ty đóng 21.5%, người lao động đóng 10.5%

TP.HCM, ngày 01/01/2024

Bên A Bên B
(Ký và ghi rõ họ tên) (Ký và ghi rõ họ tên)`
    }
  ]

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      setUploadedFile(file)
      // Read file content and set to contractContent
      const reader = new FileReader()
      reader.onload = (e) => {
        const content = e.target?.result as string
        setContractContent(content)
      }
      reader.readAsText(file)
    }
  }

  const handleAnalyze = async () => {
    // Kiểm tra đăng nhập
    if (!user) {
      toast.error('Vui lòng đăng nhập để sử dụng Phân tích Hợp đồng')
      router.push(`/supabase-login?redirect=${encodeURIComponent('/contract')}`)
      return
    }

    if (!contractContent.trim() && !uploadedFile) {
      toast.error('Vui lòng nhập nội dung hợp đồng hoặc tải lên file')
      return
    }

    // Kiểm tra giới hạn số lần phân tích
    const limit = ANALYSIS_LIMITS[userLevel]
    if (limit !== Infinity && analysisCount >= limit) {
      toast.error(`Bạn đã đạt giới hạn ${limit} lần phân tích cho gói ${userLevel}. Vui lòng nâng cấp để tiếp tục sử dụng.`)
      setIsLimitReached(true)
      return
    }

    setIsAnalyzing(true)
    
    // Tăng số lượng phân tích và lưu
    const newAnalysisCount = analysisCount + 1
    setAnalysisCount(newAnalysisCount)
    saveAnalysisCount(user.id, newAnalysisCount)
    checkLimitReached(newAnalysisCount, userLevel)
    
    // Simulate AI analysis
    setTimeout(() => {
      const mockAnalysis = {
        overallRisk: 'medium',
        risks: [
          {
            title: 'Điều khoản chấm dứt hợp đồng không rõ ràng',
            description: 'Điều khoản về chấm dứt hợp đồng có thể gây bất lợi cho bên thứ hai',
            clause: 'Điều 15 - Chấm dứt hợp đồng'
          },
          {
            title: 'Thiếu điều khoản bảo mật',
            description: 'Hợp đồng không có điều khoản bảo mật thông tin',
            clause: 'Cần bổ sung'
          }
        ],
        keyTerms: [
          {
            title: 'Điều khoản thanh toán',
            description: 'Quy định rõ ràng về phương thức và thời hạn thanh toán',
            location: 'Điều 8'
          },
          {
            title: 'Trách nhiệm pháp lý',
            description: 'Phân định rõ trách nhiệm của các bên',
            location: 'Điều 12'
          }
        ],
        recommendations: [
          {
            title: 'Bổ sung điều khoản bảo mật',
            description: 'Thêm điều khoản về bảo mật thông tin và bí mật thương mại'
          },
          {
            title: 'Làm rõ điều khoản chấm dứt',
            description: 'Cụ thể hóa các trường hợp và thủ tục chấm dứt hợp đồng'
          }
        ],
        compliance: [
          {
            requirement: 'Thông tin các bên',
            law: 'Bộ luật Dân sự 2015',
            compliant: true
          },
          {
            requirement: 'Điều khoản chính',
            law: 'Luật Thương mại 2005',
            compliant: true
          },
          {
            requirement: 'Điều khoản bảo mật',
            law: 'Luật Bảo vệ quyền lợi người tiêu dùng',
            compliant: false
          }
        ]
      }
      
      setAnalysis(mockAnalysis)
      setIsAnalyzing(false)
      
      // Lưu lịch sử phân tích
      if (user) {
        saveAnalysisHistory(user.id, mockAnalysis, contractContent || contractText)
      }
    }, 3000)
  }

  const handleSampleContract = (contract: { name: string; content: string }) => {
    setContractText(contract.content)
    toast.success(`Đã tải mẫu hợp đồng: ${contract.name}`)
  }

  const handleScanImage = () => {
    // Simulate image scanning
    toast.success('Tính năng quét hình ảnh đang được phát triển')
  }

  const handleClear = () => {
    setContractText('')
    setContractContent('')
    setContractType('')
    setUploadedFile(null)
    setAnalysis(null)
  }

  const handleDownload = () => {
    if (!analysis) return
    
    const report = `Báo cáo phân tích hợp đồng\n\n` +
      `Mức độ rủi ro: ${getRiskText(analysis.overallRisk)}\n\n` +
      `Rủi ro phát hiện:\n${analysis.risks.map((r: any) => `- ${r.title}: ${r.description}`).join('\n')}\n\n` +
      `Khuyến nghị:\n${analysis.recommendations.map((r: any) => `- ${r.title}: ${r.description}`).join('\n')}`
    
    const blob = new Blob([report], { type: 'text/plain' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = 'contract-analysis-report.txt'
    a.click()
    URL.revokeObjectURL(url)
    toast.success('Đã tải xuống báo cáo')
  }

  const getRiskColor = (risk: string) => {
    switch (risk) {
      case 'low': return 'bg-green-100 text-green-800'
      case 'medium': return 'bg-yellow-100 text-yellow-800'
      case 'high': return 'bg-orange-100 text-orange-800'
      case 'critical': return 'bg-red-100 text-red-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const getRiskText = (risk: string) => {
    switch (risk) {
      case 'low': return 'Thấp'
      case 'medium': return 'Trung bình'
      case 'high': return 'Cao'
      case 'critical': return 'Rất cao'
      default: return 'Không xác định'
    }
  }

  // Hiển thị loading khi đang kiểm tra đăng nhập
  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-primary-50 via-accent-50 to-primary-100 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-primary-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Đang kiểm tra đăng nhập...</p>
        </div>
      </div>
    )
  }

  // Không hiển thị nội dung nếu chưa đăng nhập (sẽ redirect)
  if (!user) {
    return null
  }

  const limit = ANALYSIS_LIMITS[userLevel]
  const remainingAnalyses = limit === Infinity ? '∞' : Math.max(0, limit - analysisCount)

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
              <h1 className="text-2xl font-bold text-gray-900">Phân tích Hợp đồng</h1>
              <p className="text-sm text-gray-500">AI-powered contract analysis và risk assessment</p>
            </div>
          </div>

          <div className="flex items-center space-x-4">
            {/* Hiển thị số lần phân tích còn lại */}
            <div className="flex items-center space-x-2 px-3 py-1.5 bg-blue-50 rounded-lg border border-blue-200">
              {userLevel === 'pro' && <Crown className="w-4 h-4 text-yellow-600" />}
              {userLevel === 'admin' && <Award className="w-4 h-4 text-red-600" />}
              <span className="text-sm font-medium text-gray-700">
                {isLimitReached ? (
                  <span className="text-red-600">Đã hết lượt</span>
                ) : (
                  <span>Còn lại: <strong>{remainingAnalyses}</strong> lần phân tích</span>
                )}
              </span>
            </div>

            <button
              onClick={handleClear}
              className="p-2 rounded-lg text-gray-600 hover:bg-gray-100"
              title="Xóa tất cả"
            >
              <X className="w-4 h-4" />
            </button>
            <button
              onClick={handleDownload}
              className="p-2 rounded-lg text-gray-600 hover:bg-gray-100"
              title="Xuất báo cáo"
            >
              <Download className="w-4 h-4" />
            </button>
          </div>
        </div>
      </header>

      {/* Thông báo khi đạt giới hạn */}
      {isLimitReached && (
        <div className="max-w-7xl mx-auto px-4 pt-4">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-gradient-to-r from-yellow-50 to-orange-50 border border-yellow-200 rounded-lg p-4 flex items-center justify-between"
          >
            <div className="flex items-center space-x-3">
              <AlertCircle className="w-5 h-5 text-yellow-600" />
              <div>
                <p className="font-medium text-gray-900">Bạn đã đạt giới hạn {limit} lần phân tích cho gói {userLevel}</p>
                <p className="text-sm text-gray-600">Nâng cấp lên Pro để được {ANALYSIS_LIMITS.pro} lần phân tích/tháng</p>
              </div>
            </div>
            <Link
              href="/payment?pkg=Pro"
              className="flex items-center space-x-2 px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
            >
              <Crown className="w-4 h-4" />
              <span>Nâng cấp ngay</span>
            </Link>
          </motion.div>
        </div>
      )}

      <div className="max-w-7xl mx-auto p-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Input Section */}
          <div className="space-y-6">
            {/* File Upload */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Tải lên hợp đồng</h2>
              
              <div className="space-y-4">
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                  <Upload className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-600 mb-2">Kéo thả file hoặc click để chọn</p>
                  <p className="text-sm text-gray-500">Hỗ trợ PDF, DOC, DOCX (tối đa 10MB)</p>
                  <input
                    type="file"
                    accept=".pdf,.doc,.docx"
                    onChange={handleFileUpload}
                    className="hidden"
                    id="file-upload"
                  />
                  <label
                    htmlFor="file-upload"
                    className="mt-4 inline-flex items-center px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 cursor-pointer"
                  >
                    <Upload className="w-4 h-4 mr-2" />
                    Chọn file
                  </label>
                </div>

                {uploadedFile && (
                  <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                    <div className="flex items-center space-x-3">
                      <FileText className="w-5 h-5 text-green-600" />
                      <div>
                        <p className="text-sm font-medium text-gray-900">{uploadedFile.name}</p>
                        <p className="text-xs text-gray-500">{(uploadedFile.size / 1024 / 1024).toFixed(2)} MB</p>
                      </div>
                    </div>
                    <button
                      onClick={() => setUploadedFile(null)}
                      className="text-gray-400 hover:text-gray-600"
                      title="Xóa file"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                )}
              </div>
            </div>

            {/* Manual Input */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Nhập nội dung hợp đồng</h2>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Loại hợp đồng
                  </label>
                  <select
                    value={contractType}
                    onChange={(e) => setContractType(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                    aria-label="Chọn loại hợp đồng"
                  >
                    <option value="">Chọn loại hợp đồng</option>
                    <option value="labor">Hợp đồng lao động</option>
                    <option value="business">Hợp đồng thương mại</option>
                    <option value="property">Hợp đồng mua bán tài sản</option>
                    <option value="service">Hợp đồng dịch vụ</option>
                    <option value="lease">Hợp đồng thuê</option>
                    <option value="other">Khác</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Nội dung hợp đồng
                  </label>
                  <textarea
                    value={contractContent}
                    onChange={(e) => setContractContent(e.target.value)}
                    placeholder="Nhập hoặc paste nội dung hợp đồng vào đây..."
                    rows={12}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 resize-none"
                  />
                </div>

                {isLimitReached && (
                  <div className="mb-3 p-3 bg-yellow-50 border border-yellow-200 rounded-lg flex items-center space-x-2">
                    <Lock className="w-4 h-4 text-yellow-600" />
                    <p className="text-sm text-yellow-800">
                      Bạn đã đạt giới hạn. Vui lòng nâng cấp để tiếp tục sử dụng.
                    </p>
                  </div>
                )}
                <div className="flex space-x-3">
                  <button
                    onClick={handleAnalyze}
                    disabled={(!contractContent.trim() && !uploadedFile) || isLimitReached || isAnalyzing}
                    className="flex-1 btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isAnalyzing ? (
                      <>
                        <RotateCcw className="w-4 h-4 mr-2 animate-spin" />
                        Đang phân tích...
                      </>
                    ) : (
                      <>
                        <Search className="w-4 h-4 mr-2" />
                        Phân tích
                      </>
                    )}
                  </button>
                  <button
                    onClick={handleScanImage}
                    disabled={isLimitReached}
                    className="flex items-center px-4 py-2 bg-accent-600 text-white rounded-lg hover:bg-accent-700 disabled:opacity-50 disabled:cursor-not-allowed"
                    title="Quét hình ảnh"
                  >
                    <Camera className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Analysis Results */}
          <div className="space-y-6">
            {isAnalyzing ? (
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                <div className="flex items-center justify-center py-12">
                  <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto mb-4"></div>
                    <p className="text-gray-600">Đang phân tích hợp đồng...</p>
                  </div>
                </div>
              </div>
            ) : analysis ? (
              <>
                {/* Risk Assessment */}
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                  <h2 className="text-lg font-semibold text-gray-900 mb-4">Đánh giá rủi ro</h2>
                  
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600">Mức độ rủi ro tổng thể</span>
                      <span className={`px-3 py-1 rounded-full text-sm font-medium ${getRiskColor(analysis.overallRisk)}`}>
                        {getRiskText(analysis.overallRisk)}
                      </span>
                    </div>
                    
                    <div className="space-y-2">
                      {analysis.risks.map((risk: any, index: number) => (
                        <div key={index} className="flex items-start space-x-3 p-3 bg-red-50 rounded-lg">
                          <AlertTriangle className="w-5 h-5 text-red-600 mt-0.5" />
                          <div className="flex-1">
                            <p className="text-sm font-medium text-gray-900">{risk.title}</p>
                            <p className="text-sm text-gray-600">{risk.description}</p>
                            <p className="text-xs text-gray-500 mt-1">Điều khoản: {risk.clause}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Key Terms */}
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                  <h2 className="text-lg font-semibold text-gray-900 mb-4">Điều khoản quan trọng</h2>
                  
                  <div className="space-y-3">
                    {analysis.keyTerms.map((term: any, index: number) => (
                      <div key={index} className="flex items-start space-x-3 p-3 bg-blue-50 rounded-lg">
                        <FileText className="w-5 h-5 text-blue-600 mt-0.5" />
                        <div className="flex-1">
                          <p className="text-sm font-medium text-gray-900">{term.title}</p>
                          <p className="text-sm text-gray-600">{term.description}</p>
                          <p className="text-xs text-gray-500 mt-1">Vị trí: {term.location}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Recommendations */}
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                  <h2 className="text-lg font-semibold text-gray-900 mb-4">Khuyến nghị</h2>
                  
                  <div className="space-y-3">
                    {analysis.recommendations.map((rec: any, index: number) => (
                      <div key={index} className="flex items-start space-x-3 p-3 bg-green-50 rounded-lg">
                        <CheckCircle className="w-5 h-5 text-green-600 mt-0.5" />
                        <div className="flex-1">
                          <p className="text-sm font-medium text-gray-900">{rec.title}</p>
                          <p className="text-sm text-gray-600">{rec.description}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Compliance Check */}
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                  <h2 className="text-lg font-semibold text-gray-900 mb-4">Kiểm tra tuân thủ</h2>
                  
                  <div className="space-y-3">
                    {analysis.compliance.map((item: any, index: number) => (
                      <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                        <div className="flex items-center space-x-3">
                          {item.compliant ? (
                            <CheckCircle className="w-5 h-5 text-green-600" />
                          ) : (
                            <XCircle className="w-5 h-5 text-red-600" />
                          )}
                          <div>
                            <p className="text-sm font-medium text-gray-900">{item.requirement}</p>
                            <p className="text-xs text-gray-500">{item.law}</p>
                          </div>
                        </div>
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                          item.compliant ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                        }`}>
                          {item.compliant ? 'Tuân thủ' : 'Không tuân thủ'}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </>
            ) : (
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                <div className="text-center py-12">
                  <FileText className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">Chưa có phân tích</h3>
                  <p className="text-gray-500">Tải lên hợp đồng hoặc nhập nội dung để bắt đầu phân tích</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
} 