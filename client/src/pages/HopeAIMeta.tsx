import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useAuth } from "@/_core/hooks/useAuth";
import { trpc } from "@/lib/trpc";
import { toast } from "sonner";
import {
  Send, Sparkles, Code, Brain, Image, Video, FileText, Globe, Zap,
  Copy, Download, Share2, Settings, RotateCcw, Maximize2, Minimize2,
  MessageSquare, Lightbulb, BookOpen, Cpu, Wand2, Play, Square,
  ChevronDown, ChevronUp, Clock, AlertCircle, Plus, Trash2, Search,
  Upload, Mic, Phone, Eye, FileCode, Database, GitBranch
} from "lucide-react";

interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: number;
  capability?: string;
  attachments?: { type: string; url: string; name: string }[];
  metadata?: { tokensUsed?: number; thinkingTime?: number; confidence?: number };
}

interface Conversation {
  id: string;
  title: string;
  capability: string;
  lastMessage: string;
  timestamp: number;
  messageCount: number;
}

const CAPABILITIES = [
  { id: "chat", name: "Chat", icon: <MessageSquare className="w-5 h-5" />, description: "Conversational AI" },
  { id: "code", name: "Code", icon: <Code className="w-5 h-5" />, description: "Code generation & debugging" },
  { id: "image", name: "Image", icon: <Image className="w-5 h-5" />, description: "Image generation & analysis" },
  { id: "video", name: "Video", icon: <Video className="w-5 h-5" />, description: "Video understanding" },
  { id: "document", name: "Document", icon: <FileText className="w-5 h-5" />, description: "Document analysis" },
  { id: "web", name: "Web Search", icon: <Globe className="w-5 h-5" />, description: "Real-time web search" },
  { id: "reasoning", name: "Reasoning", icon: <Brain className="w-5 h-5" />, description: "Advanced reasoning" },
  { id: "execution", name: "Execution", icon: <Play className="w-5 h-5" />, description: "Code execution" },
  { id: "data", name: "Data Analysis", icon: <Cpu className="w-5 h-5" />, description: "Data analysis & visualization" },
  { id: "creative", name: "Creative", icon: <Wand2 className="w-5 h-5" />, description: "Creative writing" },
  { id: "voice", name: "Voice", icon: <Mic className="w-5 h-5" />, description: "Voice interaction" },
  { id: "vision", name: "Vision", icon: <Eye className="w-5 h-5" />, description: "Visual understanding" },
];

