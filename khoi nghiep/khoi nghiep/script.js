ắt /**
 * ViLaw Platform - Optimized Script for Next.js Integration
 * Enhanced legal assistant with PWA capabilities
 */

// Global ViLaw Application Object
const ViLaw = {
    // State
    isListening: false,
    isMuted: false,
    currentChatMode: 'text',
    recognition: null,
    synthesis: null,
    deferredPrompt: null,
    
    // Initialize application
    init() {
        this.setupEventListeners();
        this.initializeSpeech();
        this.initializePWA();
        this.loadTheme();
        console.log('🚀 ViLaw initialized successfully');
    },
    
    // Notification system
    showNotification(message, type = 'info', duration = 3000) {
        console.log(`[${type.toUpperCase()}] ${message}`);
        
        if (typeof document === 'undefined') return;
        
        // Remove existing
        const existing = document.querySelector('.vilaw-notification');
        if (existing) existing.remove();
        
        // Create notification
        const notification = document.createElement('div');
        notification.className = `vilaw-notification vilaw-notification-${type}`;
        notification.innerHTML = `
            <div style="padding: 12px 16px; display: flex; align-items: center; gap: 8px; color: white; font-weight: 500; border-radius: 8px; box-shadow: 0 4px 12px rgba(0,0,0,0.2); position: fixed; top: 20px; right: 20px; z-index: 10000; max-width: 350px; ${this.getNotificationStyle(type)}">
                <span>${this.getNotificationIcon(type)}</span>
                <span>${message}</span>
                <button onclick="this.parentElement.parentElement.remove()" style="background: rgba(255,255,255,0.2); border: none; color: white; cursor: pointer; margin-left: auto; padding: 4px 8px; border-radius: 4px;">×</button>
            </div>
        `;
        
        document.body.appendChild(notification);
        
        setTimeout(() => {
            if (notification.parentElement) notification.remove();
        }, duration);
    },
    
    getNotificationStyle(type) {
        const styles = {
            info: 'background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);',
            success: 'background: linear-gradient(135deg, #11998e 0%, #38ef7d 100%);',
            warning: 'background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%);',
            error: 'background: linear-gradient(135deg, #ff416c 0%, #ff4b2b 100%);'
        };
        return styles[type] || styles.info;
    },
    
    getNotificationIcon(type) {
        const icons = { info: '💬', success: '✅', warning: '⚠️', error: '❌' };
        return icons[type] || icons.info;
    },
    
    // Navigation for standalone HTML
    navigateToPage(page) {
        if (typeof window === 'undefined') return;
        
        // Check if Next.js environment
        if (window.location.pathname.includes('/app/') || window.next) {
            const routes = {
                home: '/', chat: '/chat', documents: '/documents',
                'legal-documents': '/legal-documents', search: '/search',
                contract: '/contract', admin: '/admin', dashboard: '/dashboard'
            };
            window.location.href = routes[page] || `/${page}`;
            return;
        }
        
        // Standalone HTML navigation
        document.querySelectorAll('.page-content, [data-page]').forEach(p => p.style.display = 'none');
        const target = document.querySelector(`#${page}Page`) || document.querySelector(`[data-page="${page}"]`);
        if (target) target.style.display = 'block';
        
        document.querySelectorAll('.nav-link').forEach(l => l.classList.remove('active'));
        const activeLink = document.querySelector(`[data-page="${page}"]`);
        if (activeLink) activeLink.classList.add('active');
        
        this.showNotification(`Chuyển đến ${page}`, 'info', 1500);
    },
    
    // Speech Recognition
    initializeSpeech() {
        this.initializeSpeechRecognition();
        this.initializeTextToSpeech();
    },
    
    initializeSpeechRecognition() {
        if (typeof window === 'undefined') return false;
        
        if (!('webkitSpeechRecognition' in window) && !('SpeechRecognition' in window)) {
            console.warn('Speech recognition not supported');
            return false;
        }
        
        const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
        this.recognition = new SpeechRecognition();
        this.recognition.continuous = false;
        this.recognition.interimResults = false;
        this.recognition.lang = 'vi-VN';
        
        this.recognition.onstart = () => {
            this.isListening = true;
            this.updateVoiceButtons();
            this.showNotification('🎤 Đang lắng nghe...', 'info');
        };
        
        this.recognition.onend = () => {
            this.isListening = false;
            this.updateVoiceButtons();
        };
        
        this.recognition.onresult = (event) => {
            const transcript = event.results[0][0].transcript;
            this.handleVoiceInput(transcript);
        };
        
        this.recognition.onerror = (event) => {
            this.isListening = false;
            this.updateVoiceButtons();
            this.showNotification('❌ Lỗi nhận diện giọng nói', 'error');
        };
        
        return true;
    },
    
    toggleVoiceInput() {
        if (!this.recognition && !this.initializeSpeechRecognition()) {
            this.showNotification('Trình duyệt không hỗ trợ nhận diện giọng nói!', 'error');
            return;
        }
        
        if (this.isListening) {
            this.recognition.stop();
        } else {
            this.recognition.start();
        }
    },
    
    handleVoiceInput(transcript) {
        console.log('Voice input:', transcript);
        
        // Find active input
        const inputs = [
            '#chatInput', '#textChatInput', '[name="message"]',
            '.chat-input input', 'input[placeholder*="nhập"]'
        ];
        
        let chatInput = null;
        for (const selector of inputs) {
            const element = document.querySelector(selector);
            if (element && element.offsetParent !== null) {
                chatInput = element;
                break;
            }
        }
        
        if (chatInput) {
            chatInput.value = transcript;
            chatInput.focus();
            this.showNotification(`📝 Đã nhận: "${transcript}"`, 'success');
            
            // Auto-submit in chat
            if (window.location.pathname.includes('/chat')) {
                setTimeout(() => {
                    const sendButton = document.querySelector('#sendMessage') || 
                                    document.querySelector('.send-button') || 
                                    document.querySelector('[type="submit"]');
                    if (sendButton) sendButton.click();
                }, 500);
            }
        } else {
            this.showNotification(`🗣️ Nói: "${transcript}"`, 'info');
        }
    },
    
    updateVoiceButtons() {
        document.querySelectorAll('.voice-button, [data-action="voice"], .mic-button').forEach(button => {
            if (this.isListening) {
                button.classList.add('listening', 'active');
                button.setAttribute('title', 'Đang nghe... (Click để dừng)');
            } else {
                button.classList.remove('listening', 'active');
                button.setAttribute('title', 'Bắt đầu nói');
            }
        });
    },
    
    // Text-to-Speech
    initializeTextToSpeech() {
        if (typeof window === 'undefined' || !('speechSynthesis' in window)) {
            console.warn('Text-to-speech not supported');
            return false;
        }
        
        this.synthesis = window.speechSynthesis;
        return true;
    },
    
    speakText(text, options = {}) {
        if (!this.synthesis || this.isMuted) return;
        
        this.synthesis.cancel();
        
        const utterance = new SpeechSynthesisUtterance(text);
        utterance.rate = 1.0;
        utterance.pitch = 1;
        utterance.volume = 1;
        utterance.lang = 'vi-VN';
        
        utterance.onstart = () => {
            this.showNotification('🔊 Đang đọc...', 'info', 1000);
        };
        
        this.synthesis.speak(utterance);
    },
    
    toggleMute() {
        this.isMuted = !this.isMuted;
        
        if (this.isMuted) {
            this.synthesis?.cancel();
            this.showNotification('🔇 Đã tắt tiếng', 'info');
        } else {
            this.showNotification('🔊 Đã bật tiếng', 'info');
        }
        
        this.updateMuteButtons();
    },
    
    updateMuteButtons() {
        document.querySelectorAll('.mute-button, [data-action="mute"], .volume-button').forEach(button => {
            if (this.isMuted) {
                button.classList.add('muted');
                button.setAttribute('title', 'Bật tiếng');
            } else {
                button.classList.remove('muted');
                button.setAttribute('title', 'Tắt tiếng');
            }
        });
    },
    
    // Chat Mode
    switchChatMode(mode) {
        this.currentChatMode = mode;
        
        document.querySelectorAll('.mode-tab').forEach(tab => tab.classList.remove('active'));
        const activeTab = document.querySelector(`#${mode}ModeTab`) || document.querySelector(`[data-mode="${mode}"]`);
        if (activeTab) activeTab.classList.add('active');
        
        const textInput = document.querySelector('#textChatInput');
        const voiceInput = document.querySelector('#voiceChatInput');
        
        if (textInput && voiceInput) {
            if (mode === 'text') {
                textInput.style.display = 'flex';
                voiceInput.style.display = 'none';
            } else {
                textInput.style.display = 'none';
                voiceInput.style.display = 'block';
            }
        }
        
        this.showNotification(`Chế độ: ${mode === 'text' ? '📝 Văn bản' : '🎤 Giọng nói'}`, 'info');
    },
    
    // PWA
    initializePWA() {
        if (typeof window === 'undefined') return;
        
        // Service Worker
        if ('serviceWorker' in navigator) {
            navigator.serviceWorker.register('/sw.js')
                .then(() => console.log('✅ Service Worker registered'))
                .catch(() => console.warn('❌ Service Worker registration failed'));
        }
        
        // Install prompt
        window.addEventListener('beforeinstallprompt', (e) => {
            e.preventDefault();
            this.deferredPrompt = e;
            this.showInstallButton();
        });
        
        window.addEventListener('appinstalled', () => {
            this.hideInstallButton();
            this.showNotification('🎉 ViLaw đã được cài đặt!', 'success');
        });
    },
    
    showInstallButton() {
        document.querySelectorAll('.install-button, [data-action="install"]').forEach(button => {
            button.style.display = 'block';
        });
    },
    
    hideInstallButton() {
        document.querySelectorAll('.install-button, [data-action="install"]').forEach(button => {
            button.style.display = 'none';
        });
    },
    
    installPWA() {
        if (!this.deferredPrompt) {
            this.showNotification('Ứng dụng đã được cài đặt', 'warning');
            return;
        }
        
        this.deferredPrompt.prompt();
        this.deferredPrompt.userChoice.then((choiceResult) => {
            if (choiceResult.outcome === 'accepted') {
                console.log('✅ User accepted install');
            }
            this.deferredPrompt = null;
        });
    },
    
    // Theme
    loadTheme() {
        if (typeof window === 'undefined') return;
        
        const savedTheme = localStorage.getItem('vilaw-theme');
        if (savedTheme === 'dark') {
            document.body.classList.add('dark-theme');
        }
        this.updateThemeButtons();
    },
    
    toggleTheme() {
        if (typeof document === 'undefined') return;
        
        const isDark = document.body.classList.contains('dark-theme');
        
        if (isDark) {
            document.body.classList.remove('dark-theme');
            localStorage.setItem('vilaw-theme', 'light');
            this.showNotification('☀️ Giao diện sáng', 'info');
        } else {
            document.body.classList.add('dark-theme');
            localStorage.setItem('vilaw-theme', 'dark');
            this.showNotification('🌙 Giao diện tối', 'info');
        }
        
        this.updateThemeButtons();
    },
    
    updateThemeButtons() {
        const isDark = document.body?.classList.contains('dark-theme');
        document.querySelectorAll('.theme-toggle, [data-action="theme"]').forEach(button => {
            button.setAttribute('title', isDark ? 'Giao diện sáng' : 'Giao diện tối');
        });
    },
    
    // Event Listeners
    setupEventListeners() {
        if (typeof document === 'undefined') return;
        
        // Navigation
        document.querySelectorAll('.nav-link[data-page], [data-navigate]').forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                const page = link.getAttribute('data-page') || link.getAttribute('data-navigate');
                if (page) this.navigateToPage(page);
            });
        });
        
        // Voice controls
        document.querySelectorAll('.voice-button, [data-action="voice"], .mic-button').forEach(button => {
            button.addEventListener('click', () => this.toggleVoiceInput());
        });
        
        // Mute controls
        document.querySelectorAll('.mute-button, [data-action="mute"], .volume-button').forEach(button => {
            button.addEventListener('click', () => this.toggleMute());
        });
        
        // Theme controls
        document.querySelectorAll('.theme-toggle, [data-action="theme"]').forEach(button => {
            button.addEventListener('click', () => this.toggleTheme());
        });
        
        // Install controls
        document.querySelectorAll('.install-button, [data-action="install"]').forEach(button => {
            button.addEventListener('click', () => this.installPWA());
        });
        
        // Chat mode controls
        document.querySelectorAll('.mode-tab, [data-mode]').forEach(tab => {
            tab.addEventListener('click', () => {
                const mode = tab.getAttribute('data-mode') || tab.id.replace('ModeTab', '');
                if (mode) this.switchChatMode(mode);
            });
        });
        
        // Chat input
        document.querySelectorAll('#chatInput, .chat-input input, [name="message"]').forEach(input => {
            input.addEventListener('keypress', (e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault();
                    const sendButton = document.querySelector('#sendMessage') || 
                                    document.querySelector('.send-button') || 
                                    document.querySelector('[type="submit"]');
                    if (sendButton) sendButton.click();
                }
            });
        });
        
        console.log('✅ Event listeners setup complete');
    }
};

// Global functions for HTML onclick handlers
function navigateToPage(page) { ViLaw.navigateToPage(page); }
function toggleVoiceInput() { ViLaw.toggleVoiceInput(); }
function speakText(text, options) { ViLaw.speakText(text, options); }
function toggleMute() { ViLaw.toggleMute(); }
function switchChatMode(mode) { ViLaw.switchChatMode(mode); }
function installPWA() { ViLaw.installPWA(); }
function toggleTheme() { ViLaw.toggleTheme(); }
function showNotification(message, type, duration) { ViLaw.showNotification(message, type, duration); }

// Auto-initialize
if (typeof document !== 'undefined') {
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', () => ViLaw.init());
    } else {
        ViLaw.init();
    }
}

// Export for Node.js
if (typeof module !== 'undefined' && module.exports) {
    module.exports = ViLaw;
}

// Global access
if (typeof window !== 'undefined') {
    window.ViLaw = ViLaw;
}
