/**
 * ChatMVP — YC MVP Surface 1
 * Chat surface with truthful action boundaries.
 */
import { useState, useEffect, useRef, useCallback } from "react";
import { trpc } from "@/lib/trpc";
import { useAuth } from "@/_core/hooks/useAuth";
import { toast } from "sonner";
import { Link } from "wouter";
import {
  Send, Bot, Zap, DollarSign, Briefcase, ShoppingBag,
  Mic, Video, Phone, Star, TrendingUp, MoreVertical, ArrowLeft,
  Search, Plus, CheckCheck, Check, Sparkles, X, Loader2
} from "lucide-react";

type UserId = string | number;
type Message = { id: number; content: string; senderId: UserId; senderName: string; senderAvatar?: string; timestamp: Date; type: "text" | "tip" | "action" | "ai" | "system"; tipAmount?: number; actionType?: string; actionData?: Record<string, unknown>; status?: "sending" | "sent" | "delivered" | "read"; };
type ActionType = "tip" | "request_service" | "create_listing" | "ai_task";
const ACTION_QUICK_BUTTONS: { type: ActionType; label: string; icon: React.ElementType; color: string }[] = [
  { type: "tip", label: "Send Tip", icon: DollarSign, color: "text-yellow-400" }, { type: "ai_task", label: "Ask AI", icon: Bot, color: "text-purple-400" }, { type: "request_service", label: "Request Service", icon: Briefcase, color: "text-blue-400" }, { type: "create_listing", label: "Create Listing", icon: ShoppingBag, color: "text-green-400" },
];
const AI_COMMANDS = [
  { cmd: "/find designer", desc: "Ask AI to find design options" }, { cmd: "/tip 20", desc: "Prepare a 20 SKY444 tip request" }, { cmd: "/sell item", desc: "Draft a listing" }, { cmd: "/earn", desc: "Show available earning ideas" }, { cmd: "/analyze", desc: "Analyze conversation" },
];
const DEMO_CONVERSATIONS = [
  { id: 1, userId: null, name: "NOVA AI", avatar: "🤖", lastMessage: "Ask me for ideas or planning help", unread: 0, isAI: true, online: true },
  { id: 2, userId: null, name: "Alex Chen", avatar: "👤", lastMessage: "Demo conversation — connect a real user to message", unread: 0, isAI: false, online: true },
  { id: 3, userId: null, name: "Sarah K.", avatar: "👤", lastMessage: "Demo conversation — connect a real user to message", unread: 0, isAI: false, online: false },
  { id: 4, userId: null, name: "Creator Hub", avatar: "⭐", lastMessage: "Demo conversation — connect a real user to message", unread: 0, isAI: false, online: true },
];

