'use client'

import { useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Send,
  User,
  Bot,
  Mic,
  MicOff,
  Volume2,
  VolumeX,
  Settings,
  Download,
  Share2,
  Copy,
  RotateCcw,
  MessageSquare,
  FileText,
  Search,
  BookOpen,
  Scale,
  Gavel,
  Building,
  Calendar,
  ChevronDown,
  ChevronUp,
  Sparkles,
  Zap,
  Lightbulb,
  Target,
  TrendingUp,
  Award,
  Clock,
  CheckCircle,
  Star,
  ArrowRight,
  Play,
  Pause,
  SkipForward,
  SkipBack,
  Volume1,
  Volume2 as Volume2Icon,
  VolumeX as VolumeXIcon,
  Settings as SettingsIcon,
  Download as DownloadIcon,
  Share2 as ShareIcon,
  Copy as CopyIcon,
  RotateCcw as RotateCcwIcon,
  MessageSquare as MessageSquareIcon,
  FileText as FileTextIcon,
  Search as SearchIcon,
  BookOpen as BookOpenIcon,
  Scale as ScaleIcon,
  Gavel as GavelIcon,
  Building as BuildingIcon,
  Calendar as CalendarIcon,
  ChevronDown as ChevronDownIcon,
  ChevronUp as ChevronUpIcon,
  Sparkles as SparklesIcon,
  Zap as ZapIcon,
  Lightbulb as LightbulbIcon,
  Target as TargetIcon,
  TrendingUp as TrendingUpIcon,
  Award as AwardIcon,
  Clock as ClockIcon,
  CheckCircle as CheckCircleIcon,
  Star as StarIcon,
  ArrowRight as ArrowRightIcon,
  Play as PlayIcon,
  Pause as PauseIcon,
  SkipForward as SkipForwardIcon,
  SkipBack as SkipBackIcon,
  Volume1 as Volume1Icon,
} from 'lucide-react'
import Link from 'next/link'
import toast from 'react-hot-toast'

interface Message {
  id: string
  type: 'user' | 'ai'
  content: string
  timestamp: Date
  isTyping?: boolean
  audioUrl?: string
  isPlaying?: boolean
}

interface Suggestion {
  id: string
  text: string
  category: 'general' | 'contract' | 'labor' | 'property' | 'criminal' | 'civil'
  icon: React.ReactNode
}

const suggestions: Suggestion[] = [
  {
    id: '1',
    text: 'Tôi có quyền gì khi bị sa thải trái phép?',
    category: 'labor',
    icon: <Building className="w-4 h-4" />
  },
  {
    id: '2',
    text: 'Cách soạn thảo hợp đồng mua bán nhà?',
    category: 'property',
    icon: <FileText className="w-4 h-4" />
  },
  {
    id: '3',
    text: 'Thủ tục thành lập công ty TNHH?',
    category: 'general',
    icon: <Scale className="w-4 h-4" />
  },
  {
    id: '4',
    text: 'Quyền lợi người lao động khi nghỉ việc?',
    category: 'labor',
    icon: <Gavel className="w-4 h-4" />
  },
  {
    id: '5',
    text: 'Cách khiếu nại quyết định hành chính?',
    category: 'civil',
    icon: <MessageSquare className="w-4 h-4" />
  },
  {
    id: '6',
    text: 'Thủ tục thừa kế tài sản?',
    category: 'property',
    icon: <BookOpen className="w-4 h-4" />
  }
]

const categories = [
  { id: 'general', name: 'Tổng hợp', icon: <Scale className="w-4 h-4" /> },
  { id: 'contract', name: 'Hợp đồng', icon: <FileText className="w-4 h-4" /> },
  { id: 'labor', name: 'Lao động', icon: <Building className="w-4 h-4" /> },
  { id: 'property', name: 'Tài sản', icon: <BookOpen className="w-4 h-4" /> },
  { id: 'criminal', name: 'Hình sự', icon: <Gavel className="w-4 h-4" /> },
  { id: 'civil', name: 'Dân sự', icon: <MessageSquare className="w-4 h-4" /> }
]

