import React, { useState, useMemo, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageCircle, X, ChevronRight, Search, Send, RotateCcw } from 'lucide-react';

const faqs = [
    {
        question: "What exactly does Catalyst Applied AI do?",
        answer: "We help businesses build practical AI tools that solve real problems—like automating manual document reviews or extracting intelligence from internal records. We focus on ROI, not hype."
    },
    {
        question: "What is CAAi CLERK?",
        answer: "CAAi CLERK is our specialized tool for government and administrative offices. It securely triages FOIA requests, summarizes public meetings, and reviews permit packets."
    },
    {
        question: "What is the CAAi Command Center?",
        answer: "It is a unified dashboard that lets you monitor and manage all your different custom AI agents and their performance in one place."
    },
    {
        question: "Tell me about Catalyst Custom Models.",
        answer: "We build fully managed AI deployments using techniques like RAG and restricted trust layers to ensure your AI only uses your private data and never makes things up."
    },
    {
        question: "What is a 'Discovery & Diagnostic' audit?",
        answer: "It's a high-impact review where we identify exactly where AI can save you the most time and money in your current workflows before you commit to building anything."
    },
    {
        question: "Is my data used to train public models like ChatGPT?",
        answer: "No. We implement private instances and secure trust layers so your data stays entirely within your control and is never shared with external models."
    },
    {
        question: "Do you offer custom integrations?",
        answer: "Yes. We specialize in connecting AI solutions directly into your existing systems like Salesforce, HubSpot, or custom internal databases."
    },
    {
        question: "How do I get started?",
        answer: "The best way is to book an ROI Assessment. You can email sales@catalystappliedai.com or use the 'Contact' page to message us directly."
    }
];

// Simple keyword matching to find the best FAQ answer for a user message
function findBestMatch(userMessage) {
    const msg = userMessage.toLowerCase().trim();

    // Greetings
    const greetings = ['hi', 'hello', 'hey', 'howdy', 'good morning', 'good afternoon', 'good evening', 'whats up', "what's up", 'sup'];
    if (greetings.some(g => msg === g || msg.startsWith(g + ' ') || msg.startsWith(g + '!'))) {
        return "Hi there! 👋 I'm the Catalyst AI Assistant. I can help answer questions about our services, pricing, security, and more. What would you like to know?";
    }

    // Thanks
    const thanks = ['thank', 'thanks', 'thx', 'appreciate', 'ty'];
    if (thanks.some(t => msg.includes(t))) {
        return "You're welcome! 😊 Is there anything else I can help you with?";
    }

    // Bye
    const byes = ['bye', 'goodbye', 'see you', 'later', 'take care'];
    if (byes.some(b => msg.includes(b))) {
        return "Goodbye! 👋 If you have more questions in the future, don't hesitate to reach out. Have a great day!";
    }

    // Direct keyword → FAQ index mapping (index into faqs array)
    // This catches the most common queries immediately
    const keywordMap = [
        { keywords: ['service', 'services', 'offer', 'offerings', 'what do you do', 'what you do'], index: 0 },
        { keywords: ['how long', 'timeline', 'duration', 'time', 'take'], index: 1 },
        { keywords: ['small business', 'small businesses', 'startup', 'startups', 'smb'], index: 2 },
        { keywords: ['industry', 'industries', 'sector', 'sectors', 'healthcare', 'finance', 'retail'], index: 3 },
        { keywords: ['get started', 'start', 'begin', 'contact', 'reach', 'email'], index: 4 },
        { keywords: ['different', 'unique', 'why you', 'why choose', 'stand out', 'special'], index: 5 },
        { keywords: ['support', 'ongoing', 'maintenance', 'after'], index: 6 },
        { keywords: ['price', 'pricing', 'cost', 'costs', 'expensive', 'cheap', 'affordable', 'pay', 'payment', 'charge', 'fee', 'fees', 'budget'], index: 7 },
        { keywords: ['training', 'train', 'workshop', 'learn', 'coaching', 'enablement', 'teach'], index: 8 },
        { keywords: ['security', 'secure', 'safe', 'safety', 'data safe', 'nda', 'confidential', 'privacy', 'protect'], index: 9 },
        { keywords: ['integrate', 'integration', 'existing system', 'crm', 'erp', 'connect', 'api'], index: 10 },
        { keywords: ['doesnt work', "doesn't work", 'not work', 'fail', 'feasibility', 'risk'], index: 11 },
        { keywords: ['location', 'located', 'based', 'where are you', 'office', 'remote', 'kentucky', 'onsite', 'on-site'], index: 12 },
        { keywords: ['chatbot', 'virtual assistant', 'conversational', 'chat bot', 'bot'], index: 13 },
        { keywords: ['measure', 'success', 'kpi', 'metric', 'roi', 'results', 'track'], index: 14 },
        { keywords: ['strategy', 'roadmap', 'consulting', 'advisory', 'guidance', 'plan', 'without building'], index: 15 },
    ];

    // Check keyword map first (highest priority)
    for (const entry of keywordMap) {
        if (entry.keywords.some(kw => msg.includes(kw))) {
            return faqs[entry.index].answer;
        }
    }

    // Fallback: weighted scoring with question match priority
    const stopWords = new Set([
        'what', 'which', 'who', 'whom', 'where', 'when', 'why', 'how',
        'is', 'are', 'was', 'were', 'be', 'been', 'being',
        'have', 'has', 'had', 'do', 'does', 'did', 'will', 'would', 'could', 'should',
        'the', 'a', 'an', 'and', 'or', 'but', 'in', 'on', 'at', 'to', 'for',
        'of', 'with', 'by', 'from', 'as', 'into', 'about', 'can', 'you', 'your',
        'i', 'me', 'my', 'we', 'our', 'they', 'them', 'their', 'it', 'its',
        'this', 'that', 'these', 'those', 'there', 'here', 'some', 'any', 'all',
        'tell', 'know', 'please', 'want', 'need', 'like', 'also', 'just', 'more',
        'give', 'get', 'got', 'provide', 'provided'
    ]);

    const msgWords = msg.split(/\s+/)
        .map(w => w.replace(/[^a-z0-9]/g, ''))
        .filter(w => w.length > 2 && !stopWords.has(w));

    let bestScore = 0;
    let bestAnswer = null;

    for (const faq of faqs) {
        const qLower = faq.question.toLowerCase();
        let score = 0;

        for (const word of msgWords) {
            // Heavy weight for matching in the question
            if (qLower.includes(word)) {
                score += 5;
            }
            // Light weight for matching in the answer
            else if (faq.answer.toLowerCase().includes(word)) {
                score += 1;
            }
        }

        if (score > bestScore) {
            bestScore = score;
            bestAnswer = faq.answer;
        }
    }

    if (bestScore >= 4) {
        return bestAnswer;
    }

    // Fallback
    return "Great question! I don't have a specific answer for that, but our team would love to help. You can reach us at **sales@catalystappliedai.com** or call **502-416-8342** for a free consultation. You can also browse the suggested questions below! 👇";
}

