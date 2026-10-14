import React, { useState, useRef, useEffect } from 'react';
import { Send, Plus, AlertCircle, CheckCircle2, MessageSquare, Check, CornerDownRight, Sparkles, Lock } from 'lucide-react';
import { Avatar } from '../ui/Avatar';
import { ChatMessage } from '../../types';

interface RoomChatProps {
  messages: ChatMessage[];
  onSendMessage: (text: string, type?: 'message' | 'doubt_alert') => void;
  onRaiseDoubt?: (text: string) => void;
  onReplyDoubt?: (doubtId: string, text: string) => void;
  onResolveDoubt?: (doubtId: string) => void;
  onOpenPrivateSolve?: (doubt: ChatMessage) => void;
  currentUserId?: string;
  activeTab?: 'chat' | 'doubts';
  onTabChange?: (tab: 'chat' | 'doubts') => void;
}

export const RoomChat: React.FC<RoomChatProps> = ({
  messages,
  onSendMessage,
  onRaiseDoubt,
  onReplyDoubt,
  onResolveDoubt,
  onOpenPrivateSolve,
  activeTab: controlledTab,
  onTabChange,
}) => {
  const [internalTab, setInternalTab] = useState<'chat' | 'doubts'>('chat');
  const activeTab = controlledTab || internalTab;

  const setActiveTab = (tab: 'chat' | 'doubts') => {
    setInternalTab(tab);
    onTabChange?.(tab);
  };

  const [inputText, setInputText] = useState('');
  const [showDoubtQuickModal, setShowDoubtQuickModal] = useState(false);
  const [doubtText, setDoubtText] = useState('');
  const [replyInputs, setReplyInputs] = useState<{ [doubtId: string]: string }>({});
  const [expandedThreads, setExpandedThreads] = useState<{ [doubtId: string]: boolean }>({});
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
    // Switch to doubts tab to show user their posted doubt
    setActiveTab('doubts');
  };

  const handleReplySubmit = (doubtId: string, e?: React.FormEvent) => {
    if (e) e.preventDefault();
    const replyText = replyInputs[doubtId]?.trim();
    if (!replyText || !onReplyDoubt) return;

    onReplyDoubt(doubtId, replyText);
    setReplyInputs((prev) => ({ ...prev, [doubtId]: '' }));
    setExpandedThreads((prev) => ({ ...prev, [doubtId]: true }));
  };

  const toggleThread = (doubtId: string) => {
    setExpandedThreads((prev) => ({ ...prev, [doubtId]: !prev[doubtId] }));
  };

  const doubtsList = messages.filter((m) => m.type === 'doubt_alert');
  const openDoubtsCount = doubtsList.filter((d) => !d.isResolved).length;

  const filteredMessages = activeTab === 'doubts' ? doubtsList : messages;

  return (
    <div className="bg-white rounded-xl border border-[#E5E7EB] flex flex-col h-[460px] shadow-xs overflow-hidden">
      {/* Tabs Header */}
      <div className="p-3 border-b border-[#E5E7EB] flex items-center justify-between bg-white z-10">
        <div className="flex items-center gap-1 bg-[#F8F9FB] p-1 rounded-lg border border-[#E5E7EB]/60">
          <button
            onClick={() => setActiveTab('chat')}
            className={`px-3.5 py-1 rounded-md text-xs font-bold transition-all cursor-pointer ${
              activeTab === 'chat'
                ? 'bg-white text-[#151C2F] shadow-xs'
                : 'text-[#667085] hover:text-[#151C2F]'
            }`}
          >
            Chat
          </button>
          <button
            onClick={() => setActiveTab('doubts')}
            className={`px-3.5 py-1 rounded-md text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
              activeTab === 'doubts'
                ? 'bg-white text-[#151C2F] shadow-xs'
                : 'text-[#667085] hover:text-[#151C2F]'
            }`}
          >
            <span>Room Doubts</span>
            {openDoubtsCount > 0 ? (
              <span className="w-4 h-4 rounded-full bg-[#EF4444] text-white text-[10px] flex items-center justify-center font-bold">
                {openDoubtsCount}
              </span>
            ) : (
              <span className="w-1.5 h-1.5 rounded-full bg-gray-300" />
            )}
          </button>
        </div>

        <button
          onClick={() => setShowDoubtQuickModal(true)}
          className="text-xs font-semibold text-[#0057BE] hover:underline flex items-center gap-1 cursor-pointer bg-[#EAF2FC] hover:bg-[#D5E6F9] px-2.5 py-1 rounded-lg transition-colors"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>Ask Room</span>
        </button>
      </div>

      {/* Messages Scroll Area */}
      <div className="flex-1 overflow-y-auto p-4 space-y-3.5">
        {filteredMessages.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-center text-[#98A2B3] py-12 px-4">
            {activeTab === 'doubts' ? (
              <div className="space-y-2">
                <div className="w-10 h-10 rounded-full bg-amber-50 text-amber-500 flex items-center justify-center mx-auto">
                  <AlertCircle className="w-5 h-5" />
                </div>
                <p className="text-xs font-bold text-[#151C2F]">No doubts raised in this session yet</p>
                <p className="text-[11px] text-[#667085] max-w-xs">
                  Stuck on a problem or formula? Click "Ask Room" above to get instant help from your peers here.
                </p>
              </div>
            ) : (
              <p className="text-xs font-medium">No messages yet. Say hello or share your study goal!</p>
            )}
          </div>
        ) : (
          filteredMessages.map((msg, idx) => {
            const timeStr = msg.createdAt
              ? new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
              : '';
            const doubtId = msg._id || `doubt-${idx}`;
            const replies = msg.doubtReplies || [];
            const isResolved = Boolean(msg.isResolved);
            const isThreadOpen = expandedThreads[doubtId] ?? (activeTab === 'doubts' || replies.length > 0);

            // Render Live Doubt Alert with Threaded Answers & Reply Box
            if (msg.type === 'doubt_alert') {
              return (
                <div
                  key={doubtId}
                  className={`rounded-xl border p-3.5 transition-all space-y-2.5 ${
                    isResolved
                      ? 'bg-[#F0FDF4] border-[#BBF7D0]'
                      : 'bg-[#FFFBEB] border-[#FDE68A]'
                  }`}
                >
                  {/* Doubt Header */}
                  <div className="flex items-center justify-between gap-2">
                    <div className="flex items-center gap-2">
                      <Avatar
                        src={msg.senderAvatar}
                        name={msg.senderName}
                        size="xs"
                      />
                      <div>
                        <div className="flex items-center gap-1.5">
                          <span className="text-xs font-bold text-[#151C2F]">{msg.senderName}</span>
                          <span className="text-[10px] text-[#98A2B3]">{timeStr}</span>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-1.5 flex-wrap justify-end">
                      {isResolved ? (
                        <span className="px-2 py-0.5 rounded-full bg-[#DCFCE7] text-[#15803D] text-[10px] font-bold border border-[#86EFAC] flex items-center gap-1">
                          <CheckCircle2 className="w-3 h-3" />
                          Resolved
                        </span>
                      ) : (
                        <span className="px-2 py-0.5 rounded-full bg-[#FEE2E2] text-[#B91C1C] text-[10px] font-bold border border-[#FCA5A5] flex items-center gap-1">
                          <AlertCircle className="w-3 h-3" />
                          Live Doubt
                        </span>
                      )}

                      {/* Solve Doubt in Private Chat Button */}
                      {onOpenPrivateSolve && (
                        <button
                          onClick={() => onOpenPrivateSolve(msg)}
                          title="Open private 1-on-1 chat window to solve this doubt"
                          className="px-2.5 py-1 rounded-lg bg-gradient-to-r from-[#0057BE] to-indigo-600 hover:from-[#00469B] hover:to-indigo-700 text-white text-[10px] font-bold transition-all shadow-xs flex items-center gap-1 cursor-pointer"
                        >
                          <Sparkles className="w-3 h-3 text-amber-300" />
                          <span>Solve Doubt</span>
                        </button>
                      )}

                      {!isResolved && onResolveDoubt && (
                        <button
                          onClick={() => onResolveDoubt(doubtId)}
                          title="Mark doubt as resolved"
                          className="px-2 py-1 rounded-lg bg-white hover:bg-[#DCFCE7] text-[#15803D] border border-gray-200 text-[10px] font-bold transition-colors cursor-pointer flex items-center gap-1"
                        >
                          <Check className="w-2.5 h-2.5" />
                          <span>Resolve</span>
                        </button>
                      )}
                    </div>
                  </div>

                  {/* Doubt Content */}
                  <div className="text-xs font-semibold text-[#151C2F] bg-white/70 p-2.5 rounded-lg border border-gray-200/50 leading-relaxed">
                    {msg.text}
                  </div>

                  {/* Thread Toggle / Stats */}
                  <div className="flex items-center justify-between pt-1">
                    <button
                      onClick={() => toggleThread(doubtId)}
                      className="text-[11px] font-bold text-[#0057BE] hover:underline flex items-center gap-1 cursor-pointer"
                    >
                      <MessageSquare className="w-3 h-3" />
                      <span>
                        {replies.length > 0
                          ? `${replies.length} Answer${replies.length === 1 ? '' : 's'}`
                          : 'No answers yet • Be first'}
                      </span>
                    </button>
                  </div>

                  {/* Threaded Replies List */}
                  {isThreadOpen && replies.length > 0 && (
                    <div className="space-y-2 pt-2 border-t border-gray-200/60 pl-2">
                      {replies.map((reply, rIdx) => (
                        <div
                          key={reply._id || rIdx}
                          className="bg-white rounded-lg p-2.5 border border-gray-200 text-xs space-y-1 shadow-2xs"
                        >
                          <div className="flex items-center justify-between text-[11px]">
                            <div className="flex items-center gap-1.5 flex-wrap">
                              <CornerDownRight className="w-3 h-3 text-[#98A2B3]" />
                              <span className="font-bold text-[#151C2F]">{reply.senderName}</span>
                              {isResolved && (
                                <span className="text-[10px] bg-[#DCFCE7] text-[#15803D] font-bold px-1.5 py-0.5 rounded-full border border-[#86EFAC] flex items-center gap-0.5">
                                  <Check className="w-2.5 h-2.5" />
                                  <span>+50 pts Solution</span>
                                </span>
                              )}
                            </div>
                            <span className="text-[10px] text-[#98A2B3]">
                              {reply.createdAt
                                ? new Date(reply.createdAt).toLocaleTimeString([], {
                                    hour: '2-digit',
                                    minute: '2-digit',
                                  })
                                : ''}
                            </span>
                          </div>
                          <p className="text-xs text-[#374151] pl-4 leading-relaxed font-normal">
                            {reply.text}
                          </p>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Answer Input Box */}
                  <form
                    onSubmit={(e) => handleReplySubmit(doubtId, e)}
                    className="flex items-center gap-1.5 pt-1.5"
                  >
                    <input
                      type="text"
                      placeholder="Answer this live doubt..."
                      value={replyInputs[doubtId] || ''}
                      onChange={(e) =>
                        setReplyInputs((prev) => ({ ...prev, [doubtId]: e.target.value }))
                      }
                      className="flex-1 bg-white border border-gray-200 focus:border-[#0057BE] rounded-lg px-2.5 py-1.5 text-xs text-[#151C2F] placeholder-[#98A2B3] outline-none"
                    />
                    <button
                      type="submit"
                      disabled={!replyInputs[doubtId]?.trim()}
                      className="px-2.5 py-1.5 bg-[#0057BE] hover:bg-[#00469B] disabled:opacity-40 text-white text-xs font-bold rounded-lg cursor-pointer flex items-center gap-1"
                    >
                      <Send className="w-3 h-3" />
                      <span>Answer</span>
                    </button>
                  </form>

                  {onOpenPrivateSolve && !isResolved && (
                    <div className="flex justify-end pt-0.5">
                      <button
                        type="button"
                        onClick={() => onOpenPrivateSolve(msg)}
                        className="text-[10px] font-bold text-[#0057BE] hover:text-[#00469B] hover:underline flex items-center gap-1 cursor-pointer"
                      >
                        <Lock className="w-2.5 h-2.5" />
                        <span>Need 1-on-1 walkthrough? Open private solve chat →</span>
                      </button>
                    </div>
                  )}
                </div>
              );
            }

            if (msg.type === 'system') {
              return (
                <div key={idx} className="text-center text-[11px] text-[#667085] italic py-1">
                  {msg.text}
                </div>
              );
            }

            // Normal peer chat message
            return (
              <div key={idx} className="flex items-start gap-2.5">
                <Avatar
                  src={msg.senderAvatar || ''}
                  name={msg.senderName}
                  size="sm"
                />
                <div className="flex-1">
                  <div className="flex items-baseline gap-2 mb-0.5">
                    <span className="text-xs font-bold text-[#151C2F]">{msg.senderName}</span>
                    {timeStr && <span className="text-[10px] text-[#98A2B3]">{timeStr}</span>}
                  </div>
                  <div className="p-2.5 rounded-xl bg-[#F8F9FB] border border-[#E5E7EB]/50 text-xs text-[#151C2F] max-w-sm inline-block leading-relaxed">
                    {msg.text}
                  </div>
                </div>
              </div>
            );
          })
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Quick Doubt Alert Input Modal Banner */}
      {showDoubtQuickModal && (
        <form
          onSubmit={handleRaiseLiveDoubt}
          className="p-3 bg-[#FEF3C7] border-t border-[#FDE68A] flex items-center gap-2"
        >
          <input
            type="text"
            placeholder="What question or problem are you stuck on in this room?"
            value={doubtText}
            onChange={(e) => setDoubtText(e.target.value)}
            className="flex-1 bg-white text-xs px-3 py-1.5 rounded-lg border border-[#F59E0B] outline-none"
            autoFocus
          />
          <button
            type="submit"
            className="px-3 py-1.5 bg-[#F59E0B] hover:bg-[#D97706] text-white text-xs font-bold rounded-lg cursor-pointer"
          >
            Post Doubt
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

      {/* Message Input Box for Chat */}
      {activeTab === 'chat' && (
        <form
          onSubmit={handleSend}
          className="p-3 border-t border-[#E5E7EB] flex items-center gap-2 bg-white"
        >
          <button
            type="button"
            onClick={() => setShowDoubtQuickModal(true)}
            title="Ask a doubt in this room"
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
      )}
    </div>
  );
};