export default function ChatPage() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      type: 'ai',
      content: 'Xin chào! Tôi là trợ lý pháp lý AI của ViLaw. Tôi có thể giúp bạn tìm hiểu về pháp luật Việt Nam, soạn thảo văn bản pháp lý, và trả lời các câu hỏi liên quan đến quyền lợi của bạn. Bạn có thể hỏi tôi bất cứ điều gì!',
      timestamp: new Date()
    }
  ])
  const [inputValue, setInputValue] = useState('')
  const [isTyping, setIsTyping] = useState(false)
  const [isRecording, setIsRecording] = useState(false)
  const [isMuted, setIsMuted] = useState(false)
  const [selectedCategory, setSelectedCategory] = useState<string>('all')
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const handleSendMessage = async (content: string) => {
    if (!content.trim()) return

    const userMessage: Message = {
      id: Date.now().toString(),
      type: 'user',
      content: content.trim(),
      timestamp: new Date()
    }

    setMessages(prev => [...prev, userMessage])
    setInputValue('')
    setIsTyping(true)
    try {
      const anyWindow = window as any
      let aiText = ''
      if (anyWindow?.apiService?.chatWithAI) {
        const aiRes = await anyWindow.apiService.chatWithAI(content, 'vi')
        aiText = aiRes?.response || ''
      }
      if (!aiText) {
        aiText = await generateAIResponse(content)
      }
      const aiResponse: Message = {
        id: (Date.now() + 1).toString(),
        type: 'ai',
        content: aiText,
        timestamp: new Date()
      }
      setMessages(prev => [...prev, aiResponse])
    } catch (e) {
      toast.error('Không thể gọi AI hiện tại, dùng phản hồi mẫu')
      const aiResponse: Message = {
        id: (Date.now() + 1).toString(),
        type: 'ai',
        content: await generateAIResponse(content),
        timestamp: new Date()
      }
      setMessages(prev => [...prev, aiResponse])
    } finally {
      setIsTyping(false)
    }
  }

  type WebhookPayload = {
    message: string;
    section_id: string;
  };
  
  type WebhookOK = { output?: string; [k: string]: unknown };
  type WebhookErr = { error?: string; [k: string]: unknown };
  
  interface SendResult {
    id: number;
    question: string;
    response?: WebhookOK | WebhookErr;
    error?: string;
  }
  
  const generateAIResponse = async (userInput: string): Promise<string> => {
    // --- CÀI ĐẶT ---
    const webhookUrl =
      "https://cudnah.app.n8n.cloud/webhook/a6c13978-cb21-442b-b7e9-801e78add552";
  
    // --- CHUẨN HÓA INPUT ---
    const questionToSend = {
      id: 1,
      question: userInput?.trim() || "Nội dung câu hỏi trống",
    };
  
    // --- HÀM GỬI YÊU CẦU ---
    async function sendRequest(item: { id: number; question: string }): Promise<SendResult> {
      const payload: WebhookPayload = {
        message: item.question,
        section_id: String(item.id),
      };
  
      // (Tuỳ chọn) timeout để tránh treo
      const ac = new AbortController();
      const t = setTimeout(() => ac.abort(), 30000);
  
      try {
        const res = await fetch(webhookUrl, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
          signal: ac.signal,
          // mode: "cors", // nếu chạy trên trình duyệt và server hỗ trợ CORS
        });
  
        if (!res.ok) {
          throw new Error(`HTTP ${res.status} ${res.statusText}`);
        }
  
        // Có thể response không phải JSON hợp lệ -> cần try/catch
        let responseJson: unknown;
        try {
          responseJson = await res.json();
        } catch {
          throw new Error("Phản hồi không phải JSON hợp lệ");
        }
  
        return {
          id: item.id,
          question: item.question,
          response: responseJson as WebhookOK | WebhookErr,
        };
      } catch (err: any) {
        return {
          id: item.id,
          question: item.question,
          error: `Lỗi kết nối hoặc yêu cầu: ${err?.message ?? String(err)}`,
        };
      } finally {
        clearTimeout(t);
      }
    }
  
    // --- THỰC THI & TRẢ VỀ GIÁ TRỊ ---
    const result = await sendRequest(questionToSend);
  
    if (result.error) {
      // ném lỗi để caller có thể xử lý
      throw new Error(result.error);
    }
  
    const data = result.response ?? {};
    const output = (data as WebhookOK).output;
  
    if (typeof output === "string") {
      return output;
    }
  
    // fallback: trả ra toàn bộ JSON để debug
    throw new Error(
      `Phản hồi không chứa key 'output'. Dữ liệu nhận được: ${JSON.stringify(data)}`
    );
  };
  

  const handleSuggestionClick = (suggestion: Suggestion) => {
    handleSendMessage(suggestion.text)
  }

  const filteredSuggestions = selectedCategory === 'all'
    ? suggestions
    : suggestions.filter(s => s.category === selectedCategory)

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSendMessage(inputValue)
    }
  }

  const handleCopyMessage = (content: string) => {
    navigator.clipboard.writeText(content)
    toast.success('Đã sao chép tin nhắn')
  }

  const handleShareMessage = (content: string) => {
    if (navigator.share) {
      navigator.share({
        title: 'ViLaw Chat',
        text: content,
        url: window.location.href
      })
    } else {
      navigator.clipboard.writeText(content)
      toast.success('Đã sao chép để chia sẻ')
    }
  }

  return (
    <div className="min-h-screen theme-bg">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 px-4 py-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <Link href="/" className="text-primary-600 hover:text-primary-700">
              <ArrowRight className="w-5 h-5 rotate-180" />
            </Link>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Chat AI Pháp lý</h1>
              <p className="text-sm text-gray-500">Trợ lý AI 24/7 cho câu hỏi pháp lý</p>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <button
              onClick={() => setIsMuted(!isMuted)}
              className={`p-2 rounded-lg ${isMuted ? 'bg-red-100 text-red-600' : 'text-gray-600 hover:bg-gray-100'}`}
              title={isMuted ? 'Bật âm thanh' : 'Tắt âm thanh'}
            >
              {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
            </button>
            <button
              className="p-2 rounded-lg text-gray-600 hover:bg-gray-100"
              title="Cài đặt"
            >
              <Settings className="w-4 h-4" />
            </button>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto p-6">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Chat Interface */}
          <div className="lg:col-span-3">
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 h-[600px] flex flex-col">
              {/* Messages */}
              <div className="flex-1 overflow-y-auto p-6">
                <AnimatePresence>
                  {messages.map((message, index) => (
                    <motion.div
                      key={message.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className={`mb-6 ${message.type === 'user' ? 'text-right' : 'text-left'}`}
                    >
                      <div className={`inline-flex items-start space-x-3 max-w-[80%] ${message.type === 'user' ? 'ml-auto' : ''}`}>
                        {message.type === 'ai' && (
                          <div className="w-8 h-8 bg-primary-600 rounded-full flex items-center justify-center flex-shrink-0">
                            <Bot className="w-4 h-4 text-white" />
                          </div>
                        )}

                        <div className={`rounded-2xl px-4 py-3 ${message.type === 'user'
                            ? 'bg-primary-600 text-white'
                            : 'bg-gray-100 text-gray-900'
                          }`}>
                          <div className="whitespace-pre-wrap">{message.content}</div>
                          <div className={`text-xs mt-2 ${message.type === 'user' ? 'text-primary-100' : 'text-gray-500'
                            }`}>
                            {message.timestamp.toLocaleTimeString('vi-VN', {
                              hour: '2-digit',
                              minute: '2-digit'
                            })}
                          </div>
                        </div>

                        {message.type === 'user' && (
                          <div className="w-8 h-8 bg-gray-600 rounded-full flex items-center justify-center flex-shrink-0">
                            <User className="w-4 h-4 text-white" />
                          </div>
                        )}
                      </div>

                      {message.type === 'ai' && (
                        <div className="flex items-center space-x-2 mt-2 ml-11">
                          <button
                            onClick={() => handleCopyMessage(message.content)}
                            className="p-1 text-gray-400 hover:text-gray-600"
                            title="Sao chép"
                          >
                            <Copy className="w-3 h-3" />
                          </button>
                          <button
                            onClick={() => handleShareMessage(message.content)}
                            className="p-1 text-gray-400 hover:text-gray-600"
                            title="Chia sẻ"
                          >
                            <Share2 className="w-3 h-3" />
                          </button>
                        </div>
                      )}
                    </motion.div>
                  ))}
                </AnimatePresence>

                {isTyping && (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="flex items-start space-x-3 mb-6"
                  >
                    <div className="w-8 h-8 bg-primary-600 rounded-full flex items-center justify-center">
                      <Bot className="w-4 h-4 text-white" />
                    </div>
                    <div className="bg-gray-100 rounded-2xl px-4 py-3">
                      <div className="flex space-x-1">
                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce animation-delay-100"></div>
                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce animation-delay-200"></div>
                      </div>
                    </div>
                  </motion.div>
                )}

                <div ref={messagesEndRef} />
              </div>

              {/* Input */}
              <div className="border-t border-gray-200 p-4">
                <div className="flex items-end space-x-3">
                  <div className="flex-1">
                    <input
                      ref={inputRef}
                      type="text"
                      value={inputValue}
                      onChange={(e) => setInputValue(e.target.value)}
                      onKeyPress={handleKeyPress}
                      placeholder="Nhập câu hỏi pháp lý của bạn..."
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    />
                  </div>

                  <button
                    onClick={() => setIsRecording(!isRecording)}
                    className={`p-3 rounded-lg ${isRecording ? 'bg-red-500 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}
                    title={isRecording ? 'Dừng ghi âm' : 'Ghi âm'}
                  >
                    {isRecording ? <MicOff className="w-5 h-5" /> : <Mic className="w-5 h-5" />}
                  </button>

                  <button
                    onClick={() => handleSendMessage(inputValue)}
                    disabled={!inputValue.trim()}
                    className="p-3 bg-primary-600 text-white rounded-lg hover:bg-primary-700 disabled:opacity-50 disabled:cursor-not-allowed"
                    title="Gửi tin nhắn"
                  >
                    <Send className="w-5 h-5" />
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Suggestions Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Gợi ý câu hỏi</h3>

              {/* Category Filter */}
              <div className="mb-4">
                <select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                  aria-label="Lọc theo danh mục"
                >
                  <option value="all">Tất cả danh mục</option>
                  {categories.map(cat => (
                    <option key={cat.id} value={cat.id}>{cat.name}</option>
                  ))}
                </select>
              </div>

              {/* Suggestions */}
              <div className="space-y-3">
                {filteredSuggestions.map((suggestion) => (
                  <motion.button
                    key={suggestion.id}
                    onClick={() => handleSuggestionClick(suggestion)}
                    className="w-full text-left p-3 rounded-lg border border-gray-200 hover:border-primary-300 hover:bg-primary-50 transition-colors"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <div className="flex items-center space-x-2 mb-2">
                      <div className="text-primary-600">{suggestion.icon}</div>
                      <span className="text-sm font-medium text-gray-900">{suggestion.text}</span>
                    </div>
                  </motion.button>
                ))}
              </div>

              {/* Quick Actions */}
              <div className="mt-6 pt-6 border-t border-gray-200">
                <h4 className="text-sm font-medium text-gray-900 mb-3">Thao tác nhanh</h4>
                <div className="space-y-2">
                  <button className="w-full flex items-center space-x-2 p-2 rounded-lg text-gray-600 hover:bg-gray-100">
                    <Download className="w-4 h-4" />
                    <span className="text-sm">Tải lịch sử chat</span>
                  </button>
                  <button className="w-full flex items-center space-x-2 p-2 rounded-lg text-gray-600 hover:bg-gray-100">
                    <RotateCcw className="w-4 h-4" />
                    <span className="text-sm">Bắt đầu lại</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
} 