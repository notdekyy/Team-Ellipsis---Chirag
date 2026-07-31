import React, { useState, useRef, useEffect } from 'react';
import { Bot, User, Send, Trash2, Settings, Loader2 } from 'lucide-react';
import { aiEngine } from '../services/aiEngine';
import { QuickChips } from './QuickChips';
import { ChatMessage, TelemetryData } from '../types';

interface Module4Props {
  onOpenConfig: () => void;
  apiKey: string;
  provider: string;
  onTelemetryUpdate: (telemetry: TelemetryData | null) => void;
}

export const Module4_AIAssistant: React.FC<Module4Props> = ({
  onOpenConfig,
  apiKey,
  provider,
  onTelemetryUpdate,
}) => {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const chatEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isLoading]);

  const parseMarkdownToHTML = (md: string) => {
    if (!md) return '';
    return md
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/```(\w*)\n([\s\S]*?)```/g, '<div style="background:#121212; border:1px solid #2A2A2A; border-radius:12px; margin:10px 0; overflow:hidden;"><div style="background:#1E1E1E; padding:10px 16px; font-size:12px; font-weight:bold; color:#94a3b8; border-bottom:1px solid #2A2A2A; display:flex; justify-between; align-items:center;"><span>code</span><button onclick="navigator.clipboard.writeText(this.parentNode.nextElementSibling.innerText)" style="background:none; border:none; color:#3B82F6; cursor:pointer; font-size:12px; font-weight:bold;">Copy</button></div><pre style="padding:16px; margin:0; font-family:monospace; font-size:13px; color:#38bdf8; overflow-x:auto;"><code>$2</code></pre></div>')
      .replace(/^#### (.*$)/gim, '<h4 style="font-size:14px; font-weight:800; margin:14px 0 6px; color:#ffffff;">$1</h4>')
      .replace(/^### (.*$)/gim, '<h3 style="font-size:15px; font-weight:800; margin:16px 0 8px; color:#3B82F6;">$1</h3>')
      .replace(/^## (.*$)/gim, '<h2 style="font-size:17px; font-weight:800; margin:18px 0 8px; color:#ffffff;">$1</h2>')
      .replace(/^\&gt; (.*$)/gim, '<div style="background:rgba(245, 158, 11, 0.15); border-left:4px solid #F59E0B; padding:14px 18px; border-radius:8px; font-size:13.5px; font-weight:500; margin:12px 0; color:#ffffff;">$1</div>')
      .replace(/\*\*(.*?)\*\*/g, '<strong style="color:#ffffff;">$1</strong>')
      .replace(/\*(.*?)\*/g, '<em>$1</em>')
      .replace(/`(.*?)`/g, '<code style="background:#121212; border:1px solid #2A2A2A; padding:3px 8px; border-radius:6px; font-size:12.5px; color:#3B82F6;">$1</code>')
      .replace(/^\- (.*$)/gim, '<li style="margin-left:20px; font-size:13.5px; color:#cbd5e1; margin-bottom:4px;">$1</li>')
      .replace(/^1\. (.*$)/gim, '<li style="margin-left:20px; font-size:13.5px; color:#cbd5e1; margin-bottom:6px; list-style-type:decimal;">$1</li>')
      .replace(/\n\n/g, '<br><br>')
      .replace(/\n/g, '<br>');
  };

  const handleSend = async (customPrompt?: string) => {
    const promptText = (customPrompt || input).trim();
    if (!promptText || isLoading) return;

    const userMsg: ChatMessage = {
      id: 'msg-' + Date.now(),
      role: 'user',
      content: promptText,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages(prev => [...prev, userMsg]);
    if (!customPrompt) setInput('');
    setIsLoading(true);

    try {
      const response = await aiEngine.generateResponse(promptText, apiKey);

      const assistantMsg: ChatMessage = {
        id: 'msg-' + (Date.now() + 1),
        role: 'assistant',
        content: response.text,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        telemetry: response.telemetry,
      };

      setMessages(prev => [...prev, assistantMsg]);
      if (response.telemetry) {
        onTelemetryUpdate(response.telemetry);
      }
    } catch (err) {
      console.error('Generation error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleClearMemory = () => {
    aiEngine.clearMemory();
    setMessages([]);
    onTelemetryUpdate(null);
  };

  return (
    <div className="flex flex-col h-full min-h-0 flex-1 bg-[#1E1E1E] border border-[#2A2A2A] rounded-2xl overflow-hidden shadow-sm">
      {/* Header */}
      <div className="flex items-center justify-between px-6 py-4.5 border-b border-[#2A2A2A] bg-[#121212] shrink-0">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-[#3B82F6]/15 text-[#3B82F6] flex items-center justify-center border border-[#3B82F6]/30 shrink-0">
            <Bot className="w-6 h-6 shrink-0" />
          </div>
          <div className="space-y-0.5">
            <h2 className="text-lg sm:text-xl font-extrabold text-white whitespace-nowrap truncate leading-normal">
              Module 4: AURA AI Companion
            </h2>
            <span className="text-xs sm:text-sm font-bold uppercase tracking-wider text-[#22C55E] flex items-center gap-2 whitespace-nowrap truncate">
              <span className="w-2.5 h-2.5 rounded-full bg-[#22C55E] animate-pulse shrink-0"></span>
              {apiKey ? `Real LLM (${provider.toUpperCase()})` : 'Dynamic Local OSRM AI'}
            </span>
          </div>
        </div>

        <div className="flex items-center gap-3 shrink-0">
          <button
            onClick={onOpenConfig}
            className="min-h-[48px] px-5 py-2.5 rounded-xl bg-[#1E1E1E] border border-[#2A2A2A] hover:border-[#3B82F6]/60 text-gray-300 hover:text-white text-xs sm:text-sm font-extrabold flex items-center gap-2.5 transition-all duration-200 hover:scale-[1.02] active:scale-[0.98]"
          >
            <Settings className="w-4.5 h-4.5 text-[#3B82F6] shrink-0" />
            <span className="whitespace-nowrap">Config</span>
          </button>

          <button
            onClick={handleClearMemory}
            className="min-h-[48px] px-5 py-2.5 rounded-xl bg-[#1E1E1E] border border-[#2A2A2A] hover:border-[#3B82F6]/60 text-gray-300 hover:text-white text-xs sm:text-sm font-extrabold flex items-center gap-2.5 transition-all duration-200 hover:scale-[1.02] active:scale-[0.98]"
          >
            <Trash2 className="w-4.5 h-4.5 text-[#EF4444] shrink-0" />
            <span className="whitespace-nowrap">Reset Memory</span>
          </button>
        </div>
      </div>

      <div className="shrink-0">
        <QuickChips onSelectChip={(q) => handleSend(q)} />
      </div>

      {/* Chat Feed Stream Container with Prominent Right-Edge Scrollbar & Fixed Height */}
      <div className="flex-1 min-h-0 overflow-y-auto custom-chatbot-scrollbar p-5 sm:p-6 space-y-5">
        {messages.length === 0 ? (
          <div className="flex items-start gap-4 bg-[#121212] border border-[#2A2A2A] p-6 sm:p-7 rounded-2xl text-xs sm:text-sm md:text-base text-gray-200 leading-relaxed shadow-sm">
            <Bot className="w-6 h-6 text-[#3B82F6] shrink-0 mt-0.5" />
            <div className="space-y-2">
              <p>Hello! I am your <strong>AURA AI Companion</strong>.</p>
              <p>Powered by <strong>Multi-Region Spatial Viewboxes</strong> (Delhi NCR & Bhopal/MP) and <strong>Real OSRM Telemetry Injection</strong>.</p>
              <p>Ask me to plan safer routes between any two places (e.g. <em>"Bhopal to Indore"</em> or <em>"Delhi to Solan"</em>), compare ride options, or ask any general coding/knowledge questions!</p>
            </div>
          </div>
        ) : (
          messages.map(msg => (
            <div
              key={msg.id}
              className={`flex gap-3.5 max-w-[88%] ${msg.role === 'user' ? 'ml-auto flex-row-reverse' : ''}`}
            >
              <div
                className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 ${
                  msg.role === 'user' ? 'bg-[#3B82F6] text-white shadow-sm' : 'bg-[#3B82F6]/20 text-[#3B82F6] border border-[#3B82F6]/30'
                }`}
              >
                {msg.role === 'user' ? <User className="w-5 h-5 shrink-0" /> : <Bot className="w-5 h-5 shrink-0" />}
              </div>

              <div
                className={`p-5 sm:p-6 rounded-2xl text-xs sm:text-sm md:text-base leading-relaxed ${
                  msg.role === 'user'
                    ? 'bg-[#3B82F6] text-white font-medium rounded-tr-none shadow-sm'
                    : 'bg-[#121212] border border-[#2A2A2A] text-gray-100 rounded-tl-none shadow-sm'
                }`}
                dangerouslySetInnerHTML={{ __html: parseMarkdownToHTML(msg.content) }}
              />
            </div>
          ))
        )}

        {isLoading && (
          <div className="flex items-center gap-3.5">
            <div className="w-10 h-10 rounded-full bg-[#3B82F6]/20 text-[#3B82F6] flex items-center justify-center border border-[#3B82F6]/30 shrink-0">
              <Bot className="w-5 h-5 shrink-0" />
            </div>
            <div className="bg-[#121212] border border-[#2A2A2A] p-5 rounded-2xl rounded-tl-none text-xs sm:text-sm font-bold text-gray-300 flex items-center gap-3 shadow-sm">
              <Loader2 className="w-5 h-5 text-[#3B82F6] animate-spin shrink-0" />
              <span>Fetching OSRM GIS Telemetry...</span>
            </div>
          </div>
        )}

        <div ref={chatEndRef} />
      </div>

      {/* Input Footer */}
      <div className="p-4.5 border-t border-[#2A2A2A] bg-[#121212] shrink-0">
        <div className="flex items-end gap-3.5">
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                handleSend();
              }
            }}
            placeholder="Type e.g. 'Plan safest route from Bhopal to Indore'..."
            className="flex-1 min-h-[52px] bg-[#1E1E1E] border border-[#2A2A2A] rounded-xl px-5 py-3.5 text-xs sm:text-sm md:text-base text-white placeholder-gray-500 focus:outline-none focus:border-[#3B82F6] resize-none leading-relaxed transition-colors"
            rows={1}
          />
          <button
            onClick={() => handleSend()}
            disabled={isLoading || !input.trim()}
            className="min-h-[52px] px-6 py-4 bg-[#3B82F6] hover:bg-blue-600 disabled:opacity-50 text-white rounded-xl font-extrabold text-xs sm:text-sm md:text-base flex items-center justify-center gap-2.5 transition-all duration-200 hover:scale-[1.02] active:scale-[0.98] shrink-0 shadow-sm"
          >
            <Send className="w-5 h-5 shrink-0" />
            <span className="whitespace-nowrap">Send</span>
          </button>
        </div>
      </div>
    </div>
  );
};