export default function ChatMVP() {
  const { user } = useAuth();
  const currentUserId: UserId = user?.id ?? "demo-user";
  const [selectedConvId, setSelectedConvId] = useState<number>(1);
  const [messages, setMessages] = useState<Message[]>([{ id: 1, content: "Hey! I'm NOVA. I can help brainstorm, analyze, and prepare actions. Financial or marketplace actions only count as complete when a verified backend confirms them.", senderId: 0, senderName: "NOVA AI", timestamp: new Date(Date.now() - 120000), type: "ai", status: "read" }]);
  const [inputText, setInputText] = useState(""); const [showActions, setShowActions] = useState(false); const [showTipModal, setShowTipModal] = useState(false); const [tipAmount, setTipAmount] = useState("10"); const [tipMessage, setTipMessage] = useState(""); const [aiThinking, setAiThinking] = useState(false); const [showCommands, setShowCommands] = useState(false); const [searchQuery, setSearchQuery] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null); const inputRef = useRef<HTMLInputElement>(null);
  const sendMsgMut = trpc.dm.send.useMutation();
  const tipMut = trpc.creator.tip.useMutation({ onSuccess: () => { toast.success(`Tip of ${tipAmount} SKY444 confirmed by the server.`); setShowTipModal(false); addSystemMessage(`Tip of ${tipAmount} SKY444 confirmed by the server.`); }, onError: (error) => toast.error(error.message || "Tip is unavailable") });
  const aiChatMut = trpc.ai.chat.useMutation();
  useEffect(() => { messagesEndRef.current?.scrollIntoView({ behavior: "smooth" }); }, [messages]);
  const addSystemMessage = (content: string) => setMessages(prev => [...prev, { id: Date.now(), content, senderId: -1, senderName: "System", timestamp: new Date(), type: "system", status: "delivered" }]);

  const handleSend = useCallback(async () => {
    if (!inputText.trim()) return; const text = inputText.trim(); setInputText(""); setShowCommands(false);
    const userMsg: Message = { id: Date.now(), content: text, senderId: currentUserId, senderName: user?.username ?? "You", timestamp: new Date(), type: "text", status: "sending" };
    setMessages(prev => [...prev, userMsg]);
    if (selectedConvId !== 1) {
      const selected = DEMO_CONVERSATIONS.find(c => c.id === selectedConvId);
      if (!selected?.userId) { toast.error("This is a demo contact. Select a real conversation before sending."); setMessages(prev => prev.map(item => item.id === userMsg.id ? { ...item, status: "sending" } : item)); return; }
      try { await sendMsgMut.mutateAsync({ recipientId: selected.userId, content: text }); setMessages(prev => prev.map(message => message.id === userMsg.id ? { ...message, status: "sent" } : message)); }
      catch (error) { toast.error(error instanceof Error ? error.message : "Messaging is unavailable"); }
      return;
    }
    setAiThinking(true);
    try { const result = await aiChatMut.mutateAsync({ message: text, systemPrompt: "You are NOVA inside SKYCOIN4444. Help with analysis, planning, discovery, and drafting. Never state that a payment, transaction, booking, purchase, or other external action succeeded unless the application provides a verified success result." }); const aiContent = (result as any)?.content ?? (result as any)?.message ?? "No response was returned."; setMessages(prev => [...prev, { id: Date.now() + 1, content: aiContent, senderId: 0, senderName: "NOVA AI", timestamp: new Date(), type: "ai", status: "delivered" }]); }
    catch (error) { const message = error instanceof Error ? error.message : "AI is unavailable"; setMessages(prev => [...prev, { id: Date.now() + 1, content: `AI unavailable: ${message}`, senderId: 0, senderName: "NOVA AI", timestamp: new Date(), type: "system", status: "delivered" }]); }
    finally { setAiThinking(false); }
  }, [inputText, selectedConvId, currentUserId, user?.username, aiChatMut, sendMsgMut]);

  const handleKeyDown = (e: React.KeyboardEvent) => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); void handleSend(); } if (e.key === "/" && inputText === "") setShowCommands(true); if (e.key === "Escape") setShowCommands(false); };
  const handleTipSend = () => { if (!user) return toast.error("Login required"); const conv = DEMO_CONVERSATIONS.find(c => c.id === selectedConvId); if (!conv || conv.isAI || !conv.userId) return toast.error("Select a real person before tipping"); tipMut.mutate({ recipientId: conv.userId, amount: Number(tipAmount), message: tipMessage }); };
  const selectedConv = DEMO_CONVERSATIONS.find(c => c.id === selectedConvId); const filteredConvs = DEMO_CONVERSATIONS.filter(c => c.name.toLowerCase().includes(searchQuery.toLowerCase()));

  return <div className="h-screen flex bg-background overflow-hidden">
    <div className="w-80 border-r border-border/50 flex flex-col shrink-0"><div className="p-4 border-b border-border/50"><div className="flex items-center justify-between mb-3"><Link href="/" className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors"><ArrowLeft className="w-4 h-4" /></Link><h1 className="font-bold text-lg bg-gradient-to-r from-primary to-purple-400 bg-clip-text text-transparent">ShadowChat</h1><button onClick={() => toast.info("Conversation creation is not implemented yet")} className="p-1.5 rounded-lg hover:bg-secondary/50 transition-colors"><Plus className="w-4 h-4" /></button></div><div className="relative"><Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" /><input value={searchQuery} onChange={e => setSearchQuery(e.target.value)} className="w-full bg-secondary/30 border border-border/30 rounded-xl pl-9 pr-3 py-2 text-sm" placeholder="Search conversations..." /></div></div>
    <div className="flex-1 overflow-y-auto px-2 py-2 space-y-1">{filteredConvs.map(conv => <button key={conv.id} onClick={() => setSelectedConvId(conv.id)} className={`w-full flex items-center gap-3 p-3 rounded-xl text-left transition-all ${selectedConvId === conv.id ? "bg-primary/10 border border-primary/30" : "hover:bg-secondary/30"}`}><div className="w-10 h-10 rounded-full bg-secondary flex items-center justify-center">{conv.isAI ? <Bot className="w-5 h-5" /> : conv.avatar}</div><div className="flex-1 min-w-0"><div className="font-medium text-sm">{conv.name}</div><div className="text-xs text-muted-foreground truncate">{conv.lastMessage}</div></div></button>)}</div>
    <div className="p-3 border-t border-border/50 grid grid-cols-4 gap-1">{[{ icon: Bot, label: "AI", href: "/ai-brain" }, { icon: TrendingUp, label: "Feed", href: "/social" }, { icon: DollarSign, label: "Wallet", href: "/wallet" }, { icon: Star, label: "More", href: "/" }].map(item => <Link key={item.label} href={item.href} className="flex flex-col items-center gap-1 p-2 rounded-lg hover:bg-secondary/30 text-muted-foreground"><item.icon className="w-4 h-4" /><span className="text-xs">{item.label}</span></Link>)}</div></div>
    <div className="flex-1 flex flex-col min-w-0"><div className="px-4 py-3 border-b border-border/50 flex items-center justify-between"><div className="flex items-center gap-3"><div className="w-9 h-9 rounded-full bg-secondary flex items-center justify-center">{selectedConv?.isAI ? <Bot className="w-4 h-4" /> : selectedConv?.avatar}</div><div><div className="font-semibold text-sm">{selectedConv?.name}</div><div className="text-xs text-muted-foreground">{selectedConv?.isAI ? "AI assistant" : "Demo contact"}</div></div></div><div className="flex items-center gap-1"><button onClick={() => toast.info("Voice calls are not implemented yet")} className="p-2"><Phone className="w-4 h-4" /></button><button onClick={() => toast.info("Video calls are not implemented yet")} className="p-2"><Video className="w-4 h-4" /></button><button className="p-2"><MoreVertical className="w-4 h-4" /></button></div></div>
    <div className="flex-1 overflow-y-auto p-4 space-y-3">{messages.map(msg => { const isOwn = msg.senderId === currentUserId; if (msg.type === "system") return <div key={msg.id} className="flex justify-center"><span className="text-xs text-muted-foreground bg-secondary/30 px-3 py-1 rounded-full">{msg.content}</span></div>; const isAI = msg.type === "ai"; return <div key={msg.id} className={`flex gap-2 ${isOwn ? "flex-row-reverse" : "flex-row"}`}><div className={`max-w-[70%] px-3.5 py-2.5 rounded-2xl text-sm whitespace-pre-wrap ${isOwn ? "bg-primary text-primary-foreground" : "bg-secondary/70"}`}>{isAI && <div className="flex items-center gap-1 mb-1 text-xs text-primary font-medium"><Sparkles className="w-3 h-3" />NOVA AI</div>}{msg.content}<div className="mt-1 flex items-center gap-1 text-[10px] opacity-60">{new Date(msg.timestamp).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}{isOwn && (msg.status === "read" || msg.status === "delivered" ? <CheckCheck className="w-3 h-3" /> : <Check className="w-3 h-3" />)}</div></div></div>; })}{aiThinking && <div className="flex items-center gap-2 text-sm text-muted-foreground"><Loader2 className="w-4 h-4 animate-spin" />NOVA is responding…</div>}<div ref={messagesEndRef} /></div>
    {showCommands && <div className="mx-4 mb-2 card p-2 space-y-1 border border-primary/20">{AI_COMMANDS.map(cmd => <button key={cmd.cmd} onClick={() => { setInputText(cmd.cmd); setShowCommands(false); inputRef.current?.focus(); }} className="w-full flex justify-between px-2 py-1.5 rounded-lg hover:bg-secondary/50"><span className="text-sm font-mono text-primary">{cmd.cmd}</span><span className="text-xs text-muted-foreground">{cmd.desc}</span></button>)}</div>}
    {showActions && <div className="mx-4 mb-2 flex gap-2 overflow-x-auto">{ACTION_QUICK_BUTTONS.map(action => <button key={action.type} onClick={() => { if (action.type === "tip") setShowTipModal(true); else if (action.type === "ai_task") { setInputText("/"); setShowCommands(true); } else toast.info(`${action.label} is not implemented yet`); setShowActions(false); }} className="flex items-center gap-1.5 px-3 py-2 bg-secondary/50 rounded-xl text-sm whitespace-nowrap"><action.icon className={`w-4 h-4 ${action.color}`} />{action.label}</button>)}</div>}
    <div className="p-3 border-t border-border/50"><div className="flex items-end gap-2"><button onClick={() => setShowActions(!showActions)} className="p-2.5 rounded-xl bg-secondary/50"><Plus className="w-4 h-4" /></button><div className="flex-1 relative"><input ref={inputRef} value={inputText} onChange={e => { setInputText(e.target.value); setShowCommands(e.target.value === "/"); }} onKeyDown={handleKeyDown} className="w-full bg-secondary/30 border border-border/30 rounded-2xl px-4 py-2.5 text-sm pr-10" placeholder={selectedConv?.isAI ? "Ask NOVA…" : "Message…"} /><button onClick={() => toast.info("Voice messages are not implemented yet")} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground"><Mic className="w-4 h-4" /></button></div><button onClick={() => void handleSend()} disabled={!inputText.trim() || aiThinking} className="p-2.5 rounded-xl bg-primary text-primary-foreground disabled:opacity-40">{aiThinking ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}</button></div></div></div>
    {showTipModal && <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4"><div className="card p-6 w-full max-w-sm"><div className="flex items-center justify-between mb-4"><h3 className="font-bold text-lg flex items-center gap-2"><DollarSign className="w-5 h-5 text-yellow-400" />Send Tip</h3><button onClick={() => setShowTipModal(false)}><X className="w-4 h-4" /></button></div><div className="space-y-4"><div><label className="text-sm font-medium mb-2 block">Amount (SKY444)</label><input type="number" min="0" value={tipAmount} onChange={e => setTipAmount(e.target.value)} className="w-full bg-secondary/50 border border-border/50 rounded-xl px-3 py-2 text-sm" /></div><div><label className="text-sm font-medium mb-1 block">Message (optional)</label><input value={tipMessage} onChange={e => setTipMessage(e.target.value)} className="w-full bg-secondary/50 border border-border/50 rounded-xl px-3 py-2 text-sm" /></div><button onClick={handleTipSend} disabled={tipMut.isPending || !tipAmount || Number(tipAmount) <= 0} className="btn-primary w-full flex items-center justify-center gap-2">{tipMut.isPending ? <Loader2 className="w-4 h-4 animate-spin" /> : <Zap className="w-4 h-4" />}Send {tipAmount} SKY444</button></div></div></div>}
  </div>;
}
