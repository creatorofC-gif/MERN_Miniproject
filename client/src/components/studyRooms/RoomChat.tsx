import React, { useState, useRef, useEffect } from 'react';
import { Send, Plus, AlertCircle } from 'lucide-react';
import { Avatar } from '../ui/Avatar';
import { ChatMessage } from '../../types';

interface RoomChatProps {
  messages: ChatMessage[];
  onSendMessage: (text: string, type?: 'message' | 'doubt_alert') => void;
  onRaiseDoubt?: (text: string) => void;
}

export const RoomChat: React.FC<RoomChatProps> = ({
  messages,
  onSendMessage,
  onRaiseDoubt,
}) => {
  const [activeTab, setActiveTab] = useState<'chat' | 'doubts'>('chat');
  const [inputText, setInputText] = useState('');
  const [showDoubtQuickModal, setShowDoubtQuickModal] = useState(false);
  const [doubtText, setDoubtText] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim()) return;
    onSendMessage(inputText.trim(), 'message');
    setInputText('');
  };

  const handleRaiseLiveDoubt = (e: React.FormEvent) => {
    e.preventDefault();
    if (!doubtText.trim()) return;
    if (onRaiseDoubt) {
      onRaiseDoubt(doubtText.trim());
    } else {
      onSendMessage(doubtText.trim(), 'doubt_alert');
    }
    setDoubtText('');
    setShowDoubtQuickModal(false);
  };

  const filteredMessages = activeTab === 'doubts'
    ? messages.filter((m) => m.type === 'doubt_alert')
    : messages;

  return (
    <div className="bg-white rounded-xl border border-[#E5E7EB] flex flex-col h-[380px] shadow-xs overflow-hidden">
      {/* Tabs Header */}
      <div className="p-3 border-b border-[#E5E7EB] flex items-center justify-between">
        <div className="flex items-center gap-1 bg-[#F8F9FB] p-1 rounded-lg border border-[#E5E7EB]/60">
          <button
            onClick={() => setActiveTab('chat')}
            className={`px-4 py-1 rounded-md text-xs font-bold transition-all cursor-pointer ${
              activeTab === 'chat'
                ? 'bg-white text-[#151C2F] shadow-xs'
                : 'text-[#667085] hover:text-[#151C2F]'
            }`}
          >
            Chat
          </button>
          <button
            onClick={() => setActiveTab('doubts')}
            className={`px-4 py-1 rounded-md text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
              activeTab === 'doubts'
                ? 'bg-white text-[#151C2F] shadow-xs'
                : 'text-[#667085] hover:text-[#151C2F]'
            }`}
          >
            <span>Doubts</span>
            <span className="w-1.5 h-1.5 rounded-full bg-[#EF4444]" />
          </button>
        </div>

        <button
          onClick={() => setShowDoubtQuickModal(true)}
          className="text-xs font-semibold text-[#0057BE] hover:underline flex items-center gap-1 cursor-pointer"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>Raise Doubt</span>
        </button>
      </div>

      {/* Messages Scroll Area */}
      <div className="flex-1 overflow-y-auto p-4 space-y-3.5">
        <div className="text-center text-[11px] font-semibold text-[#98A2B3]">
          Session Started 15m ago
        </div>

        {filteredMessages.map((msg, idx) => {
          if (msg.type === 'doubt_alert') {
            return (
              <div key={idx} className="space-y-1">
                <div className="flex items-center gap-1.5 text-xs text-[#EF4444] font-bold">
                  <div className="w-4 h-4 rounded-full bg-[#FEE2E2] flex items-center justify-center">
                    <AlertCircle className="w-3 h-3" />
                  </div>
                  <span>Live Doubt Raised</span>
                  <span className="text-[10px] text-[#98A2B3] font-normal">10:05 AM</span>
                </div>
                <div className="p-3 bg-[#FFF5F5] border-l-4 border-l-[#F26161] rounded-r-lg text-xs font-medium text-[#151C2F]">
                  {msg.text}
                </div>
              </div>
            );
          }

          if (msg.type === 'system') {
            return (
              <div key={idx} className="text-center text-[11px] text-[#667085] italic">
                {msg.text}
              </div>
            );
          }

          return (
            <div key={idx} className="flex items-start gap-2.5">
              <Avatar
                src={msg.senderAvatar || 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80'}
                name={msg.senderName}
                size="sm"
              />
              <div className="flex-1">
                <div className="flex items-baseline gap-2 mb-0.5">
                  <span className="text-xs font-bold text-[#151C2F]">{msg.senderName}</span>
                  <span className="text-[10px] text-[#98A2B3]">10:04 AM</span>
                </div>
                <div className="p-2.5 rounded-xl bg-[#F8F9FB] border border-[#E5E7EB]/50 text-xs text-[#151C2F] max-w-sm inline-block leading-relaxed">
                  {msg.text}
                </div>
              </div>
            </div>
          );
        })}
        <div ref={messagesEndRef} />
      </div>

      {/* Quick Doubt Alert Input Modal Banner */}
      {showDoubtQuickModal && (
        <form onSubmit={handleRaiseLiveDoubt} className="p-3 bg-[#FEF3C7] border-t border-[#FDE68A] flex items-center gap-2">
          <input
            type="text"
            placeholder="What doubt are you stuck on?"
            value={doubtText}
            onChange={(e) => setDoubtText(e.target.value)}
            className="flex-1 bg-white text-xs px-3 py-1.5 rounded-lg border border-[#F59E0B] outline-none"
            autoFocus
          />
          <button
            type="submit"
            className="px-3 py-1.5 bg-[#F59E0B] hover:bg-[#D97706] text-white text-xs font-bold rounded-lg cursor-pointer"
          >
            Post Alert
          </button>
          <button
            type="button"
            onClick={() => setShowDoubtQuickModal(false)}
            className="text-xs text-gray-500 hover:text-gray-700 px-1 cursor-pointer"
          >
            Cancel
          </button>
        </form>
      )}

      {/* Message Input Box */}
      <form onSubmit={handleSend} className="p-3 border-t border-[#E5E7EB] flex items-center gap-2 bg-white">
        <button
          type="button"
          onClick={() => setShowDoubtQuickModal(true)}
          title="Add doubt or snippet"
          className="p-1.5 text-[#98A2B3] hover:text-[#151C2F] rounded-lg hover:bg-gray-100 transition-colors cursor-pointer"
        >
          <Plus className="w-4 h-4" />
        </button>

        <input
          type="text"
          placeholder="Type a message..."
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          className="flex-1 bg-[#F8F9FB] border border-transparent hover:border-[#E5E7EB] focus:border-[#0057BE] focus:bg-white text-xs text-[#151C2F] placeholder-[#98A2B3] rounded-full px-3.5 py-2 outline-none transition-all"
        />

        <button
          type="submit"
          className="p-2 text-[#0057BE] hover:bg-[#EAF2FC] rounded-full transition-colors cursor-pointer"
        >
          <Send className="w-4 h-4" />
        </button>
      </form>
    </div>
  );
};
