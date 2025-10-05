'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'
import Image from 'next/image'
import { useEffect, useState } from 'react'
//
import logoImg from '../1.jpg'
import UserIcon from './components/UserIcon'
import {
  Search,
  MessageSquare,
  FileText,
  Users,
  Settings,
  BarChart3,
  BookOpen,
  Shield,
  Zap,
  Globe,
  Database,
  Bot,
  TrendingUp,
  Award,
  Clock,
  CheckCircle,
  Star,
  ArrowRight,
  Play,
  Download,
  Share2,
  Eye,
  Building,
  Calendar,
  FileCheck,
  Scale,
  Gavel,
  BookMarked,
  Search as SearchIcon,
  Filter,
  Grid,
  List,
  ChevronDown,
  ChevronUp,
  Download as DownloadIcon,
  Share2 as ShareIcon,
  Bookmark,
  BookmarkPlus,
  Eye as EyeIcon,
  Building as BuildingIcon,
  Calendar as CalendarIcon,
  Globe as GlobeIcon,
  TrendingUp as TrendingUpIcon,
} from 'lucide-react'

const features = [
  {
    icon: <Search className="w-6 h-6" />,
    title: 'Tìm kiếm Thông minh',
    description: 'AI-powered search với semantic understanding và context awareness',
    color: 'from-blue-500 to-cyan-500'
  },
  {
    icon: <MessageSquare className="w-6 h-6" />,
    title: 'Chatbot Pháp lý',
    description: 'Trợ lý AI 24/7, trả lời câu hỏi pháp lý bằng tiếng Việt',
    color: 'from-purple-500 to-pink-500'
  },
  {
    icon: <FileText className="w-6 h-6" />,
    title: 'Soạn thảo Văn bản',
    description: 'Tự động tạo hợp đồng, đơn từ với AI assistance',
    color: 'from-green-500 to-emerald-500'
  },
  {
    icon: <Users className="w-6 h-6" />,
    title: 'Quản lý Hồ sơ',
    description: 'Digital case management với workflow automation',
    color: 'from-orange-500 to-red-500'
  },
  {
    icon: <Settings className="w-6 h-6" />,
    title: 'Tích hợp API',
    description: 'RESTful APIs cho third-party integrations',
    color: 'from-indigo-500 to-purple-500'
  },
  {
    icon: <BarChart3 className="w-6 h-6" />,
    title: 'Analytics & Reports',
    description: 'Real-time insights và predictive analytics',
    color: 'from-teal-500 to-blue-500'
  }
]

const packages = [
  {
    name: 'Gov',
    badge: 'Chính phủ',
    price: 'Miễn phí',
    features: [
      'Truy cập cơ bản',
      'Tìm kiếm văn bản',
      'Chatbot hỗ trợ',
      'API cơ bản'
    ],
    color: 'legal-500',
    popular: false
  },
  {
    name: 'Edu',
    badge: 'Giáo dục',
    price: 'Liên hệ',
    features: [
      'Tất cả tính năng Gov',
      'Tích hợp LMS',
      'Custom branding',
      'Priority support'
    ],
    color: 'accent-500',
    popular: false
  },
  {
    name: 'Pro',
    badge: 'Doanh nghiệp',
    price: 'Liên hệ',
    features: [
      'Tất cả tính năng Edu',
      'Advanced AI models',
      'Custom development',
      'Dedicated support'
    ],
    color: 'primary-600',
    popular: true
  }
]

const stats = [
  { label: 'Văn bản pháp luật', value: '50K+', icon: <FileText className="w-5 h-5" /> },
  { label: 'Người dùng', value: '10K+', icon: <Users className="w-5 h-5" /> },
  { label: 'Tỉnh thành', value: '63/63', icon: <Globe className="w-5 h-5" /> },
  { label: 'Uptime', value: '99.9%', icon: <Zap className="w-5 h-5" /> }
]

