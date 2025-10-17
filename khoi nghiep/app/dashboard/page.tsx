'use client'

import { Suspense, useEffect, useState } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import Link from 'next/link'
import toast from 'react-hot-toast'
import { motion, AnimatePresence } from 'framer-motion'
import {
  // Shared/header icons
  ArrowLeft,
  RotateCcw,
  Download,
  // Dashboard icons
  Users,
  FileText,
  MessageSquare,
  Search,
  Activity,
  BarChart3,
  Bot,
  ThumbsUp,
  Shield,
  Clock,
  CheckCircle,
  AlertCircle,
  XCircle,
  Plus,
  Bell,
  // Admin icons
  RefreshCw,
  Calendar,
  ExternalLink,
  Database,
  TrendingUp
} from 'lucide-react'

type TabKey = 'overview' | 'admin'

function DashboardUnifiedPage() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const initialTab = (searchParams.get('tab') as TabKey) || 'overview'
  const [activeTab, setActiveTab] = useState<TabKey>(initialTab)
  const [isRefreshing, setIsRefreshing] = useState(false)

  useEffect(() => {
    const urlTab = (searchParams.get('tab') as TabKey) || 'overview'
    setActiveTab(urlTab)
  }, [searchParams])

  const onSelectTab = (tab: TabKey) => {
    setActiveTab(tab)
    const params = new URLSearchParams(searchParams.toString())
    params.set('tab', tab)
    router.replace(`/dashboard?${params.toString()}`)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 via-accent-50 to-primary-100">
      {/* Header with tabs */}
      <header className="bg-white border-b border-gray-200 px-4 py-4">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Link href="/" className="text-primary-600 hover:text-primary-700">
                <ArrowLeft className="w-5 h-5" />
              </Link>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Bảng điều khiển</h1>
                <p className="text-sm text-gray-500">Tổng quan và Quản trị trong một nơi</p>
              </div>
            </div>

            <div className="flex items-center space-x-2">
              <button
                onClick={() => {
                  setIsRefreshing(true)
                  setTimeout(() => setIsRefreshing(false), 1000)
                }}
                className="p-2 rounded-lg text-gray-600 hover:bg-gray-100"
                title="Làm mới"
              >
                <RotateCcw className={`w-4 h-4 ${isRefreshing ? 'animate-spin' : ''}`} />
              </button>
              <button
                className="p-2 rounded-lg text-gray-600 hover:bg-gray-100"
                title="Xuất báo cáo"
              >
                <Download className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Tabs */}
          <div className="mt-4 flex items-center space-x-2">
            <button
              onClick={() => onSelectTab('overview')}
              className={`px-4 py-2 rounded-lg text-sm font-medium border ${
                activeTab === 'overview' ? 'bg-primary-600 text-white border-primary-600' : 'bg-white text-gray-700 border-gray-200 hover:bg-gray-50'
              }`}
            >
              Tổng quan
            </button>
            <button
              onClick={() => onSelectTab('admin')}
              className={`px-4 py-2 rounded-lg text-sm font-medium border ${
                activeTab === 'admin' ? 'bg-primary-600 text-white border-primary-600' : 'bg-white text-gray-700 border-gray-200 hover:bg-gray-50'
              }`}
            >
              Quản trị
            </button>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto p-6">
        {activeTab === 'overview' ? <DashboardOverview /> : <AdminPanel />}
      </div>
    </div>
  )
}

export default function DashboardPage() {
  return (
    <Suspense fallback={<div className="min-h-screen theme-bg" />}> 
      <DashboardUnifiedPage />
    </Suspense>
  )
}

