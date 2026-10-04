import { useState, useEffect, useRef } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

export default function App() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [sessionId, setSessionId] = useState(Date.now().toString());
  const [isDarkMode, setIsDarkMode] = useState(false);
  const messagesEndRef = useRef(null);
  const textareaRef = useRef(null);
  const glowRef = useRef(null); // Ref untuk efek mouse

  // Logika efek cahaya mengikuti Mouse
  useEffect(() => {
    const handleMouseMove = (e) => {
      if (glowRef.current) {
        glowRef.current.style.left = `${e.clientX}px`;
        glowRef.current.style.top = `${e.clientY}px`;
      }
    };
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  // Fungsi untuk mengganti tema HTML
  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDarkMode]);

  const scrollToBottom = () => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim()) return;
    const userMessage = { role: 'user', content: input };
    setMessages((prev) => [...prev, userMessage]);
    setInput('');
    if (textareaRef.current) textareaRef.current.style.height = 'inherit';
    setIsLoading(true);

    try {
      const response = await fetch('https://llm-chatbot-ai.onrender.com/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ session_id: sessionId, message: input }),
      });
      if (!response.ok) throw new Error('Network response was not ok');
      const data = await response.json();
      setMessages((prev) => [...prev, { role: 'assistant', content: data.response }]);
    } catch (error) {
      console.error('Error:', error);
      setMessages((prev) => [...prev, { role: 'assistant', content: 'Maaf, terjadi kesalahan pada server.' }]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  // Fungsi untuk tombol Quick Prompt di Sidebar
  const handleQuickPrompt = (promptText) => {
    setInput(promptText);
    if (textareaRef.current) {
      textareaRef.current.focus();
      textareaRef.current.style.height = 'inherit';
      setTimeout(() => {
        if (textareaRef.current) {
          textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
        }
      }, 10);
    }
  };

  const clearChat = async () => {
    setMessages([]);
    try {
      await fetch(`https://llm-chatbot-ai.onrender.com/api/clear?session_id=${sessionId}`, { method: 'POST' });

    } catch (e) {
      console.error(e);
    }
    setSessionId(Date.now().toString());
  };

  return (
    <div className="flex h-screen w-full relative overflow-hidden bg-[#fdfdfd] dark:bg-gray-950 transition-colors duration-500">

      {/* 🌟 LAMPU SOROT MOUSE (AMBIENT SPOTLIGHT) 🌟 */}
      <div
        ref={glowRef}
        className="pointer-events-none fixed w-[600px] h-[600px] rounded-full bg-brand-400/20 dark:bg-brand-500/15 blur-[120px] -translate-x-1/2 -translate-y-1/2 z-0 transition-opacity duration-300"
      />

      {/* Background gradients Statis */}
      <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[50%] bg-purple-200/30 dark:bg-purple-900/10 rounded-full blur-[120px] pointer-events-none transition-colors duration-500" />
      <div className="absolute bottom-[-20%] right-[-10%] w-[50%] h-[50%] bg-blue-200/30 dark:bg-blue-900/10 rounded-full blur-[120px] pointer-events-none transition-colors duration-500" />

      {/* Sidebar - Efek Transparan (Glassmorphism) Ditingkatkan */}
      <div className="w-64 border-r border-gray-100/50 dark:border-gray-800/50 bg-white/40 dark:bg-gray-900/40 backdrop-blur-2xl flex flex-col p-4 z-10 hidden md:flex transition-colors duration-500 animate-fade-in-up">
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-2 font-semibold text-lg text-gray-800 dark:text-gray-100">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-brand-500 to-brand-300 flex items-center justify-center text-white font-bold shadow-md">
              S
            </div>
            Sobat Laptop
          </div>
          <button
            onClick={() => setIsDarkMode(!isDarkMode)}
            className="p-2 rounded-lg bg-gray-100/50 dark:bg-gray-800/50 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors shadow-sm backdrop-blur-md"
            title="Ganti Tema"
          >
            {isDarkMode ? '☀️' : '🌙'}
          </button>
        </div>

        <button
          onClick={clearChat}
          className="w-full bg-gray-900/90 dark:bg-brand-600/90 text-white rounded-xl py-2.5 px-4 font-medium hover:bg-gray-800 dark:hover:bg-brand-500 transition-colors shadow-sm flex justify-center items-center gap-2 backdrop-blur-md"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4"></path></svg>
          Sesi Baru
        </button>

        <div className="mt-8 flex-1">
          <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-4">Kemampuan</h3>
          <ul className="space-y-3 text-sm text-gray-600 dark:text-gray-400">
            <li
              onClick={() => handleQuickPrompt("Tolong bantu diagnosa gejala error pada laptop saya. Gejalanya adalah: ")}
              className="flex items-center gap-2 hover:text-brand-500 transition-colors cursor-pointer hover:translate-x-1 duration-200"
            >
              🩺 Diagnosa Gejala Error
            </li>
            <li
              onClick={() => handleQuickPrompt("Tolong berikan tips cara merawat dan mengoptimasi laptop agar awet, baterai tidak bocor, dan tidak lemot.")}
              className="flex items-center gap-2 hover:text-brand-500 transition-colors cursor-pointer hover:translate-x-1 duration-200"
            >
              🛠️ Tips Merawat & Optimasi
            </li>
            <li
              onClick={() => handleQuickPrompt("Tolong berikan rekomendasi upgrade (seperti RAM/SSD) yang bagus untuk laptop saya agar performanya meningkat.")}
              className="flex items-center gap-2 hover:text-brand-500 transition-colors cursor-pointer hover:translate-x-1 duration-200"
            >
              💡 Rekomendasi Upgrade
            </li>
          </ul>
        </div>
      </div>

      {/* Main Chat Area */}
      <div className="flex-1 flex flex-col relative z-10 h-full">
        {messages.length === 0 ? (
          <div className="flex-1 flex flex-col items-center justify-center p-8 text-center animate-fade-in-up">
            <div className="w-24 h-24 mb-6 rounded-full bg-gradient-to-br from-brand-300 to-purple-400 blur-xl opacity-60 animate-pulse absolute" />
            <div className="w-20 h-20 mb-6 rounded-full bg-gradient-to-br from-white to-brand-100 shadow-xl border border-white dark:border-gray-800 flex items-center justify-center relative z-10">
              <span className="text-3xl">💻</span>
            </div>
            <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-3 tracking-tight transition-colors duration-500">Halo, Kawan.</h1>
            <p className="text-xl text-gray-500 dark:text-gray-400 max-w-md transition-colors duration-500">Ada masalah apa dengan laptopmu hari ini? Ceritakan saja gejalanya.</p>
          </div>
        ) : (
          <div className="flex-1 overflow-y-auto p-4 md:p-8 space-y-6 scroll-smooth">
            <div className="max-w-3xl mx-auto space-y-6 pb-20">
              {messages.map((msg, idx) => (
                <div key={idx} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'} animate-slide-in`}>
                  {msg.role !== 'user' && (
                    <div className="w-8 h-8 rounded-full bg-brand-100/80 dark:bg-brand-900/50 border border-brand-200/50 dark:border-brand-700/50 flex items-center justify-center mr-3 flex-shrink-0 mt-1 text-sm backdrop-blur-sm">
                      🤖
                    </div>
                  )}
                  <div className={`max-w-[85%] rounded-2xl px-5 py-3.5 leading-relaxed shadow-sm transition-colors duration-300 backdrop-blur-md ${msg.role === 'user'
                    ? 'bg-gray-900/90 dark:bg-brand-600/90 text-white rounded-br-sm'
                    : 'bg-white/70 dark:bg-gray-800/70 border border-gray-100/50 dark:border-gray-700/50 text-gray-800 dark:text-gray-100 rounded-bl-sm prose prose-sm sm:prose-base dark:prose-invert prose-p:my-1 prose-headings:my-2 max-w-none'
                    }`}>
                    {msg.role === 'user' ? (
                      msg.content
                    ) : (
                      <ReactMarkdown remarkPlugins={[remarkGfm]}>{msg.content}</ReactMarkdown>
                    )}
                  </div>
                </div>
              ))}
              {isLoading && (
                <div className="flex justify-start animate-slide-in">
                  <div className="w-8 h-8 rounded-full bg-brand-100/80 dark:bg-brand-900/50 border border-brand-200/50 dark:border-brand-700/50 flex items-center justify-center mr-3 flex-shrink-0 mt-1 backdrop-blur-sm">🤖</div>
                  <div className="bg-white/70 dark:bg-gray-800/70 border border-gray-100/50 dark:border-gray-700/50 rounded-2xl rounded-bl-sm px-5 py-4 flex items-center gap-1.5 shadow-sm backdrop-blur-md">
                    <div className="w-2 h-2 rounded-full bg-brand-400 dark:bg-brand-500 animate-bounce" style={{ animationDelay: '0ms' }} />
                    <div className="w-2 h-2 rounded-full bg-brand-400 dark:bg-brand-500 animate-bounce" style={{ animationDelay: '150ms' }} />
                    <div className="w-2 h-2 rounded-full bg-brand-400 dark:bg-brand-500 animate-bounce" style={{ animationDelay: '300ms' }} />
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>
          </div>
        )}

        {/* Input Area */}
        <div className="p-4 md:p-8 pt-0 animate-fade-in-up">
          <div className="max-w-3xl mx-auto relative bg-white/50 dark:bg-gray-800/50 backdrop-blur-xl rounded-2xl p-2 flex items-end shadow-xl shadow-brand-500/5 dark:shadow-none border border-white/50 dark:border-gray-700/50 transition-colors duration-500">
            <textarea
              ref={textareaRef}
              className="w-full bg-transparent border-none focus:ring-0 resize-none max-h-32 p-3 text-gray-800 dark:text-gray-100 placeholder-gray-400/80 outline-none transition-colors"
              rows={1}
              placeholder="Ceritakan masalah laptopmu (panas, lemot, dll)..."
              value={input}
              onChange={(e) => {
                setInput(e.target.value);
                e.target.style.height = 'inherit';
                e.target.style.height = `${e.target.scrollHeight}px`;
              }}
              onKeyDown={handleKeyDown}
            />
            <button
              onClick={handleSend}
              disabled={isLoading || !input.trim()}
              className="m-2 p-2.5 rounded-xl bg-brand-500/90 text-white hover:bg-brand-600 disabled:opacity-50 disabled:hover:bg-brand-500 transition-all shadow-md flex-shrink-0 backdrop-blur-md"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3"></path></svg>
            </button>
          </div>
          <p className="text-center text-xs text-gray-400 dark:text-gray-500 mt-4 transition-colors">AI dapat membuat kesalahan. Harap periksa kembali saran teknis.</p>
        </div>
      </div>
    </div>
  );
}
