import React, { useState, useEffect, useRef } from 'react';

export default function BudgetMain() {
  const [messages, setMessages] = useState([]);
  const [inputMessage, setInputMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);

  // Load messages from localStorage on mount
  useEffect(() => {
    const savedMessages = localStorage.getItem('gumunufu_chat_history');
    if (savedMessages) {
      try {
        setMessages(JSON.parse(savedMessages));
      } catch (e) {
        console.error('Error loading chat history:', e);
      }
    }
  }, []);

  // Save messages to localStorage whenever they change
  useEffect(() => {
    if (messages.length > 0) {
      localStorage.setItem('gumunufu_chat_history', JSON.stringify(messages));
    }
  }, [messages]);

  // Auto-scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const sendMessage = async () => {
    if (!inputMessage.trim() || isLoading) return;

    const userMessage = {
      role: 'user',
      content: inputMessage.trim(),
      timestamp: new Date().toISOString(),
    };

    setMessages(prev => [...prev, userMessage]);
    setInputMessage('');
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch('http://localhost:8000/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message: userMessage.content,
          conversation_history: messages,
        }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();

      const assistantMessage = {
        role: 'assistant',
        content: data.response,
        timestamp: data.timestamp,
      };

      setMessages(prev => [...prev, assistantMessage]);
    } catch (err) {
      console.error('Error sending message:', err);
      setError('Failed to send message. Make sure the backend is running on port 8000.');
      
      // Remove the user message if request failed
      setMessages(prev => prev.slice(0, -1));
    } finally {
      setIsLoading(false);
      inputRef.current?.focus();
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const clearChat = () => {
    if (window.confirm('Are you sure you want to clear the chat history?')) {
      setMessages([]);
      localStorage.removeItem('gumunufu_chat_history');
    }
  };

  const formatTime = (timestamp) => {
    const date = new Date(timestamp);
    return date.toLocaleTimeString('en-US', { 
      hour: 'numeric', 
      minute: '2-digit',
      hour12: true 
    });
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '70vh', maxHeight: '800px' }}>
      <div className="card glass apple-shadow" style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
        {/* Header */}
        <div className="card-header" style={{ borderBottom: '1px solid rgba(148, 163, 184, 0.18)', paddingBottom: '16px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <h2 className="card-title">Budget Chat</h2>
              <p className="card-description">
                Ask questions about your spending habits and get personalized financial advice
              </p>
            </div>
            {messages.length > 0 && (
              <button
                onClick={clearChat}
                style={{
                  padding: '8px 16px',
                  background: 'rgba(239, 68, 68, 0.1)',
                  color: '#ef4444',
                  border: '1px solid rgba(239, 68, 68, 0.2)',
                  borderRadius: '12px',
                  fontSize: '14px',
                  fontWeight: '500',
                  cursor: 'pointer',
                  transition: 'all 0.2s ease',
                }}
                onMouseOver={(e) => {
                  e.target.style.background = 'rgba(239, 68, 68, 0.15)';
                }}
                onMouseOut={(e) => {
                  e.target.style.background = 'rgba(239, 68, 68, 0.1)';
                }}
              >
                Clear Chat
              </button>
            )}
          </div>
        </div>

        {/* Messages Area */}
        <div
          style={{
            flex: 1,
            overflowY: 'auto',
            padding: '24px',
            display: 'flex',
            flexDirection: 'column',
            gap: '16px',
          }}
        >
          {messages.length === 0 ? (
            <div style={{ 
              display: 'flex', 
              flexDirection: 'column', 
              alignItems: 'center', 
              justifyContent: 'center',
              height: '100%',
              gap: '24px',
              textAlign: 'center',
              color: '#64748b'
            }}>
              <div style={{
                width: '80px',
                height: '80px',
                borderRadius: '20px',
                background: 'linear-gradient(135deg, #3b82f6, #8b5cf6)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '40px',
                color: 'white',
                boxShadow: '0 20px 40px -20px rgba(59, 130, 246, 0.5)'
              }}>
                💬
              </div>
              <div>
                <h3 style={{ fontSize: '20px', fontWeight: '600', color: '#0f172a', marginBottom: '8px' }}>
                  Start a conversation
                </h3>
                <p style={{ maxWidth: '400px', margin: '0 auto', lineHeight: '1.6' }}>
                  Ask me anything about your spending habits, budget analysis, or financial advice!
                </p>
              </div>
              <div style={{ 
                display: 'flex', 
                flexDirection: 'column', 
                gap: '8px',
                alignItems: 'flex-start',
                background: 'rgba(59, 130, 246, 0.05)',
                padding: '16px 20px',
                borderRadius: '16px',
                border: '1px solid rgba(59, 130, 246, 0.1)'
              }}>
                <p style={{ fontWeight: '600', color: '#0f172a', marginBottom: '4px' }}>Try asking:</p>
                <p style={{ fontSize: '14px', margin: 0 }}>• "How much did I spend on groceries last month?"</p>
                <p style={{ fontSize: '14px', margin: 0 }}>• "What's my biggest spending category?"</p>
                <p style={{ fontSize: '14px', margin: 0 }}>• "Should I buy a $200 pair of shoes?"</p>
                <p style={{ fontSize: '14px', margin: 0 }}>• "Am I overspending on dining out?"</p>
              </div>
            </div>
          ) : (
            messages.map((msg, index) => (
              <div
                key={index}
                style={{
                  display: 'flex',
                  justifyContent: msg.role === 'user' ? 'flex-end' : 'flex-start',
                }}
              >
                <div
                  style={{
                    maxWidth: '75%',
                    padding: '12px 16px',
                    borderRadius: '18px',
                    background: msg.role === 'user' 
                      ? 'linear-gradient(135deg, #3b82f6, #6366f1)'
                      : 'rgba(255, 255, 255, 0.9)',
                    color: msg.role === 'user' ? '#fff' : '#0f172a',
                    boxShadow: msg.role === 'user'
                      ? '0 10px 20px -10px rgba(59, 130, 246, 0.5)'
                      : '0 4px 12px -4px rgba(15, 23, 42, 0.1)',
                    border: msg.role === 'assistant' ? '1px solid rgba(148, 163, 184, 0.15)' : 'none',
                    backdropFilter: 'blur(10px)',
                  }}
                >
                  <div style={{ 
                    fontSize: '15px', 
                    lineHeight: '1.6',
                    whiteSpace: 'pre-wrap',
                    wordBreak: 'break-word'
                  }}>
                    {msg.content}
                  </div>
                  <div
                    style={{
                      fontSize: '11px',
                      marginTop: '6px',
                      opacity: 0.7,
                      textAlign: 'right',
                    }}
                  >
                    {formatTime(msg.timestamp)}
                  </div>
                </div>
              </div>
            ))
          )}
          {isLoading && (
            <div style={{ display: 'flex', justifyContent: 'flex-start' }}>
              <div
                style={{
                  padding: '12px 16px',
                  borderRadius: '18px',
                  background: 'rgba(255, 255, 255, 0.9)',
                  border: '1px solid rgba(148, 163, 184, 0.15)',
                  backdropFilter: 'blur(10px)',
                  boxShadow: '0 4px 12px -4px rgba(15, 23, 42, 0.1)',
                }}
              >
                <div style={{ display: 'flex', gap: '6px', alignItems: 'center' }}>
                  <div className="shimmer" style={{ 
                    width: '8px', 
                    height: '8px', 
                    borderRadius: '50%', 
                    background: '#3b82f6',
                    animation: 'pulse 1.5s ease-in-out infinite'
                  }} />
                  <div className="shimmer" style={{ 
                    width: '8px', 
                    height: '8px', 
                    borderRadius: '50%', 
                    background: '#3b82f6',
                    animation: 'pulse 1.5s ease-in-out infinite 0.2s'
                  }} />
                  <div className="shimmer" style={{ 
                    width: '8px', 
                    height: '8px', 
                    borderRadius: '50%', 
                    background: '#3b82f6',
                    animation: 'pulse 1.5s ease-in-out infinite 0.4s'
                  }} />
                </div>
              </div>
            </div>
          )}
          {error && (
            <div style={{
              padding: '12px 16px',
              background: 'rgba(239, 68, 68, 0.1)',
              border: '1px solid rgba(239, 68, 68, 0.2)',
              borderRadius: '12px',
              color: '#dc2626',
              fontSize: '14px',
            }}>
              ⚠️ {error}
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Input Area */}
        <div style={{ 
          padding: '20px', 
          borderTop: '1px solid rgba(148, 163, 184, 0.18)',
          background: 'rgba(255, 255, 255, 0.5)',
          backdropFilter: 'blur(10px)'
        }}>
          <div style={{ display: 'flex', gap: '12px', alignItems: 'flex-end' }}>
            <textarea
              ref={inputRef}
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Ask about your spending..."
              disabled={isLoading}
              style={{
                flex: 1,
                padding: '12px 16px',
                borderRadius: '16px',
                border: '1px solid rgba(148, 163, 184, 0.2)',
                background: 'rgba(255, 255, 255, 0.9)',
                fontSize: '15px',
                fontFamily: 'inherit',
                resize: 'none',
                minHeight: '52px',
                maxHeight: '120px',
                outline: 'none',
                transition: 'border-color 0.2s ease',
              }}
              onFocus={(e) => {
                e.target.style.borderColor = 'rgba(59, 130, 246, 0.4)';
              }}
              onBlur={(e) => {
                e.target.style.borderColor = 'rgba(148, 163, 184, 0.2)';
              }}
              rows={1}
            />
            <button
              onClick={sendMessage}
              disabled={isLoading || !inputMessage.trim()}
              style={{
                padding: '12px 24px',
                borderRadius: '16px',
                border: 'none',
                background: isLoading || !inputMessage.trim() 
                  ? 'rgba(148, 163, 184, 0.3)'
                  : 'linear-gradient(135deg, #3b82f6, #6366f1)',
                color: '#fff',
                fontSize: '15px',
                fontWeight: '600',
                cursor: isLoading || !inputMessage.trim() ? 'not-allowed' : 'pointer',
                transition: 'all 0.2s ease',
                boxShadow: isLoading || !inputMessage.trim()
                  ? 'none'
                  : '0 10px 20px -10px rgba(59, 130, 246, 0.5)',
                minWidth: '80px',
                height: '52px',
              }}
              onMouseOver={(e) => {
                if (!isLoading && inputMessage.trim()) {
                  e.target.style.transform = 'translateY(-2px)';
                  e.target.style.boxShadow = '0 12px 24px -12px rgba(59, 130, 246, 0.6)';
                }
              }}
              onMouseOut={(e) => {
                e.target.style.transform = 'translateY(0)';
                e.target.style.boxShadow = isLoading || !inputMessage.trim()
                  ? 'none'
                  : '0 10px 20px -10px rgba(59, 130, 246, 0.5)';
              }}
            >
              {isLoading ? '...' : 'Send'}
            </button>
          </div>
          <p style={{ 
            fontSize: '12px', 
            color: '#64748b', 
            marginTop: '8px',
            marginBottom: 0 
          }}>
            Press Enter to send, Shift+Enter for new line
          </p>
        </div>
      </div>

      <style>{`
        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.3; }
        }
      `}</style>
    </div>
  );
}