export default function HomePage() {
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  // Palette (provided): EFF2F0 (bg), 76819B (accent), 76BA53 (primary), 19253F (dark), 9B9CAA (muted)
  const [primaryColor] = useState<string>('#76BA53')
  const [accentColor] = useState<string>('#76819B')

  useEffect(() => {
    try {
      const saved = localStorage.getItem('vilaw_user')
      setIsLoggedIn(!!saved)
    } catch {}
  }, [])

  function toRgba(color: string, alpha: number): string {
    // Accepts hex (#RRGGBB) or rgb(...)
    if (color.startsWith('#')) {
      const bigint = parseInt(color.slice(1), 16)
      const r = (bigint >> 16) & 255
      const g = (bigint >> 8) & 255
      const b = bigint & 255
      return `rgba(${r}, ${g}, ${b}, ${alpha})`
    }
    if (color.startsWith('rgb(')) {
      const m = color.match(/rgb\(\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)\s*\)/)
      if (m) {
        const r = parseInt(m[1], 10), g = parseInt(m[2], 10), b = parseInt(m[3], 10)
        return `rgba(${r}, ${g}, ${b}, ${alpha})`
      }
    }
    return color
  }

  // Apply provided palette to :root
  useEffect(() => {
    const root = document.documentElement
    root.style.setProperty('--primary', '#76BA53')
    root.style.setProperty('--accent', '#76819B')
    root.style.setProperty('--dark', '#19253F')
    root.style.setProperty('--muted', '#9B9CAA')
    root.style.setProperty('--primary-rgba-08', toRgba('#76BA53', 0.08))
    root.style.setProperty('--accent-rgba-08', toRgba('#76819B', 0.08))
    root.style.setProperty('--primary-rgba-18', toRgba('#76BA53', 0.18))
  }, [])

  // Thanh toán được xử lý tại trang /payment
  return (
    <div className="min-h-screen bg-gradient-to-br theme-bg">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-sm border-b border-gray-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center space-x-3">
              <div className="w-20 h-20 rounded-2xl overflow-hidden border border-primary-soft shadow-sm">
                <Image src={logoImg} alt="ViLaw" width={80} height={80} className="object-cover w-full h-full transform scale-150" />
              </div>
              <div>
              </div>
            </div>
            
            <nav className="hidden md:flex items-center space-x-8">
              <Link href="/legal" className="text-gray-600 hover:text-primary-600 transition-colors">Văn bản</Link>
              <Link href="/chat" className="text-gray-600 hover:text-primary-600 transition-colors">Chat AI</Link>
              <Link href="/documents" className="text-gray-600 hover:text-primary-600 transition-colors">Soạn thảo</Link>
              <Link href="/contract" className="text-gray-600 hover:text-primary-600 transition-colors">Hợp đồng</Link>
              <Link href="/dashboard" className="text-gray-600 hover:text-primary-600 transition-colors">Admin</Link>
            </nav>

            <div className="flex items-center space-x-4">
              {isLoggedIn ? (
                <UserIcon mode="inline" />
              ) : (
                <Link href="/loginuser" className="text-gray-600 hover:text-primary-600 transition-colors">
                  Đăng nhập
                </Link>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <div className="text-center">
            <motion.h1 
              className="text-5xl md:text-7xl font-bold text-gray-900 mb-6"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              Nền tảng{' '}
              <span className="text-gradient-dynamic">Pháp lý Số</span>
              <br />
              Toàn Dân
            </motion.h1>
            
            <motion.p 
              className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              Mỗi công dân – Một trợ lý pháp lý AI. Nền tảng pháp lý số toàn diện, 
              tích hợp AI để hỗ trợ công dân, doanh nghiệp và cơ quan nhà nước.
            </motion.p>

            <motion.div 
              className="flex flex-col sm:flex-row gap-4 justify-center"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
            >
              <Link href="/chat" className="text-lg px-8 py-4 rounded-lg btn-dynamic-primary">
                <Play className="w-5 h-5 mr-2" />
                Bắt đầu ngay
              </Link>
              <Link href="/legal" className="text-lg px-8 py-4 rounded-lg btn-outline-dynamic">
                <Search className="w-5 h-5 mr-2" />
                Khám phá văn bản
              </Link>
            </motion.div>
          </div>
        </div>

        {/* Background Elements */}
        <div className="absolute inset-0 -z-10">
          <div className="absolute top-20 left-10 w-72 h-72 rounded-full mix-blend-multiply filter blur-xl animate-blob bg-primary-dynamic opacity-50"></div>
          <div className="absolute top-40 right-10 w-72 h-72 rounded-full mix-blend-multiply filter blur-xl animate-blob animation-delay-2000 bg-accent-dynamic opacity-50"></div>
          <div className="absolute -bottom-8 left-20 w-72 h-72 rounded-full mix-blend-multiply filter blur-xl animate-blob animation-delay-4000 bg-primary-dynamic opacity-35"></div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <motion.div
                key={stat.label}
                className="text-center"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
              >
                <div className="flex items-center justify-center w-12 h-12 bg-primary-100 rounded-lg mx-auto mb-4">
                  <div className="text-primary-600">{stat.icon}</div>
                </div>
                <div className="text-3xl font-bold text-gray-900 mb-2">{stat.value}</div>
                <div className="text-gray-600">{stat.label}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Tính năng Nổi bật
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Nền tảng pháp lý số tích hợp AI, blockchain và dữ liệu mở
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <motion.div
                key={feature.title}
                className="bg-white rounded-xl p-6 shadow-sm border border-gray-200 hover:shadow-md transition-shadow"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
              >
                <div className="w-12 h-12 rounded-lg flex items-center justify-center mb-4 chip-gradient">
                  <div className="text-white">{feature.icon}</div>
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">{feature.title}</h3>
                <p className="text-gray-600">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Test System Card */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div 
            className="bg-gradient-to-r from-primary-50 via-accent-50 to-legal-50 rounded-2xl p-8 shadow-lg border border-primary-100"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6 }}
          >
            <div className="text-center">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">
                Test hệ thống ngay
              </h2>
              <p className="text-lg text-gray-600 mb-8 max-w-2xl mx-auto">
                Trải nghiệm các tính năng AI-powered của ViLaw với dữ liệu mẫu
              </p>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <Link href="/legal" className="card hover:shadow-lg transition-shadow group">
                  <div className="flex items-center space-x-3 mb-3">
                    <div className="w-10 h-10 bg-primary-100 rounded-lg flex items-center justify-center">
                      <SearchIcon className="w-5 h-5 text-primary-600" />
                    </div>
                    <h3 className="text-lg font-semibold text-gray-900">Duyệt văn bản</h3>
                  </div>
                  <p className="text-gray-600 mb-4">Tìm kiếm và lọc văn bản pháp luật với AI</p>
                  <div className="flex items-center text-primary-600 group-hover:text-primary-700">
                    <span className="text-sm font-medium">Thử ngay</span>
                    <ArrowRight className="w-4 h-4 ml-1" />
                  </div>
                </Link>

                <Link href="/chat" className="card hover:shadow-lg transition-shadow group">
                  <div className="flex items-center space-x-3 mb-3">
                    <div className="w-10 h-10 bg-accent-100 rounded-lg flex items-center justify-center">
                      <MessageSquare className="w-5 h-5 text-accent-600" />
                    </div>
                    <h3 className="text-lg font-semibold text-gray-900">Chat AI</h3>
                  </div>
                  <p className="text-gray-600 mb-4">Trò chuyện với trợ lý pháp lý AI</p>
                  <div className="flex items-center text-accent-600 group-hover:text-accent-700">
                    <span className="text-sm font-medium">Thử ngay</span>
                    <ArrowRight className="w-4 h-4 ml-1" />
                  </div>
                </Link>

                <Link href="/documents" className="card hover:shadow-lg transition-shadow group">
                  <div className="flex items-center space-x-3 mb-3">
                    <div className="w-10 h-10 bg-legal-100 rounded-lg flex items-center justify-center">
                      <FileText className="w-5 h-5 text-legal-600" />
                    </div>
                    <h3 className="text-lg font-semibold text-gray-900">Soạn thảo</h3>
                  </div>
                  <p className="text-gray-600 mb-4">Tạo văn bản pháp lý với AI assistance</p>
                  <div className="flex items-center text-legal-600 group-hover:text-legal-700">
                    <span className="text-sm font-medium">Thử ngay</span>
                    <ArrowRight className="w-4 h-4 ml-1" />
                  </div>
                </Link>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Packages Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Gói Dịch vụ
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Lựa chọn gói phù hợp với nhu cầu của bạn
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {packages.map((pkg, index) => (
              <motion.div
                key={pkg.name}
                className={`relative bg-white rounded-xl p-8 shadow-sm border-2 ${
                  pkg.popular 
                    ? 'border-primary-200 shadow-lg' 
                    : 'border-gray-200'
                }`}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
              >
                {pkg.popular && (
                  <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                    <span className="bg-primary-600 text-white px-4 py-1 rounded-full text-sm font-medium">
                      Phổ biến
                    </span>
                  </div>
                )}
                
                <div className="text-center mb-6">
                  <div className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-${pkg.color} bg-opacity-10 text-${pkg.color} mb-4`}>
                    {pkg.badge}
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-2">{pkg.name}</h3>
                  <div className="text-4xl font-bold text-gray-900 mb-1">{pkg.price}</div>
                  <p className="text-gray-600">/ tháng</p>
                </div>

                <ul className="space-y-3 mb-8">
                  {pkg.features.map((feature, featureIndex) => (
                    <li key={featureIndex} className="flex items-center">
                      <CheckCircle className="w-5 h-5 text-green-500 mr-3" />
                      <span className="text-gray-700">{feature}</span>
                    </li>
                  ))}
                </ul>

                {pkg.price === 'Miễn phí' ? (
                  <Link 
                    href="/loginuser" 
                    className={`w-full py-3 px-6 rounded-lg font-medium text-center transition-colors ${
                      pkg.popular
                        ? 'bg-primary-600 text-white hover:bg-primary-700'
                        : 'bg-gray-100 text-gray-900 hover:bg-gray-200'
                    }`}
                  >
                    Sử dụng miễn phí
                  </Link>
                ) : (
                  <Link
                    href={`/payment?pkg=${pkg.name}`}
                    className={`w-full py-3 px-6 rounded-lg font-medium text-center transition-colors ${
                      pkg.popular
                        ? 'bg-primary-600 text-white hover:bg-primary-700'
                        : 'bg-gray-100 text-gray-900 hover:bg-gray-200'
                    }`}
                  >
                    Thanh toán bằng ví
                  </Link>
                )}
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center space-x-3 mb-4">
                <div className="w-10 h-10 bg-gradient-to-r from-primary-600 to-accent-500 rounded-lg flex items-center justify-center">
                  <Scale className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h3 className="text-xl font-bold">ViLaw</h3>
                  <p className="text-sm text-gray-400">Nền tảng Pháp lý Số</p>
                </div>
              </div>
              <p className="text-gray-400">
                Mỗi công dân – Một trợ lý pháp lý AI
              </p>
            </div>

            <div>
              <h4 className="text-lg font-semibold mb-4">Sản phẩm</h4>
              <ul className="space-y-2 text-gray-400">
                <li><Link href="/legal" className="hover:text-white transition-colors">Văn bản pháp luật</Link></li>
                <li><Link href="/chat" className="hover:text-white transition-colors">Chat AI</Link></li>
                <li><Link href="/documents" className="hover:text-white transition-colors">Soạn thảo</Link></li>
                <li><Link href="/admin" className="hover:text-white transition-colors">Admin</Link></li>
              </ul>
            </div>

            <div>
              <h4 className="text-lg font-semibold mb-4">Hỗ trợ</h4>
              <ul className="space-y-2 text-gray-400">
                <li><Link href="#" className="hover:text-white transition-colors">Tài liệu</Link></li>
                <li><Link href="#" className="hover:text-white transition-colors">API</Link></li>
                <li><Link href="#" className="hover:text-white transition-colors">Liên hệ</Link></li>
                <li><Link href="#" className="hover:text-white transition-colors">FAQ</Link></li>
              </ul>
            </div>

            <div>
              <h4 className="text-lg font-semibold mb-4">Công ty</h4>
              <ul className="space-y-2 text-gray-400">
                <li><Link href="#" className="hover:text-white transition-colors">Về chúng tôi</Link></li>
                <li><Link href="#" className="hover:text-white transition-colors">Tuyển dụng</Link></li>
                <li><Link href="#" className="hover:text-white transition-colors">Bảo mật</Link></li>
                <li><Link href="#" className="hover:text-white transition-colors">Điều khoản</Link></li>
              </ul>
            </div>
          </div>

          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
            <p>&copy; 2024 ViLaw. Tất cả quyền được bảo lưu.</p>
          </div>
        </div>
      </footer>
    </div>
  )
} 