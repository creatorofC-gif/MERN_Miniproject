import React, { useState, useRef, useEffect } from 'react';
import {
  X,
  Minus,
  Maximize2,
  Send,
  Sparkles,
  CheckCircle2,
  Lock,
  MessageSquare,
  Award,
} from 'lucide-react';
import { Avatar } from '../ui/Avatar';
import { ChatMessage, PrivateDoubtMessage } from '../../types';

interface PrivateDoubtChatProps {
  doubt: ChatMessage;
  messages: PrivateDoubtMessage[];
  onSendMessage: (text: string) => void;
  onResolveDoubt?: (doubtId: string) => void;
  onClose: () => void;
  currentUserId?: string;
  currentUserName?: string;
}

export const PrivateDoubtChat: React.FC<PrivateDoubtChatProps> = ({
  doubt,
  messages,
  onSendMessage,
  onResolveDoubt,
  onClose,
  currentUserId,
  currentUserName,
}) => {
  const [inputText, setInputText] = useState('');
  const [isMinimized, setIsMinimized] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const doubtId = doubt._id || (doubt as any).doubtId || '';
  const isResolved = Boolean(doubt.isResolved);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    if (!isMinimized) {
      scrollToBottom();
    }
  }, [messages, isMinimized]);

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim()) return;
    onSendMessage(inputText.trim());
    setInputText('');
  };

  const quickPrompts = [
    'Can you clarify this part?',
    'Here is the step-by-step solution:',
    'Try checking the formula:',
  ];

  if (isMinimized) {
    return (
      <div className="fixed bottom-4 right-4 z-50 bg-[#151C2F] text-white border border-[#1E293B] shadow-2xl rounded-2xl p-3 flex items-center gap-3 cursor-pointer hover:border-[#0057BE] transition-all">
        <div className="flex items-center gap-2" onClick={() => setIsMinimized(false)}>
          <div className="relative">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 absolute -top-0.5 -right-0.5 animate-pulse" />
            <Avatar src={doubt.senderAvatar} name={doubt.senderName} size="xs" />
          </div>
          <div className="text-left">
            <p className="text-[11px] font-bold flex items-center gap-1 text-emerald-400">
              <Lock className="w-3 h-3" />
              <span>Private Doubt Convo</span>
            </p>
            <p className="text-xs font-semibold text-gray-200 truncate max-w-[180px]">
              {doubt.text}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-1 border-l border-gray-700 pl-2">
          <button
            onClick={() => setIsMinimized(false)}
            title="Expand chat"
            className="p-1 rounded-lg hover:bg-white/10 text-gray-400 hover:text-white transition-colors"
          >
            <Maximize2 className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={onClose}
            title="Close chat"
            className="p-1 rounded-lg hover:bg-white/10 text-gray-400 hover:text-red-400 transition-colors"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed bottom-4 right-4 z-50 w-[360px] sm:w-[400px] h-[520px] max-h-[calc(100vh-32px)] bg-white rounded-2xl shadow-2xl border border-gray-200 flex flex-col overflow-hidden animate-in fade-in slide-in-from-bottom-4 duration-200">
      {/* Header */}
      <div className="bg-[#151C2F] text-white p-3.5 flex items-center justify-between border-b border-[#1E293B]">
        <div className="flex items-center gap-2.5 min-w-0">
          <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-[#0057BE] to-indigo-600 flex items-center justify-center text-white shrink-0 shadow-xs">
            <Sparkles className="w-4 h-4 text-amber-300" />
          </div>
          <div className="min-w-0">
            <div className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <h3 className="text-xs font-extrabold tracking-wide uppercase text-emerald-400 flex items-center gap-1">
                <Lock className="w-2.5 h-2.5" />
                <span>Private Solving Room</span>
              </h3>
            </div>
            <p className="text-xs font-semibold text-gray-200 truncate max-w-[200px]" title={doubt.text}>
              {doubt.text}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-1 shrink-0">
          {!isResolved && onResolveDoubt && (
            <button
              onClick={() => onResolveDoubt(doubtId)}
              title="Resolve doubt and award +50 points to solver"
              className="px-2 py-1 rounded-lg bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-300 border border-emerald-500/40 text-[10px] font-bold flex items-center gap-1 transition-colors cursor-pointer mr-1"
            >
              <Award className="w-3 h-3 text-amber-300" />
              <span>Mark Solved (+50)</span>
            </button>
          )}

          <button
            onClick={() => setIsMinimized(true)}
            title="Minimize"
            className="p-1 rounded-lg hover:bg-white/10 text-gray-400 hover:text-white transition-colors cursor-pointer"
          >
            <Minus className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={onClose}
            title="Close"
            className="p-1 rounded-lg hover:bg-white/10 text-gray-400 hover:text-red-400 transition-colors cursor-pointer"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Pinned Question Context Card */}
      <div className="bg-[#FFFBEB] border-b border-[#FDE68A] p-3 shrink-0">
        <div className="flex items-center justify-between text-[11px] mb-1">
          <div className="flex items-center gap-1.5 font-bold text-[#92400E]">
            <Avatar src={doubt.senderAvatar} name={doubt.senderName} size="xs" />
            <span>Asked by {doubt.senderName}</span>
          </div>
          {isResolved ? (
            <span className="text-[10px] font-extrabold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded-full border border-emerald-300 flex items-center gap-1">
              <CheckCircle2 className="w-3 h-3" />
              Solved
            </span>
          ) : (
            <span className="text-[10px] font-bold text-amber-700 bg-amber-100 px-2 py-0.5 rounded-full border border-amber-300">
              Needs Answer
            </span>
          )}
        </div>
        <p className="text-xs font-semibold text-[#151C2F] leading-snug line-clamp-3">
          "{doubt.text}"
        </p>
      </div>

      {/* Messages Stream */}
      <div className="flex-1 overflow-y-auto p-3.5 space-y-3 bg-[#F8F9FB]">
        {messages.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-center text-gray-400 py-8 px-4">
            <div className="w-10 h-10 rounded-full bg-blue-50 text-[#0057BE] flex items-center justify-center mb-2">
              <MessageSquare className="w-5 h-5" />
            </div>
            <p className="text-xs font-bold text-gray-700">Private 1-on-1 Solving Thread</p>
            <p className="text-[11px] text-gray-500 mt-1 max-w-[240px]">
              Type your explanation, formula, or code hints below. Both you and {doubt.senderName} can collaborate in real time!
            </p>
          </div>
        ) : (
          messages.map((msg, idx) => {
            const isMe =
              (currentUserId && msg.senderId && currentUserId === msg.senderId) ||
              (currentUserName && msg.senderName.toLowerCase() === currentUserName.toLowerCase());

            const timeStr = msg.createdAt
              ? new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
              : '';

            return (
              <div
                key={msg._id || idx}
                className={`flex flex-col ${isMe ? 'items-end' : 'items-start'}`}
              >
                <div className="flex items-center gap-1.5 mb-1 px-1">
                  {!isMe && (
                    <Avatar src={msg.senderAvatar} name={msg.senderName} size="xs" />
                  )}
                  <span className="text-[10px] font-bold text-gray-600">
                    {isMe ? 'You' : msg.senderName}
                  </span>
                  <span className="text-[9px] text-gray-400">{timeStr}</span>
                </div>

                <div
                  className={`max-w-[85%] rounded-2xl px-3.5 py-2 text-xs leading-relaxed ${
                    isMe
                      ? 'bg-[#0057BE] text-white rounded-tr-none shadow-xs'
                      : 'bg-white text-gray-800 border border-gray-200 rounded-tl-none shadow-xs'
                  }`}
                >
                  <p className="whitespace-pre-wrap">{msg.text}</p>
                </div>
              </div>
            );
          })
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Solved celebration banner if resolved */}
      {isResolved && (
        <div className="bg-emerald-50 border-t border-emerald-200 p-2.5 text-center text-xs font-bold text-emerald-800 flex items-center justify-center gap-1.5 shrink-0">
          <CheckCircle2 className="w-4 h-4 text-emerald-600" />
          <span>This doubt is officially solved! +50 points awarded.</span>
        </div>
      )}

      {/* Quick Prompts */}
      {!isResolved && (
        <div className="px-3 py-1.5 bg-white border-t border-gray-100 flex items-center gap-1.5 overflow-x-auto no-scrollbar shrink-0">
          {quickPrompts.map((prompt, pIdx) => (
            <button
              key={pIdx}
              type="button"
              onClick={() => setInputText((prev) => (prev ? `${prev} ${prompt}` : prompt))}
              className="text-[10px] font-medium text-gray-600 bg-gray-100 hover:bg-gray-200 rounded-full px-2.5 py-1 whitespace-nowrap transition-colors cursor-pointer"
            >
              {prompt}
            </button>
          ))}
        </div>
      )}

      {/* Input Footer */}
      <form
        onSubmit={handleSend}
        className="p-3 bg-white border-t border-gray-200 flex items-center gap-2 shrink-0"
      >
        <input
          type="text"
          placeholder={`Message ${doubt.senderName} privately...`}
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          className="flex-1 bg-gray-50 border border-gray-200 focus:border-[#0057BE] focus:bg-white text-xs text-gray-900 rounded-full px-3.5 py-2 outline-none transition-all placeholder:text-gray-400"
          autoFocus
        />
        <button
          type="submit"
          disabled={!inputText.trim()}
          className="w-8 h-8 rounded-full bg-[#0057BE] hover:bg-[#00469B] disabled:opacity-40 text-white flex items-center justify-center transition-all cursor-pointer shadow-xs shrink-0"
        >
          <Send className="w-3.5 h-3.5" />
        </button>
      </form>
    </div>
  );
};