export default function FaqChatbot() {
    const [isOpen, setIsOpen] = useState(false);
    const [selectedFaq, setSelectedFaq] = useState(null);
    const [searchQuery, setSearchQuery] = useState('');
    const [chatInput, setChatInput] = useState('');
    const [isTyping, setIsTyping] = useState(false);
    const [showFaqs, setShowFaqs] = useState(true);
    const messagesEndRef = useRef(null);
    const inputRef = useRef(null);
    const [messages, setMessages] = useState([
        { type: 'bot', text: "Hi! 👋 I'm here to help answer your questions about Catalyst Applied AI. Type a message or choose a topic below!" }
    ]);

    const filteredFaqs = useMemo(() => {
        if (!searchQuery.trim()) return faqs;
        const query = searchQuery.toLowerCase();
        return faqs.filter(faq => 
            faq.question.toLowerCase().includes(query) || 
            faq.answer.toLowerCase().includes(query)
        );
    }, [searchQuery]);

    // Auto-scroll to bottom when new messages appear
    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages, isTyping]);

    // Focus input when chat opens
    useEffect(() => {
        if (isOpen) {
            setTimeout(() => inputRef.current?.focus(), 300);
        }
    }, [isOpen]);

    const handleFaqClick = (faq) => {
        setMessages(prev => [
            ...prev,
            { type: 'user', text: faq.question },
        ]);
        setSelectedFaq(faq);
        setSearchQuery('');
        setShowFaqs(false);

        // Simulate typing delay
        setIsTyping(true);
        setTimeout(() => {
            setIsTyping(false);
            setMessages(prev => [
                ...prev,
                { type: 'bot', text: faq.answer }
            ]);
        }, 600 + Math.random() * 400);
    };

    const handleSendMessage = () => {
        const text = chatInput.trim();
        if (!text) return;

        setMessages(prev => [...prev, { type: 'user', text }]);
        setChatInput('');
        setShowFaqs(false);

        // Simulate typing
        setIsTyping(true);
        setTimeout(() => {
            const response = findBestMatch(text);
            setIsTyping(false);
            setMessages(prev => [...prev, { type: 'bot', text: response }]);
        }, 800 + Math.random() * 600);
    };

    const handleKeyDown = (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleSendMessage();
        }
    };

    const resetChat = () => {
        setMessages([
            { type: 'bot', text: "Hi! 👋 I'm here to help answer your questions about Catalyst Applied AI. Type a message or choose a topic below!" }
        ]);
        setSelectedFaq(null);
        setSearchQuery('');
        setChatInput('');
        setShowFaqs(true);
    };

    // Render message text with bold markdown (**text**)
    const renderText = (text) => {
        const parts = text.split(/(\*\*.*?\*\*)/g);
        return parts.map((part, i) => {
            if (part.startsWith('**') && part.endsWith('**')) {
                return <strong key={i} className="text-blue-400 font-semibold">{part.slice(2, -2)}</strong>;
            }
            return part;
        });
    };

    return (
        <>
            {/* Chat Button */}
            <motion.button
                onClick={() => setIsOpen(!isOpen)}
                className="fixed bottom-6 right-6 z-50 w-16 h-16 rounded-full shadow-lg shadow-blue-500/25 flex items-center justify-center overflow-hidden"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
                initial={{ scale: 0, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ type: "spring", stiffness: 260, damping: 20, delay: 1 }}
            >
                <AnimatePresence mode="wait">
                    {isOpen ? (
                        <motion.div
                            key="close"
                            initial={{ rotate: -90, opacity: 0 }}
                            animate={{ rotate: 0, opacity: 1 }}
                            exit={{ rotate: 90, opacity: 0 }}
                            transition={{ duration: 0.2 }}
                            className="w-full h-full bg-gradient-to-r from-blue-600 to-blue-500 flex items-center justify-center"
                        >
                            <X className="w-6 h-6 text-white" />
                        </motion.div>
                    ) : (
                        <motion.img
                            key="avatar"
                            src="/chatbot.jpg"
                            alt="Chat with us"
                            className="w-full h-full object-cover"
                            initial={{ scale: 0.5, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.5, opacity: 0 }}
                            transition={{ duration: 0.2 }}
                        />
                    )}
                </AnimatePresence>
            </motion.button>

            {/* Chat Window */}
            <AnimatePresence>
            {isOpen && (
                <motion.div
                    initial={{ opacity: 0, y: 20, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 20, scale: 0.95 }}
                    transition={{ type: "spring", stiffness: 300, damping: 25 }}
                    className="fixed bottom-24 right-6 z-50 w-80 sm:w-96 bg-[#060a14] rounded-2xl shadow-2xl border border-blue-500/15 overflow-hidden flex flex-col"
                    style={{ maxHeight: 'calc(100vh - 120px)' }}
                >
                    {/* Header */}
                    <div className="bg-gradient-to-r from-blue-600 to-blue-500 p-4 shrink-0">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-full overflow-hidden border-2 border-white/30">
                                    <img src="/chatbot.jpg" alt="AI Assistant" className="w-full h-full object-cover" />
                                </div>
                                <div>
                                    <h3 className="text-white font-semibold">Catalyst AI Assistant</h3>
                                    <div className="flex items-center gap-1.5">
                                        <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
                                        <p className="text-blue-100 text-xs">Online • Ask me anything</p>
                                    </div>
                                </div>
                            </div>
                            {messages.length > 1 && (
                                <button
                                    onClick={resetChat}
                                    className="text-white/60 hover:text-white transition-colors p-1"
                                    title="Reset conversation"
                                >
                                    <RotateCcw className="w-4 h-4" />
                                </button>
                            )}
                        </div>
                    </div>

                    {/* Messages Area */}
                    <div className="flex-1 overflow-y-auto p-4 space-y-3 min-h-0" style={{ maxHeight: '320px' }}>
                        {/* Background logo watermark */}
                        {messages.length <= 1 && (
                            <div className="absolute inset-0 flex items-center justify-center pointer-events-none" style={{ top: '60px' }}>
                                <img src="/logo.jpg" alt="" className="w-24 h-24 object-contain opacity-10 rounded-xl" loading="lazy" />
                            </div>
                        )}
                        {messages.map((msg, index) => (
                            <motion.div
                                key={index}
                                initial={{ opacity: 0, y: 8 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.3 }}
                                className={`flex items-end gap-2 ${msg.type === 'user' ? 'justify-end' : 'justify-start'}`}
                            >
                                {msg.type === 'bot' && (
                                    <img src="/chatbot.jpg" alt="" className="w-7 h-7 rounded-full object-cover shrink-0" loading="lazy" />
                                )}
                                <div
                                    className={`max-w-[80%] p-3 rounded-2xl text-sm ${
                                        msg.type === 'user'
                                            ? 'bg-gradient-to-r from-blue-600 to-blue-500 text-white rounded-br-md'
                                            : 'bg-slate-800 text-slate-200 rounded-bl-md'
                                    }`}
                                >
                                    {renderText(msg.text)}
                                </div>
                            </motion.div>
                        ))}

                        {/* Typing indicator */}
                        {isTyping && (
                            <motion.div
                                initial={{ opacity: 0, y: 8 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="flex items-end gap-2"
                            >
                                <img src="/chatbot.jpg" alt="" className="w-7 h-7 rounded-full object-cover shrink-0" loading="lazy" />
                                <div className="bg-slate-800 p-3 rounded-2xl rounded-bl-md">
                                    <div className="flex gap-1.5">
                                        <span className="w-2 h-2 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                                        <span className="w-2 h-2 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                                        <span className="w-2 h-2 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                                    </div>
                                </div>
                            </motion.div>
                        )}
                        <div ref={messagesEndRef} />
                    </div>

                    {/* Suggested FAQs (toggle) */}
                    <AnimatePresence>
                    {showFaqs && (
                        <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: 'auto', opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            className="border-t border-blue-500/10 overflow-hidden shrink-0"
                        >
                            <div className="p-3 bg-[#0d1425]/50">
                                {/* Search */}
                                <div className="relative mb-2">
                                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-400" />
                                    <input
                                        type="text"
                                        placeholder="Search FAQs..."
                                        value={searchQuery}
                                        onChange={(e) => setSearchQuery(e.target.value)}
                                        className="w-full pl-9 pr-4 py-1.5 bg-slate-800 border border-slate-700 rounded-lg text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-blue-500 transition-colors"
                                    />
                                </div>
                                <p className="text-xs text-slate-500 mb-1.5">
                                    {searchQuery ? `${filteredFaqs.length} result${filteredFaqs.length !== 1 ? 's' : ''}` : 'Suggested questions:'}
                                </p>
                                <div className="space-y-1 max-h-28 overflow-y-auto">
                                    {filteredFaqs.length > 0 ? (
                                        filteredFaqs.slice(0, 8).map((faq, index) => (
                                            <button
                                                key={index}
                                                onClick={() => handleFaqClick(faq)}
                                                className="w-full text-left p-1.5 rounded-lg bg-slate-800/50 hover:bg-slate-700/50 text-slate-300 text-xs flex items-center justify-between group transition-colors"
                                            >
                                                <span className="truncate pr-2">{faq.question}</span>
                                                <ChevronRight className="w-3.5 h-3.5 text-blue-400 opacity-0 group-hover:opacity-100 transition-opacity shrink-0" />
                                            </button>
                                        ))
                                    ) : (
                                        <p className="text-slate-500 text-xs text-center py-1">No matches found</p>
                                    )}
                                </div>
                            </div>
                        </motion.div>
                    )}
                    </AnimatePresence>

                    {/* Chat Input */}
                    <div className="border-t border-blue-500/10 p-3 bg-[#0a1020] shrink-0">
                        <div className="flex items-center gap-2">
                            <button
                                onClick={() => setShowFaqs(!showFaqs)}
                                className={`shrink-0 p-2 rounded-lg transition-colors ${showFaqs ? 'bg-blue-500/20 text-blue-400' : 'text-slate-500 hover:text-slate-300 hover:bg-slate-800'}`}
                                title={showFaqs ? 'Hide suggestions' : 'Show suggestions'}
                            >
                                <MessageCircle className="w-4 h-4" />
                            </button>
                            <input
                                ref={inputRef}
                                type="text"
                                value={chatInput}
                                onChange={(e) => setChatInput(e.target.value)}
                                onKeyDown={handleKeyDown}
                                placeholder="Type your message..."
                                className="flex-1 bg-slate-800 border border-slate-700 rounded-xl px-4 py-2.5 text-sm text-slate-200 placeholder-slate-500 focus:outline-none focus:border-blue-500 transition-colors"
                            />
                            <motion.button
                                onClick={handleSendMessage}
                                disabled={!chatInput.trim()}
                                className={`shrink-0 p-2.5 rounded-xl transition-all ${
                                    chatInput.trim()
                                        ? 'bg-gradient-to-r from-blue-600 to-blue-500 text-white shadow-lg shadow-blue-500/20'
                                        : 'bg-slate-800 text-slate-600 cursor-not-allowed'
                                }`}
                                whileHover={chatInput.trim() ? { scale: 1.05 } : {}}
                                whileTap={chatInput.trim() ? { scale: 0.95 } : {}}
                            >
                                <Send className="w-4 h-4" />
                            </motion.button>
                        </div>
                    </div>
                </motion.div>
            )}
            </AnimatePresence>
        </>
    );
}