export default function HopeAIMeta() {
  const { isAuthenticated, user } = useAuth();
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [selectedCapability, setSelectedCapability] = useState("chat");
  const [isLoading, setIsLoading] = useState(false);
  const [isExpanded, setIsExpanded] = useState(true);
  const [showSidebar, setShowSidebar] = useState(true);
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [currentConversation, setCurrentConversation] = useState<string | null>(null);
  const [showSettings, setShowSettings] = useState(false);
  const [temperature, setTemperature] = useState(0.7);
  const [maxTokens, setMaxTokens] = useState(2048);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = async () => {
    if (!input.trim()) return;

    const userMessage: Message = {
      id: `msg-${Date.now()}`,
      role: "user",
      content: input,
      timestamp: Date.now(),
      capability: selectedCapability
    };

    setMessages(prev => [...prev, userMessage]);
    setInput("");
    setIsLoading(true);

    try {
      await new Promise(resolve => setTimeout(resolve, 1200));

      let responseContent = "";
      const thinkingTime = Math.random() * 2000 + 500;

      const responses: Record<string, string> = {
        code: `\`\`\`javascript
// Generated code for: ${input}
function solution() {
  // Implementation optimized for performance
  return result;
}

// Usage:
const result = solution();
console.log(result);
\`\`\`

**Key Features:**
- Efficient algorithm (O(n) complexity)
- Production-ready code
- Comprehensive error handling
- Well-documented`,

        image: `**Image Generation Ready**

I can generate images for: ${input}

**Available Options:**
- Style: Photorealistic, Artistic, Cartoon, 3D
- Resolution: 1024x1024, 1536x1536, 2048x2048
- Format: PNG, JPEG, WebP

Ready to generate when you confirm!`,

        video: `**Video Analysis**

Analyzing video content for: ${input}

**Capabilities:**
- Scene detection and segmentation
- Object recognition and tracking
- Speech-to-text transcription
- Emotion and sentiment analysis
- Action recognition
- Key frame extraction

Upload a video to analyze or describe what you'd like me to analyze.`,

        document: `**Document Analysis**

Processing document for: ${input}

**Supported Formats:**
- PDF, DOCX, TXT, CSV
- Images (OCR)
- Spreadsheets
- Code files

**Analysis Features:**
- Content extraction
- Summarization
- Key insights
- Entity recognition
- Sentiment analysis

Upload a document to get started!`,

        web: `**Web Search Results for:** "${input}"

**Top Results:**
1. **Result 1** - Highly relevant information
2. **Result 2** - Additional context
3. **Result 3** - Related resources

**Key Findings:**
- Latest information from reliable sources
- Real-time data and trends
- Comprehensive overview

Would you like me to dive deeper into any result?`,

        reasoning: `**Step-by-Step Analysis**

**Problem:** ${input}

**Step 1: Understanding**
Breaking down the core components...

**Step 2: Analysis**
Examining each element in detail...

**Step 3: Solution**
Synthesizing insights...

**Step 4: Verification**
Validating the approach...

**Confidence Level:** 94%
**Reasoning Depth:** Advanced`,

        execution: `**Code Execution Environment**

Ready to execute code for: ${input}

**Available Runtimes:**
- Node.js (JavaScript/TypeScript)
- Python 3.11
- Bash/Shell

**Sandbox Features:**
- Isolated execution
- Real-time output
- Error capture
- Performance metrics

Paste your code and I'll execute it!`,

        data: `**Data Analysis Dashboard**

Analyzing data for: ${input}

**Available Analyses:**
- Statistical summary
- Trend analysis
- Correlation analysis
- Anomaly detection
- Forecasting
- Visualization

**Output Formats:**
- Charts and graphs
- CSV export
- JSON data
- Statistical report

Upload your dataset to begin!`,

        creative: `**Creative Writing Assistant**

Generating creative content for: ${input}

**Styles Available:**
- Fiction & storytelling
- Poetry & verse
- Marketing copy
- Technical writing
- Dialogue & scripts
- World-building

**Features:**
- Multiple variations
- Tone customization
- Length control
- Revision suggestions

Ready to create something amazing!`,

        voice: `**Voice Interaction Ready**

Processing voice request: ${input}

**Voice Capabilities:**
- Speech recognition
- Natural language understanding
- Voice synthesis
- Accent adaptation
- Emotion detection

**Supported Languages:**
- English (US, UK, AU)
- Spanish, French, German
- Mandarin, Japanese
- 50+ more languages

Click the microphone to start speaking!`,

        vision: `**Visual Understanding**

Analyzing visual content for: ${input}

**Vision Capabilities:**
- Object detection
- Scene understanding
- Text recognition (OCR)
- Face recognition
- Emotion detection
- Image classification

**Supported Formats:**
- JPEG, PNG, WebP
- GIF, TIFF
- Video frames

Upload an image to analyze!`
      };

      responseContent = responses[selectedCapability] || responses.chat;

      const assistantMessage: Message = {
        id: `msg-${Date.now() + 1}`,
        role: "assistant",
        content: responseContent,
        timestamp: Date.now(),
        capability: selectedCapability,
        metadata: {
          tokensUsed: Math.floor(Math.random() * 1000) + 100,
          thinkingTime: Math.floor(thinkingTime),
          confidence: Math.random() * 0.3 + 0.85
        }
      };

      setMessages(prev => [...prev, assistantMessage]);

      // Update conversation list
      if (!currentConversation) {
        const newConv: Conversation = {
          id: `conv-${Date.now()}`,
          title: input.substring(0, 50),
          capability: selectedCapability,
          lastMessage: responseContent.substring(0, 100),
          timestamp: Date.now(),
          messageCount: 2
        };
        setConversations(prev => [newConv, ...prev]);
        setCurrentConversation(newConv.id);
      }
    } catch (error) {
      toast.error("Failed to process request");
    } finally {
      setIsLoading(false);
    }
  };

  const handleNewConversation = () => {
    setMessages([]);
    setCurrentConversation(null);
    setInput("");
  };

  const handleDeleteConversation = (convId: string) => {
    setConversations(prev => prev.filter(c => c.id !== convId));
    if (currentConversation === convId) {
      handleNewConversation();
    }
  };

  if (!isExpanded) {
    return (
      <div className="fixed bottom-4 right-4 z-50">
        <Button
          onClick={() => setIsExpanded(true)}
          className="rounded-full w-14 h-14 bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 shadow-lg"
        >
          <Sparkles className="w-6 h-6" />
        </Button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-blue-950 to-slate-950 flex">
      {/* Sidebar */}
      {showSidebar && (
        <div className="w-64 bg-slate-900/80 border-r border-slate-800 flex flex-col">
          {/* Header */}
          <div className="p-4 border-b border-slate-800">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
                <Sparkles className="w-5 h-5 text-white" />
              </div>
              <h1 className="text-lg font-bold text-white">Hope AI</h1>
            </div>
            <Button
              onClick={handleNewConversation}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white"
            >
              <Plus className="w-4 h-4 mr-2" />
              New Chat
            </Button>
          </div>

          {/* Conversations */}
          <div className="flex-1 overflow-y-auto p-3 space-y-2">
            {conversations.map(conv => (
              <div
                key={conv.id}
                onClick={() => setCurrentConversation(conv.id)}
                className={`p-3 rounded-lg cursor-pointer transition-all group ${
                  currentConversation === conv.id
                    ? "bg-blue-600/30 border border-blue-500/50"
                    : "hover:bg-slate-800/50 border border-transparent"
                }`}
              >
                <p className="text-sm text-white truncate">{conv.title}</p>
                <p className="text-xs text-slate-400 mt-1">{conv.capability}</p>
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={e => {
                    e.stopPropagation();
                    handleDeleteConversation(conv.id);
                  }}
                  className="opacity-0 group-hover:opacity-100 mt-2 h-6 w-6 p-0"
                >
                  <Trash2 className="w-3 h-3" />
                </Button>
              </div>
            ))}
          </div>

          {/* Settings */}
          <div className="p-3 border-t border-slate-800">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setShowSettings(!showSettings)}
              className="w-full justify-start text-slate-300"
            >
              <Settings className="w-4 h-4 mr-2" />
              Settings
            </Button>
          </div>
        </div>
      )}

      {/* Main Chat Area */}
      <div className="flex-1 flex flex-col">
        {/* Top Bar */}
        <div className="bg-slate-900/50 border-b border-slate-800 p-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setShowSidebar(!showSidebar)}
              className="text-slate-400"
            >
              {showSidebar ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
            </Button>
            <h2 className="text-lg font-semibold text-white">
              {CAPABILITIES.find(c => c.id === selectedCapability)?.name || "Hope AI"}
            </h2>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setIsExpanded(false)}
            className="text-slate-400"
          >
            <Minimize2 className="w-4 h-4" />
          </Button>
        </div>

        {/* Capabilities Grid (when no messages) */}
        {messages.length === 0 && (
          <div className="flex-1 overflow-y-auto p-6">
            <div className="max-w-6xl mx-auto">
              <div className="mb-8">
                <h1 className="text-4xl font-bold text-white mb-2">Hope AI</h1>
                <p className="text-slate-400">Powered by advanced AI - Better than Meta AI</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {CAPABILITIES.map(cap => (
                  <Card
                    key={cap.id}
                    onClick={() => setSelectedCapability(cap.id)}
                    className={`cursor-pointer transition-all border-2 ${
                      selectedCapability === cap.id
                        ? "border-blue-500 bg-blue-500/10"
                        : "border-slate-700 hover:border-blue-500/50 bg-slate-800/30"
                    }`}
                  >
                    <CardContent className="p-4">
                      <div className="flex items-center gap-3 mb-2">
                        <div className="text-blue-400">{cap.icon}</div>
                        <h3 className="font-semibold text-white">{cap.name}</h3>
                      </div>
                      <p className="text-sm text-slate-400">{cap.description}</p>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Messages */}
        {messages.length > 0 && (
          <div className="flex-1 overflow-y-auto p-6">
            <div className="max-w-4xl mx-auto space-y-4">
              {messages.map(msg => (
                <div key={msg.id} className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}>
                  <div
                    className={`max-w-2xl px-4 py-3 rounded-lg ${
                      msg.role === "user"
                        ? "bg-blue-600 text-white rounded-br-none"
                        : "bg-slate-800 text-slate-100 rounded-bl-none border border-slate-700"
                    }`}
                  >
                    <p className="text-sm whitespace-pre-wrap">{msg.content}</p>
                    {msg.metadata && (
                      <div className="text-xs text-slate-400 mt-2 flex gap-2">
                        <span>⏱️ {msg.metadata.thinkingTime}ms</span>
                        <span>📊 {msg.metadata.tokensUsed} tokens</span>
                      </div>
                    )}
                  </div>
                </div>
              ))}
              {isLoading && (
                <div className="flex justify-start">
                  <div className="bg-slate-800 text-slate-300 px-4 py-3 rounded-lg border border-slate-700">
                    <div className="flex gap-2">
                      <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce" />
                      <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce" style={{ animationDelay: "0.1s" }} />
                      <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce" style={{ animationDelay: "0.2s" }} />
                    </div>
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>
          </div>
        )}

        {/* Input Area */}
        <div className="bg-slate-900/50 border-t border-slate-800 p-4">
          <div className="max-w-4xl mx-auto space-y-3">
            <div className="flex gap-2">
              <Textarea
                value={input}
                onChange={e => setInput(e.target.value)}
                onKeyDown={e => {
                  if (e.key === "Enter" && e.ctrlKey) {
                    handleSendMessage();
                  }
                }}
                placeholder="Ask Hope AI anything..."
                className="flex-1 bg-slate-800 border-slate-700 text-white placeholder-slate-500 resize-none"
                rows={3}
              />
              <Button
                onClick={handleSendMessage}
                disabled={isLoading || !input.trim()}
                className="bg-blue-600 hover:bg-blue-700 text-white h-full"
              >
                <Send className="w-4 h-4" />
              </Button>
            </div>

            <div className="flex gap-2 flex-wrap">
              {[
                { icon: <Upload className="w-4 h-4" />, label: "Upload" },
                { icon: <Mic className="w-4 h-4" />, label: "Voice" },
                { icon: <Image className="w-4 h-4" />, label: "Image" },
                { icon: <FileCode className="w-4 h-4" />, label: "Code" }
              ].map((btn, idx) => (
                <Button
                  key={idx}
                  variant="outline"
                  size="sm"
                  className="border-slate-700 text-slate-300 hover:bg-slate-800"
                >
                  {btn.icon}
                  {btn.label}
                </Button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
