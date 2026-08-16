import React, { useState, useEffect } from 'react';
import { Send, Heart, Smile } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { useAuth } from '@/_core/hooks/useAuth';

interface Match {
  id: string;
  userId: string;
  displayName: string;
  profileImageUrl: string;
  lastMessage?: string;
  lastMessageAt?: string;
  unreadCount: number;
}

interface Message {
  id: string;
  fromUserId: string;
  content: string;
  createdAt: string;
  isRead: boolean;
}

export default function DatingMessages() {
  const { user } = useAuth();
  const [matches, setMatches] = useState<Match[]>([]);
  const [selectedMatch, setSelectedMatch] = useState<Match | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadMatches();
  }, []);

  useEffect(() => {
    if (selectedMatch) {
      loadMessages(selectedMatch.id);
    }
  }, [selectedMatch]);

  const loadMatches = async () => {
    try {
      const response = await fetch('/api/dating/matches');
      const data = await response.json();
      setMatches(data.matches || []);
      if (data.matches && data.matches.length > 0) {
        setSelectedMatch(data.matches[0]);
      }
    } catch (error) {
      console.error('Failed to load matches:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadMessages = async (matchId: string) => {
    try {
      const response = await fetch(`/api/dating/messages/${matchId}`);
      const data = await response.json();
      setMessages(data.messages || []);
    } catch (error) {
      console.error('Failed to load messages:', error);
    }
  };

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim() || !selectedMatch) return;

    try {
      const response = await fetch('/api/dating/messages', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          matchId: selectedMatch.id,
          content: newMessage,
        }),
      });

      if (response.ok) {
        setNewMessage('');
        loadMessages(selectedMatch.id);
      }
    } catch (error) {
      console.error('Failed to send message:', error);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-gray-600">Loading messages...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-6xl mx-auto h-screen flex">
        {/* Matches List */}
        <div className="w-80 bg-white border-r border-gray-200 overflow-y-auto">
          <div className="p-4 border-b border-gray-200">
            <h2 className="text-2xl font-bold text-gray-900">Messages</h2>
          </div>

          {matches.length === 0 ? (
            <div className="p-8 text-center text-gray-500">
              <p>No matches yet</p>
              <p className="text-sm">Start swiping to find matches!</p>
            </div>
          ) : (
            matches.map((match) => (
              <div
                key={match.id}
                onClick={() => setSelectedMatch(match)}
                className={`p-4 border-b border-gray-100 cursor-pointer transition-colors ${
                  selectedMatch?.id === match.id
                    ? 'bg-pink-50'
                    : 'hover:bg-gray-50'
                }`}
              >
                <div className="flex items-center gap-3">
                  <img
                    src={match.profileImageUrl}
                    alt={match.displayName}
                    className="w-12 h-12 rounded-full object-cover"
                  />
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-gray-900 truncate">
                      {match.displayName}
                    </h3>
                    <p className="text-sm text-gray-500 truncate">
                      {match.lastMessage || 'No messages yet'}
                    </p>
                  </div>
                  {match.unreadCount > 0 && (
                    <div className="bg-pink-500 text-white text-xs font-bold rounded-full w-6 h-6 flex items-center justify-center">
                      {match.unreadCount}
                    </div>
                  )}
                </div>
              </div>
            ))
          )}
        </div>

        {/* Chat Area */}
        <div className="flex-1 flex flex-col bg-white">
          {selectedMatch ? (
            <>
              {/* Header */}
              <div className="p-4 border-b border-gray-200 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <img
                    src={selectedMatch.profileImageUrl}
                    alt={selectedMatch.displayName}
                    className="w-10 h-10 rounded-full object-cover"
                  />
                  <div>
                    <h3 className="font-semibold text-gray-900">
                      {selectedMatch.displayName}
                    </h3>
                    <p className="text-xs text-gray-500">Online</p>
                  </div>
                </div>
                <Button variant="ghost" size="sm">
                  <Heart className="w-5 h-5 text-pink-500" />
                </Button>
              </div>

              {/* Messages */}
              <div className="flex-1 overflow-y-auto p-4 space-y-4">
                {messages.length === 0 ? (
                  <div className="h-full flex items-center justify-center text-gray-500">
                    <div className="text-center">
                      <Heart className="w-12 h-12 mx-auto mb-2 text-pink-300" />
                      <p>Start the conversation!</p>
                    </div>
                  </div>
                ) : (
                  messages.map((msg) => (
                    <div
                      key={msg.id}
                      className={`flex ${
                        msg.fromUserId === user?.id?.toString()
                          ? 'justify-end'
                          : 'justify-start'
                      }`}
                    >
                      <div
                        className={`max-w-xs px-4 py-2 rounded-lg ${
                          msg.fromUserId === user?.id?.toString()
                            ? 'bg-pink-500 text-white'
                            : 'bg-gray-100 text-gray-900'
                        }`}
                      >
                        <p className="text-sm">{msg.content}</p>
                        <p
                          className={`text-xs mt-1 ${
                            msg.fromUserId === user?.id?.toString()
                              ? 'text-pink-100'
                              : 'text-gray-500'
                          }`}
                        >
                          {new Date(msg.createdAt).toLocaleTimeString()}
                        </p>
                      </div>
                    </div>
                  ))
                )}
              </div>

              {/* Input */}
              <form onSubmit={handleSendMessage} className="p-4 border-t border-gray-200">
                <div className="flex gap-2">
                  <Button type="button" variant="ghost" size="sm">
                    <Smile className="w-5 h-5 text-gray-600" />
                  </Button>
                  <Input
                    type="text"
                    placeholder="Type a message..."
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    className="flex-1"
                  />
                  <Button
                    type="submit"
                    className="bg-pink-500 hover:bg-pink-600 text-white"
                  >
                    <Send className="w-5 h-5" />
                  </Button>
                </div>
              </form>
            </>
          ) : (
            <div className="flex-1 flex items-center justify-center text-gray-500">
              <div className="text-center">
                <Heart className="w-16 h-16 mx-auto mb-4 text-pink-300" />
                <p className="text-lg">Select a match to start chatting</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
