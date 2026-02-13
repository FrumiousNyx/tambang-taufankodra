import React, { useState, useEffect, useRef } from 'react';
import { MessageCircle, X, Send, Bot, Sparkles, ChevronRight } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';

interface Message {
  id: string;
  text: string;
  sender: 'user' | 'bot';
  timestamp: Date;
  suggestions?: string[];
}

const Chatbot: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState<Message[]>([]);
  const [isTyping, setIsTyping] = useState(false);
  const { language } = useLanguage();
  const scrollRef = useRef<HTMLDivElement>(null);

  // Auto-scroll logic
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTo({ top: scrollRef.current.scrollHeight, behavior: 'smooth' });
    }
  }, [messages, isTyping]);

  // Welcome System
  useEffect(() => {
    if (messages.length === 0) {
      const getWelcome = () => {
        if (language === 'zh') return {
          text: '您好！我是 Semen Nusantara 的智能助手。我可以为您提供产品规格、项目案例或商务合作咨询。',
          sug: ['产品信息', '查看项目', '联系销售']
        };
        if (language === 'en') return {
          text: 'Hello! I am your Semen Nusantara AI assistant. How can I help you today?',
          sug: ['Our Products', 'View Projects', 'Contact Sales']
        };
        return {
          text: 'Halo! Saya asisten pintar Semen Nusantara. Ada yang bisa saya bantu mengenai produk atau proyek kami hari ini?',
          sug: ['Info Produk', 'Lihat Proyek', 'Hubungi Sales']
        };
      };

      const welcome = getWelcome();
      setMessages([{
        id: 'welcome',
        text: welcome.text,
        sender: 'bot',
        timestamp: new Date(),
        suggestions: welcome.sug
      }]);
    }
  }, [language]);

  const generateResponse = (userInput: string) => {
    const q = userInput.toLowerCase();
    
    // --- LOGIKA SALAM / GREETING ---
    if (q.includes('halo') || q.includes('hi') || q.includes('pagi') || q.includes('siang') || q.includes('sore') || q.includes('hello') || q.includes('你好')) {
      return {
        text: language === 'zh' 
          ? '你好！很高兴为您服务。我是您的虚拟助手。您想了解我们的高品质水泥产品还是查看我们参与的国家项目？'
          : language === 'en'
          ? 'Hi there! Great to see you. I am your virtual assistant. Would you like to learn about our premium cement or check our national projects?'
          : 'Halo! Senang sekali bisa menyapa Anda. Saya asisten virtual Anda. Apakah Anda ingin tahu lebih lanjut tentang produk semen premium kami atau melihat proyek nasional yang kami tangani?',
        sug: ['PCC', 'Info Proyek', 'Hubungi Sales']
      };
    }

    // --- LOGIKA DETAIL PRODUK ---
    if (q.includes('pcc')) {
      return {
        text: language === 'zh' 
          ? '【PCC - 波特兰复合水泥】这是我们的多用途产品。具有更细腻的质地，易于施工，且成品表面更光滑。非常适合房屋建筑、抹灰和瓷砖安装。'
          : language === 'en'
          ? '[PCC - Portland Composite Cement] Our versatile product. It offers better workability, smoother finish, and high durability. Ideal for general housing and plastering.'
          : '[PCC - Portland Composite Cement] Produk serbaguna kami. Memiliki tekstur lebih halus, pengerjaan lebih mudah, dan hasil akhir lebih rapat. Sangat cocok untuk konstruksi rumah umum, plesteran, dan pasang bata.',
        sug: ['Minta Penawaran', 'Produk Lainnya']
      };
    }

    if (q.includes('opc')) {
      return {
        text: language === 'zh' 
          ? '【OPC - 普通波特兰水泥】高强度结构型水泥。专为需要高抗压强度的重型建筑设计，如高层建筑、桥梁和预制构件。'
          : language === 'en'
          ? '[OPC - Ordinary Portland Cement] High-strength structural cement. Designed for heavy construction requiring high compressive strength like high-rise buildings and bridges.'
          : '[OPC - Ordinary Portland Cement] Semen struktural kekuatan tinggi. Dirancang khusus untuk konstruksi berat yang membutuhkan daya tekan tinggi seperti gedung bertingkat, jembatan, dan beton pracetak.',
        sug: ['Spesifikasi Teknis', 'Produk Lainnya']
      };
    }

    if (q.includes('srpc')) {
      return {
        text: language === 'zh' 
          ? '【SRPC - 抗硫酸盐水泥】极端环境专家。专门用于硫酸盐含量高的地区，如沿海建筑、码头或地下基础。具有极强的防腐蚀性能。'
          : language === 'en'
          ? '[SRPC - Sulfate Resistant Cement] Extreme environment specialist. Formulated for areas with high sulfate content like coastal structures and piers. High corrosion resistance.'
          : '[SRPC - Sulfate Resistant Cement] Spesialis lingkungan ekstrem. Diformulasikan untuk area dengan kadar sulfat tinggi seperti struktur pantai, dermaga, atau fondasi bawah tanah. Memiliki ketahanan korosi yang sangat tinggi.',
        sug: ['Konsultasi Ahli', 'Produk Lainnya']
      };
    }

    // --- LOGIKA UMUM ---
    if (q.includes('produk') || q.includes('product') || q.includes('产品')) {
      return {
        text: language === 'zh' 
          ? '我们提供三类核心产品：PCC（多用途）、OPC（高强度结构）和 SRPC（抗硫酸盐）。您需要了解哪一种？'
          : language === 'en'
          ? 'We offer three core products: PCC (Multi-purpose), OPC (High-strength), and SRPC (Sulfate Resistant). Which one do you need?'
          : 'Kami menawarkan tiga produk inti: PCC (Serbaguna), OPC (Kekuatan Tinggi), dan SRPC (Tahan Sulfat). Mana yang ingin Anda diskusikan?',
        sug: ['PCC', 'OPC', 'SRPC']
      };
    }

    // FALLBACK
    return {
      text: language === 'zh' ? '抱歉，我不明白。您可以询问"产品"、"项目"或直接联系我们的客服。' : 'Maaf, saya kurang mengerti. Anda bisa bertanya tentang "Produk", "Proyek", atau cara memesan.',
      sug: ['Info Produk', 'Hubungi Kami']
    };
  };

  const handleSend = async (val: string) => {
    if (!val.trim()) return;
    const userMsg: Message = { id: Date.now().toString(), text: val, sender: 'user', timestamp: new Date() };
    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setIsTyping(true);

    setTimeout(() => {
      const response = generateResponse(val);
      const botMsg: Message = {
        id: (Date.now() + 1).toString(),
        text: response.text,
        sender: 'bot',
        timestamp: new Date(),
        suggestions: response.sug
      };
      setMessages(prev => [...prev, botMsg]);
      setIsTyping(false);
    }, 1000);
  };

  return (
    <div className="fixed bottom-6 right-6 z-[9999]">
      {/* --- SMART TRIGGER ANIMATION --- */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="group relative flex items-center justify-center w-16 h-16 bg-orange-600 rounded-2xl shadow-2xl transition-all duration-500 hover:rotate-6 hover:scale-110"
      >
        {isOpen ? <X className="text-white" size={32} /> : (
          <>
            <MessageCircle className="text-white group-hover:hidden" size={32} />
            <Sparkles className="text-white hidden group-hover:block animate-pulse" size={32} />
          </>
        )}
        {!isOpen && (
          <span className="absolute -top-2 -right-2 flex h-5 w-5">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-orange-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-5 w-5 bg-orange-500 border-2 border-white"></span>
          </span>
        )}
      </button>

      {/* --- CHAT WINDOW --- */}
      {isOpen && (
        <div className="absolute bottom-20 right-0 w-[380px] h-[600px] bg-white rounded-3xl shadow-2xl border border-slate-100 flex flex-col overflow-hidden animate-in zoom-in-95 duration-300 origin-bottom-right">
          
          <div className="bg-[#121212] p-6 text-white">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-orange-600 rounded-xl"><Bot size={24} /></div>
                <div>
                  <h3 className="font-black text-sm uppercase tracking-tight">Nusantara AI</h3>
                  <div className="flex items-center gap-1.5">
                    <div className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse" />
                    <span className="text-[10px] text-slate-400 font-bold uppercase tracking-widest italic">Adaptive Assistant</span>
                  </div>
                </div>
              </div>
              <button onClick={() => setIsOpen(false)} className="hover:rotate-90 transition-transform">
                <X size={20} className="text-slate-500" />
              </button>
            </div>
          </div>

          <div ref={scrollRef} className="flex-1 overflow-y-auto p-5 space-y-6 bg-slate-50/50">
            {messages.map((msg) => (
              <div key={msg.id} className={`flex flex-col ${msg.sender === 'user' ? 'items-end' : 'items-start'}`}>
                <div className={`max-w-[85%] p-4 rounded-2xl text-[13px] leading-relaxed shadow-sm transition-all ${
                  msg.sender === 'user' 
                    ? 'bg-orange-600 text-white rounded-tr-none' 
                    : 'bg-white text-slate-800 border border-slate-200 rounded-tl-none'
                }`}>
                  {msg.text}
                </div>
                
                {msg.suggestions && !isTyping && msg === messages[messages.length - 1] && (
                  <div className="flex flex-wrap gap-2 mt-3 animate-in fade-in slide-in-from-left-2 duration-500">
                    {msg.suggestions.map((s, i) => (
                      <button
                        key={i}
                        onClick={() => handleSend(s)}
                        className="flex items-center gap-1.5 px-3 py-1.5 bg-white border border-slate-200 text-slate-600 text-[11px] font-bold rounded-full hover:border-orange-500 hover:text-orange-600 transition-all shadow-sm active:scale-95"
                      >
                        {s} <ChevronRight size={12} />
                      </button>
                    ))}
                  </div>
                )}
              </div>
            ))}
            {isTyping && (
              <div className="flex items-center gap-2 text-slate-400 italic text-[11px] animate-pulse">
                <Bot size={14} /> AI is thinking...
              </div>
            )}
          </div>

          <div className="p-4 bg-white border-t border-slate-100">
            <form onSubmit={(e) => { e.preventDefault(); handleSend(input); }} className="relative flex items-center">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder={language === 'zh' ? '输入消息...' : language === 'en' ? 'Type a message...' : 'Ketik pesan...'}
                className="w-full bg-slate-100 border-none rounded-2xl px-5 py-4 text-sm focus:ring-2 focus:ring-orange-600 transition-all pr-14"
              />
              <button 
                type="submit" 
                disabled={!input.trim()} 
                className="absolute right-2 p-2.5 bg-orange-600 text-white rounded-xl hover:bg-orange-700 disabled:opacity-30 transition-all"
              >
                <Send size={18} />
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Chatbot;