function DashboardOverview() {
  const [isLoading, setIsLoading] = useState(false)

  const stats = {
    totalDocuments: '12,847',
    activeUsers: '2,456',
    aiQueries: '8,923',
    satisfaction: '94'
  }

  const recentActivity = [
    { type: 'document', title: 'Văn bản mới được thêm', description: 'Nghị định về quản lý doanh nghiệp', time: '2 phút trước' },
    { type: 'user', title: 'Người dùng mới đăng ký', description: 'Công ty TNHH ABC', time: '5 phút trước' },
    { type: 'system', title: 'Cập nhật hệ thống', description: 'Phiên bản 2.1.0 đã được triển khai', time: '10 phút trước' },
    { type: 'ai', title: 'Truy vấn AI tăng cao', description: '1,234 câu hỏi trong giờ qua', time: '15 phút trước' }
  ]

  const notifications = [
    { title: 'Cập nhật văn bản', message: '5 văn bản mới đã được thêm vào hệ thống', time: '2 phút trước' },
    { title: 'Bảo trì hệ thống', message: 'Hệ thống sẽ được bảo trì vào 02:00 sáng mai', time: '1 giờ trước' },
    { title: 'Báo cáo tháng', message: 'Báo cáo thống kê tháng 1 đã sẵn sàng', time: '3 giờ trước' }
  ]

  const handleRefresh = () => {
    setIsLoading(true)
    setTimeout(() => setIsLoading(false), 1500)
  }

  const handleExport = () => {
    console.log('Exporting data...')
  }

  const handleAddDocument = () => {
    console.log('Adding document...')
  }

  const handleGenerateReport = () => {
    console.log('Generating report...')
  }

  const handleSystemCheck = () => {
    console.log('Checking system...')
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed':
        return <CheckCircle className="w-4 h-4 text-green-500" />
      case 'pending':
        return <Clock className="w-4 h-4 text-yellow-500" />
      case 'failed':
        return <XCircle className="w-4 h-4 text-red-500" />
      default:
        return <AlertCircle className="w-4 h-4 text-gray-500" />
    }
  }

  const getActivityIcon = (type: string) => {
    switch (type) {
      case 'chat':
        return <MessageSquare className="w-4 h-4 text-blue-500" />
      case 'document':
        return <FileText className="w-4 h-4 text-green-500" />
      case 'search':
        return <Search className="w-4 h-4 text-purple-500" />
      case 'contract':
        return <BarChart3 className="w-4 h-4 text-orange-500" />
      default:
        return <Activity className="w-4 h-4 text-gray-500" />
    }
  }

  return (
    <div>
      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Tổng văn bản</p>
              <p className="text-3xl font-bold text-gray-900">{stats.totalDocuments}</p>
              <p className="text-sm text-green-600">+12% so với tháng trước</p>
            </div>
            <div className="w-12 h-12 bg-primary-100 rounded-lg flex items-center justify-center">
              <FileText className="w-6 h-6 text-primary-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Người dùng hoạt động</p>
              <p className="text-3xl font-bold text-gray-900">{stats.activeUsers}</p>
              <p className="text-sm text-green-600">+8% so với tuần trước</p>
            </div>
            <div className="w-12 h-12 bg-accent-100 rounded-lg flex items-center justify-center">
              <Users className="w-6 h-6 text-accent-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Truy vấn AI</p>
              <p className="text-3xl font-bold text-gray-900">{stats.aiQueries}</p>
              <p className="text-sm text-green-600">+15% so với ngày trước</p>
            </div>
            <div className="w-12 h-12 bg-legal-100 rounded-lg flex items-center justify-center">
              <Bot className="w-6 h-6 text-legal-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Tỉ lệ hài lòng</p>
              <p className="text-3xl font-bold text-gray-900">{stats.satisfaction}%</p>
              <p className="text-sm text-green-600">+2% so với tháng trước</p>
            </div>
            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
              <ThumbsUp className="w-6 h-6 text-green-600" />
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Activity */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-xl shadow-sm border border-gray-200">
            <div className="p-6 border-b border-gray-200">
              <h2 className="text-xl font-semibold text-gray-900">Hoạt động gần đây</h2>
            </div>
            <div className="p-6">
              <div className="space-y-4">
                {recentActivity.map((activity, index) => (
                  <div key={index} className="flex items-start space-x-4">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                      activity.type === 'document' ? 'bg-blue-100' :
                      activity.type === 'user' ? 'bg-green-100' :
                      activity.type === 'system' ? 'bg-orange-100' : 'bg-gray-100'
                    }`}>
                      {activity.type === 'document' && <FileText className="w-4 h-4 text-blue-600" />}
                      {activity.type === 'user' && <Users className="w-4 h-4 text-green-600" />}
                      {activity.type === 'system' && <Shield className="w-4 h-4 text-orange-600" />}
                      {activity.type === 'ai' && <Bot className="w-4 h-4 text-gray-600" />}
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-medium text-gray-900">{activity.title}</p>
                      <p className="text-sm text-gray-600">{activity.description}</p>
                      <p className="text-xs text-gray-500">{activity.time}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Quick Actions and Notifications */}
        <div className="space-y-6">
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Thao tác nhanh</h3>
            <div className="space-y-3">
              <button
                onClick={handleAddDocument}
                className="w-full flex items-center space-x-3 p-3 rounded-lg border border-gray-200 hover:border-primary-300 hover:bg-primary-50 transition-colors"
              >
                <Plus className="w-5 h-5 text-primary-600" />
                <span className="text-sm font-medium text-gray-900">Thêm văn bản mới</span>
              </button>
              <button
                onClick={handleGenerateReport}
                className="w-full flex items-center space-x-3 p-3 rounded-lg border border-gray-200 hover:border-accent-300 hover:bg-accent-50 transition-colors"
              >
                <BarChart3 className="w-5 h-5 text-accent-600" />
                <span className="text-sm font-medium text-gray-900">Tạo báo cáo</span>
              </button>
              <button
                onClick={handleSystemCheck}
                className="w-full flex items-center space-x-3 p-3 rounded-lg border border-gray-200 hover:border-legal-300 hover:bg-legal-50 transition-colors"
              >
                <Shield className="w-5 h-5 text-legal-600" />
                <span className="text-sm font-medium text-gray-900">Kiểm tra hệ thống</span>
              </button>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Thông báo</h3>
            <div className="space-y-3">
              {notifications.map((notification, index) => (
                <div key={index} className="flex items-start space-x-3 p-3 bg-blue-50 rounded-lg">
                  <Bell className="w-4 h-4 text-blue-600 mt-0.5" />
                  <div className="flex-1">
                    <p className="text-sm font-medium text-gray-900">{notification.title}</p>
                    <p className="text-sm text-gray-600">{notification.message}</p>
                    <p className="text-xs text-gray-500 mt-1">{notification.time}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

function AdminPanel() {
  const [documents, setDocuments] = useState<any[]>([])
  const [filteredDocuments, setFilteredDocuments] = useState<any[]>([])
  const [stats, setStats] = useState<any | null>(null)
  const [isUpdating, setIsUpdating] = useState(false)
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedType, setSelectedType] = useState('')
  const [selectedSource, setSelectedSource] = useState('')
  const [selectedAuthority, setSelectedAuthority] = useState('')
  const [currentPage, setCurrentPage] = useState(1)
  const docsPerPage = 20

  const documentTypes = [
    'Hiến pháp', 'Luật', 'Bộ luật', 'Pháp lệnh',
    'Nghị quyết', 'Nghị định', 'Quyết định',
    'Thông tư', 'Chỉ thị', 'Quy chế',
    'Hướng dẫn', 'Công văn', 'Văn bản khác'
  ]

  const sources = [
    'government', 'library', 'assembly', 'court',
    'google_search', 'ministry_justice', 'ministry_finance'
  ]

  const authorities = [
    'Quốc hội', 'Chính phủ', 'Thủ tướng Chính phủ',
    'Bộ Tư pháp', 'Bộ Tài chính', 'Bộ Lao động - Thương binh và Xã hội',
    'Tòa án Tối cao', 'Viện Kiểm sát Tối cao'
  ]

  useEffect(() => {
    const timer = setTimeout(() => {
      initializeCrawler()
      loadDocuments()
      loadStats()
    }, 500)
    const handleUpdate = (event: any) => {
      toast.success(`Đã cập nhật: ${event.detail?.newDocuments ?? 0} văn bản mới`)
      loadDocuments()
      loadStats()
    }
    if (typeof window !== 'undefined') {
      window.addEventListener('vilaw-legal-update', handleUpdate as EventListener)
    }
    return () => {
      clearTimeout(timer)
      if (typeof window !== 'undefined') {
        window.removeEventListener('vilaw-legal-update', handleUpdate as EventListener)
      }
    }
  }, [])

  useEffect(() => {
    filterDocuments()
  }, [documents, searchTerm, selectedType, selectedSource, selectedAuthority])

  const initializeCrawler = async () => {
    if (typeof window !== 'undefined' && window.legalCrawler) {
      await window.legalCrawler.initialize()
    }
  }

  const loadDocuments = () => {
    if (typeof window !== 'undefined' && window.legalCrawler) {
      const docs = window.legalCrawler.getAllDocuments()
      setDocuments(docs)
    } else {
      setDocuments(getSampleDocuments())
    }
  }

  const loadStats = () => {
    if (typeof window !== 'undefined' && window.legalCrawler) {
      const statsData = window.legalCrawler.getUpdateStats()
      setStats(statsData)
    } else {
      setStats({
        total: 156,
        thisWeek: 12,
        thisMonth: 43,
        byType: { 'Luật': 23, 'Nghị định': 45, 'Thông tư': 67, 'Quyết định': 21 },
        lastUpdate: new Date().toISOString()
      })
    }
  }

  const getSampleDocuments = () => [
    {
      id: '1',
      title: 'Luật Bảo vệ môi trường 2020 (sửa đổi)',
      type: 'Luật',
      authority: 'Quốc hội',
      dateIssued: '2024-01-15',
      url: 'https://thuvienphapluat.vn/van-ban/Bo-may-hanh-chinh/Luat-Bao-ve-moi-truong-2020-sua-doi',
      status: 'active' as const,
      source: 'library',
      lastCrawled: '2024-01-16T10:00:00Z'
    },
    {
      id: '2',
      title: 'Nghị định 01/2024/NĐ-CP về đầu tư công',
      type: 'Nghị định',
      authority: 'Chính phủ',
      dateIssued: '2024-01-10',
      url: 'https://vanban.chinhphu.vn/chi-tiet-van-ban?Ngay=2024-01-15&So=01',
      status: 'active' as const,
      source: 'government',
      isNew: true,
      lastCrawled: '2024-01-16T11:00:00Z'
    },
    {
      id: '3',
      title: 'Thông tư 02/2024/TT-BTC hướng dẫn Luật Thuế',
      type: 'Thông tư',
      authority: 'Bộ Tài chính',
      dateIssued: '2024-01-08',
      url: 'https://vanban.chinhphu.vn/chi-tiet-van-ban?Ngay=2024-01-20&So=02',
      status: 'active' as const,
      source: 'government',
      lastCrawled: '2024-01-16T12:00:00Z'
    }
  ]

  const filterDocuments = () => {
    let filtered = documents
    if (searchTerm) {
      const term = searchTerm.toLowerCase()
      filtered = filtered.filter((doc: any) =>
        doc.title.toLowerCase().includes(term) ||
        doc.authority.toLowerCase().includes(term) ||
        doc.type.toLowerCase().includes(term)
      )
    }
    if (selectedType) filtered = filtered.filter((doc: any) => doc.type === selectedType)
    if (selectedSource) filtered = filtered.filter((doc: any) => doc.source === selectedSource)
    if (selectedAuthority) filtered = filtered.filter((doc: any) => doc.authority === selectedAuthority)
    setFilteredDocuments(filtered)
  }

  const handleForceUpdate = async () => {
    setIsUpdating(true)
    toast.loading('Đang cập nhật văn bản pháp luật...', { duration: 2000 })
    try {
      if (typeof window !== 'undefined' && window.legalCrawler) {
        await window.legalCrawler.forceUpdate()
        loadDocuments()
        loadStats()
        toast.success('Cập nhật thành công!')
      }
    } catch (error: any) {
      const message = error?.message ?? String(error)
      toast.error('Cập nhật thất bại: ' + message)
    } finally {
      setIsUpdating(false)
    }
  }

  const handleExportDocuments = () => {
    const dataStr = JSON.stringify(filteredDocuments, null, 2)
    const dataUri = 'data:application/json;charset=utf-8,' + encodeURIComponent(dataStr)
    const exportFileDefaultName = `vilaw-documents-${new Date().toISOString().split('T')[0]}.json`
    const linkElement = document.createElement('a')
    linkElement.setAttribute('href', dataUri)
    linkElement.setAttribute('download', exportFileDefaultName)
    linkElement.click()
    toast.success('Đã xuất dữ liệu thành công!')
  }

  const formatDate = (dateString: string) => new Date(dateString).toLocaleDateString('vi-VN', { year: 'numeric', month: '2-digit', day: '2-digit' })
  const getSourceName = (source: string) => ({
    government: 'Chính phủ',
    library: 'Thư viện Pháp luật',
    assembly: 'Quốc hội',
    court: 'Tòa án',
    google_search: 'Google Search',
    ministry_justice: 'Bộ Tư pháp',
    ministry_finance: 'Bộ Tài chính'
  } as Record<string, string>)[source] || source

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'text-green-600 bg-green-100'
      case 'draft': return 'text-yellow-600 bg-yellow-100'
      case 'archived': return 'text-gray-600 bg-gray-100'
      default: return 'text-blue-600 bg-blue-100'
    }
  }

  const indexOfLastDoc = currentPage * docsPerPage
  const indexOfFirstDoc = indexOfLastDoc - docsPerPage
  const currentDocs = filteredDocuments.slice(indexOfFirstDoc, indexOfLastDoc)
  const totalPages = Math.ceil((filteredDocuments.length || 1) / docsPerPage)

  return (
    <div className="space-y-6">
      {/* Stats */}
      {stats && (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-500 text-sm">Tổng văn bản</p>
                <p className="text-2xl font-bold text-gray-900">{stats.total.toLocaleString()}</p>
              </div>
              <Database className="w-8 h-8 text-blue-600" />
            </div>
          </motion.div>
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-500 text-sm">Tuần này</p>
                <p className="text-2xl font-bold text-green-600">{stats.thisWeek}</p>
              </div>
              <TrendingUp className="w-8 h-8 text-green-600" />
            </div>
          </motion.div>
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-500 text-sm">Tháng này</p>
                <p className="text-2xl font-bold text-purple-600">{stats.thisMonth}</p>
              </div>
              <Calendar className="w-8 h-8 text-purple-600" />
            </div>
          </motion.div>
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-500 text-sm">Cập nhật cuối</p>
                <p className="text-sm font-medium text-gray-900">{formatDate(stats.lastUpdate)}</p>
              </div>
              <Clock className="w-8 h-8 text-orange-600" />
            </div>
          </motion.div>
        </div>
      )}

      {/* Filters and actions */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div>
            <label htmlFor="admin-search" className="block text-sm font-medium text-gray-700 mb-2">Tìm kiếm</label>
            <div className="relative">
              <Search className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
              <input
                id="admin-search"
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Tìm kiếm văn bản..."
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
              />
            </div>
          </div>
          <div>
            <label htmlFor="admin-type" className="block text-sm font-medium text-gray-700 mb-2">Loại văn bản</label>
            <select id="admin-type" value={selectedType} onChange={(e) => setSelectedType(e.target.value)} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500">
              <option value="">Tất cả loại</option>
              {documentTypes.map(type => (<option key={type} value={type}>{type}</option>))}
            </select>
          </div>
          <div>
            <label htmlFor="admin-source" className="block text-sm font-medium text-gray-700 mb-2">Nguồn</label>
            <select id="admin-source" value={selectedSource} onChange={(e) => setSelectedSource(e.target.value)} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500">
              <option value="">Tất cả nguồn</option>
              {sources.map(source => (<option key={source} value={source}>{getSourceName(source)}</option>))}
            </select>
          </div>
          <div>
            <label htmlFor="admin-authority" className="block text-sm font-medium text-gray-700 mb-2">Cơ quan ban hành</label>
            <select id="admin-authority" value={selectedAuthority} onChange={(e) => setSelectedAuthority(e.target.value)} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500">
              <option value="">Tất cả cơ quan</option>
              {authorities.map(authority => (<option key={authority} value={authority}>{authority}</option>))}
            </select>
          </div>
        </div>
        <div className="flex items-center justify-between mt-4 pt-4 border-t border-gray-200">
          <div className="text-sm text-gray-500">Hiển thị {filteredDocuments.length} trong tổng số {documents.length} văn bản</div>
          <div className="flex items-center space-x-2">
            <button onClick={handleForceUpdate} disabled={isUpdating} className="flex items-center space-x-2 px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 disabled:opacity-50">
              <RefreshCw className={`w-4 h-4 ${isUpdating ? 'animate-spin' : ''}`} />
              <span>{isUpdating ? 'Đang cập nhật...' : 'Cập nhật ngay'}</span>
            </button>
            <button onClick={handleExportDocuments} className="flex items-center space-x-2 px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200">
              <Download className="w-4 h-4" />
              <span>Xuất dữ liệu</span>
            </button>
          </div>
        </div>
      </div>

      {/* Document List */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200">
        <div className="px-6 py-4 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900">Danh sách văn bản</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Văn bản</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Loại</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Cơ quan</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Ngày ban hành</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Nguồn</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Trạng thái</th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Thao tác</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              <AnimatePresence>
                {currentDocs.map((doc: any, index: number) => (
                  <motion.tr key={doc.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} transition={{ delay: index * 0.02 }} className="hover:bg-gray-50">
                    <td className="px-6 py-4">
                      <div className="flex items-center">
                        {doc.isNew && (
                          <span className="mr-2 px-2 py-1 text-xs font-medium bg-green-100 text-green-800 rounded-full">MỚI</span>
                        )}
                        <div>
                          <div className="text-sm font-medium text-gray-900 line-clamp-2">{doc.title}</div>
                          <div className="text-sm text-gray-500">ID: {doc.id}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="px-2 py-1 text-xs font-medium bg-blue-100 text-blue-800 rounded-full">{doc.type}</span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{doc.authority}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{formatDate(doc.dateIssued)}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{getSourceName(doc.source)}</td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(doc.status)}`}>{doc.status}</span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium space-x-2">
                      <a href={doc.url} target="_blank" rel="noopener noreferrer" className="text-primary-600 hover:text-primary-900" title="Xem văn bản">
                        <ExternalLink className="w-4 h-4" />
                      </a>
                    </td>
                  </motion.tr>
                ))}
              </AnimatePresence>
            </tbody>
          </table>
        </div>
        {/* Pagination */}
        {totalPages > 1 && (
          <div className="px-6 py-4 border-t border-gray-200 flex items-center justify-between">
            <div className="text-sm text-gray-500">Trang {currentPage} / {totalPages}</div>
            <div className="flex space-x-2">
              <button onClick={() => setCurrentPage(Math.max(1, currentPage - 1))} disabled={currentPage === 1} className="px-3 py-1 text-sm border border-gray-300 rounded disabled:opacity-50">Trước</button>
              <button onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))} disabled={currentPage === totalPages} className="px-3 py-1 text-sm border border-gray-300 rounded disabled:opacity-50">Sau</button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}