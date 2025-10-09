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

  useEffect(() => {
    let isMounted = true

    const checkSession = async () => {
      try {
        const response = await fetch('/api/auth/session', { credentials: 'include' })
        if (!isMounted) return
        setIsLoggedIn(response.ok)
      } catch (error) {
        console.error('Unable to determine session', error)
        if (isMounted) {
          setIsLoggedIn(false)
        }
      }
    }

    checkSession()

    return () => {
      isMounted = false
    }
  }, [])

  return (
    <div className="min-h-screen bg-hero">
      {/* Header */}
      <header className="glass-effect sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 rounded-xl overflow-hidden">
                <Image src={logoImg} alt="ViLaw" width={48} height={48} className="object-cover w-full h-full" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-slate-900">ViLaw</h1>
                <p className="text-sm text-slate-600">Nền tảng Pháp lý Số</p>
              </div>
            </div>
            
            <nav className="hidden md:flex items-center space-x-8">
              <Link href="/legal" className="nav-link">Văn bản</Link>
              <Link href="/chat" className="nav-link">Chat AI</Link>
              <Link href="/documents" className="nav-link">Soạn thảo</Link>
              <Link href="/contract" className="nav-link">Hợp đồng</Link>
              <Link href="/dashboard" className="nav-link">Admin</Link>
            </nav>

            <div className="flex items-center space-x-4">
              {isLoggedIn ? (
                <button
                  onClick={async () => {
                    try {
                      await fetch('/api/session', { method: 'DELETE' })
                      localStorage.removeItem('vilaw_user')
                      window.location.reload()
                    } catch {}
                  }}
                  className="btn-ghost"
                >
                  Đăng xuất
                </button>
              ) : (
                <Link href="/login" className="btn-ghost">
                  Đăng nhập
                </Link>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative overflow-hidden py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <motion.h1 
              className="text-5xl md:text-6xl font-bold text-slate-900 mb-6"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              Nền tảng{' '}
              <span className="text-gradient">Pháp lý Số</span>
              <br />
              Toàn Dân
            </motion.h1>
            
            <motion.p 
              className="text-xl text-slate-600 mb-12 max-w-3xl mx-auto leading-relaxed"
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
              <Link href="/chat" className="btn-primary inline-flex items-center">
                <Play className="w-5 h-5 mr-2" />
                Bắt đầu ngay
              </Link>
              <Link href="/legal" className="btn-outline inline-flex items-center">
                <Search className="w-5 h-5 mr-2" />
                Khám phá văn bản
              </Link>
            </motion.div>
          </div>
        </div>

        {/* Subtle Background Elements */}
        <div className="absolute inset-0 -z-10">
          <div className="absolute top-20 left-10 w-96 h-96 rounded-full bg-blue-100 opacity-30 animate-float"></div>
          <div className="absolute top-40 right-10 w-80 h-80 rounded-full bg-slate-100 opacity-40 animate-float animation-delay-200"></div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-20 bg-section">
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
                <div className="flex items-center justify-center w-16 h-16 bg-blue-50 rounded-xl mx-auto mb-4">
                  <div className="text-blue-600">{stat.icon}</div>
                </div>
                <div className="text-3xl font-bold text-slate-900 mb-2">{stat.value}</div>
                <div className="text-slate-600 font-medium">{stat.label}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-section-alt">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-slate-900 mb-4">
              Tính năng Nổi bật
            </h2>
            <p className="text-xl text-slate-600 max-w-3xl mx-auto">
              Nền tảng pháp lý số tích hợp AI, blockchain và dữ liệu mở
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <motion.div
                key={feature.title}
                className="card group hover:shadow-medium transition-all duration-300"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
              >
                <div className="w-14 h-14 rounded-xl bg-gradient-to-r from-blue-600 to-blue-700 flex items-center justify-center mb-6">
                  <div className="text-white">{feature.icon}</div>
                </div>
                <h3 className="text-xl font-semibold text-slate-900 mb-3">{feature.title}</h3>
                <p className="text-slate-600 leading-relaxed">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Test System Card */}
      <section className="py-20 bg-section">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div 
            className="card-elevated bg-gradient-to-r from-blue-50 to-slate-50"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6 }}
          >
            <div className="text-center">
              <h2 className="text-3xl font-bold text-slate-900 mb-4">
                Test hệ thống ngay
              </h2>
              <p className="text-lg text-slate-600 mb-12 max-w-2xl mx-auto">
                Trải nghiệm các tính năng AI-powered của ViLaw với dữ liệu mẫu
              </p>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                <Link href="/legal" className="card hover:shadow-medium transition-all duration-300 group">
                  <div className="flex items-center space-x-4 mb-4">
                    <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
                      <SearchIcon className="w-6 h-6 text-blue-600" />
                    </div>
                    <h3 className="text-lg font-semibold text-slate-900">Duyệt văn bản</h3>
                  </div>
                  <p className="text-slate-600 mb-6">Tìm kiếm và lọc văn bản pháp luật với AI</p>
                  <div className="flex items-center text-blue-600 group-hover:text-blue-700 font-medium">
                    <span>Thử ngay</span>
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </div>
                </Link>

                <Link href="/chat" className="card hover:shadow-medium transition-all duration-300 group">
                  <div className="flex items-center space-x-4 mb-4">
                    <div className="w-12 h-12 bg-slate-100 rounded-xl flex items-center justify-center">
                      <MessageSquare className="w-6 h-6 text-slate-600" />
                    </div>
                    <h3 className="text-lg font-semibold text-slate-900">Chat AI</h3>
                  </div>
                  <p className="text-slate-600 mb-6">Trò chuyện với trợ lý pháp lý AI</p>
                  <div className="flex items-center text-slate-600 group-hover:text-slate-700 font-medium">
                    <span>Thử ngay</span>
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </div>
                </Link>

                <Link href="/documents" className="card hover:shadow-medium transition-all duration-300 group">
                  <div className="flex items-center space-x-4 mb-4">
                    <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
                      <FileText className="w-6 h-6 text-blue-600" />
                    </div>
                    <h3 className="text-lg font-semibold text-slate-900">Soạn thảo</h3>
                  </div>
                  <p className="text-slate-600 mb-6">Tạo văn bản pháp lý với AI assistance</p>
                  <div className="flex items-center text-blue-600 group-hover:text-blue-700 font-medium">
                    <span>Thử ngay</span>
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </div>
                </Link>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Packages Section */}
      <section className="py-20 bg-section-alt">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-slate-900 mb-4">
              Gói Dịch vụ
            </h2>
            <p className="text-xl text-slate-600 max-w-3xl mx-auto">
              Lựa chọn gói phù hợp với nhu cầu của bạn
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {packages.map((pkg, index) => (
              <motion.div
                key={pkg.name}
                className={`relative card-elevated ${
                  pkg.popular 
                    ? 'border-blue-200 shadow-medium' 
                    : ''
                }`}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
              >
                {pkg.popular && (
                  <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                    <span className="bg-blue-600 text-white px-4 py-2 rounded-full text-sm font-medium">
                      Phổ biến
                    </span>
                  </div>
                )}
                
                <div className="text-center mb-8">
                  <div className="inline-flex items-center px-4 py-2 rounded-full text-sm font-medium bg-blue-50 text-blue-600 mb-6">
                    {pkg.badge}
                  </div>
                  <h3 className="text-2xl font-bold text-slate-900 mb-2">{pkg.name}</h3>
                  <div className="text-4xl font-bold text-slate-900 mb-1">{pkg.price}</div>
                  <p className="text-slate-600">/ tháng</p>
                </div>

                <ul className="space-y-4 mb-8">
                  {pkg.features.map((feature, featureIndex) => (
                    <li key={featureIndex} className="flex items-center">
                      <CheckCircle className="w-5 h-5 text-green-500 mr-3 flex-shrink-0" />
                      <span className="text-slate-700">{feature}</span>
                    </li>
                  ))}
                </ul>

                {pkg.price === 'Miễn phí' ? (
                  <Link 
                    href="/login" 
                    className={`w-full py-3 px-6 rounded-lg font-medium text-center transition-all duration-200 ${
                      pkg.popular
                        ? 'btn-primary'
                        : 'btn-secondary'
                    }`}
                  >
                    Sử dụng miễn phí
                  </Link>
                ) : (
                  <Link
                    href={`/payment?pkg=${pkg.name}`}
                    className={`w-full py-3 px-6 rounded-lg font-medium text-center transition-all duration-200 ${
                      pkg.popular
                        ? 'btn-primary'
                        : 'btn-secondary'
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
      <footer className="bg-slate-900 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center space-x-3 mb-6">
                <div className="w-12 h-12 bg-gradient-to-r from-blue-600 to-blue-700 rounded-xl flex items-center justify-center">
                  <Scale className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h3 className="text-xl font-bold">ViLaw</h3>
                  <p className="text-sm text-slate-400">Nền tảng Pháp lý Số</p>
                </div>
              </div>
              <p className="text-slate-400 leading-relaxed">
                Mỗi công dân – Một trợ lý pháp lý AI
              </p>
            </div>

            <div>
              <h4 className="text-lg font-semibold mb-6 text-white">Sản phẩm</h4>
              <ul className="space-y-3 text-slate-400">
                <li><Link href="/legal" className="hover:text-white transition-colors">Văn bản pháp luật</Link></li>
                <li><Link href="/chat" className="hover:text-white transition-colors">Chat AI</Link></li>
                <li><Link href="/documents" className="hover:text-white transition-colors">Soạn thảo</Link></li>
                <li><Link href="/admin" className="hover:text-white transition-colors">Admin</Link></li>
              </ul>
            </div>

            <div>
              <h4 className="text-lg font-semibold mb-6 text-white">Hỗ trợ</h4>
              <ul className="space-y-3 text-slate-400">
                <li><Link href="#" className="hover:text-white transition-colors">Tài liệu</Link></li>
                <li><Link href="#" className="hover:text-white transition-colors">API</Link></li>
                <li><Link href="#" className="hover:text-white transition-colors">Liên hệ</Link></li>
                <li><Link href="#" className="hover:text-white transition-colors">FAQ</Link></li>
              </ul>
            </div>

            <div>
              <h4 className="text-lg font-semibold mb-6 text-white">Công ty</h4>
              <ul className="space-y-3 text-slate-400">
                <li><Link href="#" className="hover:text-white transition-colors">Về chúng tôi</Link></li>
                <li><Link href="#" className="hover:text-white transition-colors">Tuyển dụng</Link></li>
                <li><Link href="#" className="hover:text-white transition-colors">Bảo mật</Link></li>
                <li><Link href="#" className="hover:text-white transition-colors">Điều khoản</Link></li>
              </ul>
            </div>
          </div>

          <div className="border-t border-slate-800 mt-12 pt-8 text-center text-slate-400">
            <p>&copy; 2024 ViLaw. Tất cả quyền được bảo lưu.</p>
          </div>
        </div>
      </footer>
    </div>
  )
} 